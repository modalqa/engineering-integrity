import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp,writeFile,rm } from 'node:fs/promises';
import os from 'node:os';import path from 'node:path';import { fileURLToPath } from 'node:url';
import { checkReport } from '../lib/check-report.mjs';
import { validReport,finding } from './helpers.mjs';
const reject=(report,pattern)=>{const result=checkReport(report);assert.equal(result.valid,false);assert.match(result.errors.join('\n'),pattern);};
test('accepts a consistent report but discloses limits of machine verification',()=>{const result=checkReport(validReport());assert.equal(result.valid,true);assert.match(result.warnings.join(' '),/consistency only/);});
test('rejects false VERIFIED statuses for incomplete requirements and unavailable checks',()=>{
 for(const mutate of [r=>r.task.requirementsComplete=false,r=>r.requirements[0].status='Not Verifiable',r=>r.checks[0].outcome='unavailable',r=>r.scope.status='unknown']){const r=validReport();mutate(r);assert.equal(checkReport(r).valid,false);}
});
test('rejects missing, stale, claim-only, failing, and future evidence',()=>{
 for(const mutate of [r=>r.evidence=[],r=>r.evidence[0].snapshot='old',r=>r.evidence[0].kind='claim',r=>r.evidence[0].exitCode=1,r=>r.evidence[0].capturedAt='2999-01-01T00:00:00Z']){const r=validReport();mutate(r);assert.equal(checkReport(r).valid,false);}
});
test('does not allow open blockers or false closures',()=>{
 const r=validReport();r.findings=[finding()];reject(r,/Confirmed blocker/);
 r.status='BLOCKED';assert.equal(checkReport(r).valid,true);
 r.status='VERIFIED';r.findings[0].state='resolved';reject(r,/resolution needs/);
 r.findings[0].verificationEvidenceIds=['E-1'];assert.equal(checkReport(r).valid,true);
});
test('inspection evidence cannot close execution-dependent bug fixes',()=>{const r=validReport();r.findings=[finding({state:'resolved',verificationEvidenceIds:['E-1']})];r.evidence[0].kind='inspection';r.evidence[0].outcome='observed';reject(r,/resolution needs/);});
test('risk acceptance cannot bypass High findings or failed mandatory requirements',()=>{
 const r=validReport();r.findings=[finding({state:'justified',justification:'Convenient',acceptedBy:'reviewer'})];reject(r,/invalid risk acceptance/);
 r.findings=[];r.requirements[0].status='Failed';reject(r,/Confirmed blocker/);
});
test('Medium trade-offs need explicit acceptance and warnings',()=>{const r=validReport();r.findings=[finding({severity:'Medium',state:'justified',justification:'Documented project constraint',acceptedBy:'task owner'})];reject(r,/Unresolved concerns/);r.status='VERIFIED WITH WARNINGS';assert.equal(checkReport(r).valid,true);delete r.findings[0].acceptedBy;assert.equal(checkReport(r).valid,false);});
test('rejects duplicate IDs, fingerprints, broken references, and malformed JSON shapes',()=>{
 for(const value of [null,{},[],{schemaVersion:2}])assert.equal(checkReport(value).valid,false);
 const r=validReport();r.findings=[finding(),finding({id:'F-002'})];r.status='BLOCKED';reject(r,/duplicate finding fingerprint/);
 r.findings=[];r.requirements[0].id='E-1';reject(r,/Duplicate ID/);
});
test('enforces round order, fresh evidence, limits, and audit-only behavior',()=>{
 const r=validReport();r.iterations.push({...r.iterations[0],round:1});r.limits.maxIterations=0;reject(r,/round limit/);
 r.limits.maxIterations=3;r.mode='audit';reject(r,/Audit mode/);
 r.mode='full';r.iterations[1].round=3;reject(r,/contiguous/);
});
test('CLI returns nonzero for invalid reports and never runs commands stored in them',async t=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'integrity-report-'));t.after(()=>rm(dir,{recursive:true,force:true}));
 const report=validReport();report.task.requirementsComplete=false;report.evidence[0].command='THIS COMMAND MUST NOT RUN';const file=path.join(dir,'report.json');await writeFile(file,JSON.stringify(report));
 const cli=fileURLToPath(new URL('../bin/cli.mjs',import.meta.url));let result=spawnSync(process.execPath,[cli,'check-report',file],{encoding:'utf8'});assert.equal(result.status,1);assert.equal(JSON.parse(result.stdout).valid,false);
 report.task.requirementsComplete=true;await writeFile(file,JSON.stringify(report));result=spawnSync(process.execPath,[cli,'check-report',file],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);
 await writeFile(file,'{bad');result=spawnSync(process.execPath,[cli,'check-report',file],{encoding:'utf8'});assert.equal(result.status,1);
});

test('rejects fabricated reset counters and repeated round evidence',()=>{
 const r=validReport();r.status='BLOCKED';r.findings=[finding()];r.evidence.push({...r.evidence[0],id:'E-2'});r.iterations.push({round:1,snapshot:r.snapshot,correctedFindingIds:['F-001'],failedFindingIds:['F-001'],evidenceIds:['E-2']});reject(r,/attempt counter/);
 r.findings[0].attempts=1;assert.equal(checkReport(r).valid,true);r.iterations[1].evidenceIds=['E-1'];reject(r,/reused/);
});
