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
    this.onTarget=onTarget;
    this.camera=new THREE.PerspectiveCamera(35,1,.1,100);this.camera.position.set(8,12,20);this.camera.lookAt(0,1,0);
    this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.18;
    this.renderer.domElement.setAttribute('aria-label','Interactive layered-paper Florida parking lot diorama');this.renderer.domElement.setAttribute('role','img');
    host.appendChild(this.renderer.domElement);this.scene.add(this.root);
    const hemi=new THREE.HemisphereLight('#fff3d8','#573d44',2);this.scene.add(hemi);
    const sun=new THREE.DirectionalLight('#fff0d4',3.7);sun.position.set(-9,15,8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-13,right:13,top:12,bottom:-12,near:1,far:45});sun.shadow.bias=-.001;sun.shadow.normalBias=.02;this.scene.add(sun);
    const fill=new THREE.DirectionalLight('#85d8c8',.65);fill.position.set(8,5,-2);this.scene.add(fill);
    this.light=new THREE.PointLight('#73ffd4',42,13,2);this.light.position.set(2,.3,.1);this.root.add(this.light);
    // Transparent shadow catcher lets the paper stage sit on the page's printed surface.
    const table=new THREE.Mesh(new THREE.PlaneGeometry(34,23),new THREE.ShadowMaterial({opacity:.22}));
    table.rotation.x=-Math.PI/2;table.position.y=-1.18;table.receiveShadow=true;this.root.add(table);
    const s=new THREE.Shape();s.moveTo(-8,-5);s.lineTo(8,-5);s.lineTo(8,5);s.lineTo(-8,5);s.closePath();
    const h=new THREE.Path();h.absarc(2,0,2.12,0,Math.PI*2,true);s.holes.push(h);
    const slab=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:.22,bevelEnabled:false,steps:1}),this.material('#686065',this.texture('asphalt')));slab.rotation.x=-Math.PI/2;slab.position.y=-.38;slab.receiveShadow=true;slab.castShadow=true;this.root.add(slab);
    const portalMat=new THREE.MeshStandardMaterial({color:'#3e9b83',emissive:'#48cfa6',emissiveIntensity:.7,roughness:.88,metalness:0});
    this.portal=new THREE.Mesh(new THREE.CircleGeometry(2.02,32),portalMat);this.portal.rotation.x=-Math.PI/2;this.portal.position.set(2,-.245,0);this.portal.receiveShadow=true;this.root.add(this.portal);
    const wall=new THREE.Mesh(new THREE.CylinderGeometry(2.08,1.72,.46,18,1,true),this.material('#6f5546'));wall.position.set(2,-.42,0);this.root.add(wall);
    for(let i=0;i<24;i++){const a=i/24*Math.PI*2;const chip=this.box(.42+(i%3)*.09,.06,.2,'#8c806b',2+Math.cos(a)*2.13,-.08,Math.sin(a)*2.13);chip.rotation.y=-a+(i%2?.2:-.2);}
    for(let i=0;i<4;i++){const ring=new THREE.Mesh(new THREE.RingGeometry(.68+i*.32,.73+i*.32,40),new THREE.MeshBasicMaterial({color:i%2?'#b3ffe0':'#e8d096',transparent:true,opacity:.32,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.set(2,-.22+i*.008,0);this.root.add(ring);this.rings.push(ring);}
    this.neon=new THREE.MeshStandardMaterial({color:'#f2a26c',emissive:'#e25b6e',emissiveIntensity:2});
    this.cutout('./assets/diorama/sunshine-discounts-storefront.png',13.6,5.67,0,2.35,-4.35);
    // Parking stripes are faded ink printed directly onto the asphalt card, never raised geometry.
    for(let i=0;i<6;i++){
      const stripe=new THREE.Mesh(new THREE.PlaneGeometry(.085,1.65),new THREE.MeshBasicMaterial({color:'#d8c88c',transparent:true,opacity:i%2?.38:.5,side:THREE.DoubleSide,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2}));
      stripe.rotation.x=-Math.PI/2;stripe.rotation.z=(i%3-1)*.012;stripe.position.set(-7+i*2.6,.075,4.02+(i%2?.04:-.03));this.root.add(stripe);
    }
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
  cutout(path:string,w:number,h:number,x:number,y:number,z:number,parent:THREE.Object3D=this.root,emissive='#000000',emissiveIntensity=0){
    const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);
    new THREE.TextureLoader().load(path,texture=>{
      texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(8,this.renderer.capabilities.getMaxAnisotropy());
      const geometry=new THREE.PlaneGeometry(w,h);
      const back=new THREE.Mesh(geometry.clone(),new THREE.MeshStandardMaterial({map:texture,color:'#76533c',transparent:true,alphaTest:.08,roughness:1,side:THREE.DoubleSide}));back.position.z=-.065;back.scale.set(1.018,1.018,1);back.castShadow=true;g.add(back);
      const front=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({map:texture,transparent:true,alphaTest:.08,roughness:1,side:THREE.DoubleSide,emissive,emissiveIntensity}));front.castShadow=true;front.receiveShadow=true;g.add(front);
    },undefined,()=>this.host.dispatchEvent(new CustomEvent('asseterror',{detail:path})));
    return g;
  }
  paperShape(points:number[][],color:string,x:number,y:number,z:number,parent:THREE.Object3D=this.root){
    const shape=new THREE.Shape();points.forEach(([px,py],i)=>i?shape.lineTo(px,py):shape.moveTo(px,py));shape.closePath();
    const geometry=new THREE.ShapeGeometry(shape),front=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color,roughness:1,metalness:0,side:THREE.DoubleSide}));front.position.set(x,y,z);front.castShadow=true;front.receiveShadow=true;parent.add(front);
    const back=new THREE.Mesh(geometry.clone(),new THREE.MeshStandardMaterial({color:'#725340',roughness:1,side:THREE.DoubleSide}));back.position.z=-.055;back.scale.set(1.018,1.018,1);front.add(back);
    const edge=new THREE.LineSegments(new THREE.EdgesGeometry(geometry),new THREE.LineBasicMaterial({color:'#392e2b',transparent:true,opacity:.72}));edge.position.z=.008;front.add(edge);return front;
  }
  paperRect(w:number,h:number,color:string,x:number,y:number,z:number,parent:THREE.Object3D=this.root){return this.paperShape([[-w/2,-h/2],[w/2,-h/2],[w/2,h/2],[-w/2,h/2]],color,x,y,z,parent);}
  sign(text:string,w:number,h:number,fg:string,bg:string,sx:number,sy:number,x:number,y:number,z:number,parent:THREE.Object3D=this.root){const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d')!;ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);ctx.fillStyle=fg;ctx.font=`bold ${Math.floor(h*.59)}px Impact, sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,w/2,h/2,w*.92);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;const m=new THREE.Mesh(new THREE.PlaneGeometry(sx,sy),new THREE.MeshStandardMaterial({map:t,roughness:1}));m.position.set(x,y,z);parent.add(m);return m;}
  palm(x:number,z:number,h:number){
    const p=new THREE.Group();p.position.set(x,0,z);p.rotation.y=(x>0?-.18:.18);this.root.add(p);
    this.cutout('./assets/diorama/cardboard-palm.png',h*.667,h,0,h/2,0,p);
  }
  cone(x:number,z:number){const g=new THREE.Group();g.position.set(x,.02,z);g.rotation.y=x>0?-.18:.18;this.root.add(g);this.cutout('./assets/diorama/traffic-cone.png',.9,1,0,.5,0,g);}
  makeBarricade(){const g=new THREE.Group();g.position.set(1,.03,2.8);g.rotation.y=-.1;g.userData.target='barricade';this.root.add(g);this.targets.barricade=g;
    this.cutout('./assets/diorama/county-barricade.png',2.55,1.7,0,.85,0,g);
  }
  makeGenerator(){const g=new THREE.Group();g.position.set(5.5,.03,1.85);g.rotation.y=-.3;g.userData.target='generator';this.root.add(g);this.targets.generator=g;
    this.cutout('./assets/diorama/portable-generator.png',1.9,1.74,0,.87,0,g);
  }
  gator(){const g=new THREE.Group();
    this.cutout('./assets/diorama/spectral-gator.png',3.2,1.6,0,0,0,g,'#2da983',.28);
    g.userData.target='sinkhole';g.rotation.y=0;return g;
  }
  setCrew(roster:CrewId[]){if(roster.join('|')===this.crewIds.join('|'))return;this.loadCrew(roster);}
  loadCrew(roster:CrewId[]=DEFAULT_CREW){
    const loadId=++this.crewLoad;
    for(const group of this.crew){this.root.remove(group);group.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(m=>m.dispose());}});}
    this.crew=[];this.crewIds=[...roster];const loader=new THREE.TextureLoader();const positions=[[-5.15,1.5],[-3.15,.95],[-1.35,1.5]];const heights:Record<CrewId,number>={darlene:3.25,ron:3.65,manager:3.05,dj:3.35,cheryl:3.25,mara:3.6};
    roster.forEach((id,i)=>{const name=CREW[id].art;loader.load(`./assets/characters/${name}.webp`,texture=>{
      if(loadId!==this.crewLoad){texture.dispose();return;}texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(8,this.renderer.capabilities.getMaxAnisotropy());const [x,z]=positions[i],h=heights[id];const g=new THREE.Group();g.position.set(x,.05,z);g.rotation.y=.32;this.root.add(g);this.crew[i]=g;
      const base=this.box(1.12,.1,.52,'#9a7450',0,.05,0,g);base.rotation.y=-.08;
      const card=new THREE.Mesh(new THREE.PlaneGeometry(h*2/3,h),new THREE.MeshBasicMaterial({map:texture,alphaTest:.25,side:THREE.DoubleSide,toneMapped:false}));card.position.set(0,h/2+.08,0);card.castShadow=true;g.add(card);
      // A tinted duplicate behind the print becomes the visible cardboard edge.
      const back=new THREE.Mesh(card.geometry.clone(),new THREE.MeshBasicMaterial({map:texture,color:'#76533c',alphaTest:.25,side:THREE.DoubleSide,toneMapped:false}));back.position.set(0,h/2+.08,-.055);back.scale.set(1.018,1.018,1);back.castShadow=true;g.add(back);
    },undefined,()=>{this.host.dispatchEvent(new CustomEvent('asseterror',{detail:name}));});});
  }
  resize(){this.width=this.host.clientWidth;this.height=this.host.clientHeight;if(!this.width||!this.height)return;this.renderer.setSize(this.width,this.height);this.camera.aspect=this.width/this.height;
    // Fit the full cardboard stage as its container changes, independently of the HUD.
    this.camera.position.set(3,8.15,17.7);this.camera.lookAt(0,1.42,0);
    this.camera.fov=Math.max(30,THREE.MathUtils.radToDeg(2*Math.atan(9.5/(20*this.camera.aspect))));this.camera.updateProjectionMatrix();}
  setQuality(low:boolean){this.low=low;this.renderer.setPixelRatio(low?1:Math.min(devicePixelRatio,1.6));this.renderer.shadowMap.enabled=!low;this.resize();}
  setState(state:State){this.state=state;this.ghosts.forEach((g,i)=>g.visible=i<state.spirits&&state.status!=='sealed');this.light.intensity=state.status==='sealed'?3:45+state.chaos*4;this.portal.scale.setScalar(state.status==='sealed'?.08:1-state.stability*.02);this.targets.generator.children.forEach(o=>{if(o instanceof THREE.Mesh&&o.material instanceof THREE.MeshStandardMaterial){o.material.emissive.set(state.generator?'#a87b22':'#000000');o.material.emissiveIntensity=state.generator?.15:0;}});}
  highlight(t:Target|null){this.selected=t;for(const [name,g]of Object.entries(this.targets))g.traverse(o=>{if(o instanceof THREE.Mesh&&o.material instanceof THREE.MeshStandardMaterial){o.material.emissive.set(name===t?'#b29336':'#000000');o.material.emissiveIntensity=name===t?.35:0;}});}
  project(target:Target){const g=this.targets[target];if(!g)return {x:0,y:0};const p=g.position.clone();p.y=target==='sinkhole'?1.15:1.5;p.project(this.camera);return{x:(p.x+1)*this.width/2,y:(1-p.y)*this.height/2};}
  pulse(owner:string){const ownerId=({Darlene:'darlene',Ron:'ron',Manager:'manager','DJ Rip Current':'dj','Cheryl Vortex':'cheryl','Mara Key':'mara'} as Record<string,CrewId>)[owner];const i=this.crewIds.indexOf(ownerId),g=this.crew[i];if(g&&!this.reduced){animate(g.position,{y:[.05,.32,.05],duration:500,ease:'out(3)'});}}
  loop=()=>{this.frame=requestAnimationFrame(this.loop);if(document.hidden||this.paused)return;const t=this.reduced?0:this.clock.getElapsedTime();
    this.ghosts.forEach((g,i)=>{const a=i*2.094+t*.22;g.position.set(2+Math.cos(a)*.85,1.2+Math.sin(t*1.2+i)*.18+i*.23,Math.sin(a)*.7);g.rotation.y=0;g.rotation.z=Math.sin(t*.8+i)*.035;});
    this.papers.forEach((p,i)=>{p.position.y=.7+(i*.28+t*.16)%1.8;p.rotation.y=t*.5+i;});
    this.rings.forEach((r,i)=>r.rotation.z=t*.1*(i%2?1:-1));this.neon.emissiveIntensity=1.8+(Math.sin(t*7)> .98?-.7:0);
    this.renderer.render(this.scene,this.camera);
  };
}
