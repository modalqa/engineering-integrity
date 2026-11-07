#!/usr/bin/env node
import { install } from '../lib/install.mjs';
import { readFile } from 'node:fs/promises';
import { checkReport } from '../lib/check-report.mjs';
import { scoreEvaluation, prepareEvaluation } from '../lib/evaluation.mjs';
const help = `Engineering Integrity: verify what your coding agent delivered.
Usage: engineering-integrity [install] [--agent all|codex|claude|copilot|cursor] [--cwd PATH] [--dry-run]
Additional commands:
  check-report REPORT.json
  prepare-evaluation CASE OUTPUT_DIRECTORY
  score-evaluation CASE REPORT.json
Default: all four agents in the current project. Repeat --agent to select several.
Copies one portable skill. Different existing files are never overwritten.
No audits, application changes, or model calls run during installation.
Example: npx engineering-integrity install --agent codex`;
try {
  const args=process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) console.log(help);
  else if (args.length===1 && args[0]==='--version') console.log(JSON.parse(await readFile(new URL('../package.json',import.meta.url),'utf8')).version);
  else if (args[0]==='check-report') {
    if(args.length!==2)throw new Error('Usage: check-report REPORT.json');
    const result=checkReport(JSON.parse(await readFile(args[1],'utf8')));
    console.log(JSON.stringify(result,null,2));if(!result.valid)process.exitCode=1;
  } else if(args[0]==='prepare-evaluation') {
    if(args.length!==3)throw new Error('Usage: prepare-evaluation CASE OUTPUT_DIRECTORY');
    console.log(JSON.stringify(await prepareEvaluation(args[1],args[2]),null,2));
  } else if(args[0]==='score-evaluation') {
    if(args.length!==3)throw new Error('Usage: score-evaluation CASE REPORT.json');
    const result=await scoreEvaluation(args[1],JSON.parse(await readFile(args[2],'utf8')));
    console.log(JSON.stringify(result,null,2));if(!result.reportValid)process.exitCode=1;
  }
  else {
    if (args[0]==='install') args.shift();
    const options={agents:[],dryRun:false};
    while (args.length) {
      const arg=args.shift();
      if (arg==='--dry-run') options.dryRun=true;
      else if (arg==='--agent' || arg==='--cwd') {
        const value=args.shift();
        if (!value || value.startsWith('--')) throw new Error('Missing value for '+arg);
        if (arg==='--cwd') options.cwd=value; else options.agents.push(...value.split(','));
      } else throw new Error('Unknown argument: '+arg);
    }
    if (!options.agents.length || options.agents.includes('all')) {
      if (options.agents.some(a=>!['all','codex','claude','copilot','cursor'].includes(a))) throw new Error('Unknown agent.');
      delete options.agents;
    }
    for (const result of await install(options)) console.log(result.status+': '+result.agent+' -> '+result.destination);
    console.log(options.dryRun?'Dry run complete. No files were written.':'Open a new agent session and ask it to use engineering-integrity.');
  }
} catch(error) { console.error('Engineering Integrity: '+error.message); process.exitCode=1; }
