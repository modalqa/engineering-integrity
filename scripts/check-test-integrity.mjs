// Optional Bantulansia negative-control evaluation. Never changes the source project.
import { mkdtemp, cp, readFile, writeFile, symlink, rm, realpath } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
const project=await realpath(process.argv[2]);
const base=await realpath(os.tmpdir());
const isolated=await mkdtemp(path.join(base,'engineering-integrity-negative-'));
try {
 for(const dir of ['src','lib']) await cp(path.join(project,dir),path.join(isolated,dir),{recursive:true});
 await symlink(path.join(project,'node_modules'),path.join(isolated,'node_modules'),process.platform==='win32'?'junction':'dir');
 await writeFile(path.join(isolated,'package.json'),'{"private":true,"type":"module"}');
 const module=path.join(isolated,'src/modules/orders/application/use-cases/get-admin-metrics.use-case.ts');
 const original=await readFile(module,'utf8');
 const formula='const completionRate = assignedTotal === 0 ? 0 : Math.round((completed / assignedTotal) * 100);';
 if(!original.includes(formula))throw new Error('Expected source formula changed; re-evaluate the negative control.');
 await writeFile(module,original.replace(formula,'const completionRate = 0; // Deliberately broken negative control'));
 const config={test:{environment:'node',include:['src/tests/admin-metrics.test.ts']},resolve:{alias:{'@':isolated}}};
 await writeFile(path.join(isolated,'vitest.config.mjs'),'export default '+JSON.stringify(config));
 const result=spawnSync(process.execPath,[path.join(project,'node_modules/vitest/vitest.mjs'),'run','--config',path.join(isolated,'vitest.config.mjs')],{cwd:isolated,encoding:'utf8',timeout:60000});
 console.log('Negative control: replace completion-rate formula with constant zero in an isolated copy.');
 console.log(result.stdout);console.error(result.stderr);
 if(result.error)throw result.error;
 console.log('Test command exit code: '+result.status);
 console.log(result.status===0?'Observed: existing tests accept the broken formula.':'Observed: tests reject the mutation or the evaluation failed; inspect output.');
 process.exitCode=result.status===0?0:1;
} finally {
 const resolved=await realpath(isolated);
 if(path.dirname(resolved)!==base || !path.basename(resolved).startsWith('engineering-integrity-negative-'))throw new Error('Unsafe cleanup target');
 await rm(resolved,{recursive:true,force:true});
}
