import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createGame,apply,CARDS,CREW,EXPANSION,threat,restore,preview,unavailable} from '../src/rules.ts';
import type {State,Kind,Mode,CrewId} from '../src/rules.ts';
import {TARGET_ROLES,VORTEX_INCIDENTS} from '../src/rules.ts';

test('level 2 shares all crew and wildcard cards and preserves mechanical roles',()=>{
  for(const roster of [['darlene','ron','manager'],['dj','cheryl','mara']] as CrewId[][]){
    const county=createGame(71,false,roster),vortex=createGame(71,false,roster,'vortex');
    assert.deepEqual(vortex.hand,county.hand);assert.deepEqual(vortex.draw,county.draw);
    assert.equal(vortex.hand.length+vortex.draw.length,18);
    assert.deepEqual(restore(JSON.stringify(vortex)),vortex);
  }
  assert.equal(TARGET_ROLES.sinkhole,'threat');assert.equal(TARGET_ROLES.generator,'power');assert.equal(TARGET_ROLES.barricade,'defense');
});
test('level 2 supports both complete winning card sequences',()=>{
  for(const route of ['seal','relocate'] as Mode[]){
    let s=createGame(42,true,undefined,'vortex');
    s=end(play(play(s,'cone'),'jurisdiction'));
    s=play(s,'house');s=play(s,'bait');
    if(route==='relocate')s=play(s,'release');
    s=play(s,'closing',route);
    assert.equal(s.status,route==='seal'?'sealed':'relocated');
    assert.match(s.reason,route==='seal'?/final putt/:/course spirits/);
    assert.deepEqual(restore(JSON.stringify(s)),s);
    assert.throws(()=>end(s),/complete/);
  }
});
test('level 2 incidents, hazard mitigation, deadline and fatal surge',()=>{
  let s=createGame(42,true,undefined,'vortex');
  for(let turn=1;turn<=5;turn++){
    s.turn=turn;assert.equal(threat(s).name,VORTEX_INCIDENTS[turn-1].name);
  }
  s.turn=3;s.spirits=1;assert.equal(threat(s).relocation,0);
  s.turn=5;s.endurance=12;s.block=4;s.chaos=0;s.stability=8;
  const lost=end(s);assert.equal(lost.status,'defeat');assert.match(lost.reason,/haunted course/);
  s=createGame(42,true,undefined,'vortex');s.stability=7;s.endurance=2;s.chaos=6;
  s=play(s,'jurisdiction');assert.equal(s.stability,12);assert.equal(s.status,'defeat');
});
test('legacy saves migrate to county; invalid level rejected; Bass Possum restores',()=>{
  const old=JSON.parse(JSON.stringify(createGame(9,true)));delete old.level;
  assert.equal(restore(JSON.stringify(old))?.level,'county');
  old.level='unknown';assert.equal(restore(JSON.stringify(old)),null);
  let s=createGame(7,false,['dj','cheryl','mara'],'vortex');
  const all=[...s.hand,...s.draw],i=all.findIndex(c=>c.kind==='bass-possum');
  s.hand=[all.splice(i,1)[0]];s.draw=all;s=play(s,'bass-possum');
  assert.deepEqual(restore(JSON.stringify(s)),s);
});
function play(s:State,k:Kind,mode?:Mode){const c=s.hand.find(x=>x.kind===k)!;assert.ok(c,`Expected ${k}`);return apply(s,{type:'play',id:c.id,target:CARDS[k].target,mode,revision:s.revision});}
const end=(s:State)=>apply(s,{type:'end',revision:s.revision});
function opening(){return end(play(play(createGame(42,true),'cone'),'jurisdiction'));}

test('all 20 normal crews resolve identically across stages without changing cards',()=>{
  const ids=Object.keys(CREW) as CrewId[];
  const mechanical=(s:State)=>{const {level,reason,log,...rest}=s;return rest;};
  for(let a=0;a<4;a++)for(let b=a+1;b<5;b++)for(let c=b+1;c<6;c++){
    const roster=[ids[a],ids[b],ids[c]];
    let county=createGame(791,false,roster),vortex=createGame(791,false,roster,'vortex');
    for(let step=0;step<80&&county.status==='playing';step++){
      const card=county.hand.find(card=>!unavailable(county,card,'seal'));
      if(card){county=play(county,card.kind,'seal');vortex=play(vortex,card.kind,'seal');}
      else{county=end(county);vortex=end(vortex);}
      assert.deepEqual(mechanical(vortex),mechanical(county));
      assert.deepEqual(restore(JSON.stringify(vortex)),vortex);
    }
    assert.notEqual(vortex.status,'playing');
  }
});
test('tutorial opening is safe, exact, immutable',()=>{const s=createGame(42,true);const before=JSON.stringify(s);const n=opening();assert.equal(n.endurance,12);assert.equal(n.stability,7);assert.equal(n.chaos,1);assert.equal(n.block,0);assert.equal(n.turn,2);assert.equal(JSON.stringify(s),before);});
test('containment victory',()=>{let s=opening();s=play(s,'house');s=play(s,'bait');s=play(s,'closing','seal');assert.equal(s.status,'sealed');assert.equal(s.chaos,5);assert.equal(s.actions,2);});
test('relocation victory',()=>{let s=opening();for(const k of ['house','bait','release']as Kind[])s=play(s,k);s=play(s,'closing','relocate');assert.equal(s.status,'relocated');assert.equal(s.spirits,0);assert.equal(s.actions,0);});
test('bait order matters',()=>{let s=opening();for(const k of ['house','release','bait']as Kind[])s=play(s,k);s=play(s,'closing','relocate');assert.equal(s.status,'playing');assert.equal(s.spirits,1);assert.equal(threat(s).net,1);});
test('generator bonus, surge and liability',()=>{let s=createGame(42,true);for(const k of ['generator','bait','cone']as Kind[])s=play(s,k);assert.equal(s.stability,3);s=end(s);for(const k of ['house','bait','release']as Kind[])s=play(s,k);s=play(s,'closing','relocate');assert.equal(s.status,'relocated');assert.equal(s.endurance,10);assert.equal(s.chaos,1);assert.equal(s.liabilities,1);assert.equal(s.discard.filter(c=>c.kind==='liability').length,1);});
test('fatal surge precedes victory',()=>{let s=opening();s=play(s,'house');s=play(s,'bait');s.endurance=2;s.chaos=5;s=play(s,'closing','seal');assert.equal(s.status,'defeat');assert.equal(s.stability,12);});
test('duplicate/revision and wrong target rejected',()=>{const s=createGame(42,true);const cmd={type:'play' as const,id:'c0',target:'barricade' as const,revision:0};const n=apply(s,cmd);assert.throws(()=>apply(n,cmd));assert.throws(()=>apply(s,{...cmd,target:'sinkhole'}));});
test('healing clamp and full health eligibility',()=>{let s=createGame(1,true);assert.match(unavailable(s,s.hand.find(c=>c.kind==='coffee')!),/full/);s.endurance=11;s=play(s,'coffee');assert.equal(s.endurance,12);});
test('block cap and expiry; distraction expiry',()=>{let s=opening();s.block=3;s=play(s,'cone');assert.equal(s.block,4);s=play(s,'bait');assert.equal(s.distracted,true);s=end(s);assert.equal(s.block,0);assert.equal(s.distracted,false);});
test('ground hazard ignores relocation; final stability reduces attack',()=>{const s=createGame(1);s.turn=3;s.spirits=1;assert.equal(threat(s).net,3);s.turn=5;s.stability=8;assert.equal(threat(s).net,1);});
test('seeded shuffle deterministic and distinct',()=>{assert.deepEqual(createGame(8),createGame(8));assert.notDeepEqual(createGame(8).hand,createGame(9).hand);});
test('save/restore preserves RNG and state; rejects corrupt/duplicate save',()=>{const s=opening();assert.deepEqual(restore(JSON.stringify(s)),s);assert.equal(restore('bad'),null);const c=structuredClone(s);c.hand.push(c.hand[0]);assert.equal(restore(JSON.stringify(c)),null);assert.equal(restore(JSON.stringify({...s,turn:9})),null);assert.deepEqual(end(restore(JSON.stringify(s))!),end(s));});
test('preview does not change state',()=>{const s=createGame(1,true),old=JSON.stringify(s);assert.match(preview(s,s.hand[0]),/Block/);assert.equal(JSON.stringify(s),old);});
test('normal incident loss and no further actions',()=>{let s=createGame(1);while(s.status==='playing')s=end(s);assert.equal(s.status,'defeat');assert.throws(()=>end(s));});
test('fifth-turn deadline even with enough endurance',()=>{const s=createGame(1);s.turn=5;s.endurance=12;s.block=4;const n=end(s);assert.equal(n.status,'defeat');assert.match(n.reason,/collapsed/);});
test('Field Notes exhausts and never redraws itself',()=>{let s=createGame(1,true);s.discard.push(...s.hand);s.hand=[s.draw.pop()!];assert.equal(s.hand[0].kind,'notes');s=play(s,'notes');assert.equal(s.hand.length,1);assert.equal(s.exhaust[0].kind,'notes');});
test('deck conservation across reshuffles',()=>{let s=createGame(73);for(let i=0;i<4&&s.status==='playing';i++){s.endurance=12;s=end(s);const all=[...s.hand,...s.draw,...s.discard,...s.exhaust];assert.equal(all.length,18+s.liabilities);assert.equal(new Set(all.map(c=>c.id)).size,all.length);}});

function deal(...kinds:Kind[]){const s=createGame(91,true);s.expanded=true;const all=[...s.hand,...s.draw,...EXPANSION.map((kind,i)=>({id:`c${i+12}`,kind}))];s.hand=kinds.map(k=>all.splice(all.findIndex(c=>c.kind===k),1)[0]);s.draw=all;return s;}
test('pick-three decks contain four cards per selected local plus six roadside wildcards',()=>{const roster:CrewId[]=['dj','cheryl','mara'];const s=createGame(2,false,roster);const all=[...s.hand,...s.draw];assert.equal(all.length,18);assert.equal(s.expanded,true);assert.deepEqual(s.roster,roster);for(const id of roster){const kinds=new Set(CREW[id].deck);assert.equal(all.filter(c=>kinds.has(c.kind)).length,4);}for(const kind of EXPANSION)assert.equal(all.filter(c=>c.kind===kind).length,1);assert.deepEqual(restore(JSON.stringify(s)),s);assert.throws(()=>createGame(1,false,['dj','dj','mara']));});
test('tutorial size and legacy save migration',()=>{assert.equal(createGame(2,true).draw.length,7);const old:any=createGame(1,true);delete old.expanded;delete old.roster;delete old.possum;delete old.chihuahua;delete old.flamingo;const restored=restore(JSON.stringify(old));assert.equal(restored?.expanded,false);assert.deepEqual(restored?.roster,['darlene','ron','manager']);});
test('new crew signature cards resolve their core effects',()=>{let s=createGame(7,false,['dj','cheryl','mara']);const all=[...s.hand,...s.draw];const pick=(...kinds:Kind[])=>{s.hand=kinds.map(k=>all.splice(all.findIndex(c=>c.kind===k),1)[0]);s.draw=all;};pick('bass-possum','boombox','putter','raccoon','multitool');s=play(s,'bass-possum');assert.equal(s.possum,true);s=play(s,'boombox');assert.equal(s.actions,4);assert.equal(s.chaos,2);s=play(s,'putter');assert.equal(s.stability,3);s.actions=3;s=play(s,'raccoon');assert.equal(s.block,3);s=play(s,'multitool');assert.equal(s.generator,true);assert.equal(s.chaos,3);});
test('possum cancels one complete surge and leaves',()=>{let s=deal('possum','crystal');s.chaos=5;s=play(s,'possum');s=play(s,'crystal');assert.equal(s.endurance,12);assert.equal(s.chaos,0);assert.equal(s.liabilities,0);assert.equal(s.possum,false);assert.match(s.log.join(' '),/POSSUM/);s.chaos=5;s=end(s);assert.equal(s.liabilities,1);});
test('chihuahua enables relocation combo and remains after distraction expires',()=>{let s=deal('chihuahua','release');s=play(s,'chihuahua');s=play(s,'release');assert.equal(s.spirits,1);assert.equal(s.distracted,false);assert.equal(s.chihuahua,true);s=end(s);assert.equal(s.chihuahua,true);assert.deepEqual(restore(JSON.stringify(s)),s);});
test('noodle grants 2 alone or 4 with active companion and caps',()=>{assert.equal(play(deal('noodle'),'noodle').block,2);let s=deal('possum','noodle');s=play(s,'possum');s.block=1;s=play(s,'noodle');assert.equal(s.block,4);});
test('crystal gains power bonus; fatal surge still precedes victory',()=>{let s=deal('crystal');s.generator=true;s=play(s,'crystal');assert.equal(s.stability,4);assert.equal(s.chaos,1);s=deal('crystal');s.stability=9;s.chaos=5;s.endurance=2;s=play(s,'crystal');assert.equal(s.status,'defeat');assert.equal(s.stability,12);});
test('iguana powers on dangerously or cashes out power for exactly 3 stability',()=>{let s=play(deal('iguana'),'iguana');assert.equal(s.generator,true);assert.equal(s.chaos,3);s=deal('iguana');s.generator=true;s=play(s,'iguana');assert.equal(s.generator,false);assert.equal(s.stability,3);assert.equal(s.exhaust[0].kind,'iguana');});
test('flamingo ticks twice after incident and expires',()=>{let s=play(deal('flamingo'),'flamingo');s=end(s);assert.equal(s.stability,2);assert.equal(s.flamingo,1);s.generator=true;s=end(s);assert.equal(s.stability,5);assert.equal(s.flamingo,0);s=end(s);assert.equal(s.stability,5);});
test('flamingo can win on final incident but cannot rescue a defeated crew',()=>{let s=play(deal('flamingo'),'flamingo');s.turn=5;s.stability=10;s=end(s);assert.equal(s.status,'sealed');s=play(deal('flamingo'),'flamingo');s.endurance=1;s.stability=10;s=end(s);assert.equal(s.status,'defeat');assert.equal(s.stability,10);});
test('companion save corruption rejected and preview remains pure',()=>{const s=deal('possum');const before=JSON.stringify(s);assert.match(preview(s,s.hand[0]),/Protect/);assert.equal(JSON.stringify(s),before);s.possum=true;assert.equal(restore(JSON.stringify(s)),null);});
