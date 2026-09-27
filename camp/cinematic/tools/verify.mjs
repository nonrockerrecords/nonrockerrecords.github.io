import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const roots=['.','../field-guide','../surreal'];const failures=[];let links=0,pages=0;
async function walk(dir){const out=[];for(const e of await fs.readdir(dir,{withFileTypes:true})){if(['node_modules','verification','tools','src','tests','artwork'].includes(e.name))continue;const p=path.join(dir,e.name);if(e.isDirectory())out.push(...await walk(p));else if(p.endsWith('.html'))out.push(p);}return out;}
for(const root of roots)for(const file of await walk(root)){
 pages++;const html=await fs.readFile(file,'utf8');assert(html.includes('<main id="main">'),file+' main landmark');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);if(new Set(ids).size!==ids.length)failures.push(file+': duplicate ids');
 for(const [,attr,value] of html.matchAll(/\b(src|href|srcset)="([^"]+)"/g)){
  if(/^(https?:|data:|mailto:|javascript:)/.test(value))continue;
  const url=value.split(/[?#]/)[0];
  if(!url){if(value.startsWith('#')&&!ids.includes(value.slice(1)))failures.push(file+': missing fragment '+value);continue;}
  if(attr==='srcset'&&value.includes(','))continue;
  const resolved=path.resolve(path.dirname(file),url);try{await fs.access(resolved);}catch{failures.push(file+': missing '+value);}links++;
  if(attr==='src'&&value.includes('/assets/img/'))failures.push(file+': original campaign art referenced '+value);
 }
 if(!html.includes('Demo')&&!html.includes('demo'))failures.push(file+': missing demo label');
}
const originals=(await fs.readdir('..')).filter(n=>n.endsWith('.html'));
for(const original of originals)try{await fs.access(original);}catch{failures.push('Missing cinematic counterpart: '+original);}
const manifest=JSON.parse(await fs.readFile('artwork/manifest.json','utf8'));
assert.equal(manifest.assets.length,16);
for(const a of manifest.assets){await fs.access(a.target);a.status=failures.length?'wired':'verified';}
await fs.writeFile('artwork/manifest.json',JSON.stringify(manifest,null,2));
await fs.mkdir('verification',{recursive:true});
await fs.writeFile('verification/static-results.json',JSON.stringify({pages,links,originalCounterparts:originals.length,assets:manifest.assets.length,failures},null,2));
console.log(JSON.stringify({pages,links,originalCounterparts:originals.length,assets:manifest.assets.length,failures},null,2));
if(failures.length)process.exitCode=1;
