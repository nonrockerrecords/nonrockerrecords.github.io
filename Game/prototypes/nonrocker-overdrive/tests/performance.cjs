const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'}),results=[];
 try{for(const deviceScaleFactor of [1,3]){
  const page=await browser.newPage({viewport:deviceScaleFactor===1?{width:1440,height:1000}:{width:390,height:844},deviceScaleFactor});
  await page.goto('http://127.0.0.1:8781/?qa=1');await page.waitForFunction(()=>__qa.state().ready);await page.click('#start-btn');
  await page.evaluate(()=>{__qa.god(true);__qa.setStage(2);__qa.spawnBoss();__qa.setBossHP(__qa.state().boss.max*.3);__qa.setPlayer({power:3,x:25});__qa.advance(12);__qa.manual(false);});
  const intervals=await page.evaluate(()=>new Promise(resolve=>{const samples=[];let last=performance.now();function frame(now){samples.push(now-last);last=now;if(samples.length<180)requestAnimationFrame(frame);else resolve(samples.slice(1).sort((a,b)=>a-b));}requestAnimationFrame(frame);}));
  const s=await page.evaluate(()=>__qa.state());assert(s.bullets<=300&&s.shots<=160&&s.particles<=520,'entities remain bounded');
  const result={deviceScaleFactor,medianMs:intervals[Math.floor(intervals.length*.5)],p95Ms:intervals[Math.floor(intervals.length*.95)],entities:{enemies:s.enemies,bullets:s.bullets,shots:s.shots,particles:s.particles}};assert(result.p95Ms<60,'unexpected frame stalls');results.push(result);await page.close();
 }console.log(JSON.stringify({result:'PASS',scope:'Headless Edge on this desktop; high-density phone emulation is not physical phone performance.',samples:results},null,2));}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
