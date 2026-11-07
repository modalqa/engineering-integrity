const text = {type:'string', minLength:1};
const list = items => ({type:'array',items});
const obj = (properties,required=Object.keys(properties)) => ({type:'object',properties,required,additionalProperties:false});
const one = values => ({type:'string',enum:values});
export const reportSchema = {
 $schema:'https://json-schema.org/draft/2020-12/schema',
 ...obj({
  schemaVersion:{const:1}, task:obj({id:text,source:text,requirementsComplete:{type:'boolean'},upstreamWorkflow:text},['id','source','requirementsComplete']),
  snapshot:text, status:one(['VERIFIED','VERIFIED WITH WARNINGS','BLOCKED','UNVERIFIED']),
  mode:one(['audit','correction','full']),
  limits:obj({maxIterations:{type:'integer',minimum:0},maxRepeatedAttempts:{type:'integer',minimum:1}}),
  requirements:list(obj({id:text,description:text,mandatory:{type:'boolean'},status:one(['Verified','Partially Verified','Not Implemented','Failed','Not Verifiable']),verification:one(['execution','inspection']),implementation:list(text),evidenceIds:list(text)})),
  evidence:list(obj({id:text,snapshot:text,capturedAt:{type:'string',format:'date-time'},kind:one(['execution','inspection','claim']),outcome:one(['passed','failed','observed','unavailable']),description:text,command:text,cwd:text,exitCode:{type:['integer','null']}},['id','snapshot','capturedAt','kind','outcome','description'])),
  findings:list(obj({id:text,fingerprint:text,title:text,category:text,severity:one(['Critical','High','Medium','Low','Informational']),component:text,description:text,expected:text,actual:text,recommendation:text,verificationCriteria:text,verification:one(['execution','inspection']),state:one(['open','in-progress','resolved','reopened','justified','unverified']),attempts:{type:'integer',minimum:0},evidenceIds:list(text),verificationEvidenceIds:list(text),justification:text,acceptedBy:text},['id','fingerprint','title','category','severity','component','description','expected','actual','recommendation','verificationCriteria','verification','state','attempts','evidenceIds','verificationEvidenceIds'])),
  iterations:list(obj({round:{type:'integer',minimum:0},snapshot:text,correctedFindingIds:list(text),failedFindingIds:list(text),evidenceIds:list(text)})),
  checks:list(obj({id:text,required:{type:'boolean'},outcome:one(['passed','failed','unavailable','skipped']),evidenceIds:list(text)})),
  scope:obj({status:one(['verified','unauthorized','unknown']),evidenceIds:list(text)}),
  independence:one(['independent-reviewer','fresh-context','same-agent-pass']),limitations:list(text),stopReason:text
 })
};
export function validateShape(value,schema=reportSchema,at='$',errors=[]) {
 if(schema.const!==undefined && value!==schema.const)errors.push(at+': expected '+schema.const);
 if(schema.enum && !schema.enum.includes(value))errors.push(at+': unsupported value');
 if(schema.type) {
  const types=Array.isArray(schema.type)?schema.type:[schema.type];
  const matches=types.some(t=>t==='null'?value===null:t==='array'?Array.isArray(value):t==='integer'?Number.isInteger(value):t==='object'?value!==null && typeof value==='object' && !Array.isArray(value):typeof value===t);
  if(!matches){errors.push(at+': expected '+types.join('|'));return errors;}
 }
 if(typeof value==='string') {
  if(schema.minLength && value.trim().length<schema.minLength)errors.push(at+': must not be empty');
  if(schema.format==='date-time' && !/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(value))errors.push(at+': expected ISO date-time with timezone');
  if(schema.format==='date-time' && !Number.isFinite(Date.parse(value)))errors.push(at+': invalid date-time');
 }
 if(typeof value==='number' && schema.minimum!==undefined && value<schema.minimum)errors.push(at+': below minimum');
 if(Array.isArray(value))value.forEach((v,i)=>validateShape(v,schema.items,at+'['+i+']',errors));
 if(value!==null && typeof value==='object' && !Array.isArray(value)) {
  for(const key of schema.required??[])if(!Object.hasOwn(value,key))errors.push(at+'.'+key+': required');
  for(const key of Object.keys(value)) {
   if(schema.properties?.[key])validateShape(value[key],schema.properties[key],at+'.'+key,errors);
   else if(schema.additionalProperties===false)errors.push(at+'.'+key+': unknown field');
  }
 }
 return errors;
}
