import Phaser from 'phaser';
import {gameUI} from './game-ui.mjs';
import {COLORS,FixedClock,Round,clamp,mix,selectCatch} from './core.mjs';
const ui=gameUI();
try {main();}catch(e){ui.fail(e);}
function main(){
  const host=document.querySelector('#game-canvas');
  let capsules=[],aimX=360,actualX=360,clawY=200,grip=0,vx=0,paused=false,elapsed=0,nextId=1,frames=0,time=0,sceneRef;
  const fixed=new FixedClock(),round=new Round((s,c)=>ui.state(s,c));
  const W=720,H=850;
  class Cabinet extends Phaser.Scene {
    preload(){this.load.image('backdrop','../assets/generated/arcade-interior.webp');this.load.image('frame','../assets/generated/arcade-frame.webp');}
    create(){
      sceneRef=this;
      const g=this.add.graphics();
      g.fillStyle(0x162c20).fillRoundedRect(62,25,596,790,24);
      g.lineStyle(3,0xc3a98e).strokeRoundedRect(62,25,596,790,24);
      if(this.textures.exists('frame'))this.add.image(360,420,'frame').setDisplaySize(596,790).setAlpha(.55);
      this.add.graphics().fillStyle(0xf6f2ee).fillRoundedRect(89,48,542,98,8);
      g.fillStyle(0xf6f2ee).fillRoundedRect(89,48,542,98,8);
      this.add.text(360,92,'GRAB YOUR SWAG',{fontFamily:'Arial',fontSize:'39px',fontStyle:'bold',color:'#2f4936'}).setOrigin(.5);
      this.add.text(360,126,'C A M P   A R C A D E',{fontFamily:'Arial',fontSize:'12px',color:'#2f4936'}).setOrigin(.5);
      this.add.rectangle(360,390,534,455,0x13281c);
      if(this.textures.exists('backdrop'))this.add.image(360,390,'backdrop').setDisplaySize(534,455).setAlpha(.55);
      g.lineStyle(3,0xc3a98e).strokeRect(93,162,534,455);
      g.lineStyle(6,0xa6aaa0).lineBetween(110,180,610,180);
      g.fillStyle(0x090f0b).fillRoundedRect(115,693,160,79,10);
      this.add.graphics().fillStyle(0x090f0b).fillRoundedRect(115,693,160,79,10).lineStyle(3,0xc3a98e).strokeRoundedRect(115,693,160,79,10);
      g.lineStyle(3,0xc3a98e).strokeRoundedRect(115,693,160,79,10);
      this.add.text(195,790,'PRIZE CHUTE',{fontFamily:'Arial',fontSize:'12px',color:'#c3a98e'}).setOrigin(.5);
      this.add.text(440,730,'A LITTLE SKILL.\nA LITTLE CAMP MAGIC.',{fontFamily:'Arial',fontSize:'17px',fontStyle:'bold',color:'#f6f2ee',align:'center'}).setOrigin(.5);
      const glow=this.add.graphics();
      for(let i=0;i<10;i++){glow.fillStyle(0xd9ab4d,.15).fillCircle(105+i*56,36,10);glow.fillStyle(0xffe2a5).fillCircle(105+i*56,36,4);}
      this.matter.add.rectangle(360,623,535,20,{isStatic:true});
      this.matter.add.rectangle(88,380,18,485,{isStatic:true});
      this.matter.add.rectangle(632,380,18,485,{isStatic:true});
      this.claw=this.add.graphics().setDepth(20);this.reticle=this.add.graphics().setDepth(21);
      this.rest();
      ui.bind({drop:()=>{if(paused)return;round.drop({x:actualX,z:0},this.positions());},retry:()=>{if(['miss','win'].includes(round.state)){if(capsules.every(c=>c.caught))this.rest();else round.reset();}},reset:()=>{if(['aim','miss','win'].includes(round.state))this.rest();},pause:v=>{paused=v;fixed.reset();}});
      this.game.events.on('blur',()=>fixed.reset());
      window.__campQA={snapshot:()=>({engine:'phaser-matter',state:round.state,aim:{x:actualX,z:0},caught:round.caught?.id,capsules:this.positions().map(({id,x,y,z,r,caught})=>({id,x,y,z,r,caught})),fps:frames/Math.max(time,.001)})};
    }
    positions(){return capsules.map(c=>Object.assign(c,{x:c.body.position.x,y:H-c.body.position.y,z:0}));}
    rest(){
      capsules.forEach(c=>{this.matter.world.remove(c.body);c.view.destroy();});capsules=[];
      for(let row=0;row<3;row++)for(let col=0;col<8;col++){
        const id=nextId++,color=COLORS[(col+row)%5],r=25,x=140+col*61+(row%2?8:0),y=570-row*56;
        const body=this.matter.add.circle(x,y,r,{restitution:.27,friction:.55,frictionAir:.014});
        const view=this.add.container(x,y).setDepth(10);
        view.add(this.add.circle(0,0,r,color));
        view.add(this.add.arc(0,0,r-3,185,350,false,0xffffff,.14));
        view.add(this.add.rectangle(0,0,r*1.86,2,0xc3a98e));
        view.add(this.add.circle(-8,-9,6,0xffffff,.38));
        view.add(this.add.circle(0,7,8,0xf6f2ee,.85));
        capsules.push({id,r,color,body,view,caught:false});
      }
      for(let i=0;i<150;i++)this.matter.world.step(1000/60);
      aimX=360;vx=0;round.reset();
    }
    capture(a){const c=selectCatch(this.positions(),a);if(c){c.caught=true;this.matter.world.remove(c.body);}return c;}
    update(now,delta){
      if(paused||document.hidden)return;
      frames++;time+=Math.min(delta/1000,.1);
      fixed.tick(delta/1000,dt=>{
        elapsed+=dt;this.matter.world.step(dt*1000);
        if(round.state==='aim'){
          const d=ui.direction();vx+=(clamp(d.x,-1,1)*170-vx)*.15;aimX=clamp(aimX+vx*dt,128,592);
          actualX=clamp(aimX+Math.sin(elapsed*1.7)*14,118,602);clawY=210;grip=0;
        }else round.tick(dt,{pose:(s,t,r)=>{
          const low=r.target?H-r.target.y-36:565;
          actualX=r.aim.x;clawY=210;grip=0;
          if(s==='lower')clawY=mix(210,low,t);
          if(s==='close'){clawY=low;grip=t;}
          if(s==='lift'){clawY=mix(low,210,t);grip=1;}
          if(s==='carry'){actualX=mix(r.aim.x,195,t);grip=1;}
          if(s==='release'){actualX=195;grip=1-t;}
          if(r.caught){r.caught.view.setPosition(actualX,clawY+36);if(s==='release')r.caught.view.setPosition(195,mix(246,731,t));}
        },capture:a=>this.capture(a),deliver:c=>c.view.setPosition(195,731)});
      });
      capsules.forEach(c=>{if(!c.caught)c.view.setPosition(c.body.position.x,c.body.position.y).setRotation(c.body.angle);});
      const g=this.claw;g.clear();g.lineStyle(3,0xc3a98e).lineBetween(actualX,180,actualX,clawY);
      g.fillStyle(0xbca780).fillRoundedRect(actualX-25,170,50,16,5);
      g.fillStyle(0xe0ddd0).fillCircle(actualX,clawY,12);g.fillStyle(0xc3a98e).fillRect(actualX-7,clawY-15,14,16);
      const spread=mix(33,20,grip);g.lineStyle(6,0xdcd7c9);
      g.beginPath();g.moveTo(actualX-5,clawY+5);g.lineTo(actualX-spread,clawY+26);g.lineTo(actualX-spread+11,clawY+53);g.strokePath();
      g.beginPath();g.moveTo(actualX+5,clawY+5);g.lineTo(actualX+spread,clawY+26);g.lineTo(actualX+spread-11,clawY+53);g.strokePath();
      this.reticle.clear();if(round.state==='aim'){this.reticle.lineStyle(1,0xd9ab4d,.5).lineBetween(actualX,275,actualX,600);this.reticle.strokeEllipse(actualX,605,30,8);}
    }
  }
  const game=new Phaser.Game({type:Phaser.AUTO,parent:host,width:W,height:H,backgroundColor:'#0e2117',transparent:true,antialias:true,scene:Cabinet,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},physics:{default:'matter',matter:{gravity:{y:1.2},autoUpdate:false}},audio:{noAudio:true},banner:false});
  game.events.on('ready',()=>{game.canvas.setAttribute('aria-hidden','true');game.canvas.addEventListener('webglcontextlost',()=>{paused=true;ui.fail(new Error('Graphics context lost'));});});
  window.addEventListener('pagehide',()=>game.destroy(true),{once:true});
}
