import test from 'node:test';import assert from 'node:assert/strict';
import { readdir,readFile,mkdtemp,cp,writeFile,rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';import { fileURLToPath } from 'node:url';import path from 'node:path';import os from 'node:os';
import { prepareEvaluation,scoreAgainstOracle } from '../lib/evaluation.mjs';import { validReport,finding } from './helpers.mjs';
const fixtures=fileURLToPath(new URL('./fixtures/',import.meta.url));
for(const name of await readdir(fixtures))test('real fixture: '+name,async()=>{
 const dir=path.join(fixtures,name);const oracle=JSON.parse(await readFile(path.join(dir,'oracle.json'),'utf8'));
 const execution=spawnSync(process.execPath,['checks.mjs'],{cwd:path.join(dir,'project'),encoding:'utf8',timeout:10000});
 assert.equal(execution.status,oracle.expectedExecution,execution.stdout+execution.stderr);
 assert.ok((await readFile(path.join(dir,'project/TASK.md'),'utf8')).length>0);
});
test('negative control catches a broken product formula with meaningful assertions',async t=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'integrity-negative-'));t.after(()=>rm(root,{recursive:true,force:true}));
 const original=path.join(fixtures,'correct/project');const target=path.join(root,'isolated');await cp(original,target,{recursive:true});
 const source=await readFile(path.join(original,'pricing.mjs'),'utf8');await writeFile(path.join(target,'pricing.mjs'),source.replace('quantity * price','quantity + price'));
 const result=spawnSync(process.execPath,['checks.mjs'],{cwd:target,encoding:'utf8'});assert.equal(result.status,1);
 assert.equal(await readFile(path.join(original,'pricing.mjs'),'utf8'),source);
 const weak=spawnSync(process.execPath,['checks.mjs'],{cwd:path.join(fixtures,'weak-assertions/project'),encoding:'utf8'});assert.equal(weak.status,0);
});
test('preparation withholds evaluator oracle and preserves existing directories',async t=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'integrity-prepare-'));t.after(()=>rm(root,{recursive:true,force:true}));const target=path.join(root,'project');
 await prepareEvaluation('correct',target);assert.ok((await readdir(target)).includes('TASK.md'));assert.ok(!(await readdir(target)).includes('oracle.json'));
 await assert.rejects(prepareEvaluation('correct',target),/already exist/);await assert.rejects(prepareEvaluation('../correct',path.join(root,'escape')),/Invalid/);
});
test('scoring measures detection and false positives rather than counting all findings as success',()=>{
 const oracle={case:'sample',initialStatus:'BLOCKED',expectedFindings:[{category:'Fix verification',component:'pricing.mjs'}]};
 const r=validReport();r.status='BLOCKED';r.findings=[finding(),finding({id:'F-002',fingerprint:'invented',category:'Architecture',component:'unrelated.mjs'})];
 const score=scoreAgainstOracle(oracle,r);assert.equal(score.reportValid,true);assert.equal(score.metrics.truePositives,1);assert.equal(score.metrics.falsePositives,1);assert.equal(score.metrics.precision,0.5);
 const clean=scoreAgainstOracle({case:'tradeoff',initialStatus:'VERIFIED',expectedFindings:[]},validReport());assert.equal(clean.metrics.falsePositives,0);assert.equal(clean.metrics.statusMatches,true);
});

test('oracle exposes a coherent but factually false acceptance',()=>{
 const score=scoreAgainstOracle({case:'false-claim',initialStatus:'BLOCKED',expectedFindings:[{category:'Requirements',component:'pricing.mjs'}]},validReport());assert.equal(score.reportValid,true);assert.equal(score.metrics.falseAcceptance,true);assert.equal(score.metrics.falseNegatives,1);
});
