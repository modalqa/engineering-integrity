import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile, writeFile, readdir, mkdir, symlink } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { install, source, targets } from '../lib/install.mjs';
const fixture=async t=>{const dir=await mkdtemp(path.join(os.tmpdir(),'engineering-integrity-'));t.after(()=>rm(dir,{recursive:true,force:true}));return dir;};
test('all hosts receive a complete skill and repeat installs are unchanged',async t=>{
 const cwd=await fixture(t); const result=await install({cwd}); assert.equal(result.length,4);
 for(const agent of Object.keys(targets)) {
  const dest=path.join(cwd,targets[agent],'engineering-integrity');
  assert.equal(await readFile(path.join(dest,'SKILL.md'),'utf8'),await readFile(path.join(source,'SKILL.md'),'utf8'));
  assert.equal((await readdir(path.join(dest,'auditors'))).length,7);
  assert.ok((await readFile(path.join(dest,'workflows/completion.md'),'utf8')).includes('UNVERIFIED'));
 }
 assert.ok((await install({cwd})).every(r=>r.status==='unchanged'));
});
test('dry run writes nothing and selection installs only selected hosts',async t=>{
 const cwd=await fixture(t);const result=await install({cwd,agents:['cursor'],dryRun:true});assert.equal(result[0].status,'planned');assert.deepEqual(await readdir(cwd),[]);
 await install({cwd,agents:['cursor']});assert.deepEqual(await readdir(cwd),['.cursor']);
});
test('different existing files stop all preflight writes and preserve user content',async t=>{
 const cwd=await fixture(t);await install({cwd,agents:['cursor']});const file=path.join(cwd,targets.cursor,'engineering-integrity/SKILL.md');await writeFile(file,'user content');
 await assert.rejects(install({cwd,agents:['codex','cursor']}),/Existing skill differs/);
 assert.equal(await readFile(file,'utf8'),'user content');assert.deepEqual(await readdir(cwd),['.cursor']);
});
test('rejects unknown agents without writes',async t=>{const cwd=await fixture(t);await assert.rejects(install({cwd,agents:['unknown']}),/Choose/);assert.deepEqual(await readdir(cwd),[]);});
test('does not follow a linked host directory outside the project',async t=>{
 const cwd=await fixture(t),outside=await fixture(t);await symlink(outside,path.join(cwd,'.cursor'),process.platform==='win32'?'junction':'dir');
 await assert.rejects(install({cwd,agents:['cursor']}),/linked path/);assert.deepEqual(await readdir(outside),[]);
});
test('CLI supports paths with spaces, multiple agents, dry run, and useful errors',async t=>{
 const base=await fixture(t),cwd=path.join(base,'project with spaces');await mkdir(cwd);
 const cli=new URL('../bin/cli.mjs',import.meta.url);
 const {fileURLToPath}=await import('node:url');
 let result=spawnSync(process.execPath,[fileURLToPath(cli),'install','--cwd',cwd,'--agent','codex','--agent','claude','--dry-run'],{encoding:'utf8'});
 assert.equal(result.status,0,result.stderr);assert.match(result.stdout,/planned: codex/);assert.match(result.stdout,/planned: claude/);assert.deepEqual(await readdir(cwd),[]);
 for(const args of [['--agent'],['--agent','all,bad'],['--force'],['remove']]) {result=spawnSync(process.execPath,[fileURLToPath(cli),...args],{encoding:'utf8'});assert.equal(result.status,1);}
});
