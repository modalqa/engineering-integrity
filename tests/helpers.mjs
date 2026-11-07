export function validReport() {
 return {schemaVersion:1,task:{id:'TASK-1',source:'TASK.md',requirementsComplete:true,upstreamWorkflow:'Existing implementation workflow'},snapshot:'snapshot-0',status:'VERIFIED',mode:'full',limits:{maxIterations:3,maxRepeatedAttempts:2},
 requirements:[{id:'REQ-1',description:'Return the required result',mandatory:true,status:'Verified',verification:'execution',implementation:['pricing.mjs'],evidenceIds:['E-1']}],
 evidence:[{id:'E-1',snapshot:'snapshot-0',capturedAt:'2026-01-01T00:00:00Z',kind:'execution',outcome:'passed',description:'Required behavior assertions passed',command:'node checks.mjs',cwd:'isolated fixture',exitCode:0}],
 findings:[],iterations:[{round:0,snapshot:'snapshot-0',correctedFindingIds:[],failedFindingIds:[],evidenceIds:['E-1']}],checks:[{id:'CHECK-1',required:true,outcome:'passed',evidenceIds:['E-1']}],scope:{status:'verified',evidenceIds:['E-1']},independence:'same-agent-pass',limitations:['The same agent performed the review.'],stopReason:'All mandatory gates passed.'};
}
export function finding(overrides={}) {
 return {id:'F-001',fingerprint:'zero-quantity',title:'Zero quantity is accepted',category:'Fix verification',severity:'High',component:'pricing.mjs',description:'Zero bypasses the required positive quantity check.',expected:'Zero throws RangeError',actual:'Zero returns a value',recommendation:'Reject zero without rejecting valid quantities',verificationCriteria:'Zero throws and positive quantities return the correct product',verification:'execution',state:'open',attempts:0,evidenceIds:['E-1'],verificationEvidenceIds:[],...overrides};
}
