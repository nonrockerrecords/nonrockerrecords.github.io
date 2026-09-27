import './style.css';
import './glam.css';
import './roadside.css';
import {animate} from 'animejs';
import {createGame,apply,CARDS,CREW,DEFAULT_CREW,threat,unavailable,preview,restore} from './rules';
import type {State,Card,Target,Mode,Kind,CrewId} from './rules';
import {Diorama} from './scene';

const $=<T extends HTMLElement>(id:string)=>document.getElementById(id) as T;
document.querySelector<HTMLAnchorElement>('.wordmark')!.innerHTML='<img src="./assets/roadside/roadside-marquee.webp" alt="Florida Man" width="1400" height="467"><i>COLLECT THE CAST. SURVIVE THE STATE.</i>';
document.querySelector<HTMLElement>('.start-copy h2')!.innerHTML='<img class="start-marquee" src="./assets/roadside/roadside-marquee.webp" alt="Florida Man" width="1400" height="467">';
const saveKey='florida-man-county-v1',settingsKey='florida-man-settings-v1';
let game:State=createGame(427,true),selected:string|null=null,chosenTarget:Target|null=null,mode:Mode='seal',busy=false,started=false;
let selectedCrew:CrewId[]=[...DEFAULT_CREW];
let saved:State|null=null,saveAvailable=true,sound=false,sfxVolume=.3,ambienceVolume=.05,fast=false,low=false;
let reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let guideActive=false;
const guide=document.createElement('aside');guide.id='tutorialGuide';guide.hidden=true;guide.setAttribute('aria-label','Guided tutorial');document.querySelector('main')!.prepend(guide);
function renderGuide(){
  document.querySelectorAll('.tutorial-focus').forEach(el=>el.classList.remove('tutorial-focus'));
  guide.hidden=!guideActive||!started||game.status!=='playing';if(guide.hidden)return;
  let title='',body='',focus='';const card=getCard();
  if(game.turn>1){title='You’re officially unqualified. Go get ’em.';body='New turn: draw 5, reset to 3 Actions. Try On the House for extra Actions, then Bait → Catch and Release to relocate two spirits. Or use Closing Time to seal the rift. At 6 Chaos, lose 2 Endurance and gain a dead-weight Liability.';}
  else if(card){title=chosenTarget?'3 · Make it official':'2 · Pick the target';body=chosenTarget?'Check the green effect preview, then press PLAY CARD. The number on the card is its Action cost.':`Choose ${names[CARDS[card.kind].target]} in the scene or use the Target button in the card panel. Nothing is spent until you confirm.`;focus=chosenTarget?'#confirmPlay':'.pick-target';}
  else if(game.revision===0){title='1 · A little roadside authority';body='Start with Orange Cone Authority below. It costs 1 of your 3 Actions and gives 2 Block to absorb this turn’s attack.';focus='[data-kind="cone"]';}
  else if(game.actions>=2&&game.block>0&&game.hand.some(c=>c.kind==='jurisdiction')){title='4 · Now make the combo';body='Play County Jurisdiction on the Sinkhole. Your barricade adds a bonus: 7 Stability instead of 5. Reach 12 to seal the rift!';focus='[data-kind="jurisdiction"]';}
  else {title='5 · Let the weirdness happen';body='Check the incoming damage above your hand, then End Turn. Block absorbs damage and expires. Unplayed cards are discarded; the next turn brings 5 cards and 3 fresh Actions.';focus='#endTurn';}
  guide.innerHTML=`<div><span class="eyebrow">◆ DARLENE’S CRASH COURSE</span><h2>${title}</h2><p>${body}</p></div><button class="outline" id="skipGuide">${game.turn>1?'Got it — let me play':'Skip tutorial'}</button>`;
  $('skipGuide').onclick=()=>{guideActive=false;renderGuide();};if(focus)document.querySelector(focus)?.classList.add('tutorial-focus');
}
function tutorialIntro(){showModal('<span class="eyebrow">WELCOME TO THE SUNSHINE DISASTER</span><h2>Big hair. Bad decisions.<br>One tiny orientation.</h2><ol><li><strong>Your job:</strong> reach 12 Stability OR relocate all 3 ghost gators before five turns run out.</li><li><strong>Your tools:</strong> 5 cards and 3 Actions each turn. Select a card → choose its target → confirm Play Card.</li><li><strong>Stay alive:</strong> protect your 12 Endurance. Ending a turn triggers the visible attack. At 6 Chaos, a supernatural surge hurts you and clogs your deck.</li></ol><p>We’ll walk through your first two cards. No timer. No pressure. Absolutely no county insurance.</p><button class="primary" id="startLesson">SHOW ME HOW →</button>','Skip orientation');$('startLesson').onclick=()=>{hideModal();renderGuide();};}
let scene:Diorama|undefined,audio:AudioContext|undefined,ambientGain:GainNode|undefined,toastTimer:number|undefined;
const start=$<HTMLDialogElement>('startDialog'),modal=$<HTMLDialogElement>('modal'),turnReport=$<HTMLElement>('turnReport');
const names:Record<Target,string>={sinkhole:'Sinkhole',barricade:'Barricade',generator:'Generator',crew:'Your crew',self:'Your hand'};
try{const raw=localStorage.getItem(saveKey);saved=raw?restore(raw):null;const opts=JSON.parse(localStorage.getItem(settingsKey)||'{}');sound=opts.sound===true;fast=opts.fast===true;low=opts.low===true;sfxVolume=typeof opts.sfxVolume==='number'?Math.max(0,Math.min(1,opts.sfxVolume)):.3;ambienceVolume=typeof opts.ambienceVolume==='number'?Math.max(0,Math.min(.2,opts.ambienceVolume)):.05;}catch{saveAvailable=false;}
function settingsSave(){try{localStorage.setItem(settingsKey,JSON.stringify({sound,fast,low,sfxVolume,ambienceVolume}));}catch{}}
function save(){if(!started)return;try{localStorage.setItem(saveKey,JSON.stringify(game));$('saveStatus').textContent='SAVED ON THIS DEVICE';}catch{saveAvailable=false;$('saveStatus').textContent='SAVING UNAVAILABLE · KEEP THIS TAB OPEN';}}
function toast(msg:string){clearTimeout(toastTimer);$('toast').textContent=msg;$('toast').classList.add('show');toastTimer=window.setTimeout(()=>$('toast').classList.remove('show'),3600);}
function text(id:string,value:string){$(id).textContent=value;}
function escape(s:string){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));}
function getCard(){return game.hand.find(c=>c.id===selected);}
function ownerImage(owner:string){return ({Darlene:'darlene',Ron:'ron',Manager:'manager','DJ Rip Current':'dj','Cheryl Vortex':'cheryl','Mara Key':'mara'} as Record<string,string>)[owner]||'darlene';}
function cardImage(kind:Kind){const d=CARDS[kind];return d.art?`./assets/cards/${d.art}.webp`:`./assets/characters/${ownerImage(d.owner)}.webp`;}
const companions=document.createElement('div');companions.className='companions';companions.setAttribute('aria-label','Active companions');document.querySelector('.hand-area')!.prepend(companions);
function renderCompanions(){
  const active:[Kind,string][]=[];
  if(game.possum)active.push([game.roster.includes('dj')?'bass-possum':'possum','Next surge protected']);
  if(game.chihuahua)active.push(['chihuahua',game.distracted?'Distracting · noodle bonus':'Noodle bonus active']);
  if(game.flamingo)active.push(['flamingo',`${game.flamingo} incident boost${game.flamingo===1?'':'s'} left`]);
  companions.hidden=!active.length;companions.innerHTML=active.map(([kind,label])=>`<div class="companion-badge"><img src="${cardImage(kind)}" alt=""><span><b>${CARDS[kind].name}</b>${label}</span></div>`).join('');
}
const deckButton=document.createElement('button');deckButton.className='text-btn';deckButton.id='deckLibrary';deckButton.textContent='Meet all six locals ↗';document.querySelector('.deck-counts')!.append(deckButton);
deckButton.onclick=()=>showModal(`<span class="eyebrow">SUNSHINE COUNTY PERSONNEL FILES</span><h2>Six locals. Pick any three.</h2><p>Each crew member contributes a four-card mini-deck. Your chosen trio makes a focused 12-card deck for the incident.</p><div class="roster-gallery">${(Object.keys(CREW) as CrewId[]).map(id=>{const c=CREW[id];return `<article><img src="./assets/characters/${c.art}.webp" alt="${c.name}"><span class="eyebrow">${c.role}</span><h3>${c.name}</h3><p>${[...new Set(c.deck)].map(k=>CARDS[k].name).join(' · ')}</p></article>`;}).join('')}</div>`);
function syncPause(){const reportOpen=!turnReport.hidden;if(scene)scene.paused=modal.open||start.open||reportOpen;document.body.classList.toggle('paused',modal.open);if(ambientGain&&audio)ambientGain.gain.setTargetAtTime(sound&&!modal.open&&!start.open&&!reportOpen&&!document.hidden?ambienceVolume:0,audio.currentTime,.15);}
function audioInit(){
  if(!audio){audio=new AudioContext();ambientGain=audio.createGain();ambientGain.gain.value=0;ambientGain.connect(audio.destination);for(const [f,v]of [[82,.35],[123,.12],[164,.08]]){const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.value=f;g.gain.value=v;o.connect(g);g.connect(ambientGain);o.start();}}
  void audio.resume();syncPause();
}
function ping(type:'select'|'play'|'end'|'win'='play'){if(!sound)return;audioInit();const a=audio!,o=a.createOscillator(),g=a.createGain();o.type='triangle';const f=type==='select'?520:type==='end'?100:type==='win'?660:300;o.frequency.setValueAtTime(f,a.currentTime);o.frequency.exponentialRampToValueAtTime(type==='win'?990:f*.65,a.currentTime+.12);g.gain.setValueAtTime(0,a.currentTime);g.gain.linearRampToValueAtTime(sfxVolume*.25,a.currentTime+.01);g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+.2);o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+.22);}
function showModal(html:string,closeLabel='Back to the incident'){$('modalBody').innerHTML=html;$('closeModal').textContent=closeLabel;if(!modal.open)modal.showModal();const heading=$('modalBody').querySelector<HTMLElement>('h2');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}modal.scrollTop=0;syncPause();}
function hideModal(){modal.close();syncPause();}
$('closeModal').onclick=hideModal;modal.addEventListener('close',syncPause);
start.addEventListener('cancel',e=>{if(!started)e.preventDefault();});start.addEventListener('close',syncPause);
function refreshTargets(){for(const el of document.querySelectorAll<HTMLButtonElement>('.target')){const t=el.dataset.target as Target;const p=scene?.project(t);if(p){el.style.left=`${p.x}px`;el.style.top=`${p.y}px`;}const c=getCard();el.classList.toggle('valid',!!c&&CARDS[c.kind].target===t&&!unavailable(game,c,mode));el.classList.toggle('picked',chosenTarget===t);}}
function chooseTarget(t:Target){if(!started||modal.open||busy)return;const c=getCard();if(!c){toast(`${names[t]} · ${t==='sinkhole'?'Seal the rift or relocate its spirits.':t==='barricade'?'Block reduces the next incident’s damage.':'Power boosts Stability cards and Closing Time.'}`);return;}if(CARDS[c.kind].target!==t){toast(`${CARDS[c.kind].name} targets ${names[CARDS[c.kind].target].toLowerCase()}.`);return;}chosenTarget=t;renderSelection();refreshTargets();ping('select');}
for(const t of ['sinkhole','barricade','generator']as Target[]){const b=document.createElement('button');b.className='target';b.dataset.target=t;b.innerHTML=`<span class="dot"></span>${names[t].toUpperCase()}`;b.setAttribute('aria-label',`Target ${names[t]}`);b.onclick=()=>chooseTarget(t);$('sceneTargets').append(b);}

function render(){
  scene?.setCrew(game.roster);
  text('endurance',String(game.endurance));$('endurance').innerHTML+=`<small>/12</small>`;
  text('actions',String(game.actions));text('chaos',String(game.chaos));$('chaos').innerHTML+='<small>/6</small>';
  $('enduranceFill').style.width=`${game.endurance/12*100}%`;$('chaosFill').style.width=`${game.chaos/6*100}%`;
  $('actionPips').innerHTML='<i></i>'.repeat(game.actions);$('stability').innerHTML=`${game.stability} <small>/ 12</small>`;$('stabilityFill').style.width=`${game.stability/12*100}%`;
  text('spirits',`${game.spirits} LEFT`);text('spiritDots','◆ '.repeat(game.spirits)+'◇ '.repeat(3-game.spirits));
  text('turn',`TURN ${game.turn} / 5`);text('blockLabel',`Barricade · ${game.block} Block`);text('generatorLabel',`Generator · ${game.generator?'powered':'off'}`);
  const t=threat(game);text('incidentName',t.name);text('incidentDetail',`${t.net} damage · +${t.chaos} Chaos${game.turn===5?' · FINAL TURN':''}`);
  text('deckCounts',`${game.draw.length} DRAW  /  ${game.discard.length} DISCARD  /  ${game.exhaust.length} EXHAUSTED`);
  $('hand').innerHTML='';game.hand.forEach((c,i)=>{
    const d=CARDS[c.kind],why=unavailable(game,c,mode),b=document.createElement('button');b.type='button';b.className=`card${selected===c.id?' selected':''}${why?' unavailable':''}`;b.dataset.id=c.id;b.dataset.kind=c.kind;b.style.setProperty('--angle',`${(i-(game.hand.length-1)/2)*2}deg`);
    b.setAttribute('aria-label',`${d.name}, ${d.cost} Actions. ${d.text}${why?' '+why:''}`);b.setAttribute('aria-pressed',String(selected===c.id));b.draggable=!why;
    b.innerHTML=`<span class="card-cost">${c.kind==='liability'?'×':d.cost}</span><span class="card-art ${d.art?'item-art':''}"><img src="${cardImage(c.kind)}" alt="" draggable="false"><span class="card-symbol">${d.icon}</span></span><span class="card-owner">${d.owner.toUpperCase()}${d.exhaust?' · EXHAUST':''}</span><span class="card-name">${d.name}</span><span class="card-text">${d.text}</span>`;
    b.onclick=()=>select(c);b.addEventListener('dragstart',e=>{if(busy||modal.open){e.preventDefault();return;}selected=c.id;chosenTarget=null;mode='seal';e.dataTransfer?.setData('text/plain',c.id);renderSelection();refreshTargets();scene?.highlight(d.target);});$('hand').appendChild(b);
  });
  $<HTMLButtonElement>('endTurn').disabled=busy||game.status!=='playing';
  $('handHint').textContent=game.tutorial&&game.revision===0?'TRY ORANGE CONE AUTHORITY → BARRICADE':'PICK A CARD. MAKE IT EVERYONE’S PROBLEM.';
  scene?.setState(game);renderSelection();refreshTargets();renderCompanions();save();renderGuide();
}
function select(c:Card){if(busy||!started||modal.open||game.status!=='playing')return;selected=c.id;chosenTarget=null;mode='seal';ping('select');render();const target=CARDS[c.kind].target;if(target==='self'||target==='crew'){chosenTarget=target;renderSelection();}scene?.highlight(target);}
function clearSelection(){selected=null;chosenTarget=null;scene?.highlight(null);render();}
function renderSelection(){const c=getCard(),panel=$('selection');if(!c){panel.hidden=true;renderGuide();return;}panel.hidden=false;const d=CARDS[c.kind],why=unavailable(game,c,mode);
  panel.innerHTML=`<span class="eyebrow">${d.owner.toUpperCase()} · ${d.cost} ACTION${d.cost===1?'':'S'}</span><h2>${d.name}</h2><p>${d.text}</p>${c.kind==='closing'?'<div class="mode-buttons"><button data-mode="seal">Seal the rift</button><button data-mode="relocate">Relocate spirits</button></div>':''}<p class="effect ${why?'warning':''}">${escape(preview(game,c,mode))}</p><p class="target-prompt">${why?escape(why):chosenTarget?`TARGET: ${names[chosenTarget].toUpperCase()}`:`Choose the ${names[d.target].toLowerCase()} in the scene.`}</p>${!chosenTarget&&!why?`<button class="outline pick-target">Target ${names[d.target]}</button>`:''}<button class="primary" id="confirmPlay" ${why||!chosenTarget||busy?'disabled':''}>PLAY CARD <span>→</span></button><button class="cancel" id="cancelPlay">Cancel · Esc</button>`;
  panel.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach(b=>{b.classList.toggle('active',b.dataset.mode===mode);b.onclick=()=>{mode=b.dataset.mode as Mode;renderSelection();};});
  panel.querySelector<HTMLButtonElement>('.pick-target')?.addEventListener('click',()=>chooseTarget(d.target));
  $('cancelPlay').onclick=clearSelection;$('confirmPlay').onclick=()=>playSelected();
  renderGuide();
}
function playSelected(){const c=getCard();if(!c||!chosenTarget||busy)return;const d=CARDS[c.kind];try{const before=game;game=apply(game,{type:'play',id:c.id,target:chosenTarget,mode,revision:game.revision});busy=true;selected=null;chosenTarget=null;save();scene?.highlight(null);if(['Darlene','Ron','Manager','DJ Rip Current','Cheryl Vortex','Mara Key'].includes(d.owner))scene?.pulse(d.owner);ping();render();
    toast(game.liabilities>before.liabilities?'MANIFESTATION! −2 Endurance. Another form to fill out.':`${d.name} · ${effectSummary(before,game)}`);
    window.setTimeout(()=>{busy=false;render();if(game.status!=='playing')result();},fast||reduced?60:470);
  }catch(e){toast((e as Error).message);}}
function effectSummary(a:State,b:State){const p=[];if(a.stability!==b.stability)p.push(`+${b.stability-a.stability} Stability`);if(a.spirits!==b.spirits)p.push(`${a.spirits-b.spirits} relocated`);if(a.block!==b.block)p.push(`+${b.block-a.block} Block`);if(a.endurance!==b.endurance)p.push(`${b.endurance-a.endurance>0?'+':''}${b.endurance-a.endurance} Endurance`);if(b.generator&&!a.generator)p.push('Generator running');if(b.actions>a.actions)p.push('+2 Actions');if(b.possum&&!a.possum)p.push('Next surge protected');if(a.possum&&!b.possum)p.push('Possum canceled surge');if(b.chihuahua&&!a.chihuahua)p.push('Chihuahua joins the crew');if(b.flamingo>a.flamingo)p.push('2 incident boosts ready');if(a.generator&&!b.generator)p.push('Generator switched off');if(!p.length)p.push('Done.');return p.join(' · ');}
function showTurnReport(before:State,after:State){
  const incident=threat(before),surged=before.chaos+incident.chaos>=6,canceled=surged&&before.possum&&!after.possum;
  const incidentLoss=Math.min(before.endurance,incident.net),surgeLoss=Math.max(0,before.endurance-after.endurance-incidentLoss),newLiabilities=after.liabilities-before.liabilities;
  const chaosSlots=Array.from({length:6},(_,i)=>`<i class="${i<after.chaos?'active':''}${surged&&i===5?' threshold':''}"></i>`).join('');
  const aftermath=after.log.slice(before.log.length).map(entry=>`<li>${escape(entry)}</li>`).join('');
  const artSlugs=['spectral-tail-slap','parking-lot-stampede','something-under-asphalt','awning-gives-way','final-manifestation'];
  const headlines=['SPECTRAL TAIL SLAP ROCKS COUNTY\u00a0LOT','GHOST-GATOR STAMPEDE CRUSHES\u00a0PARKING','THING UNDER ASPHALT REFUSES\u00a0PERMIT','STRIP-MALL AWNING LOSES FINAL\u00a0ARGUMENT','FINAL MANIFESTATION DEFIES\u00a0ZONING'];
  const alts=['A spectral alligator tail lashes through a cracked parking lot, scattering cones and county paperwork.','Three spectral alligators stampede across a strip-mall parking lot, scattering cones and a shopping cart.','Spectral alligator claws and a snout push up beneath buckled, glowing parking-lot asphalt.','A spectral alligator tears through a collapsing striped strip-mall awning.','A colossal spectral alligator rises from a glowing sinkhole over the strip mall.'];
  const captions=['<b>WHAP!</b> County paperwork and traffic cones become airborne after an unlicensed spectral tail enters the lot.','<b>RUN!</b> Three unregistered reptiles ignore parking arrows, a shopping cart, and several strongly worded cones.','<b>UPHEAVAL!</b> Public Works confirms the pavement is not supposed to breathe, glow, or have claws.','<b>COLLAPSE!</b> The awning reaches the end of its structural argument with one extremely deceased tenant.','<b>LAST CALL!</b> A full-size apparition rises for the final turn while officials reconsider the word “pothole.”'];
  const actualSurge=surged&&!canceled,eventSlug=actualSurge?'chaos-manifestation':artSlugs[before.turn-1],eventArt=`./assets/events/${eventSlug}.webp`;
  const eventAlt=actualSurge?'A spectral paperwork cyclone explodes through county filing cabinets beside the parking lot.':alts[before.turn-1];
  const eventCaption=actualSurge?'<b>WRONG DEPARTMENT!</b> Reality adds two injuries, one Liability, and several airborne filing cabinets.':captions[before.turn-1];
  const reportHeadline=actualSurge?'CHAOS HITS SIX; REALITY FILES\u00a0COMPLAINT':headlines[before.turn-1];
  turnReport.innerHTML=`<div class="chaos-sky" aria-hidden="true"><i></i><i></i><i></i></div><article class="chaos-board ${surged?'surged ':''}${eventArt?'illustrated':''}">
    <header class="chaos-masthead"><span>THE</span><strong>FLORIDA MAN</strong><b>GAZETTE</b><em>ALL THE NEWS THE COUNTY DENIES</em></header>
    <div class="chaos-kicker"><span>VOL. 1 · NO. ${before.turn}</span><b>${surged?'CHAOS EXTRA!':'EXTRA!'}</b><span>SUNSHINE COUNTY · TURN ${before.turn}</span></div>
    <div class="chaos-head"><span class="chaos-burst">${surged?'6!':'!'}</span><div><span class="eyebrow">SPECIAL PARKING-LOT EDITION</span><h2 id="turnReportTitle">${reportHeadline}</h2><p>Officials describe the supernatural incident as “within seasonal expectations.” Witnesses strongly disagree.</p></div></div>
    <div class="chaos-main ${eventArt?'illustrated':''}">
      ${eventArt?`<figure class="chaos-event-art"><img src="${eventArt}" alt="${escape(eventAlt)}"><figcaption>${eventCaption} <i>Staff illustration</i></figcaption></figure>`:''}
      <div class="chaos-data"><div class="chaos-incident"><span>INCIDENT</span><strong>${escape(incident.name)}</strong><small>${incident.damage} base damage · ${incident.relocation+incident.stable+before.block} prevented</small></div>
      <div class="chaos-impact"><div><span>ENDURANCE</span><b>${before.endurance} <em>→</em> ${after.endurance}</b><small>${incidentLoss?`−${incidentLoss} from incident`:'No incident damage'}${surgeLoss?` · −${surgeLoss} from surge`:''}</small></div><div><span>CHAOS</span><b>${before.chaos} <em>→</em> ${after.chaos}</b><div class="chaos-meter" aria-label="${after.chaos} of 6 Chaos">${chaosSlots}</div></div></div>
      ${surged?`<div class="surge-ticket"><b>${canceled?'POSSUM INTERCEPTED THE SURGE':'SUPERNATURAL SURGE'}</b><span>${canceled?'No damage. No Liability. Possum has left the incident.':`−${surgeLoss} Endurance · ${newLiabilities?'+1 Wrong Department Liability':'No new Liability'}`}</span></div>`:''}
      ${aftermath?`<details class="chaos-aftermath"><summary>County incident record</summary><ul>${aftermath}</ul></details>`:''}</div>
    </div>
    <button class="primary chaos-continue" id="continueTurn">${after.status==='playing'?`DEAL TURN ${after.turn} →`:'SEE COUNTY VERDICT →'}</button>
    <span class="chaos-fineprint">BLOCK EXPIRED · HAND DISCARDED · COUNTY DENIES RESPONSIBILITY · CONTINUED NEXT TURN</span>
  </article>`;
  turnReport.hidden=false;document.body.classList.add('turn-report-open');$('app').inert=true;syncPause();
  const continueButton=$<HTMLButtonElement>('continueTurn');continueButton.focus({preventScroll:true});continueButton.onclick=()=>{turnReport.hidden=true;turnReport.innerHTML='';document.body.classList.remove('turn-report-open');$('app').inert=false;busy=false;render();syncPause();if(game.status!=='playing')result();else $('hand').querySelector<HTMLButtonElement>('.card:not(.unavailable)')?.focus({preventScroll:true});};
}
function endTurn(){if(busy||game.status!=='playing')return;const before=game;game=apply(game,{type:'end',revision:game.revision});selected=null;chosenTarget=null;busy=true;save();scene?.highlight(null);ping('end');render();window.requestAnimationFrame(()=>showTurnReport(before,game));}
$('endTurn').onclick=()=>{const playable=game.hand.filter(c=>!unavailable(game,c));if(playable.length){showModal(`<span class="eyebrow">LAST CALL</span><h2>Leave ${game.actions} Action${game.actions===1?'':'s'} on the table?</h2><p>You still have ${playable.length} playable card${playable.length===1?'':'s'}. Ending your turn discards your hand and triggers <strong>${threat(game).name}</strong>.</p><button class="primary" id="endAnyway">End turn anyway →</button>`);$('endAnyway').onclick=()=>{hideModal();endTurn();};}else endTurn();};
function result(){ping('win');const win=game.status!=='defeat';const headline=game.status==='sealed'?'COUNTY DECLARES PORTAL STRUCTURALLY COMPLIANT':game.status==='relocated'?'LOCAL DEPUTY REHOMES THREE DECEASED ALLIGATORS':'PARKING LOT REZONED AS AFTERLIFE';showModal(`<span class="result-stamp">THE FLORIDA MAN GAZETTE · ${win?'INCIDENT RESOLVED':'SPECIAL DISASTER EDITION'}</span><h2>${headline}</h2><p>${escape(game.reason)}</p><div class="result-stats"><div><b>${game.turn}</b><span>TURNS</span></div><div><b>${game.endurance}/12</b><span>ENDURANCE</span></div><div><b>${game.liabilities}</b><span>NEW LIABILITIES</span></div></div><p>${win?'The county would like to thank you. In writing. In six to eight weeks.':'Nobody was paid enough for this. A different hand might help.'}</p><div class="button-row"><button class="primary" id="replay">Replay same deal →</button><button class="outline" id="newShuffle">New shuffle</button></div>`,'Inspect the table');$('replay').onclick=()=>begin(game.tutorial,game.seed,game.roster);$('newShuffle').onclick=()=>begin(false,Date.now()>>>0,game.roster);}
function begin(tutorial:boolean,seed=Date.now()>>>0,roster:CrewId[]=selectedCrew){hideModal();start.close();game=createGame(seed,tutorial,roster);guideActive=tutorial;started=true;selected=null;chosenTarget=null;busy=false;scene?.highlight(null);scene?.setCrew(game.roster);if(sound)audioInit();render();syncPause();if(tutorial)tutorialIntro();}
const rosterPicker=document.createElement('section');rosterPicker.className='roster-picker';rosterPicker.setAttribute('aria-labelledby','rosterTitle');
document.querySelector('.start-actions')!.before(rosterPicker);
function renderRosterPicker(){
  rosterPicker.innerHTML=`<div class="roster-picker-head"><span class="eyebrow" id="rosterTitle">PICK THREE FOR THE INCIDENT</span><b>${selectedCrew.length} / 3 SELECTED</b></div><div class="roster-options">${(Object.keys(CREW) as CrewId[]).map(id=>{const c=CREW[id],picked=selectedCrew.includes(id);return `<button type="button" class="roster-option${picked?' selected':''}" data-crew="${id}" aria-pressed="${picked}" ${!picked&&selectedCrew.length===3?'aria-disabled="true"':''}><img src="./assets/characters/${c.art}.webp" alt=""><span><b>${c.name}</b><small>${c.role}</small></span><i>${picked?'✓':'+'}</i></button>`;}).join('')}</div><small class="roster-note">Each local brings four cards. Deselect one before choosing a replacement.</small>`;
  rosterPicker.querySelectorAll<HTMLButtonElement>('[data-crew]').forEach(button=>button.onclick=()=>{const id=button.dataset.crew as CrewId,index=selectedCrew.indexOf(id);if(index>=0)selectedCrew.splice(index,1);else if(selectedCrew.length<3)selectedCrew.push(id);renderRosterPicker();});
  $<HTMLButtonElement>('normalStart').disabled=selectedCrew.length!==3;
}
$('tutorialStart').onclick=()=>begin(true,427,DEFAULT_CREW);$('normalStart').onclick=()=>begin(false,Date.now()>>>0,selectedCrew);
$('tutorialStart').textContent='Teach me to play';
$('normalStart').innerHTML='START SELECTED CREW · 12 CARDS <span>→</span>';renderRosterPicker();
$('resumeBtn').hidden=!saved;$('resumeBtn').onclick=()=>{if(!saved)return;game=saved;selectedCrew=[...game.roster];started=true;start.close();scene?.setCrew(game.roster);if(sound)audioInit();render();syncPause();if(game.status!=='playing')result();};
$('soundBtn').onclick=()=>{sound=!sound;if(sound)audioInit();text('soundBtn',sound?'Sound on':'Sound off');$('soundBtn').setAttribute('aria-pressed',String(sound));$('soundBtn').setAttribute('aria-label',sound?'Disable sound':'Enable sound');settingsSave();syncPause();};
text('soundBtn',sound?'Sound on':'Sound off');
function help(){showModal(`<span class="eyebrow">THE COUNTY’S FIELD GUIDE</span><h2>Roll up your sleeves.<br>Read the fine print.</h2><ol><li><strong>Build a crew:</strong> pick any three of six locals. Each brings four cards, making a 12-card incident deck.</li><li><strong>Win either way:</strong> reach 12 Stability to seal the rift, or relocate all 3 spirits. You have five turns.</li><li><strong>Each turn:</strong> draw 5 cards and get 3 Actions. Select a card, choose its glowing scene target, then confirm.</li><li><strong>Block</strong> reduces the next incident’s damage, then expires. Generator power adds +1 to Stability cards.</li><li><strong>At 6 Chaos:</strong> lose 2 Endurance, gain an unplayable Liability, then subtract 6 Chaos. This happens before a win check.</li><li><strong>Exhaust</strong> means a card leaves this encounter. Other cards cycle through discard and reshuffle.</li></ol><p>Keyboard: Tab moves between cards and controls; Enter activates; Escape cancels selection. Decisions have no timer. Your run saves after every resolved action.</p>`);}
$('helpBtn').onclick=help;
$('pauseBtn').onclick=()=>{showModal(`<span class="eyebrow">TAKE FIVE</span><h2>The afterlife can wait.</h2><label><input id="fastSetting" type="checkbox" ${fast?'checked':''}> Quick action animations</label><label><input id="qualitySetting" type="checkbox" ${low?'checked':''}> Lower graphics load</label><label>Effects volume <input id="sfxSetting" type="range" min="0" max="1" step=".05" value="${sfxVolume}"></label><label>Ambient drone <input id="ambientSetting" type="range" min="0" max=".2" step=".01" value="${ambienceVolume}"></label><p>Reduced motion follows your device preference. Progress saves automatically.</p><button id="restartAsk" class="outline">Restart this deal</button>`);
  $<HTMLInputElement>('fastSetting').onchange=e=>{fast=(e.target as HTMLInputElement).checked;settingsSave();};
  $<HTMLInputElement>('qualitySetting').onchange=e=>{low=(e.target as HTMLInputElement).checked;scene?.setQuality(low);settingsSave();};
  for(const id of ['sfxSetting','ambientSetting'])$<HTMLInputElement>(id).oninput=e=>{const v=Number((e.target as HTMLInputElement).value);if(id==='sfxSetting')sfxVolume=v;else ambienceVolume=v;settingsSave();};
  $('restartAsk').onclick=()=>{showModal('<h2>Start this deal again?</h2><p>This replaces the current saved incident.</p><button class="primary" id="restartConfirm">Restart →</button>');$('restartConfirm').onclick=()=>begin(game.tutorial,game.seed);};
};
$('logBtn').onclick=()=>showModal(`<span class="eyebrow">PUBLIC RECORD</span><h2>The incident, so far.</h2><ol class="log-list">${game.log.map(l=>`<li>${escape(l)}</li>`).join('')}</ol>`);
$('chaosInfo').onclick=()=>showModal('<h2>A little Chaos goes a long way.</h2><p>At 6 Chaos, a manifestation deals 2 damage directly to your crew, ignoring Block. A Wrong Department Liability enters your discard pile. Subtract 6 Chaos.</p><p>The surge resolves before victory. A fatal surge can defeat your crew even when your card completes the objective.</p>');
$('threatInfo').onclick=()=>{const t=threat(game);showModal(`<h2>${t.name}</h2><p>${t.damage} base damage − ${t.relocation} for relocated spirits − ${t.stable} for a stable rift − ${game.block} Block = <strong>${t.net} Endurance lost</strong>.</p><p>Then gain ${t.chaos} Chaos. All Block and distraction expire.${game.turn===3?' This ground hazard ignores relocated spirits.':''}${game.turn===5?' This is the final turn. Finish either objective before ending it.':''}</p>`);};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.open&&!start.open&&selected){e.preventDefault();clearSelection();}});
document.addEventListener('visibilitychange',syncPause);
// Adapted from the original Holographic Pack: reflective edges only, matte faces.
$('hand').addEventListener('pointermove',e=>{
  if(reduced||e.pointerType==='touch')return;
  const card=(e.target as HTMLElement).closest<HTMLElement>('.card');if(!card)return;
  const rect=card.getBoundingClientRect();
  card.style.setProperty('--foil-x',`${Math.max(0,Math.min(100,(e.clientX-rect.left)/rect.width*100))}%`);
  card.style.setProperty('--foil-angle',`${115+(e.clientY-rect.top)/rect.height*95}deg`);
});
$('hand').addEventListener('pointerout',e=>{
  const card=(e.target as HTMLElement).closest<HTMLElement>('.card');
  if(card&&(!(e.relatedTarget instanceof Node)||!card.contains(e.relatedTarget))){card.style.removeProperty('--foil-x');card.style.removeProperty('--foil-angle');}
});
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{reduced=e.matches;if(scene)scene.reduced=reduced;});
document.querySelectorAll<HTMLElement>('.target').forEach(el=>{el.addEventListener('dragover',e=>e.preventDefault());el.addEventListener('drop',e=>{e.preventDefault();chooseTarget(el.dataset.target as Target);});});
window.addEventListener('resize',()=>setTimeout(refreshTargets,80));
$('scene').addEventListener('asseterror',e=>toast(`Could not load ${(e as CustomEvent).detail} artwork. Reload to retry; card controls remain available.`));
$('scene').addEventListener('sceneerror',()=>{$('loading').hidden=false;$('loading').classList.add('error');$('loading').textContent='The 3D scene lost its graphics context. Reload to restore your saved turn. Card controls still work.';});
try{scene=new Diorama($('scene'),chooseTarget);scene.reduced=reduced;scene.setQuality(low);$('loading').hidden=true;setTimeout(refreshTargets,100);}catch{$('loading').classList.add('error');$('loading').textContent='3D graphics are unavailable. You can still play using each card’s Target button. Enable WebGL and reload to restore the scene.';}
if(!saveAvailable)$('saveStatus').textContent='SAVING UNAVAILABLE · KEEP THIS TAB OPEN';
render();start.showModal();syncPause();
// A small public read-only snapshot helps browser tests inspect the same state the UI displays.
Object.defineProperty(window,'floridaState',{get:()=>structuredClone(game)});
