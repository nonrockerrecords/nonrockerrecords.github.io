const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const errors=[];
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
  await page.goto('http://127.0.0.1:8781/?qa=1');await page.waitForFunction(()=>__qa.state().ready);
  await page.screenshot({path:'qa-title.png'});
  await page.click('#start-btn');await page.evaluate(()=>{__qa.manual(true);__qa.god(true);__qa.advance(10);});
  await page.screenshot({path:'qa-flight.png'});
  const first=await page.locator('#game').screenshot();await page.evaluate(()=>__qa.advance(.3));const second=await page.locator('#game').screenshot();assert(!first.equals(second),'scene must move');
  await page.evaluate(()=>{__qa.setPlayer({power:1,hp:2});__qa.addDrop('power');__qa.addDrop('health');__qa.addDrop('record');__qa.advance(.1);});
  let state=await page.evaluate(()=>__qa.state());assert.equal(state.player.power,2);assert.equal(state.player.hp,3);assert(state.score>0);
  await page.evaluate(()=>{__qa.god(false);__qa.setPlayer({inv:0});__qa.bullet();__qa.advance(.02);});assert.equal((await page.evaluate(()=>__qa.state())).player.hp,2);
  await page.evaluate(()=>{__qa.charge(100);__qa.activateDrive();__qa.advance(.5);});await page.screenshot({path:'qa-overdrive.png'});
  await page.keyboard.press('p');const paused=await page.evaluate(()=>__qa.state().stageTime);await page.evaluate(()=>__qa.advance(1));assert.equal(await page.evaluate(()=>__qa.state().stageTime),paused);await page.click('#resume-btn');
  await page.evaluate(()=>__qa.god(true));
  for(let i=0;i<3;i++){for(let n=0;n<180&&!(await page.evaluate(()=>__qa.state())).boss;n++)await page.evaluate(()=>__qa.advance(1));const s=await page.evaluate(()=>__qa.state());assert(s.boss,'stage '+(i+1)+' boss must arrive');assert.equal(s.stage,i);await page.evaluate(()=>{__qa.setBossHP(0);__qa.advance(4.5);});}
  assert.equal((await page.evaluate(()=>__qa.state())).state,'result');
  const layouts=[];
  for(const [width,height] of [[1440,1000],[1920,1080],[390,844],[375,667],[320,568],[844,390]]){
   await page.setViewportSize({width,height});await page.reload();await page.waitForFunction(()=>__qa.state().ready);
   const layout=await page.evaluate(()=>{const p=document.querySelector('.playfield').getBoundingClientRect(),deck=document.querySelector('.object-guide').getBoundingClientRect();return{width:innerWidth,height:innerHeight,arenaWidth:p.width,arenaHeight:p.height,bottom:deck.bottom,scrollWidth:document.documentElement.scrollWidth,buffer:document.querySelector('canvas').width};});
   assert(layout.scrollWidth<=width,'horizontal overflow '+width);assert(layout.bottom<=height+1,'controls below viewport '+width+'x'+height);assert(Math.abs(layout.arenaWidth/layout.arenaHeight-2/3)<.01,'aspect ratio');layouts.push(layout);
   if(width===390){await page.screenshot({path:'qa-phone-title.png'});await page.click('#start-btn');await page.evaluate(()=>{__qa.manual(true);__qa.advance(8);});await page.screenshot({path:'qa-phone-flight.png'});const box=await page.locator('#game').boundingBox();const before=await page.evaluate(()=>__qa.state().player.x);await page.mouse.move(box.x+box.width*.5,box.y+box.height*.8);await page.mouse.down();await page.mouse.move(box.x+box.width*.7,box.y+box.height*.8);await page.mouse.up();assert((await page.evaluate(()=>__qa.state().player.x))>before);}
  }
  await page.setViewportSize({width:390,height:844});await page.click('#settings-btn');await page.check('#reduced');await page.getByRole('button',{name:'DONE'}).click();await page.reload();await page.waitForFunction(()=>__qa.state().ready);assert((await page.evaluate(()=>__qa.stats().settings)).reduced);
  assert.deepEqual(errors,[]);console.log(JSON.stringify({result:'PASS',checks:'moving scene, pickup rewards, bullet damage, overdrive, pause, three-stage victory, six responsive layouts, pointer steering, reduced effects persistence, zero runtime/network errors',layouts},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
