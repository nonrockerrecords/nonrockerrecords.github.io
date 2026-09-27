import {animate} from 'animejs';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
window.addEventListener('camp:claim',()=>{if(!reduced)animate('.pass-result:not([hidden])',{opacity:[0,1],translateY:[15,0],duration:400,ease:'outQuad'});});
if(!reduced){const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){animate(e.target,{opacity:[.35,1],translateY:[18,0],duration:650,ease:'outQuad'});reveal.unobserve(e.target);}}),{threshold:.12});$$('.card,.benefit').forEach(e=>reveal.observe(e));}

const quiz=$('#quiz');
if(quiz){
  const questions=[
    ['What brings you to camp?',[
      ['Enrollment needs momentum','Move from pressure to a practical next step.',[3,1,2]],['Our brand needs clarity','Find a story the whole institution can tell.',[2,4,1]],['We’re ready to grow','Build on what is already working.',[4,2,1]],['Just exploring','Start with a fresh pair of eyes.',[1,2,3]]]],
    ['How long is your expedition?',[
      ['One focused project','A clear brief and a defined destination.',[1,3,4]],['A long-term partnership','An embedded team for the road ahead.',[5,1,1]],['An annual campaign cycle','A repeatable enrollment rhythm.',[4,2,2]],['Let’s find out together','Start small and learn as we go.',[2,2,3]]]],
    ['Who’s already on your team?',[
      ['Starting from scratch','Build the right foundation.',[5,2,1]],['An in-house team','Bring specialist reinforcements.',[2,3,4]],['An existing agency','Explore a different kind of partnership.',[4,3,2]],['Leadership and a vision','Turn strategic intent into action.',[3,3,3]]]]
  ];
  const results=[['Agency of Record','Pitch a tent. Stay a while.','An integrated partnership across strategy, creative, media, and measurement. A team built around the work ahead.'],['Brand','Find your true north.','Sharpen positioning, create a coherent identity, and give your enrollment story a stronger foundation.'],['Strategic Consulting','Pack light. Think bigger.','A focused engagement to diagnose a challenge and leave your team with a clear next move.']];
  let step=0,answers=[null,null,null];
  function render(){
    quiz.innerHTML=`<div class="quiz-progress" aria-label="Step ${step+1} of 3">${questions.map((_,i)=>`<span class="${i<=step?'active':''}"></span>`).join('')}</div><p class="eyebrow">Question ${step+1} / 03</p><h2 tabindex="-1">${questions[step][0]}</h2><div class="quiz-options" role="group" aria-label="Choose one answer">${questions[step][1].map((o,i)=>`<button class="quiz-option" aria-pressed="${answers[step]===i}" data-answer="${i}"><b>${o[0]}</b><span>${o[1]}</span></button>`).join('')}</div><div class="quiz-actions"><button class="button outline" id="quiz-back" ${step===0?'disabled':''}>Back</button><button class="button" id="quiz-next" ${answers[step]===null?'disabled':''}>${step===2?'Find my route':'Next question'} →</button></div>`;
    quiz.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{answers[step]=Number(b.dataset.answer);quiz.querySelectorAll('[data-answer]').forEach(o=>o.setAttribute('aria-pressed',String(o===b)));$('#quiz-next').disabled=false;});
    $('#quiz-back').onclick=()=>{step--;render();quiz.querySelector('h2').focus();};
    $('#quiz-next').onclick=()=>{if(step<2){step++;render();quiz.querySelector('h2').focus();}else finish();};
  }
  function finish(){const score=[0,0,0];answers.forEach((a,q)=>questions[q][1][a][2].forEach((v,i)=>score[i]+=v));const r=results[score.indexOf(Math.max(...score))];quiz.innerHTML=`<p class="eyebrow">Your suggested route · ${r[0]}</p><h2 tabindex="-1">${r[1]}</h2><p class="body-copy">${r[2]}</p><p class="small body-copy">An exploratory recommendation, not a proposal. Tell us more to find the right fit.</p><div class="actions"><a class="button" href="index-yourstory.html">Tell us your story →</a><button class="button outline" id="quiz-restart">Start over</button></div>`;quiz.querySelector('h2').focus();$('#quiz-restart').onclick=()=>{step=0;answers=[null,null,null];render();};}
  render();
}

const spots=[['Gather around','The gathering place','Good conversations need room to happen. Pull up a chair for the questions behind your next campaign.','index-chairs.html'],['Find your field notes','A little useful perspective','Explore brand, enrollment, and campaign thinking, designed to travel back to your team.','index-stories.html'],['Try your luck','The camp arcade','Line up a capsule, time your drop, and take a little camp magic with you.','claw-3d/index.html']];
$$('[data-spot]').forEach(b=>b.onclick=()=>{const s=spots[+b.dataset.spot];$$('[data-spot]').forEach(t=>t.setAttribute('aria-pressed',String(t===b)));$('#spot-title').textContent=s[1];$('#spot-body').textContent=s[2];$('#spot-link').href=s[3];$('#spot-link').textContent=s[0]+' →';});
const conversations=[['The enrollment chair','“What would we change if we could fix only one step in the student journey?”','Start with the handoff where interest becomes action. Make the next step clear, measurable, and easy to take.'],['The brand chair','“Could three different teams explain our value in the same sentence?”','A useful brand idea gives everyone a shared starting point without making every story sound identical.'],['The creative chair','“Does this feel like us—or just like our category?”','Look for the specific place, voice, or point of view that another institution could not simply borrow.'],['The growth chair','“What did the last campaign teach us?”','Separate a repeatable lesson from a single good result. Bring that learning to the next brief.']];
$$('[data-chair]').forEach(b=>b.onclick=()=>{const c=conversations[+b.dataset.chair];$$('[data-chair]').forEach(t=>t.setAttribute('aria-pressed',String(t===b)));$('#chair-title').textContent=c[0];$('#chair-quote').textContent=c[1];$('#chair-body').textContent=c[2];});

const chapters=$$('.story-chapter');if(chapters.length){const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){$('#story-image').src=`assets/generated/${e.target.dataset.image}.webp`;$('#story-image').alt=e.target.dataset.alt;}});},{rootMargin:'-25% 0px -35% 0px',threshold:0});chapters.forEach(c=>observer.observe(c));}
$('#day-toggle')?.addEventListener('click',()=>{const night=$('#day-scene').classList.toggle('night');$('#day-toggle').textContent=night?'Bring back the morning':'Stay for the night';$('#day-toggle').setAttribute('aria-pressed',String(night));$('#day-caption').textContent=night?'Same trail. A different perspective.':'A new day. A little more possibility.';});
if(chapters.length)window.addEventListener('scroll',()=>{if(chapters[0].getBoundingClientRect().top>innerHeight*.5){$('#story-image').src=`assets/generated/${chapters[0].dataset.image}.webp`;$('#story-image').alt=chapters[0].dataset.alt;}},{passive:true});
if(location.pathname.endsWith('index-chaotic.html')){document.body.classList.add('chaotic-camp');let last=0;if(!reduced)window.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||performance.now()-last<90)return;last=performance.now();const s=document.createElement('span');s.className='cursor-spark';s.textContent='✳';s.setAttribute('aria-hidden','true');s.style.left=e.clientX+'px';s.style.top=e.clientY+'px';document.body.append(s);animate(s,{translateY:[0,-35],rotate:90,opacity:[.8,0],scale:[.5,1.2],duration:600,onComplete:()=>s.remove()});});}

const fire=$('.fire-scroll');let fireActive=!$('#fire-start');
$('#fire-start')?.addEventListener('click',()=>{fireActive=true;$('#fire-gate').hidden=true;$('#fire-caption').textContent='Scroll to wake the woods.';});
if(fire){const update=()=>{if(!fireActive||reduced)return;const r=fire.getBoundingClientRect(),p=Math.max(0,Math.min(1,-r.top/(fire.offsetHeight-innerHeight)));fire.style.setProperty('--fire-scale',String(1+p*.18));fire.style.setProperty('--fire-light',String(1+p*.25));};window.addEventListener('scroll',update,{passive:true});update();}

const flashlight=$('#flashlight-scene');if(flashlight){
  let active=false,found=false,x=50,y=50;
  const paint=()=>{flashlight.style.setProperty('--fx',x+'%');flashlight.style.setProperty('--fy',y+'%');};
  const help=document.createElement('p');help.id='forest-help';help.textContent='Move your pointer, tap the woods, or use arrow keys to explore. Choose “Investigate the eyes” to reveal the werewolf.';flashlight.querySelector('.scene-overlay').append(help);
  $('#forest-start').onclick=()=>{active=true;x=50;y=45;paint();$('#forest-gate').hidden=true;flashlight.focus();};
  flashlight.addEventListener('pointerdown',e=>{if(!active||e.target.closest('button'))return;const r=flashlight.getBoundingClientRect();x=(e.clientX-r.left)/r.width*100;y=(e.clientY-r.top)/r.height*100;paint();});
  flashlight.addEventListener('pointermove',e=>{if(!active)return;const r=flashlight.getBoundingClientRect();x=(e.clientX-r.left)/r.width*100;y=(e.clientY-r.top)/r.height*100;paint();});
  flashlight.addEventListener('keydown',e=>{if(!active||!e.key.startsWith('Arrow'))return;e.preventDefault();x=Math.max(0,Math.min(100,x+(e.key==='ArrowRight'?5:e.key==='ArrowLeft'?-5:0)));y=Math.max(0,Math.min(100,y+(e.key==='ArrowDown'?5:e.key==='ArrowUp'?-5:0)));paint();});
  $('#flashlight-toggle').onclick=()=>{const off=$('.flashlight-mask').classList.toggle('off');$('#flashlight-toggle').textContent=off?'Use flashlight':'Light the whole path';};
  $('#encounter').onclick=()=>{if(!active)return;found=!found;flashlight.classList.toggle('encounter-active',found);$('.werewolf-encounter').classList.toggle('show',found);$('#encounter').setAttribute('aria-pressed',String(found));$('#encounter').textContent=found?'Let it return to the woods':'Investigate the eyes';$('#forest-caption').textContent=found?'Some stories find you first.':'Follow the glow. Watch the trees.';help.textContent=found?'The woods have company. Send it back to resume exploring with the flashlight.':'Move your pointer, tap the woods, or use arrow keys to explore. Choose “Investigate the eyes” to reveal the werewolf.';};
}
$$('[data-route]').forEach(b=>b.onclick=()=>{$$('[data-route]').forEach(t=>t.setAttribute('aria-pressed',String(t===b)));$('#route-title').textContent=['Find the foothold.','Choose your line.','Take the next step.'][+b.dataset.route];$('#route-body').textContent=['Identify the real challenge before choosing tactics. A sharper question is the first move.','Connect positioning and campaign decisions. Every hold should help you reach the next one.','Turn your strategy into one useful action your team can take this week.'][+b.dataset.route];});
$('#story-form')?.addEventListener('submit',e=>{e.preventDefault();const t=$('#your-story');if(!t.value.trim()){t.focus();return;}$('#story-preview').textContent=t.value.trim();$('#story-preview').hidden=false;$('#story-preview').focus();$('#story-note').textContent='Your draft is ready below. Nothing was sent or saved.';});
$('#count-start')?.addEventListener('click',()=>{const model={value:0};if(reduced){$('#count-number').textContent='100';return;}animate(model,{value:100,duration:1600,ease:'outExpo',onUpdate:()=>$('#count-number').textContent=String(Math.round(model.value))});});
$('#compass-turn')?.addEventListener('click',()=>{$('#compass').classList.toggle('turn');});
$('#glow-toggle')?.addEventListener('click',()=>{const b=$('#glow-toggle');b.classList.toggle('cream');b.setAttribute('aria-pressed',String(b.classList.contains('cream')));});
$('#toast-demo')?.addEventListener('click',()=>{$('#polish-toast').textContent='A little signal. A clear next step.';});
$('#loader-demo')?.addEventListener('click',()=>{const el=$('#loader-demo');el.textContent='Getting the fire going…';setTimeout(()=>el.textContent='Ready to explore',reduced?0:1000);});
