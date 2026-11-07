import { lstat, realpath, mkdir, cp, rename, rm, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
export const targets = Object.freeze({codex: '.agents/skills', claude: '.claude/skills', copilot: '.github/skills', cursor: '.cursor/skills'});
export const source = fileURLToPath(new URL('../skills/engineering-integrity/', import.meta.url));
const missing = async p => { try { await lstat(p); return false; } catch (e) { if (e.code === 'ENOENT') return true; throw e; } };
async function safeDirectory(root, relative, create) {
  let current = root;
  for (const part of relative.split('/')) {
    current = path.join(current, part);
    if (await missing(current)) { if (create) await mkdir(current); else return current; }
    const stat = await lstat(current);
    if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error('Refusing non-directory or linked path: ' + current);
  }
  return current;
}
async function equalTree(a,b) {
  const left=(await readdir(a)).sort(), right=(await readdir(b)).sort();
  if (JSON.stringify(left)!==JSON.stringify(right)) return false;
  for (const name of left) {
    const x=path.join(a,name), y=path.join(b,name), sx=await lstat(x), sy=await lstat(y);
    if (sx.isSymbolicLink() || sy.isSymbolicLink()) return false;
    if (sx.isDirectory() && sy.isDirectory()) { if (!await equalTree(x,y)) return false; }
    else if (sx.isFile() && sy.isFile()) { if (!(await readFile(x)).equals(await readFile(y))) return false; }
    else return false;
  }
  return true;
}
export async function install({cwd=process.cwd(), agents=Object.keys(targets), dryRun=false}={}) {
  if (!agents.length || agents.some(a=>!Object.hasOwn(targets,a))) throw new Error('Choose codex, claude, copilot, cursor, or all.');
  const root=await realpath(cwd), plan=[];
  for (const agent of [...new Set(agents)]) {
    const relative=targets[agent]+'/engineering-integrity';
    await safeDirectory(root,relative,false);
    const destination=path.join(root,relative), exists=!await missing(destination);
    if (exists && !await equalTree(source,destination)) throw new Error('Existing skill differs; preserve or move it before installing: '+destination);
    plan.push({agent,destination,status:exists?'unchanged':dryRun?'planned':'installed'});
  }
  if (dryRun) return plan;
  for (const item of plan) {
    if (item.status==='unchanged') continue;
    const parent=await safeDirectory(root,targets[item.agent],true);
    const temporary=path.join(parent,'.engineering-integrity-'+randomUUID());
    try {
      await cp(source,temporary,{recursive:true,errorOnExist:true,force:false});
      if (!await missing(item.destination)) throw new Error('Destination appeared during installation: '+item.destination);
      await rename(temporary,item.destination);
    } finally { await rm(temporary,{recursive:true,force:true}); }
  }
  return plan;
}
