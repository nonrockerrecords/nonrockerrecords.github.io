import * as THREE from 'three';
import {CREW} from './rules';
import type {State,Target,CrewId} from './rules';

// This isolated art study does not read or write the playable encounter's save.
export class LevelTwoScene {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(35, 1, .1, 100);
  renderer: THREE.WebGLRenderer;
  root = new THREE.Group();
  observer: ResizeObserver;
  frame = 0;
  disposed = false;
  resources: THREE.Texture[] = [];
  ready: Promise<void>;
  loader: THREE.TextureLoader;
  rotor = new THREE.Group();
  ball!: THREE.Mesh;
  progress = 0;
  displayedProgress = 0;
  chaos = 0;
  lastTime = 0;
  paused = false;
  reduced = false;
  state?: State;
  crewIds: CrewId[] = [];
  crewGroups: THREE.Group[] = [];
  departures: {group:THREE.Group; age:number; active:boolean}[] = [];
  glow = new THREE.PointLight('#6affc1',8,4);
  powerLamp = new THREE.PointLight('#58e6d0',0,3);
  selection = new THREE.Mesh(new THREE.RingGeometry(.4,.45,40),new THREE.MeshBasicMaterial({color:'#f8e9c7',side:THREE.DoubleSide,transparent:true,opacity:.8}));
  reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  ballPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.3,-.1,2.9),new THREE.Vector3(-1.9,-.1,1.7),
    new THREE.Vector3(-.7,-.1,.25),new THREE.Vector3(.7,-.1,-.65),
    new THREE.Vector3(2.78,-.1,-1.29)
  ]);

  constructor(public host: HTMLElement, public fitMargin=.91) {
    const manager = new THREE.LoadingManager();
    this.ready = new Promise<void>((resolve, reject) => {
      manager.onLoad = resolve;
      manager.onError = url => reject(new Error(`Could not load ${url}`));
    });
    this.loader = new THREE.TextureLoader(manager);
    this.renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.domElement.setAttribute('role', 'img');
    this.renderer.domElement.setAttribute('aria-label', 'Pink cardboard mini-golf stage: crew and pump at the tee, a recessed green ending at the haunted windmill’s glowing tunnel, and the clubhouse behind.');
    host.append(this.renderer.domElement);
    this.scene.add(this.root);
    this.scene.add(new THREE.HemisphereLight('#fff7ec', '#334e49', 2));
    const key = new THREE.DirectionalLight('#fff4e8', 2.1);
    key.position.set(-6, 13, 8);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    Object.assign(key.shadow.camera, {left:-10,right:10,top:10,bottom:-10,near:1,far:35});
    key.shadow.normalBias = .035;
    key.shadow.bias = -.0003;
    key.shadow.radius = 3;
    this.scene.add(key);
    this.buildCourse();
    this.buildCutouts();
    this.buildCrew();
    this.glow.position.set(2.8,.4,-.9);this.root.add(this.glow);
    this.powerLamp.position.set(-5.15,1.1,3);this.root.add(this.powerLamp);
    this.selection.rotation.x=-Math.PI/2;this.selection.visible=false;this.root.add(this.selection);
    for(let i=0;i<3;i++){
      const group=this.cutout('./assets/level-2/haunted-golf-ball-spirit.png',.72,1.08,2.8,.15,-1);
      group.visible=false;group.userData.effect=true;
      this.departures.push({group,age:0,active:false});
    }
    // Shallow theatre stage: keep useful overlap without exposing a whole golf course.
    this.root.scale.z = .78;
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(host);
    this.resize();
    this.loop();
  }

  material(color: string, map?: THREE.Texture) {
    return new THREE.MeshStandardMaterial({color, map, roughness:1, metalness:0});
  }

  // Procedural paper/felt grain, deliberately quiet beneath the painted artwork.
  grain(base: string, flecks: string[], seed: number) {
    const c = document.createElement('canvas'); c.width = c.height = 512;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = base; ctx.fillRect(0, 0, 512, 512);
    const random = () => {seed = (Math.imul(seed,1664525)+1013904223)>>>0; return seed/4294967296;};
    for(let i=0;i<16000;i++) {
      ctx.globalAlpha = .08 + random()*.15;
      ctx.fillStyle = flecks[Math.floor(random()*flecks.length)];
      ctx.fillRect(random()*512,random()*512,.5+random()*2.5,.5+random()*1.1);
    }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(.28,.28);
    this.resources.push(t); return t;
  }

  outline(points: number[][]) {
    return new THREE.Shape(points.map(([x,z]) => new THREE.Vector2(x,-z)));
  }

  lane() {
    const s = new THREE.Shape();
    // Coordinates are x / -z so the flat shape can rotate onto the XZ plane.
    s.moveTo(-3.7,-3.1);
    s.bezierCurveTo(-4,-1.8,-2.4,-.45,-1.35,.35);
    s.bezierCurveTo(-.5,1.1,.45,2.9,2.6,3);
    s.bezierCurveTo(4.8,3.1,5,1.5,4.2,.2);
    s.bezierCurveTo(3.3,-1,1.75,-.65,.75,-1.5);
    s.bezierCurveTo(-.4,-2.2,-.3,-3.9,-1.65,-4);
    s.bezierCurveTo(-2.9,-4.2,-3.5,-3.7,-3.7,-3.1);
    s.closePath(); return s;
  }

  horizontal(geometry: THREE.BufferGeometry, material: THREE.Material | THREE.Material[], y: number) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI/2; mesh.position.y = y;
    mesh.receiveShadow = true; this.root.add(mesh); return mesh;
  }

  buildCourse() {
    const outer = this.outline([[-6.6,-4.1],[-5.9,-4.65],[4.4,-4.65],[6,-3.4],[6.15,1.9],[4.6,4.6],[-5.9,4.6],[-6.7,3.25]]);
    const hole = new THREE.Path(this.lane().getPoints(64));
    outer.holes.push(hole);
    const pink = this.grain('#da7488',['#f6d6b4','#b74568','#c76b64'],83);
    // Extruded top has a real opening and inner walls. Turf lies .23 units below it.
    const deck = this.horizontal(new THREE.ExtrudeGeometry(outer,{depth:.4,bevelEnabled:false,curveSegments:64}),
      [this.material('#ffffff',pink),this.material('#914450')],-.4);
    deck.castShadow = true;
    const turf = this.lane();
    this.horizontal(new THREE.ShapeGeometry(turf,64),this.material('#ffffff',this.grain('#347b65',['#8faf78','#194d41','#b7bb88'],19)),-.23);
    const floor = this.outline([[-6.65,-4.1],[-5.9,-4.65],[4.4,-4.65],[6,-3.4],[6.15,1.9],[4.6,4.6],[-5.9,4.6],[-6.7,3.25]]);
    this.horizontal(new THREE.ShapeGeometry(floor),this.material('#3e2939'),-.405);

    // A slim cream lip follows the opening without obscuring the recessed walls.
    const edgePoints = this.lane().getPoints(100).map(p=>new THREE.Vector3(p.x,.015,-p.y));
    const rim = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(edgePoints,true),160,.045,5,true),this.material('#e7bd9c'));
    rim.castShadow = true; this.root.add(rim);
    const ball = this.ball = new THREE.Mesh(new THREE.SphereGeometry(.12,16,12),this.material('#f8ebc9'));
    ball.position.set(-2.3,-.1,2.9);ball.castShadow=true;this.root.add(ball);
    const tee = new THREE.Mesh(new THREE.BoxGeometry(.7,.018,.08),this.material('#e8c5a0'));
    tee.position.set(-2.4,-.21,3.23);tee.rotation.y=-.35;this.root.add(tee);
  }

  cutout(path: string,w: number,h: number,x: number,bottom: number,z: number,rotation=0,trim=true) {
    const group=new THREE.Group();group.position.set(x,bottom,z);group.rotation.y=rotation;this.root.add(group);
    this.loader.load(path,texture=>{
      if(this.disposed||group.userData.retired){texture.dispose();return;}
      texture.colorSpace=THREE.SRGBColorSpace;
      texture.anisotropy=Math.min(8,this.renderer.capabilities.getMaxAnisotropy());this.resources.push(texture);
      // Trim transparent padding at render time so the actual artwork sits on its base.
      const image=texture.image as HTMLImageElement;
      const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;
      const ctx=canvas.getContext('2d')!;ctx.drawImage(image,0,0);
      const rgba=ctx.getImageData(0,0,image.width,image.height).data;
      let left=image.width,right=0,top=image.height,bottomPixel=0;
      for(let py=0;py<image.height;py++)for(let px=0;px<image.width;px++)if(rgba[(py*image.width+px)*4+3]>70){left=Math.min(left,px);right=Math.max(right,px);top=Math.min(top,py);bottomPixel=Math.max(bottomPixel,py);}
      if(trim&&right>left&&bottomPixel>top){texture.offset.set(left/image.width,1-(bottomPixel+1)/image.height);texture.repeat.set((right-left+1)/image.width,(bottomPixel-top+1)/image.height);}
      const geometry=new THREE.PlaneGeometry(w,h);
      const front=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({map:texture,alphaTest:.27,side:THREE.DoubleSide,toneMapped:false}));
      front.position.y=h/2;front.castShadow=true;group.add(front);
      const back=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({map:texture,color:'#765440',alphaTest:.27,side:THREE.DoubleSide,toneMapped:false}));
      back.position.set(0,h/2,-.045);back.scale.set(1.012,1.012,1);group.add(back);
      this.resize();
    });return group;
  }

  buildCutouts() {
    this.cutout('./assets/level-2/clubhouse-lettered-v2.png',8.2,4.63,-2.35,0,-3.65);
    const tower=this.cutout('./assets/level-2/windmill-tower-v2.png',2.55,4.65,3.25,-.18,-1.35,-.12);
    // Hub measured against the alpha-trimmed tower. Rotor stays untrimmed to
    // preserve its centered pivot; both layers share the same facing plane.
    tower.add(this.rotor);this.rotor.position.set(-.34,3.15,.1);
    const blades=this.cutout('./assets/level-2/windmill-rotor-v2.png',3.55,3.55,0,-1.775,0,0,false);
    this.rotor.add(blades);this.rotor.rotation.z=Math.PI/4;
    this.cutout('./assets/level-2/haunted-pump-shack.png',2.05,1.87,-5.15,.03,2.85,-.06);
    this.cutout('./assets/level-2/sunglasses-gator.png',2.15,.75,3.72,.02,3.15,-.08);
  }

  buildCrew() {
    this.setCrew(['cheryl','mara','dj']);
  }

  setCrew(roster:CrewId[]){
    if(roster.join('|')===this.crewIds.join('|'))return;
    for(const group of this.crewGroups){group.userData.retired=true;this.root.remove(group);group.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});}
    this.crewGroups=[];this.crewIds=[...roster];
    const heights:Record<CrewId,number>={darlene:2.35,ron:2.6,manager:2.3,cheryl:2.35,mara:2.6,dj:2.42};
    roster.forEach((id,i)=>{
      const x=-3.95+i*1.385,z=-.75-i*.15,h=heights[id];
      const group=this.cutout(`./assets/characters/${id}.webp`,h*.62,h,x,.1,z,.03);
      this.crewGroups.push(group);
      const base=new THREE.Mesh(new THREE.BoxGeometry(1,.1,.43),this.material('#aa7f58'));
      base.position.set(0,-.05,0);base.castShadow=true;group.add(base);
    });
  }

  setQuality(low:boolean){this.renderer.setPixelRatio(low?1:Math.min(devicePixelRatio,1.8));this.renderer.shadowMap.enabled=!low;this.resize();}
  project(target:Target){
    const xyz=target==='sinkhole'?[3.1,1,-1.3]:target==='generator'?[-5.15,1.4,2.85]:[-2.5,2,-.9];
    this.root.updateMatrixWorld(true);
    const p=new THREE.Vector3(...xyz).applyMatrix4(this.root.matrixWorld).project(this.camera);
    return{x:(p.x+1)*this.host.clientWidth/2,y:(1-p.y)*this.host.clientHeight/2};
  }
  highlight(target:Target|null){
    this.selection.visible=!!target&&target!=='self';
    this.selection.position.set(...(target==='sinkhole'?[2.8,-.19,-.9]:target==='generator'?[-5.15,.06,2.85]:[-2.5,.06,-.6]) as [number,number,number]);
  }
  pulse(owner:string){
    const i=this.crewIds.findIndex(id=>CREW[id].name===owner||({Darlene:'darlene',Ron:'ron',Manager:'manager'} as Record<string,string>)[owner]===id);
    if(i>=0&&!this.reduced)this.crewGroups[i].userData.pulse=.45;
  }
  previewRehome(count=1){
    for(let i=0;i<count;i++){
      const d=this.departures.find(d=>!d.active);if(d){d.active=true;d.age=-i*.35;}
    }
  }
  setState(next:State){
    const previous=this.state;
    const fresh=!previous||next.revision<previous.revision||next.seed!==previous.seed;
    if(fresh){this.departures.forEach(d=>{d.active=false;d.group.visible=false;});this.displayedProgress=next.stability/12;}
    if(!fresh&&next.revision>previous.revision&&next.spirits<previous.spirits){
      for(let i=0;i<previous.spirits-next.spirits;i++){
        this.previewRehome(1);
      }
    }
    this.state=structuredClone(next);this.setProgress(next.stability,next.chaos);
    this.glow.intensity=next.status==='playing'?2+next.spirits*2:0;
    this.powerLamp.intensity=next.generator?8:0;
  }

  resize() {
    const w=this.host.clientWidth,h=this.host.clientHeight;if(!w||!h)return;
    this.renderer.setSize(w,h);this.camera.aspect=w/h;
    this.camera.position.set(.6,7.2,20.5);this.camera.lookAt(-.1,1.3,0);
    // Fit visible artwork and the compact board, including palm tips, in camera space.
    this.camera.updateMatrixWorld();
    let tangent=.01;
    this.root.updateMatrixWorld(true);
    const p=new THREE.Vector3();
    this.root.traverse(o=>{
      if(!(o instanceof THREE.Mesh))return;
      if(o.parent?.userData.effect)return;
      const vertices=o.geometry.getAttribute('position');
      for(let i=0;i<vertices.count;i++){
        p.fromBufferAttribute(vertices,i).applyMatrix4(o.matrixWorld).applyMatrix4(this.camera.matrixWorldInverse);
        tangent=Math.max(tangent,Math.abs(p.y)/-p.z,Math.abs(p.x)/(-p.z*this.camera.aspect));
      }
    });
    // The playable board uses a tighter default; the isolated art preview asks
    // for its original generous margin explicitly.
    this.camera.fov=THREE.MathUtils.radToDeg(2*Math.atan(tangent*this.fitMargin));this.camera.updateProjectionMatrix();
  }

  // Preview adapter: future gameplay supplies Stability (0–12) and Chaos (0–6).
  setProgress(stability: number,chaos=0){
    this.progress=THREE.MathUtils.clamp(stability/12,0,1);
    this.chaos=THREE.MathUtils.clamp(chaos,0,6);
  }

  loop=(time=0)=>{
    this.frame=requestAnimationFrame(this.loop);
    const dt=Math.min((time-this.lastTime)/1000,.05);this.lastTime=time;
    const reduced=this.reduced||this.reducedMotion.matches;
    if(this.paused||document.hidden){this.renderer.render(this.scene,this.camera);return;}
    this.displayedProgress=reduced?this.progress:THREE.MathUtils.damp(this.displayedProgress,this.progress,3,dt);
    this.ball.position.copy(this.ballPath.getPoint(this.displayedProgress));
    this.ball.visible=this.displayedProgress<.995||this.state?.status==='defeat';
    for(const d of this.departures){
      if(!d.active)continue;d.age+=dt;
      const duration=reduced?.8:2.3;d.group.visible=d.age>=0&&d.age<duration;
      const t=Math.max(0,d.age/duration);
      d.group.position.set(2.8-(reduced?0:t*1.7),.25+(reduced?.45:t*2.7),-.85);
      d.group.rotation.z=reduced?-.08:Math.sin(t*Math.PI*2)*.12;
      d.group.scale.setScalar(reduced?.95:.95-t*.32);
      if(d.age>=duration){d.active=false;d.group.visible=false;}
    }
    for(const g of this.crewGroups){const p=Math.max(0,(g.userData.pulse||0)-dt);g.userData.pulse=p;g.position.y=.1+(reduced?0:Math.sin(p/.45*Math.PI)*.15);}
    if(!reduced&&this.progress<1&&(!this.state||this.state.status==='playing')){
      const speed=.14+this.chaos*.055+Math.sin(time*.0018)*this.chaos*.075;
      this.rotor.rotation.z+=dt*speed;
    }
    this.renderer.render(this.scene,this.camera);
  };
  dispose(){
    this.disposed=true;cancelAnimationFrame(this.frame);this.observer.disconnect();
    this.root.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});
    this.resources.forEach(t=>t.dispose());this.renderer.dispose();this.renderer.domElement.remove();
  }
}
