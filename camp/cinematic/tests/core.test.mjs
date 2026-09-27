import test from 'node:test';
import assert from 'node:assert/strict';
import {selectCatch, exposedCapsules, Round, FixedClock} from '../src/core.mjs';
const capsule = (id,x,y=1,z=0)=>({id,x,y,z,r:1});
test('center, edge and miss depend on position',()=>{
  const c=capsule(1,0);
  assert.equal(selectCatch([c],{x:0,z:0}),c);
  assert.equal(selectCatch([c],{x:.72,z:0}),c);
  assert.equal(selectCatch([c],{x:.721,z:0}),null);
});
test('covered capsule cannot be selected; upper capsule can',()=>{
  const bottom=capsule(1,0), top=capsule(2,0,2);
  assert.deepEqual(exposedCapsules([bottom,top]),[top]);
  assert.equal(selectCatch([bottom,top],{x:0,z:0}),top);
});
test('ties resolve by stable id; caught capsules are excluded',()=>{
  const a=capsule(1,-.2),b=capsule(2,.2);
  assert.equal(selectCatch([b,a],{x:0,z:0}),a);
  a.caught=true; assert.equal(selectCatch([a,b],{x:0,z:0}),b);
});
test('round locks duplicate drops and delivers same identity',()=>{
  const c=capsule(7,0),r=new Round(); let delivered;
  assert.equal(r.drop({x:0},[c]),true);
  assert.equal(r.drop({x:4},[c]),false);
  for(let i=0;i<400;i++) r.tick(1/60,{pose(){},capture(){return c;},deliver(p){delivered=p;}});
  assert.equal(r.state,'win');assert.equal(delivered,c);
  r.reset();assert.equal(r.state,'aim');assert.equal(r.caught,null);
});
test('miss never delivers and permits retry after reset',()=>{
  const r=new Round();r.drop({x:9},[]);
  for(let i=0;i<400;i++)r.tick(1/60,{pose(){},capture(){return null;},deliver(){assert.fail();}});
  assert.equal(r.state,'miss');r.reset();assert.equal(r.drop({x:0},[]),true);
});
test('fixed stepping yields same catch at 30, 60 and 120 fps',()=>{
  const results=[30,60,120].map(fps=>{
    const clock=new FixedClock();let x=-1;
    for(let i=0;i<fps;i++)clock.tick(1/fps,dt=>x+=dt);
    return selectCatch([capsule(1,0)],{x})?.id;
  });assert.deepEqual(results,[1,1,1]);
});
