// A local ledger, not an agent orchestrator. Callers supply independently observed evidence.
export function createLoop({maxIterations=3,maxRepeatedAttempts=2}={}) {
 if(!Number.isInteger(maxIterations)||maxIterations<0||!Number.isInteger(maxRepeatedAttempts)||maxRepeatedAttempts<1)throw new Error('Invalid correction limits');
 return {limits:{maxIterations,maxRepeatedAttempts},findings:[],iterations:[],evidence:[],snapshot:null};
}
export function loopDecision(state) {
 const open=state.findings.filter(f=>!['resolved','justified'].includes(f.state));
 if(!open.length)return {action:'verify',reason:'No unresolved findings; run the full acceptance gate.'};
 if(state.iterations.length-1>=state.limits.maxIterations)return {action:'stop',reason:'Correction round limit reached.'};
 if(open.some(f=>f.attempts>=state.limits.maxRepeatedAttempts))return {action:'stop',reason:'Repeated finding attempt limit reached.'};
 return {action:'correct',reason:'Actionable findings remain.'};
}
export function recordRound(previous,{snapshot,evidence,observations=[],resolutions=[],correctedFingerprints=[]}) {
 const state=structuredClone(previous), round=state.iterations.length;
 if(round>0&&loopDecision(state).action==='stop')throw new Error('Correction loop has reached a limit');
 if(!snapshot||!evidence.length||evidence.some(e=>e.snapshot!==snapshot||e.kind==='claim'))throw new Error('Fresh non-claim evidence is required for each round');
 if(round===0&&correctedFingerprints.length)throw new Error('Initial audit is not a correction round');
 const ids=new Set(state.evidence.map(e=>e.id));
 for(const e of evidence){if(ids.has(e.id))throw new Error('Evidence IDs must be unique across rounds');ids.add(e.id);}
 const current=new Map(evidence.map(e=>[e.id,e]));
 const observed=new Set();
 for(const o of observations){
  if(!o.fingerprint||observed.has(o.fingerprint))throw new Error('Duplicate or empty observation fingerprint');observed.add(o.fingerprint);
  if(!o.evidenceIds?.length||o.evidenceIds.some(id=>!current.has(id)))throw new Error('Finding requires current evidence');
 }
 for(const key of correctedFingerprints)if(!state.findings.some(f=>f.fingerprint===key))throw new Error('Cannot correct an unknown finding');
 if(new Set(correctedFingerprints).size!==correctedFingerprints.length)throw new Error('Duplicate correction target');
 if(new Set(resolutions.map(x=>x.fingerprint)).size!==resolutions.length)throw new Error('Duplicate resolution');
 // A new snapshot invalidates old closures unless fresh verification is supplied.
 if(state.snapshot!==null&&state.snapshot!==snapshot)for(const finding of state.findings)if(finding.state==='resolved')finding.state='unverified';
 for(const o of observations){
  let finding=state.findings.find(f=>f.fingerprint===o.fingerprint);
  if(finding){
   const prior=previous.findings.find(f=>f.fingerprint===o.fingerprint);
   Object.assign(finding,o,{id:finding.id,attempts:finding.attempts,state:prior.state==='resolved'?'reopened':'open',verificationEvidenceIds:[]});
  } else state.findings.push({...o,id:'F-'+String(state.findings.length+1).padStart(3,'0'),state:'open',attempts:0,verificationEvidenceIds:[]});
 }
 for(const resolution of resolutions){
  const finding=state.findings.find(f=>f.fingerprint===resolution.fingerprint);
  if(!finding)throw new Error('Cannot resolve an unknown finding');
  if(observed.has(resolution.fingerprint))throw new Error('A confirmed defect cannot also be resolved in the same round');
  const proof=resolution.evidenceIds?.map(id=>current.get(id));
  if(!proof?.length||proof.some(e=>!e)||!proof.some(e=>e.kind!=='claim'&&(e.outcome==='passed'||(finding.verification==='inspection'&&e.kind==='inspection'&&e.outcome==='observed'))&&(finding.verification!=='execution'||(e.kind==='execution'&&e.exitCode===0))))throw new Error('Resolution requires fresh passing verification, not a completion claim');
  finding.state='resolved';finding.verificationEvidenceIds=resolution.evidenceIds;
 }
 const correctedFindingIds=[],failedFindingIds=[];
 for(const key of correctedFingerprints){
  const finding=state.findings.find(f=>f.fingerprint===key);correctedFindingIds.push(finding.id);
  if(finding.state!=='resolved'){finding.attempts++;failedFindingIds.push(finding.id);}
 }
 state.snapshot=snapshot;state.evidence.push(...evidence);
 state.iterations.push({round,snapshot,correctedFindingIds,failedFindingIds,evidenceIds:evidence.map(e=>e.id)});
 return state;
}
