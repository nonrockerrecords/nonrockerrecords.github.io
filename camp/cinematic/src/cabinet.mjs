import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import RAPIER from '@dimforge/rapier3d-compat';
import {gameUI} from './game-ui.mjs';
import {COLORS,FixedClock,Round,clamp,mix,selectCatch} from './core.mjs';
const ui=gameUI();
try { await main(); } catch(e){ui.fail(e);}
async function main(){
  await RAPIER.init();
  const host=document.querySelector('#game-canvas');
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.shadowMap.enabled=innerWidth>700;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
  host.append(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(37,1,.1,80);
  let angled=true;const setCamera=()=>{camera.position.set(angled?8.4:0,angled?7:5.1,angled?12.5:15.8);camera.lookAt(0,3.2,0);};setCamera();
  const pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(new RoomEnvironment(),.04).texture;scene.environmentIntensity=.85;
  scene.add(new THREE.HemisphereLight(0xffeed2,0x274c38,1.4));
  const key=new THREE.DirectionalLight(0xffe5b1,2.4);key.position.set(-4,10,7);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.normalBias=.035;key.shadow.radius=4;scene.add(key);
  const rim=new THREE.DirectionalLight(0xc0dacb,1.8);rim.position.set(5,6,-4);scene.add(rim);
  const green=new THREE.MeshStandardMaterial({color:0x2f4936,metalness:.45,roughness:.32});
  const dark=new THREE.MeshStandardMaterial({color:0x11271b,roughness:.55});
  const brass=new THREE.MeshStandardMaterial({color:0xc3a06b,metalness:.8,roughness:.25});
  const chrome=new THREE.MeshStandardMaterial({color:0xe1dfd4,metalness:.9,roughness:.21});
  const cream=new THREE.MeshStandardMaterial({color:0xf6f2ee,roughness:.4});
  const emissive=new THREE.MeshStandardMaterial({color:0xffe5aa,emissive:0xffb748,emissiveIntensity:2});
  function box(w,h,d,x,y,z,mat=green,parent=scene){const m=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,2,Math.min(.055,w*.14,h*.14,d*.14)),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  function sphere(r,x,y,z,mat,parent=scene){const m=new THREE.Mesh(new THREE.SphereGeometry(r,28,20),mat);m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;}
  box(5.1,.2,3.7,0,.15,0,dark);box(4.9,1.4,3.5,0,1,0);box(4.9,.28,3.5,0,2,0,brass);
  [-2.27,2.27].forEach(x=>[-1.57,1.57].forEach(z=>{box(.22,3.8,.22,x,4,z);box(.32,.12,.32,x,5.9,z,brass);}));
  box(4.9,.9,3.5,0,6.25,0);box(4.5,.59,.06,0,6.25,1.78,cream);
  [-2.3,2.3].forEach(x=>{box(.035,1.1,.025,x,1,1.765,brass);for(let y=.55;y<6.8;y+=.75)sphere(.038,x,y,1.73,brass);});
  for(let x=-1.8;x<=1.8;x+=.3)box(.12,.018,.04,x,1.37,1.77,dark);
  [-1.9,1.9].forEach(x=>[-1.2,1.2].forEach(z=>sphere(.16,x,.09,z,brass)));
  // Live, exact lettering is drawn into a code-native texture, never generated into artwork.
  const lettering=document.createElement('canvas');lettering.width=1024;lettering.height=160;
  const tx=lettering.getContext('2d');tx.fillStyle='#f6f2ee';tx.fillRect(0,0,1024,160);tx.fillStyle='#2f4936';tx.textAlign='center';tx.font='900 78px Arial';tx.fillText('GRAB YOUR SWAG',512,112);
  const label=new THREE.CanvasTexture(lettering);label.colorSpace=THREE.SRGBColorSpace;
  box(4.25,.55,.015,0,6.25,1.82,new THREE.MeshBasicMaterial({map:label}));
  box(4.45,3.45,.06,0,4.06,-1.59,dark);
  const texture=new THREE.TextureLoader().load('../assets/generated/machine-surface.webp');texture.colorSpace=THREE.SRGBColorSpace;
  box(4.44,3.3,.02,0,4.03,-1.54,new THREE.MeshStandardMaterial({map:texture,roughness:.7}));
  const glass=new THREE.MeshPhysicalMaterial({color:0xcfe8d7,transparent:true,opacity:.075,roughness:.08,metalness:.1,side:THREE.DoubleSide,depthWrite:false});
  box(.03,3.5,3,-2.26,4.02,0,glass);box(.03,3.5,3,2.26,4.02,0,glass);
  // Open front gives a clear gameplay view; edge reflections retain the glass impression.
  box(.025,3.3,.03,-1.98,4,1.61,cream);box(.025,2,.03,2.01,4.5,1.61,cream);
  for(let x=-2;x<=2;x+=.5){sphere(.055,x,6.68,1.8,emissive);}
  const lamp=new THREE.PointLight(0xffce83,25,7,2);lamp.position.set(0,5.65,.5);scene.add(lamp);
  [-1.95,1.95].forEach(x=>box(.12,.1,2.85,x,5.78,0,chrome));
  const bridge=box(4.15,.12,.14,0,5.72,0,chrome);
  box(1.7,.72,.07,-1.05,.85,1.79,dark);box(1.7,.06,.8,-1.05,.48,2.06,brass);
  box(1.9,.25,.75,.95,1.72,1.95);sphere(.15,.7,2.02,2.08,new THREE.MeshStandardMaterial({color:0xc96e43,roughness:.22}));sphere(.11,1.35,1.93,2.09,emissive);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(30,30),new THREE.ShadowMaterial({opacity:.22}));ground.rotation.x=-Math.PI/2;ground.position.y=.01;ground.receiveShadow=true;scene.add(ground);
  const carriage=box(.58,.25,.47,0,5.64,0,brass);
  const claw=new THREE.Group();scene.add(claw);
  sphere(.17,0,0,0,chrome,claw);box(.22,.29,.22,0,.15,0,brass,claw);
  const fingers=[];
  for(let i=0;i<3;i++){
    const pivot=new THREE.Group();pivot.rotation.y=i*Math.PI*2/3;claw.add(pivot);
    const arm=new THREE.Group();arm.position.x=.12;pivot.add(arm);
    const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,0,0),new THREE.Vector3(.19,-.19,0),new THREE.Vector3(.29,-.38,0),new THREE.Vector3(.25,-.57,0),new THREE.Vector3(.12,-.65,0)]);
    const finger=new THREE.Mesh(new THREE.TubeGeometry(curve,16,.036,8,false),chrome);arm.add(finger);sphere(.065,0,0,0,brass,arm);
    fingers.push(arm);
  }
  const cable=new THREE.Mesh(new THREE.CylinderGeometry(.017,.017,1,8),chrome);scene.add(cable);
  const target=new THREE.Mesh(new THREE.RingGeometry(.28,.31,48),new THREE.MeshBasicMaterial({color:0xd9ab4d,side:THREE.DoubleSide,transparent:true,opacity:.8}));target.rotation.x=-Math.PI/2;scene.add(target);
  const world=new RAPIER.World({x:0,y:-9.81,z:0});world.timestep=1/60;
  const wall=(hx,hy,hz,x,y,z)=>world.createCollider(RAPIER.ColliderDesc.cuboid(hx,hy,hz).setTranslation(x,y,z).setFriction(.55));
  wall(2.2,.1,1.5,0,2.13,0);wall(.1,2,1.5,-2.18,4,0);wall(.1,2,1.5,2.18,4,0);wall(2.2,2,.1,0,4,-1.48);wall(2.2,2,.1,0,4,1.48);
  let capsules=[],nextId=1,aim={x:0,z:0},vx=0,vz=0,paused=false,frames=0,totalTime=0;
  const clock=new FixedClock();
  const round=new Round((s,c)=>ui.state(s,c));
  function restock(){
    capsules.forEach(c=>{world.removeRigidBody(c.body);scene.remove(c.mesh);c.mesh.traverse(o=>{if(o.isMesh){o.geometry.dispose();o.material.dispose();}});});capsules=[];
    for(let row=0;row<2;row++)for(let z=0;z<3;z++)for(let x=0;x<5;x++){
      const id=nextId++,r=.32,color=COLORS[(x+z+row)%COLORS.length];
      const body=world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(-1.52+x*.75+(row?.08:0),2.8+row*.69,-.85+z*.82).setLinearDamping(.65).setAngularDamping(.8));
      world.createCollider(RAPIER.ColliderDesc.ball(r).setRestitution(.22).setFriction(.7),body);
      const mesh=new THREE.Group();
      sphere(r,0,0,0,new THREE.MeshPhysicalMaterial({color,metalness:.1,roughness:.24,clearcoat:1}),mesh);
      const band=new THREE.Mesh(new THREE.TorusGeometry(r,.012,8,36),new THREE.MeshStandardMaterial({color:0xd6c4a1,metalness:.7,roughness:.25}));band.rotation.x=Math.PI/2;mesh.add(band);
      sphere(.065,0,.15,.275,new THREE.MeshStandardMaterial({color:0xf6f2ee,roughness:.3}),mesh);scene.add(mesh);
      capsules.push({id,r,color,body,mesh,caught:false});
    }
    for(let i=0;i<150;i++)world.step();sync();aim={x:0,z:0};round.reset();
  }
  const positions=()=>capsules.map(c=>Object.assign(c,c.body.translation()));
  function sync(){capsules.forEach(c=>{if(!c.caught){const p=c.body.translation();c.mesh.position.set(p.x,p.y,p.z);const q=c.body.rotation();c.mesh.quaternion.set(q.x,q.y,q.z,q.w);}});}
  let grabY=2.95;
  function pose(s,t,r){
    let x=r.aim.x,z=r.aim.z,y=5.05;
    if(s==='lower')y=mix(5.05,grabY,t);
    if(s==='close')y=grabY;
    if(s==='lift')y=mix(grabY,5.05,t);
    if(s==='carry'){x=mix(x,-1.05,t);z=mix(z,1.15,t);}
    if(s==='release'){x=-1.05;z=1.15;}
    aimClaw(x,y,z,(s==='close'?t:['lift','carry'].includes(s)?1:0));
    if(r.caught){
      r.caught.mesh.position.set(x,y-.45,z);
      if(s==='release')r.caught.mesh.position.set(-1.05,mix(4.6,.84,t),mix(1.15,2.07,t));
      if(!ui.reduced)r.caught.mesh.rotation.z=Math.sin(t*7)*.08;
    }
  }
  function aimClaw(x,y,z,grip=0){claw.position.set(x,y,z);carriage.position.set(x,5.64,z);bridge.position.z=z;cable.position.set(x,(5.6+y+.2)/2,z);cable.scale.y=5.6-y-.2;fingers.forEach(f=>f.rotation.z=mix(-.4,.38,grip));}
  restock();
  const controller={
    drop(){if(paused)return;const cs=positions();if(round.drop(aim,cs)){grabY=round.target?round.target.y+.47:2.8;}},
    retry(){if(!['win','miss'].includes(round.state))return;if(capsules.every(c=>c.caught))restock();else round.reset();},
    reset(){if(['aim','miss','win'].includes(round.state))restock();},pause(v){paused=v;clock.reset();},
    camera(){angled=!angled;setCamera();document.querySelector('#camera').textContent=angled?'Front view':'Angled view';}
  };
  ui.bind(controller);
  const resize=()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();};new ResizeObserver(resize).observe(host);resize();
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();paused=true;ui.fail(new Error('Graphics context lost. Reload to restart the machine.'));});
  let last=performance.now();
  renderer.setAnimationLoop(now=>{
    const dt=(now-last)/1000;last=now;if(paused||document.hidden)return;
    frames++;totalTime+=Math.min(dt,.1);
    clock.tick(dt,step=>{
      world.step();sync();
      if(round.state==='aim'){
        const d=ui.direction();vx+=(clamp(d.x,-1,1)*1.75-vx)*.16;vz+=(clamp(d.z,-1,1)*1.35-vz)*.16;
        aim.x=clamp(aim.x+vx*step,-1.88,1.88);aim.z=clamp(aim.z+vz*step,-1.12,1.12);
        aimClaw(aim.x,5.05,aim.z);claw.rotation.z=ui.reduced?0:-vx*.045;
      }else round.tick(step,{pose,capture(a){const c=selectCatch(positions(),a);if(c){c.caught=true;c.body.setEnabled(false);}return c;},deliver(c){c.mesh.position.set(-1.05,.84,2.07);}});
    });
    const candidate=selectCatch(positions(),aim);target.visible=round.state==='aim';target.position.set(aim.x,candidate?candidate.y+candidate.r+.03:2.25,aim.z);renderer.render(scene,camera);
  });
  window.__campQA={snapshot:()=>({engine:'three-rapier',state:round.state,aim:{...aim},caught:round.caught?.id,capsules:positions().map(({id,x,y,z,r,caught})=>({id,x,y,z,r,caught})),fps:frames/Math.max(totalTime,.001)})};
}
