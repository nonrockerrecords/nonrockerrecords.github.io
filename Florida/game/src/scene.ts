import * as THREE from 'three';
import {animate} from 'animejs';
import {CREW,DEFAULT_CREW} from './rules';
import type {State,Target,CrewId} from './rules';

export class Diorama {
  scene=new THREE.Scene(); camera:THREE.PerspectiveCamera; renderer:THREE.WebGLRenderer;
  root=new THREE.Group(); clock=new THREE.Clock(); ray=new THREE.Raycaster(); mouse=new THREE.Vector2();
  targets:Record<string,THREE.Group>={}; ghosts:THREE.Group[]=[]; crew:THREE.Group[]=[]; papers:THREE.Mesh[]=[];
  crewIds:CrewId[]=[];
  crewLoad=0;
  portal:THREE.Mesh; light:THREE.PointLight; rings:THREE.Mesh[]=[]; neon:THREE.MeshStandardMaterial;
  reduced=matchMedia('(prefers-reduced-motion: reduce)').matches; paused=false; low=false; state:State|null=null;
  onTarget:(t:Target)=>void; frame=0; width=1;height=1; selected:Target|null=null; orbit=0;
  constructor(public host:HTMLElement,onTarget:(t:Target)=>void){
    this.onTarget=onTarget;this.scene.background=new THREE.Color('#421439');this.scene.fog=new THREE.Fog('#6e2965',25,60);
    this.camera=new THREE.PerspectiveCamera(35,1,.1,100);this.camera.position.set(8,12,20);this.camera.lookAt(0,1,0);
    this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.35;
    this.renderer.domElement.setAttribute('aria-label','Interactive miniature Florida parking lot');this.renderer.domElement.setAttribute('role','img');
    host.appendChild(this.renderer.domElement);this.scene.add(this.root);
    const hemi=new THREE.HemisphereLight('#fff0e5','#234f49',2.3);this.scene.add(hemi);
    const sun=new THREE.DirectionalLight('#ffe4e9',3.1);sun.position.set(-9,15,6);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-13,right:13,top:12,bottom:-12,near:1,far:45});sun.shadow.bias=-.001;sun.shadow.normalBias=.03;this.scene.add(sun);
    const fill=new THREE.DirectionalLight('#75dccb',.9);fill.position.set(8,5,-2);this.scene.add(fill);
    this.light=new THREE.PointLight('#73ffd4',65,13,2);this.light.position.set(2,.3,.1);this.root.add(this.light);
    const table=this.box(34,.65,23,'#164a44',0,-1.3,0);table.material=this.material('#b12b7a',this.texture('table'));
    new THREE.TextureLoader().load('./assets/roadside/roadside-terrazzo.webp',texture=>{
      texture.colorSpace=THREE.SRGBColorSpace;
      texture.anisotropy=Math.min(8,this.renderer.capabilities.getMaxAnisotropy());
      const previous=table.material as THREE.MeshStandardMaterial;previous.map?.dispose();previous.dispose();
      table.material=this.material('#ffffff',texture);
    },undefined,()=>host.dispatchEvent(new CustomEvent('asseterror',{detail:'tabletop'})));
    const s=new THREE.Shape();s.moveTo(-8,-5);s.lineTo(8,-5);s.lineTo(8,5);s.lineTo(-8,5);s.closePath();
    const h=new THREE.Path();h.absarc(2,0,2.12,0,Math.PI*2,true);s.holes.push(h);
    const slab=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:.65,bevelEnabled:true,bevelSize:.08,bevelThickness:.08,bevelSegments:1,steps:1}),this.material('#685174',this.texture('asphalt')));slab.rotation.x=-Math.PI/2;slab.position.y=-.65;slab.receiveShadow=true;slab.castShadow=true;this.root.add(slab);
    const portalMat=new THREE.MeshStandardMaterial({color:'#1f9e80',emissive:'#35ddaa',emissiveIntensity:1.6,roughness:.35,metalness:.1});
    this.portal=new THREE.Mesh(new THREE.CircleGeometry(2.04,64),portalMat);this.portal.rotation.x=-Math.PI/2;this.portal.position.set(2,-.44,0);this.root.add(this.portal);
    const wall=new THREE.Mesh(new THREE.CylinderGeometry(2.12,1.6,1.1,20,1,true),this.material('#235749'));wall.position.set(2,-.65,0);this.root.add(wall);
    for(let i=0;i<30;i++){const a=i/30*Math.PI*2;const stone=new THREE.Mesh(new THREE.DodecahedronGeometry(.2+(i%4)*.065,0),this.material(i%3?'#79715a':'#4c5750'));stone.position.set(2+Math.cos(a)*2.13,-.04,Math.sin(a)*2.13);stone.scale.set(1.6,.5,1);stone.rotation.y=a;stone.castShadow=true;this.root.add(stone);}
    for(let i=0;i<4;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(.7+i*.33,.012,5,70),new THREE.MeshBasicMaterial({color:'#b3ffe0',transparent:true,opacity:.22}));ring.rotation.x=-Math.PI/2;ring.position.set(2,-.37,0);this.root.add(ring);this.rings.push(ring);}
    // Weathered strip mall and awnings are modeled surfaces, not a backdrop image.
    const facade=this.box(14,3.3,.9,'#c58070',0,1.62,-4.25);facade.material=this.material('#ff469e',this.texture('wall'));
    this.box(14.6,.22,1.7,'#ffcf58',0,3.38,-4.1);this.box(14.8,.1,1.8,'#e977bd',0,3.52,-4.1);
    for(let i=0;i<5;i++){
      const x=-5.5+i*2.7;this.box(2.3,2.1,.05,'#203d35',x,1.25,-3.77);
      this.box(.09,2.2,.12,'#bfc4a2',x,1.25,-3.7);this.box(2.4,.1,.12,'#cfc6a4',x,2.29,-3.7);
      const aw=this.box(2.65,.17,1.3,i%2?'#2ddbc9':'#f05da9',x,2.65,-3.22);aw.rotation.x=.22;
      this.box(2.62,.28,.08,'#d0268b',x,2.39,-2.59);
      this.box(.3,.12,.35,'#cb9d6c',x+.72,.17,-3.3);
    }
    this.sign('SUNSHINE DISCOUNTS',512,90,'#eed9a3','#b41474',7.8,1.36,0,2.92,-3.72);
    // Oversized souvenir-shop rhinestones: real faceted meshes, not flashing effects.
    const foil=new THREE.MeshStandardMaterial({color:'#ffd45c',metalness:.65,roughness:.22,emissive:'#ad5611',emissiveIntensity:.2});
    for(const x of [-6.5,-4.4,4.4,6.5]){const gem=new THREE.Mesh(new THREE.OctahedronGeometry(.22),foil);gem.position.set(x,3.45,-3.23);gem.scale.set(1,1.4,.6);gem.castShadow=true;this.root.add(gem);}
    this.sign('COLD BEER • WARM REGRETS',512,60,'#253f34','#e0b18d',4.4,.53,4.66,1.8,-3.68);
    this.sign('OPEN',128,64,'#ffb497','#402f32',.8,.4,-5.4,1.6,-3.65);
    this.neon=new THREE.MeshStandardMaterial({color:'#f2a26c',emissive:'#e25b6e',emissiveIntensity:2});
    const neonBar=this.box(2.1,.06,.07,'#efae8b',-5.35,2.02,-3.68);neonBar.material=this.neon;
    // Parking stripes, wheel stops and painted fracture lines.
    for(let i=0;i<6;i++){this.box(.07,.012,1.45,'#d4bd79',-7+i*2.6,.06,3.95);this.box(1.1,.14,.2,'#b5ae8c',-6.4+i*2.5,.08,4.63);}
    for(let i=0;i<13;i++){const a=i*.483;const x=2+Math.cos(a)*2.3,z=Math.sin(a)*2.3;const line=this.box(.035,.012,1.1,'#262d26',x,.08,z);line.rotation.y=-a+Math.PI/2;}
    for(const p of [[-7.1,-2.7,5.1],[-6.5,3,3.8],[6.8,-2.9,5.6],[7,3.4,3.8]])this.palm(p[0],p[1],p[2]);
    for(const p of [[-7,1],[-.5,-2.6],[6,2.7],[4.9,-1.9]])this.cone(p[0],p[1]);
    this.makeBarricade();this.makeGenerator();
    const sink=new THREE.Group();sink.position.set(2,.1,0);sink.userData.target='sinkhole';this.root.add(sink);this.targets.sinkhole=sink;
    const invisible=new THREE.Mesh(new THREE.CylinderGeometry(2.1,2.1,.18,32),new THREE.MeshBasicMaterial({visible:false}));invisible.userData.target='sinkhole';sink.add(invisible);
    for(let i=0;i<3;i++){const g=this.gator();this.root.add(g);this.ghosts.push(g);}
    for(let i=0;i<7;i++){const p=new THREE.Mesh(new THREE.PlaneGeometry(.24,.34),this.material('#ded7a7'));p.material.side=THREE.DoubleSide;p.position.set(2+Math.sin(i)*1.5,1+i*.12,Math.cos(i)*1.5);p.rotation.set(.3,i,.25);this.root.add(p);this.papers.push(p);}
    this.loadCrew();
    new ResizeObserver(()=>this.resize()).observe(host);this.resize();
    host.addEventListener('pointermove',e=>{if(e.target!==this.renderer.domElement)return;const b=host.getBoundingClientRect();this.mouse.set((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1);this.ray.setFromCamera(this.mouse,this.camera);host.style.cursor=this.ray.intersectObjects(this.root.children,true).some(x=>this.getTarget(x.object))?'pointer':'default';});
    host.addEventListener('click',e=>{if(e.target!==this.renderer.domElement)return;const b=host.getBoundingClientRect();this.mouse.set((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1);this.ray.setFromCamera(this.mouse,this.camera);for(const hit of this.ray.intersectObjects(this.root.children,true)){const t=this.getTarget(hit.object);if(t){this.onTarget(t);break;}}});
    this.renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();host.dispatchEvent(new CustomEvent('sceneerror'));});
    this.loop();
  }
  getTarget(o:THREE.Object3D):Target|null{while(o){if(o.userData.target)return o.userData.target;o=o.parent!;}return null;}
  texture(type:string){
    const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d')!;
    x.fillStyle=type==='table'?'#6f8d73':type==='wall'?'#dcc4a1':'#b6b29c';x.fillRect(0,0,256,256);
    let seed=29;const rand=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
    for(let i=0;i<1800;i++){x.fillStyle=rand()>.5?'rgba(37,47,38,.13)':'rgba(255,243,205,.17)';const w=type==='table'?rand()*18:rand()*4;x.fillRect(rand()*256,rand()*256,w,rand()*2+1);}
    if(type==='wall')for(let i=0;i<45;i++){x.fillStyle='rgba(80,101,75,.18)';x.fillRect(rand()*256,rand()*256,rand()*30,rand()*12);}
    const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(type==='asphalt'?5:2,2);t.colorSpace=THREE.SRGBColorSpace;return t;
  }
  material(color:string,map?:THREE.Texture){return new THREE.MeshStandardMaterial({color,...(map?{map}:{}),roughness:.92});}
  box(w:number,h:number,d:number,color:string,x:number,y:number,z:number,parent:THREE.Object3D=this.root){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),this.material(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  sign(text:string,w:number,h:number,fg:string,bg:string,sx:number,sy:number,x:number,y:number,z:number,parent:THREE.Object3D=this.root){const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d')!;ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);ctx.fillStyle=fg;ctx.font=`bold ${Math.floor(h*.59)}px Impact, sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,w/2,h/2,w*.92);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;const m=new THREE.Mesh(new THREE.PlaneGeometry(sx,sy),new THREE.MeshStandardMaterial({map:t,roughness:1}));m.position.set(x,y,z);parent.add(m);return m;}
  palm(x:number,z:number,h:number){
    const p=new THREE.Group();p.position.set(x,0,z);this.root.add(p);
    const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,0,0),new THREE.Vector3(.12,h*.5,0),new THREE.Vector3(.45,h,0)]);
    const trunk=new THREE.Mesh(new THREE.TubeGeometry(curve,8,.12,6,false),this.material('#8b7850'));trunk.castShadow=true;p.add(trunk);
    for(let j=0;j<7;j++){const a=j*Math.PI*2/7;const shape=new THREE.Shape();shape.moveTo(0,0);shape.quadraticCurveTo(.8,.45,2.15,0);shape.quadraticCurveTo(.8,-.22,0,0);const leaf=new THREE.Mesh(new THREE.ShapeGeometry(shape,5),new THREE.MeshStandardMaterial({color:j%2?'#57734a':'#8b9758',side:THREE.DoubleSide,roughness:1}));leaf.position.set(.45,h,0);leaf.rotation.set(-Math.PI/2+.25,a,0);leaf.rotateZ(a);leaf.castShadow=true;p.add(leaf);}
    for(let j=0;j<9;j++){const band=new THREE.Mesh(new THREE.TorusGeometry(.127,.018,3,7),this.material('#574c35'));band.rotation.x=Math.PI/2;band.position.set(.12*j/9,h*j/10,0);p.add(band);}
  }
  cone(x:number,z:number){this.box(.48,.08,.48,'#514e35',x,.1,z);const c=new THREE.Mesh(new THREE.ConeGeometry(.18,.62,8),this.material('#e78b47'));c.position.set(x,.43,z);c.castShadow=true;this.root.add(c);const stripe=new THREE.Mesh(new THREE.CylinderGeometry(.07,.11,.15,8),this.material('#f0d9a8'));stripe.position.set(x,.45,z);this.root.add(stripe);}
  makeBarricade(){const g=new THREE.Group();g.position.set(1,.03,2.8);g.rotation.y=-.1;g.userData.target='barricade';this.root.add(g);this.targets.barricade=g;
    for(const x of [-.87,.87]){const leg=this.box(.13,1.35,.15,'#d9b577',x,.66,0,g);leg.rotation.z=x>0?-.16:.16;this.box(.55,.09,.65,'#786749',x,.05,0,g);}
    this.box(2.15,.58,.16,'#f0d6a8',0,.94,0,g);
    for(let i=0;i<5;i++){const stripe=this.box(.2,.55,.17,'#e18543',-.9+i*.42,.94,.01,g);stripe.rotation.z=-.42;}
    this.box(2.1,.18,.12,'#c99348',0,.34,0,g);
  }
  makeGenerator(){const g=new THREE.Group();g.position.set(5.5,.03,1.85);g.rotation.y=-.3;g.userData.target='generator';this.root.add(g);this.targets.generator=g;
    this.box(1.5,.82,.85,'#c99e43',0,.62,0,g);this.box(1.15,.25,.78,'#545647',0,.14,0,g);this.box(.66,.58,.07,'#2f4840',-.2,.61,.45,g);
    for(let i=0;i<5;i++)this.box(.43,.035,.07,'#86988b',-.2,.43+i*.085,.49,g);
    for(const x of [-.65,.65])for(const z of [-.4,.4])this.box(.065,1.12,.065,'#3e4940',x,.61,z,g);
    this.box(1.35,.07,.09,'#42473b',0,1.18,0,g);for(const x of [-.56,.56]){const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.13,12),this.material('#253c35'));wheel.rotation.x=Math.PI/2;wheel.position.set(x,.22,.45);g.add(wheel);}
    const cable=new THREE.CatmullRomCurve3([new THREE.Vector3(-.4,.2,.5),new THREE.Vector3(-1,.03,1),new THREE.Vector3(-1.5,.02,.2),new THREE.Vector3(-2,.02,0)]);g.add(new THREE.Mesh(new THREE.TubeGeometry(cable,18,.035,5,false),this.material('#b66e35')));
  }
  gator(){const g=new THREE.Group();const mat=new THREE.MeshStandardMaterial({color:'#83edca',emissive:'#51c8a6',emissiveIntensity:1.25,transparent:true,opacity:.78,roughness:.45});
    const part=(sx:number,sy:number,sz:number,x:number,y:number,z:number)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(1,12,8),mat);m.scale.set(sx,sy,sz);m.position.set(x,y,z);g.add(m);return m;};
    part(.24,.22,.68,0,0,0);part(.24,.13,.42,0,.1,.71);part(.21,.06,.37,0,-.075,.72);
    for(const x of [-.15,.15]){part(.105,.1,.13,x,.25,.52);const eye=new THREE.Mesh(new THREE.SphereGeometry(.032,8,8),new THREE.MeshBasicMaterial({color:'#fff4b7'}));eye.position.set(x,.27,.62);g.add(eye);}
    const tail=new THREE.CatmullRomCurve3([new THREE.Vector3(0,0,-.45),new THREE.Vector3(.2,.05,-.9),new THREE.Vector3(.55,.2,-1.2),new THREE.Vector3(.4,.45,-1.4)]);g.add(new THREE.Mesh(new THREE.TubeGeometry(tail,14,.095,7,false),mat));
    for(let i=0;i<6;i++){const spike=new THREE.Mesh(new THREE.ConeGeometry(.08,.15,3),mat);spike.position.set(0,.22,-.45+i*.16);g.add(spike);}
    for(const x of [-.28,.28])for(const z of [-.3,.25]){const leg=part(.17,.06,.18,x,-.07,z);leg.rotation.y=x*2;}
    for(let i=0;i<5;i++)for(const x of [-.19,.19]){const tooth=new THREE.Mesh(new THREE.ConeGeometry(.023,.09,3),new THREE.MeshBasicMaterial({color:'#e8ffdd'}));tooth.rotation.x=Math.PI;tooth.position.set(x,.0,.5+i*.11);g.add(tooth);}
    g.userData.target='sinkhole';return g;
  }
  setCrew(roster:CrewId[]){if(roster.join('|')===this.crewIds.join('|'))return;this.loadCrew(roster);}
  loadCrew(roster:CrewId[]=DEFAULT_CREW){
    const loadId=++this.crewLoad;
    for(const group of this.crew){this.root.remove(group);group.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(m=>m.dispose());}});}
    this.crew=[];this.crewIds=[...roster];const loader=new THREE.TextureLoader();const positions=[[-5.15,1.5],[-3.15,.95],[-1.35,1.5]];const heights:Record<CrewId,number>={darlene:3.25,ron:3.65,manager:3.05,dj:3.35,cheryl:3.25,mara:3.6};
    roster.forEach((id,i)=>{const name=CREW[id].art;loader.load(`./assets/characters/${name}.webp`,texture=>{
      if(loadId!==this.crewLoad){texture.dispose();return;}texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(8,this.renderer.capabilities.getMaxAnisotropy());const [x,z]=positions[i],h=heights[id];const g=new THREE.Group();g.position.set(x,.05,z);g.rotation.y=.32;this.root.add(g);this.crew[i]=g;
      const base=new THREE.Mesh(new THREE.CylinderGeometry(.57,.6,.11,32),this.material('#c7bb93'));base.scale.z=.55;base.castShadow=true;base.receiveShadow=true;g.add(base);
      const card=new THREE.Mesh(new THREE.PlaneGeometry(h*2/3,h),new THREE.MeshBasicMaterial({map:texture,alphaTest:.25,side:THREE.DoubleSide,toneMapped:false}));card.position.set(0,h/2+.08,0);card.castShadow=true;g.add(card);
      // A tiny offset back layer gives the illustrated cutout a physical rim.
      const back=card.clone();back.position.z=-.035;g.add(back);
    },undefined,()=>{this.host.dispatchEvent(new CustomEvent('asseterror',{detail:name}));});});
  }
  resize(){this.width=this.host.clientWidth;this.height=this.host.clientHeight;if(!this.width||!this.height)return;this.renderer.setSize(this.width,this.height);this.camera.aspect=this.width/this.height;
    const narrow=this.camera.aspect<1.3;const scale=narrow?1.3:1;this.camera.position.set(6*scale,10*scale,18*scale);this.camera.lookAt(0,.9,0);this.camera.fov=narrow?48:35;this.camera.updateProjectionMatrix();}
  setQuality(low:boolean){this.low=low;this.renderer.setPixelRatio(low?1:Math.min(devicePixelRatio,1.6));this.renderer.shadowMap.enabled=!low;this.resize();}
  setState(state:State){this.state=state;this.ghosts.forEach((g,i)=>g.visible=i<state.spirits&&state.status!=='sealed');this.light.intensity=state.status==='sealed'?3:45+state.chaos*4;this.portal.scale.setScalar(state.status==='sealed'?.08:1-state.stability*.02);this.targets.generator.children.forEach(o=>{if(o instanceof THREE.Mesh&&o.material instanceof THREE.MeshStandardMaterial){o.material.emissive.set(state.generator?'#a87b22':'#000000');o.material.emissiveIntensity=state.generator?.15:0;}});}
  highlight(t:Target|null){this.selected=t;for(const [name,g]of Object.entries(this.targets))g.traverse(o=>{if(o instanceof THREE.Mesh&&o.material instanceof THREE.MeshStandardMaterial){o.material.emissive.set(name===t?'#b29336':'#000000');o.material.emissiveIntensity=name===t?.35:0;}});}
  project(target:Target){const g=this.targets[target];if(!g)return {x:0,y:0};const p=g.position.clone();p.y=target==='sinkhole'?1.15:1.5;p.project(this.camera);return{x:(p.x+1)*this.width/2,y:(1-p.y)*this.height/2};}
  pulse(owner:string){const ownerId=({Darlene:'darlene',Ron:'ron',Manager:'manager','DJ Rip Current':'dj','Cheryl Vortex':'cheryl','Mara Key':'mara'} as Record<string,CrewId>)[owner];const i=this.crewIds.indexOf(ownerId),g=this.crew[i];if(g&&!this.reduced){animate(g.position,{y:[.05,.32,.05],duration:500,ease:'out(3)'});}}
  loop=()=>{this.frame=requestAnimationFrame(this.loop);if(document.hidden||this.paused)return;const t=this.reduced?0:this.clock.getElapsedTime();
    this.ghosts.forEach((g,i)=>{const a=i*2.094+t*.22;g.position.set(2+Math.cos(a)*.85,1.2+Math.sin(t*1.2+i)*.18+i*.23,Math.sin(a)*.7);g.rotation.y=-a+.5;});
    this.papers.forEach((p,i)=>{p.position.y=.7+(i*.28+t*.16)%1.8;p.rotation.y=t*.5+i;});
    this.rings.forEach((r,i)=>r.rotation.z=t*.1*(i%2?1:-1));this.neon.emissiveIntensity=1.8+(Math.sin(t*7)> .98?-.7:0);
    this.renderer.render(this.scene,this.camera);
  };
}
