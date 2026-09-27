import {animate} from 'animejs';
export function gameUI() {
  const $=s=>document.querySelector(s),keys=new Set();
  const status=$('#game-status'),drop=$('#drop'),retry=$('#retry'),reset=$('#restock');
  let controller,muted=true,audio,paused=false,motor,motorGain,offscreen=false;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const names={aim:'Move the claw. Line up a capsule. Make your drop.',lower:'Going down. Keep your eye on the claw.',close:'Closing the grip…',lift:'Coming back up…',carry:'A good catch. Heading for the chute.',release:'Special delivery.',win:'You caught it! Open your capsule to claim.',miss:'Just missed. Aim over the center of an exposed capsule.'};
  const ping=(hz=250,length=.09)=>{
    if(muted||document.hidden)return;
    try {audio??=new AudioContext();audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.type='triangle';o.frequency.setValueAtTime(hz,audio.currentTime);o.frequency.exponentialRampToValueAtTime(hz*.6,audio.currentTime+length);g.gain.setValueAtTime(.025,audio.currentTime);g.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+length);o.connect(g).connect(audio.destination);o.start();o.stop(audio.currentTime+length);}catch{}
  };
  function stopMotor(){if(motor){try{motor.stop();}catch{}motor.disconnect();motor=null;}}
  function motorFor(s){
    stopMotor();if(muted||paused||offscreen||document.hidden||!['lower','lift','carry'].includes(s))return;
    try{audio??=new AudioContext();audio.resume();motor=audio.createOscillator();motorGain=audio.createGain();motor.type='sawtooth';motor.frequency.value=s==='carry'?82:64;motorGain.gain.value=.004;motor.connect(motorGain).connect(audio.destination);motor.start();}catch{}
  }
  function state(s,c){
    document.body.dataset.gameState=s;status.textContent=names[s]||s;
    motorFor(s);
    drop.disabled=s!=='aim';retry.hidden=!['miss','win'].includes(s);
    reset.disabled=!['aim','miss','win'].includes(s);
    $('#open-capsule').hidden=s!=='win';
    $('#round-label').textContent=s==='aim'?'YOUR MOVE':s==='miss'?'TRY AGAIN':s==='win'?'NICE CATCH':'IN PLAY';
    if(s==='win'){
      $('#open-capsule').style.setProperty('--capsule-color','#'+Number(c.color).toString(16).padStart(6,'0'));
      $('#open-capsule').dataset.capsuleId=c.id;
      ping(740,.4);if(!reduced)animate('#open-capsule',{scale:[.7,1],opacity:[0,1],duration:550,ease:'outBack'});
    }else if(['lower','close','release','miss'].includes(s))ping(s==='miss'?140:320,.15);
  }
  const editing=e=>e.target.closest('input,textarea,select,dialog');
  document.addEventListener('keydown',e=>{
    if(editing(e))return;
    if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','a','d','w','s'].includes(e.key)){e.preventDefault();keys.add(e.key);}
    if(e.code==='Space'&&!e.repeat&&!e.target.closest('button,a')){e.preventDefault();controller?.drop();}
  });
  document.addEventListener('keyup',e=>keys.delete(e.key));
  window.addEventListener('blur',()=>keys.clear());
  document.addEventListener('visibilitychange',()=>{keys.clear();controller?.pause(document.hidden||paused||offscreen);motorFor(document.body.dataset.gameState);});
  window.addEventListener('pagehide',()=>{stopMotor();audio?.close();});
  document.querySelectorAll('[data-move]').forEach(b=>{
    const release=()=>keys.delete(b.dataset.move);
    b.addEventListener('pointerdown',e=>{keys.add(b.dataset.move);b.setPointerCapture(e.pointerId);});
    b.addEventListener('pointerup',release);b.addEventListener('pointercancel',release);b.addEventListener('lostpointercapture',release);
    b.addEventListener('keydown',e=>{if([' ','Enter'].includes(e.key)){e.preventDefault();keys.add(b.dataset.move);}});
    b.addEventListener('keyup',release);b.addEventListener('blur',release);
  });
  const stick=$('#joystick');let stickPointer=null,stickX=0,stickZ=0;
  const updateStick=e=>{const r=stick.getBoundingClientRect();stickX=Math.max(-1,Math.min(1,(e.clientX-r.left-r.width/2)/(r.width*.32)));stickZ=Math.max(-1,Math.min(1,(e.clientY-r.top-r.height/2)/(r.height*.32)));stick.style.setProperty('--jx',`${stickX*20}px`);stick.style.setProperty('--jy',`${stickZ*20}px`);};
  stick?.addEventListener('pointerdown',e=>{stickPointer=e.pointerId;stick.setPointerCapture(e.pointerId);updateStick(e);});
  stick?.addEventListener('pointermove',e=>{if(e.pointerId===stickPointer)updateStick(e);});
  ['pointerup','pointercancel','lostpointercapture'].forEach(event=>stick?.addEventListener(event,()=>{stickPointer=null;stickX=stickZ=0;stick.style.setProperty('--jx','0px');stick.style.setProperty('--jy','0px');}));
  drop.addEventListener('click',()=>controller?.drop());
  retry.addEventListener('click',()=>{controller?.retry();drop.focus();});
  reset.addEventListener('click',()=>controller?.reset());
  $('#sound').addEventListener('click',()=>{muted=!muted;$('#sound').textContent=muted?'Sound off':'Sound on';$('#sound').setAttribute('aria-pressed',String(!muted));ping(440);motorFor(document.body.dataset.gameState);});
  $('#pause').addEventListener('click',()=>{paused=!paused;$('#pause').textContent=paused?'Resume':'Pause';$('#pause').setAttribute('aria-pressed',String(paused));controller?.pause(paused||offscreen);drop.disabled=paused||document.body.dataset.gameState!=='aim';motorFor(document.body.dataset.gameState);});
  $('#camera')?.addEventListener('click',()=>controller?.camera());
  $('#open-capsule').addEventListener('click',()=>window.campClaim?.());
  return {state,ping,reduced,bind(c){controller=c;$('#loading').hidden=true;drop.disabled=false;state('aim');new IntersectionObserver(([e])=>{offscreen=!e.isIntersecting;controller.pause(offscreen||paused||document.hidden);motorFor(document.body.dataset.gameState);},{threshold:0}).observe($('.game-shell'));},
    direction(){return {x:stickX+(keys.has('ArrowRight')||keys.has('d')?1:0)-(keys.has('ArrowLeft')||keys.has('a')?1:0),z:stickZ+(keys.has('ArrowDown')||keys.has('s')?1:0)-(keys.has('ArrowUp')||keys.has('w')?1:0)};},
    fail(error){$('#loading').hidden=false;$('#loading').textContent='The machine could not start. You can still claim a demo pass below.';status.textContent='Game unavailable. The demo claim form is ready.';console.error(error);}};
}
