import test from 'node:test';import assert from 'node:assert/strict';
import { mkdtemp,cp,readFile,rm } from 'node:fs/promises';import os from 'node:os';import path from 'node:path';import { fileURLToPath } from 'node:url';import { createHash } from 'node:crypto';import { spawnSync } from 'node:child_process';
import { createLoop,recordRound,loopDecision } from '../lib/correction-loop.mjs';import { checkReport } from '../lib/check-report.mjs';import { validReport,finding } from './helpers.mjs';
const fixtures=fileURLToPath(new URL('./fixtures/',import.meta.url));
async function execute(t,name,stage=0) {
 const dir=await mkdtemp(path.join(os.tmpdir(),'integrity-loop-'));t.after(()=>rm(dir,{recursive:true,force:true}));
 await cp(path.join(fixtures,name,stage?'stages/'+stage:'project'),dir,{recursive:true});
 let content;try{content=await readFile(path.join(dir,'pricing.mjs'));}catch{content=await readFile(path.join(dir,'pricing-renamed.mjs'));}
 const snapshot=createHash('sha256').update(content).digest('hex');
 const result=spawnSync(process.execPath,['checks.mjs'],{cwd:dir,encoding:'utf8',timeout:10000});
 assert.ok(result.status===0||result.status===1,result.stderr);
 const e={id:'E-'+stage,snapshot,capturedAt:new Date().toISOString(),kind:'execution',outcome:result.status===0?'passed':'failed',command:'node checks.mjs',cwd:'isolated '+name+' stage '+stage,exitCode:result.status,description:(result.stdout+result.stderr).trim()};
 return {snapshot,evidence:[e],status:result.status};
}
const observation=e=>{const {id,state,attempts,verificationEvidenceIds,...data}=finding();return {...data,evidenceIds:[e.id]};};
test('real correction: reproduce failure, apply fixture correction, rerun, and pass report gate',async t=>{
 const before=await execute(t,'unfixed-bug');assert.equal(before.status,1);
 let state=recordRound(createLoop(),{...before,observations:[observation(before.evidence[0])]});assert.equal(loopDecision(state).action,'correct');
 const after=await execute(t,'unfixed-bug',1);assert.equal(after.status,0);
 state=recordRound(state,{...after,correctedFingerprints:['zero-quantity'],resolutions:[{fingerprint:'zero-quantity',evidenceIds:['E-1']}]});
 assert.equal(state.findings[0].state,'resolved');assert.equal(loopDecision(state).action,'verify');
 const report=validReport();Object.assign(report,{snapshot:state.snapshot,evidence:state.evidence,findings:state.findings,iterations:state.iterations});report.requirements[0].evidenceIds=['E-1'];report.checks[0].evidenceIds=['E-1'];report.scope.evidenceIds=['E-1'];assert.equal(checkReport(report).valid,true,checkReport(report).errors.join('\n'));
});
test('agent saying fixed cannot close a finding',async t=>{
 const before=await execute(t,'unfixed-bug');const state=recordRound(createLoop(),{...before,observations:[observation(before.evidence[0])]});
 assert.throws(()=>recordRound(state,{snapshot:'new',evidence:[{...before.evidence[0],id:'E-1',snapshot:'new',kind:'claim',outcome:'passed',exitCode:0}],correctedFingerprints:['zero-quantity'],resolutions:[{fingerprint:'zero-quantity',evidenceIds:['E-1']}]}),/non-claim/);
 assert.equal(state.findings[0].state,'open');
});
test('a correction that introduces a regression remains open until both behaviors pass',async t=>{
 const before=await execute(t,'correction-regression');let state=recordRound(createLoop(),{...before,observations:[observation(before.evidence[0])]});
 const middle=await execute(t,'correction-regression',1);assert.equal(middle.status,1);
 // Independently verify the original zero case, while the complete check detects the new regression.
 const targetDir=await mkdtemp(path.join(os.tmpdir(),'integrity-targeted-'));t.after(()=>rm(targetDir,{recursive:true,force:true}));
 await cp(path.join(fixtures,'correction-regression/stages/1'),targetDir,{recursive:true});
 const targeted=spawnSync(process.execPath,['--input-type=module','--eval',"import assert from 'node:assert/strict';import {total} from './pricing.mjs';assert.throws(()=>total(0,4),RangeError);"],{cwd:targetDir,encoding:'utf8'});assert.equal(targeted.status,0,targeted.stderr);
 const zeroProof={...middle.evidence[0],id:'E-1-zero',outcome:'passed',exitCode:0,command:'node --input-type=module --eval [zero quantity assertion]',description:'The original zero-quantity rejection passed independently.'};
 state=recordRound(state,{...middle,evidence:[...middle.evidence,zeroProof],correctedFingerprints:['zero-quantity'],resolutions:[{fingerprint:'zero-quantity',evidenceIds:['E-1-zero']}],observations:[{...observation(middle.evidence[0]),fingerprint:'positive-quantity-regression',category:'Regression',title:'Valid quantity one is rejected'}]});
 assert.equal(state.findings.length,2);assert.equal(state.findings[0].state,'resolved');assert.equal(state.findings[1].state,'open');assert.equal(loopDecision(state).action,'correct');
 const after=await execute(t,'correction-regression',2);assert.equal(after.status,0);
 state=recordRound(state,{...after,correctedFingerprints:state.findings.map(f=>f.fingerprint),resolutions:state.findings.map(f=>({fingerprint:f.fingerprint,evidenceIds:['E-2']}))});
 assert.ok(state.findings.every(f=>f.state==='resolved'));assert.equal(loopDecision(state).action,'verify');
});
test('recurring root cause keeps its ID and failed-attempt count after a rename',async t=>{
 const before=await execute(t,'recurring-findings');let state=recordRound(createLoop(),{...before,observations:[observation(before.evidence[0])]});
 for(const stage of [1,2]){const result=await execute(t,'recurring-findings',stage);state=recordRound(state,{...result,correctedFingerprints:['zero-quantity'],observations:[{...observation(result.evidence[0]),component:stage===2?'pricing-renamed.mjs':'pricing.mjs'}]});}
 assert.equal(state.findings.length,1);assert.equal(state.findings[0].id,'F-001');assert.equal(state.findings[0].attempts,2);assert.equal(loopDecision(state).action,'stop');
 assert.throws(()=>recordRound(state,{snapshot:'later',evidence:[{...before.evidence[0],id:'E-3',snapshot:'later'}]}),/limit/);
});
test('subsequent changes reopen resolved findings and do not reset counters',async t=>{
 const before=await execute(t,'unfixed-bug');let state=recordRound(createLoop(),{...before,observations:[observation(before.evidence[0])]});const after=await execute(t,'unfixed-bug',1);
 state=recordRound(state,{...after,correctedFingerprints:['zero-quantity'],resolutions:[{fingerprint:'zero-quantity',evidenceIds:['E-1']}]});
 state=recordRound(state,{...before,evidence:[{...before.evidence[0],id:'E-2'}],observations:[{...observation(before.evidence[0]),evidenceIds:['E-2']}]});assert.equal(state.findings[0].state,'reopened');assert.equal(state.findings[0].id,'F-001');
});
test('changing snapshots invalidates un-rechecked closures; omission is not resolution',async t=>{
 const before=await execute(t,'unfixed-bug');let state=recordRound(createLoop(),{...before,observations:[observation(before.evidence[0])]});
 const after=await execute(t,'unfixed-bug',1);state=recordRound(state,{...after,correctedFingerprints:['zero-quantity'],resolutions:[{fingerprint:'zero-quantity',evidenceIds:['E-1']}]});
 state=recordRound(state,{snapshot:'changed',evidence:[{...after.evidence[0],id:'E-2',snapshot:'changed'}]});assert.equal(state.findings[0].state,'unverified');
});
test('zero rounds and invalid limits do not silently permit correction',()=>{
 assert.throws(()=>createLoop({maxIterations:-1}),/Invalid/);assert.throws(()=>createLoop({maxRepeatedAttempts:0}),/Invalid/);
 const e={id:'E-0',snapshot:'s',kind:'inspection',outcome:'observed'};
 const state=recordRound(createLoop({maxIterations:0}),{snapshot:'s',evidence:[e],observations:[observation(e)]});assert.equal(loopDecision(state).action,'stop');
});
