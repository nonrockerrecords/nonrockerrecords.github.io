import {chromium} from 'playwright';
import {serve} from './serve.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const server=await serve(8801);let browser;const results=[];
try{
 browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});
 for(const game of ['claw-3d','claw-arcade']){
  await page.goto(`http://127.0.0.1:8801/camp/cinematic/${game}/`);await page.waitForFunction(()=>window.__campQA);await page.waitForTimeout(500);
  const snap=()=>page.evaluate(()=>window.__campQA.snapshot());
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
  const before=await snap();await page.keyboard.down('ArrowRight');await page.waitForTimeout(250);await page.keyboard.up('ArrowRight');assert.deepEqual((await snap()).aim,before.aim);
  await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});
  if(game==='claw-3d'){
   const stick=await page.locator('#joystick').boundingBox(),s=await snap();const cd=await page.context().newCDPSession(page);
   await cd.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:stick.x+stick.width*.8,y:stick.y+stick.height*.5}]});await page.waitForTimeout(250);await cd.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cd.detach();assert((await snap()).aim.x>s.aim.x);
  }
  await page.locator('[data-claim]').click();assert.equal(await page.locator('#claim-email').evaluate(e=>e===document.activeElement),true);await page.keyboard.press('Escape');assert.equal(await page.locator('[data-claim]').evaluate(e=>e===document.activeElement),true);
  await page.locator('[data-claim]').click();await page.locator('#claim-email').fill('private@example.edu');await page.locator('#claim-dialog form button').click();
  await page.evaluate(()=>Object.defineProperty(navigator.clipboard,'writeText',{configurable:true,value:()=>Promise.reject(new Error('Denied for test'))}));await page.locator('[data-copy]').click();assert.match(await page.locator('[data-copy]').textContent(),/selected/);
  results.push({game,checks:'visibility event pauses input; 3D touch joystick; dialog initial/return focus; clipboard denial fallback',passed:true});
 }
 await page.route('**/assets/dist/arcade.js',r=>r.abort());await page.goto('http://127.0.0.1:8801/camp/cinematic/claw-arcade/');await page.locator('[data-claim]').click();await page.locator('#claim-email').fill('demo@example.edu');await page.locator('#claim-dialog form button').click();assert(await page.locator('.pass-result').isVisible());results.push({check:'arcade dependency failure claim',passed:true});
 await page.goto('http://127.0.0.1:8801/camp/cinematic/index-campfire-chaos.html');await page.locator('#fire-start').click();assert(await page.locator('#fire-gate').isHidden());
 await page.goto('http://127.0.0.1:8801/camp/cinematic/index-yourstory.html');await page.locator('#your-story').fill('A local draft.');await page.locator('#story-form button').click();assert.equal(await page.locator('#story-preview').textContent(),'A local draft.');
 await page.goto('http://127.0.0.1:8801/camp/cinematic/index-bouldering-topo.html');await page.locator('[data-route="2"]').click();assert.equal(await page.locator('#route-title').textContent(),'Take the next step.');results.push({check:'explicit demon entry, local story preview, route hotspots',passed:true});
 await fs.writeFile('verification/edge-results.json',JSON.stringify({date:new Date().toISOString(),results},null,2));console.log(JSON.stringify(results));
}finally{await browser?.close();server.close();}
