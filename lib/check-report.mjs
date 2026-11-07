import { validateShape } from './report-schema.mjs';
export function checkReport(report,{now=Date.now()}={}) {
 const errors=validateShape(report);const warnings=[];
 if(errors.length)return {valid:false,errors,warnings};
 const {evidence,requirements,findings,iterations,checks}=report;
 const ids=new Set();
 for(const list of [evidence,requirements,findings,checks])for(const item of list){if(ids.has(item.id))errors.push('Duplicate ID: '+item.id);ids.add(item.id);}
 const ledger=new Map(evidence.map(e=>[e.id,e]));
 const refs=(values,owner)=>{if(new Set(values).size!==values.length)errors.push(owner+': duplicate evidence references');for(const id of values)if(!ledger.has(id))errors.push(owner+': missing evidence '+id);};
 const supported=(values,kind,snapshot=report.snapshot)=>values.some(id=>{
  const e=ledger.get(id);return e && e.snapshot===snapshot && e.kind!=='claim' && (kind!=='execution'||e.kind==='execution') && (e.outcome==='passed'||(kind==='inspection'&&e.kind==='inspection'&&e.outcome==='observed')) && (e.kind!=='execution'||e.exitCode===0);
 });
 for(const e of evidence){
  if(Date.parse(e.capturedAt)>now+300000)errors.push(e.id+': evidence is dated in the future');
  if(e.kind==='execution'){
   if(!e.command || !e.cwd || !Object.hasOwn(e,'exitCode'))errors.push(e.id+': execution needs command, cwd, and exitCode');
   if(e.outcome==='passed'&&e.exitCode!==0)errors.push(e.id+': passing execution requires exitCode 0');
   if(e.outcome==='failed'&&(e.exitCode===0||e.exitCode===null))errors.push(e.id+': failed execution requires a nonzero exitCode');
  }
 }
 for(const q of requirements){refs(q.evidenceIds,q.id);if(q.status==='Verified' && (!q.implementation.length || !supported(q.evidenceIds,q.verification)))errors.push(q.id+': Verified needs implementation and current supporting evidence');}
 const fingerprints=new Set();
 for(const finding of findings){
  if(fingerprints.has(finding.fingerprint))errors.push(finding.id+': duplicate finding fingerprint');fingerprints.add(finding.fingerprint);
  refs(finding.evidenceIds,finding.id);refs(finding.verificationEvidenceIds,finding.id+' verification');
  if(!finding.evidenceIds.some(id=>ledger.get(id)?.kind!=='claim' && ledger.has(id)))errors.push(finding.id+': finding needs non-claim evidence');
  if(finding.state==='resolved'&&!supported(finding.verificationEvidenceIds,finding.verification))errors.push(finding.id+': resolution needs current verification evidence');
  if(finding.state==='justified' && (['Critical','High'].includes(finding.severity)||!finding.justification||!finding.acceptedBy))errors.push(finding.id+': invalid risk acceptance');
 }
 if(!iterations.length || iterations[0].round!==0)errors.push('Iteration history must start at round 0');
 const roundEvidence=new Set();
 iterations.forEach((it,i)=>{
  for(const id of it.evidenceIds){if(roundEvidence.has(id))errors.push('Round '+it.round+': evidence was reused from an earlier round');roundEvidence.add(id);}
  if(it.round!==i)errors.push('Iteration rounds must be contiguous');
  refs(it.evidenceIds,'Round '+it.round);
  if(!it.evidenceIds.length || it.evidenceIds.some(id=>ledger.get(id)?.snapshot!==it.snapshot))errors.push('Round '+it.round+': fresh snapshot evidence required');
  if(new Set(it.correctedFindingIds).size!==it.correctedFindingIds.length || new Set(it.failedFindingIds).size!==it.failedFindingIds.length)errors.push('Round '+it.round+': duplicate finding IDs');
  if(it.round===0&&(it.correctedFindingIds.length||it.failedFindingIds.length))errors.push('Initial audit cannot contain corrections');
  for(const id of it.failedFindingIds)if(!it.correctedFindingIds.includes(id))errors.push('Round '+it.round+': failed finding was not targeted');
  for(const id of it.correctedFindingIds)if(!findings.some(f=>f.id===id))errors.push('Round '+it.round+': unknown finding '+id);
 });
 if(iterations.at(-1)?.snapshot!==report.snapshot)errors.push('Final round must match report snapshot');
 if(iterations.length-1>report.limits.maxIterations)errors.push('Correction round limit exceeded');
 if(report.mode==='audit'&&iterations.length>1)errors.push('Audit mode cannot contain correction rounds');
 for(const finding of findings){
  const targeted=iterations.filter(it=>it.round>0&&it.correctedFindingIds.includes(finding.id)).length;
  if(finding.attempts>targeted)errors.push(finding.id+': attempts exceed targeted correction rounds');
  const failed=iterations.filter(it=>it.failedFindingIds.includes(finding.id)).length;
  if(finding.attempts!==failed)errors.push(finding.id+': attempt counter does not match failed correction history');
  let previousFailures=0;for(const it of iterations){if(it.correctedFindingIds.includes(finding.id)&&previousFailures>=report.limits.maxRepeatedAttempts)errors.push(finding.id+': correction continued after repeated-attempt limit');if(it.failedFindingIds.includes(finding.id))previousFailures++;}
  if(finding.attempts>report.limits.maxRepeatedAttempts)errors.push(finding.id+': repeated-attempt limit exceeded');
 }
 for(const check of checks){refs(check.evidenceIds,check.id);if(check.outcome==='passed'&&!supported(check.evidenceIds,'execution'))errors.push(check.id+': passing check needs current execution evidence');}
 refs(report.scope.evidenceIds,'Scope');
 if(report.scope.status==='verified'&&!supported(report.scope.evidenceIds,'inspection'))errors.push('Scope verification needs current evidence');
 const accepted=report.status.startsWith('VERIFIED');
 const blockers=findings.some(f=>['Critical','High'].includes(f.severity)&&f.state!=='resolved') || report.scope.status==='unauthorized' || requirements.some(q=>q.mandatory&&['Failed','Not Implemented'].includes(q.status));
 if(blockers&&report.status!=='BLOCKED')errors.push('Confirmed blocker requires BLOCKED');
 if(report.status==='BLOCKED'&&!blockers)errors.push('BLOCKED needs a confirmed blocking defect or mandatory failure');
 if(accepted){
  if(!report.task.requirementsComplete||!requirements.some(q=>q.mandatory))errors.push('Acceptance requires complete original mandatory requirements');
  if(requirements.some(q=>q.mandatory&&q.status!=='Verified'))errors.push('Mandatory requirements are not all Verified');
  if(report.scope.status!=='verified')errors.push('Acceptance requires verified scope');
  if(checks.some(x=>x.required&&x.outcome!=='passed'))errors.push('Required checks must pass');
  if(findings.some(f=>f.severity==='Medium'&&!['resolved','justified'].includes(f.state)))errors.push('Medium findings must be resolved or justified');
  const concerns=findings.some(f=>f.state!=='resolved');
  if(report.status==='VERIFIED'&&concerns)errors.push('Unresolved concerns require VERIFIED WITH WARNINGS or a nonaccepted status');
  if(report.status==='VERIFIED WITH WARNINGS'&&!concerns)errors.push('Warning status needs a documented finding');
 }
 if(report.independence==='same-agent-pass')warnings.push('Review used the same agent; independent review was not established.');
 warnings.push('Checks establish report consistency only. Evidence authenticity, relevance, and complete requirements still need review.');
 return {valid:errors.length===0,errors,warnings};
}
