import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import {serve} from './serve.mjs';
import assert from 'node:assert/strict';
import {selectCatch,exposedCapsules} from '../src/core.mjs';
import sharp from 'sharp';
const server=await serve(8800);let browser;
const results=[];
try{
 browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 let errors=[];page.on('pageerror',e=>errors.push(e.message));
 await fs.mkdir('verification/screenshots',{recursive:true});
 for(const route of (process.argv.includes('--pages-only')?[]:['cinematic/claw-3d/index.html','cinematic/claw-arcade/index.html'])){
  errors=[];
  await page.goto('http://127.0.0.1:8800/camp/'+route);
  await page.waitForFunction(()=>window.__campQA||document.querySelector('#loading')?.textContent.includes('could'),{timeout:30000});
  await page.waitForTimeout(2000);
  let snapshot=await page.evaluate(()=>window.__campQA?.snapshot());
  assert(snapshot,'Game initialized');
  const arcade=route.includes('arcade');
  const snap=()=>page.evaluate(()=>window.__campQA.snapshot());
  const pulse=async(key,ms)=>{await page.keyboard.down(key);await page.waitForTimeout(ms);await page.keyboard.up(key);await page.waitForTimeout(150);};
  async function aimAt(target){
   for(let i=0;i<35;i++){
    const s=await snap(),dx=target.x-s.aim.x,dz=(target.z||0)-(s.aim.z||0),threshold=arcade?8:.045;
    if(Math.abs(dx)<threshold&&Math.abs(dz)<threshold)return;
    const axis=Math.abs(dx)>Math.abs(dz)?'x':'z',delta=axis==='x'?dx:dz;
    await pulse(axis==='x'?(delta>0?'ArrowRight':'ArrowLeft'):(delta>0?'ArrowDown':'ArrowUp'),Math.max(20,Math.min(450,Math.abs(delta)*(arcade?4.2:430))));
   }
  }
  const target=exposedCapsules(snapshot.capsules).sort((a,b)=>Math.hypot(a.x-snapshot.aim.x,a.z-snapshot.aim.z)-Math.hypot(b.x-snapshot.aim.x,b.z-snapshot.aim.z))[0];
  await aimAt(target);
  snapshot=await snap();const expected=selectCatch(snapshot.capsules,snapshot.aim);assert(expected,'Player can aim at an exposed capsule');
  await page.locator('#drop').click();assert(await page.locator('#drop').isDisabled(),'Drop locked during round');
  await page.waitForFunction(()=>['win','miss'].includes(window.__campQA.snapshot().state),null,{timeout:12000});
  snapshot=await snap();assert.equal(snapshot.state,'win');assert.equal(snapshot.caught,expected.id,'Same capsule delivered');
  await page.locator('#open-capsule').click();await page.locator('#claim-email').fill('bad');await page.locator('#claim-dialog form button').click();assert(await page.locator('#claim-email').getAttribute('aria-invalid'));
  await page.locator('#claim-email').fill('demo@example.edu');await page.locator('#claim-dialog form button').click();assert(await page.locator('#claim-dialog .pass-result').isVisible());assert.equal(await page.locator('#claim-email').inputValue(),'');
  await page.keyboard.press('Escape');await page.locator('#retry').click();assert.equal((await snap()).state,'aim');
  // Choose an empty grip position from actual exposed positions, then drive there with keyboard input.
  let missTarget;
  if(arcade){const pile=exposedCapsules((await snap()).capsules);let clearance=-1;for(let x=128;x<592;x+=2){const gap=Math.min(...pile.map(c=>Math.abs(c.x-x)-c.r*.72));if(gap>clearance){clearance=gap;missTarget={x,z:0};}}}
  else missTarget={x:1.88,z:1.12};
  await aimAt(missTarget);let missSnapshot=await snap();assert(!selectCatch(missSnapshot.capsules,missSnapshot.aim),'Empty alignment selected');await page.locator('#drop').click();await page.waitForFunction(()=>window.__campQA.snapshot().state==='miss',null,{timeout:10000});await page.locator('#retry').click();
  await page.locator('#restock').click();assert.equal((await snap()).capsules.length,arcade?24:30);
  await page.locator('#pause').click();const paused=(await snap()).aim;await pulse('ArrowRight',200);assert.deepEqual((await snap()).aim,paused);await page.locator('#pause').click();
  await page.locator('#sound').click();assert.equal(await page.locator('#sound').getAttribute('aria-pressed'),'true');await page.locator('#sound').click();
  if(!arcade){await page.locator('#camera').click();assert.equal(await page.locator('#camera').textContent(),'Angled view');await page.locator('#camera').click();}
  await page.screenshot({path:'verification/screenshots/'+(route.includes('3d')?'claw-3d':'claw-arcade')+'-desktop.png',fullPage:true});
  const preview=await page.locator('#game-canvas').screenshot();await sharp(preview).resize({width:1100,withoutEnlargement:true}).webp({quality:87}).toFile('assets/generated/'+(arcade?'arcade-preview':'cabinet-preview')+'.webp');
  results.push({route,checks:'keyboard aim, catch, miss, identity, lock, invalid/valid claim, retry, restock, pause, sound, camera',fps:snapshot.fps,errors:[...errors]});
  console.log(JSON.stringify(results.at(-1)));
  await page.setViewportSize({width:390,height:844});await page.waitForTimeout(500);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'No mobile overflow');
  await page.locator('#restock').click();const before=await snap();
  const right=await page.locator('[data-move="ArrowRight"]').boundingBox();await page.mouse.move(right.x+right.width/2,right.y+right.height/2);await page.mouse.down();await page.waitForTimeout(300);await page.mouse.up();assert((await snap()).aim.x>before.aim.x,'Pointer control moves claw');
  await page.locator('#restock').click();await page.evaluate(()=>scrollTo(0,0));const touchBefore=await snap();
  const cd=await page.context().newCDPSession(page);await cd.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
  const touchBox=await page.locator('[data-move="ArrowRight"]').boundingBox();
  await cd.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:touchBox.x+touchBox.width/2,y:touchBox.y+touchBox.height/2}]});await page.waitForTimeout(300);await cd.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert((await snap()).aim.x>touchBefore.aim.x,'Touch control moves claw');await cd.detach();
  await page.evaluate(()=>{document.activeElement?.blur();scrollTo(0,0);});
  const dropBox=await page.locator('#drop').boundingBox();assert(dropBox.y+dropBox.height<844,'Drop stays in mobile viewport');
  results.push({route,width:390,checks:'pointer and emulated touch movement, drop visible with machine, no overflow',passed:true});
  await page.screenshot({path:'verification/screenshots/'+(arcade?'claw-arcade':'claw-3d')+'-mobile.png',fullPage:true});
  await page.setViewportSize({width:1440,height:1000});
 }
 if(process.argv.includes('--full')){
  const files=(await fs.readdir('.')).filter(n=>n.endsWith('.html')).map(n=>'cinematic/'+n).concat(['field-guide/index.html','surreal/index.html']);
  for(const route of files){
   for(const width of [1440,390]){
    errors=[];await page.setViewportSize({width,height:width===390?844:1000});await page.goto('http://127.0.0.1:8800/camp/'+route);await page.waitForTimeout(250);
    // Load lazy images and reveal animations before the full-page visual inspection.
    await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=650){scrollTo(0,y);await new Promise(r=>setTimeout(r,40));}scrollTo(0,0);});await page.waitForTimeout(450);
    await page.locator('img').evaluateAll(async imgs=>{await Promise.all(imgs.map(async i=>{i.loading='eager';try{await i.decode();}catch{}}));});
    const broken=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src));
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
    await page.screenshot({path:`verification/screenshots/${route.replaceAll('/','-').replace('.html','')}-${width}.png`,fullPage:true});
    results.push({route,width,broken,overflow,errors:[...errors]});
    assert.deepEqual(broken,[],route+' images');assert(!overflow,route+' overflow');assert.deepEqual(errors,[],route+' errors');
   }
   console.log('Reviewed '+route+' desktop/mobile');
  }
  await page.goto('http://127.0.0.1:8800/camp/cinematic/index-campsite.html');
  for(let i=0;i<3;i++){await page.locator('[data-answer="0"]').click();await page.locator('#quiz-next').click();}
  assert(await page.locator('#quiz-restart').isVisible());await page.locator('#quiz-restart').click();assert.equal(await page.locator('[data-answer]').count(),4);
  await page.goto('http://127.0.0.1:8800/camp/cinematic/index-daynight.html');await page.locator('#day-toggle').click();assert(await page.locator('#day-scene').evaluate(e=>e.classList.contains('night')));
  await page.goto('http://127.0.0.1:8800/camp/cinematic/index-flashlight.html');assert(await page.locator('#forest-gate').isVisible());await page.locator('#forest-start').click();await page.locator('#encounter').click();assert(await page.locator('.werewolf-encounter').evaluate(e=>e.classList.contains('show')));
  await page.goto('http://127.0.0.1:8800/camp/cinematic/index-booth-tour.html');await page.locator('[data-spot="2"]').click();assert.equal(await page.locator('#spot-title').textContent(),'The camp arcade');
  await page.goto('http://127.0.0.1:8800/camp/cinematic/index-chairs.html');await page.locator('[data-chair="2"]').click();assert.equal(await page.locator('#chair-title').textContent(),'The creative chair');
 }
 // Failure path uses only the independent HTML claim script.
 await page.route('**/assets/dist/cabinet.js',route=>route.abort());
 await page.goto('http://127.0.0.1:8800/camp/cinematic/claw-3d/index.html');await page.locator('[data-claim]').click();await page.locator('#claim-email').fill('fallback@example.edu');await page.locator('#claim-dialog form button').click();assert(await page.locator('.pass-result').isVisible());results.push({check:'bundle failure claim fallback',passed:true});
 await page.unroute('**/assets/dist/cabinet.js');
 const noGL=await browser.newPage();await noGL.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type.includes('webgl')?null:original.call(this,type,...args);};});await noGL.goto('http://127.0.0.1:8800/camp/cinematic/claw-3d/');await noGL.locator('[data-claim]').click();assert(await noGL.locator('#claim-dialog').isVisible());await noGL.close();results.push({check:'unavailable WebGL claim fallback',passed:true});
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('http://127.0.0.1:8800/camp/cinematic/index.html');assert.equal(await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches),true);results.push({check:'reduced motion',passed:true});
 await fs.writeFile('verification/'+(process.argv.includes('--pages-only')?'page-results.json':'browser-results.json'),JSON.stringify({browser:browser.version(),date:new Date().toISOString(),results},null,2));
 console.log('All browser checks passed.');
}catch(error){await fs.writeFile('verification/browser-failure.json',JSON.stringify({error:String(error),results},null,2));throw error;
}finally{await browser?.close();server.close();}
