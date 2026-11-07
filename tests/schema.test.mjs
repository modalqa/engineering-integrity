import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import {reportSchema} from '../lib/report-schema.mjs';import {checkReport} from '../lib/check-report.mjs';
test('the portable schema and example match the executable report contract',async()=>{
 const schema=JSON.parse(await readFile(new URL('../skills/engineering-integrity/templates/report.schema.json',import.meta.url),'utf8'));assert.deepEqual(schema,reportSchema);
 const example=JSON.parse(await readFile(new URL('../skills/engineering-integrity/templates/report.example.json',import.meta.url),'utf8'));const result=checkReport(example);assert.equal(result.valid,true,result.errors.join('\n'));
});
