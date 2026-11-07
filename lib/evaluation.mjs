import { readFile, readdir, mkdir, cp, lstat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkReport } from './check-report.mjs';
const fixtures=fileURLToPath(new URL('../tests/fixtures/',import.meta.url));
async function casePath(name){if(!/^[a-z]+(?:-[a-z]+)*$/.test(name))throw new Error('Invalid evaluation case');const dir=path.join(fixtures,name);if(!(await readdir(fixtures)).includes(name))throw new Error('Unknown evaluation case');return dir;}
export async function prepareEvaluation(name,out) {
 const dir=await casePath(name),target=path.resolve(out);
 try { await lstat(target);throw new Error('Output must not already exist'); }catch(e){if(e.code!=='ENOENT')throw e;}
 await mkdir(path.dirname(target),{recursive:true});
 await cp(path.join(dir,'project'),target,{recursive:true,errorOnExist:true,force:false});
 return {case:name,project:target,instructions:'Review TASK.md using engineering-integrity. Do not inspect evaluator oracles. Write the structured report outside the project.'};
}
export function scoreAgainstOracle(oracle,report) {
 const validation=checkReport(report);
 if(!validation.valid)return {reportValid:false,errors:validation.errors,metrics:null};
 const candidates=report.findings.filter(f=>f.severity!=='Informational');
 const remaining=[...candidates];let truePositives=0;
 for(const expected of oracle.expectedFindings){const i=remaining.findIndex(f=>f.category===expected.category&&f.component.replaceAll('\\','/')===expected.component);if(i>=0){truePositives++;remaining.splice(i,1);}}
 const falsePositives=remaining.length,falseNegatives=oracle.expectedFindings.length-truePositives;
 return {case:oracle.case,reportValid:true,metrics:{truePositives,falsePositives,falseNegatives,precision:candidates.length?truePositives/candidates.length:null,recall:oracle.expectedFindings.length?truePositives/oracle.expectedFindings.length:null,statusMatches:report.status===oracle.initialStatus,falseAcceptance:report.status.startsWith('VERIFIED')&&!oracle.initialStatus.startsWith('VERIFIED')},limitations:'Category/component matching is a reproducible scoring aid, not proof of semantic finding quality. Review disputed matches manually.'};
}
export async function scoreEvaluation(name,report){const dir=await casePath(name);return scoreAgainstOracle(JSON.parse(await readFile(path.join(dir,'oracle.json'),'utf8')),report);}
