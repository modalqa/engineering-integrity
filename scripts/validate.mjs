import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const skill=path.join(root,'skills/engineering-integrity');
const entry=await readFile(path.join(skill,'SKILL.md'),'utf8');
if(!entry.startsWith('---\nname: engineering-integrity\n') || !entry.includes('\ndescription: ')) throw new Error('Invalid skill frontmatter');
let checked=0;
async function walk(dir) {
 for(const item of await readdir(dir,{withFileTypes:true})) {
  const full=path.join(dir,item.name);
  if(item.isDirectory()){if(!['.git','node_modules'].includes(item.name))await walk(full);continue;}
  if(!item.name.endsWith('.md'))continue;
  const text=await readFile(full,'utf8');
  for(const match of text.matchAll(/\]\(([^)]+)\)/g)) {
   const target=match[1];if(/^(https?:|#)/.test(target))continue;
   await access(path.resolve(dir,target.split('#')[0]));
  }
  checked++;
 }
}
await walk(root);
console.log('Validated skill frontmatter and local links in '+checked+' Markdown files.');
