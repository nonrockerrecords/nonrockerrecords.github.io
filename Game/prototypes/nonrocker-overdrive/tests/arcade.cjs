const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const base=process.env.GAME_URL||'http://127.0.0.1:8781/';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'}),checks=[],errors=[];
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const check=(name,v)=>{assert.ok(v,name);checks.push(name);};
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 try{
  await page.goto(base+'?qa=1');await page.waitForFunction(()=>__qa.state().ready);await page.waitForTimeout(300);
  await page.click('#start-btn');await page.evaluate(()=>{__qa.manual(true);__qa.advance(.2);__qa.setPlayer({inv:0});});
  await page.keyboard.press('c');let s=await page.evaluate(()=>__qa.state());check('C starts an evasive roll',s.roll>0&&s.rollCooldown===9);
  await page.evaluate(()=>{__qa.bullet();__qa.advance(.2);});check('Roll prevents damage',(await page.evaluate(()=>__qa.state())).player.hp===3);
  await page.evaluate(()=>__qa.roll());check('Cooldown prevents repeat roll',(await page.evaluate(()=>__qa.state())).rollCooldown<9);
  await page.keyboard.press('p');const stopped=await page.evaluate(()=>({s:__qa.state(),t:__qa.details().travel}));await page.evaluate(()=>__qa.advance(2));const after=await page.evaluate(()=>({s:__qa.state(),t:__qa.details().travel}));check('Pause freezes scenery and roll cooldown',after.t===stopped.t&&after.s.rollCooldown===stopped.s.rollCooldown);await page.click('#resume-btn');
  await page.evaluate(()=>{__qa.god(true);__qa.advance(10);});check('Roll becomes available again',await page.locator('#roll-btn').isEnabled());await page.click('#roll-btn');check('Touch roll control activates',(await page.evaluate(()=>__qa.state())).roll>0);
  await page.evaluate(()=>{__qa.start();__qa.god(true);__qa.setPlayer({power:3});__qa.advance(.2);});let shots=await page.evaluate(()=>__qa.details().shots);check('Level 3 launches homing missiles',shots.some(s=>s.missile));const wide=Math.max(...shots.filter(s=>!s.missile).map(s=>Math.abs(s.vx)));
  await page.keyboard.down('Shift');await page.evaluate(()=>{__qa.start();__qa.god(true);__qa.setPlayer({power:3});});await page.keyboard.up('Shift');await page.keyboard.down('Shift');await page.evaluate(()=>__qa.advance(.2));shots=await page.evaluate(()=>__qa.details().shots);const narrow=Math.max(...shots.filter(s=>!s.missile).map(s=>Math.abs(s.vx)));check('Focused fire narrows spread and increases shot damage',narrow<wide*.3&&shots.filter(s=>!s.missile).every(s=>s.damage===2));await page.keyboard.up('Shift');
  await page.evaluate(()=>{__qa.start();__qa.manual(true);__qa.spawnWave();__qa.clearEnemies();});s=await page.evaluate(()=>__qa.state());check('Complete formation awards a clear bonus',s.formationClears===1&&s.formations===0);const score=s.score;await page.evaluate(()=>__qa.clearEnemies());check('Formation bonus is awarded only once',(await page.evaluate(()=>__qa.state())).score===score);
  await page.evaluate(()=>{__qa.start();__qa.manual(true);__qa.god(true);__qa.setPlayer({x:25,y:80});__qa.advance(8);});check('Escaping enemies do not count as cleared formations',(await page.evaluate(()=>__qa.state())).escaped>0&&(await page.evaluate(()=>__qa.state())).formationClears===0);
  for(let stage=0;stage<3;stage++){
   await page.evaluate(v=>{__qa.start();__qa.manual(true);__qa.god(true);__qa.setStage(v);__qa.spawnBoss();__qa.advance(5);},stage);
   s=await page.evaluate(()=>__qa.state());check('Stage '+(stage+1)+' boss fires lock-on volleys',s.boss.phase===0&&s.boss.volley>0);
   await page.evaluate(()=>{__qa.setBossHP(__qa.state().boss.max*.6);__qa.advance(2);});s=await page.evaluate(()=>__qa.state());check('Stage '+(stage+1)+' switches to crossfeed',s.boss.phase===1&&s.boss.volley>1);
   await page.evaluate(()=>{__qa.setBossHP(__qa.state().boss.max*.3);__qa.advance(2);});check('Stage '+(stage+1)+' switches to feedback storm',(await page.evaluate(()=>__qa.state())).boss.phase===2);
   await page.screenshot({path:'arcade-stage-'+(stage+1)+'.png'});
  }
  await page.evaluate(()=>{__qa.start();__qa.manual(true);__qa.god(true);__qa.advance(12);});await page.screenshot({path:'arcade-desktop.png'});
  for(const [width,height]of[[390,844],[375,667],[320,568]]){await page.setViewportSize({width,height});await page.evaluate(()=>{__qa.charge(100);__qa.draw();});const fits=await page.locator('.object-guide').evaluate(e=>e.getBoundingClientRect().bottom<=innerHeight);check('Active controls fit '+width+'x'+height,fits);}
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:'arcade-phone.png'});
  const touch=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true});touch.on('pageerror',e=>errors.push(e.message));await touch.goto(base+'?qa=1');await touch.waitForFunction(()=>__qa.state().ready);await touch.click('#settings-btn');await touch.check('#focus-touch');await touch.getByRole('button',{name:'DONE'}).click();await touch.click('#start-btn');await touch.evaluate(()=>__qa.manual(true));const box=await touch.locator('#game').boundingBox(),cdp=await touch.context().newCDPSession(touch);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+box.width*.5,y:box.y+box.height*.8}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:box.x+box.width*.7,y:box.y+box.height*.8}]});await touch.evaluate(()=>__qa.advance(.1));check('Real touch steering and focus work together',(await touch.evaluate(()=>__qa.state())).player.x>300&&(await touch.evaluate(()=>__qa.state())).focus);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await touch.evaluate(()=>__qa.advance(.1));check('Focus clears when touch ends',!(await touch.evaluate(()=>__qa.state())).focus);
  await touch.reload();await touch.waitForFunction(()=>__qa.state().ready);check('Touch focus setting persists',await touch.locator('#focus-touch').isChecked());await touch.close();
  const normal=await browser.newPage();await normal.goto(base);await normal.waitForFunction(()=>!document.querySelector('#start-btn').disabled);await normal.locator('#start-btn').focus();await normal.keyboard.press('Space');check('Focused Start button accepts Space',await normal.locator('#title-screen').evaluate(e=>e.hidden));check('QA controls are absent for normal players',await normal.evaluate(()=>!window.__qa));
  check('No runtime or asset errors',errors.length===0);console.log(JSON.stringify({result:'PASS',checks,errors},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
