export type Kind = 'cone'|'jurisdiction'|'generator'|'bait'|'release'|'notes'|'coffee'|'house'|'closing'|'bass-possum'|'boombox'|'putt-putt'|'putter'|'raccoon'|'multitool'|'liability'|'possum'|'chihuahua'|'noodle'|'crystal'|'iguana'|'flamingo';
export type CrewId = 'darlene'|'ron'|'manager'|'dj'|'cheryl'|'mara';
export type Target = 'barricade'|'sinkhole'|'generator'|'crew'|'self';
export type LevelId = 'county'|'vortex';
export type TargetRole = 'defense'|'threat'|'power'|'crew'|'self';
// Stable mechanical roles; legacy target IDs remain accepted by old saves/cards.
export const TARGET_ROLES:Record<Target,TargetRole>={barricade:'defense',sinkhole:'threat',generator:'power',crew:'crew',self:'self'};
export const VORTEX_INCIDENTS=[
  {name:'Blades Without Wind',damage:2,chaos:1},
  {name:'Ball-Return Backfire',damage:3,chaos:1},
  {name:'The Green Buckles',damage:3,chaos:2},
  {name:'The Course Comes Alive',damage:4,chaos:1},
  {name:'Last Putt Before the Afterlife',damage:5,chaos:2}
];
export type Mode = 'seal'|'relocate';
export interface Card { id:string; kind:Kind }
export interface Definition { name:string; owner:string; cost:number; target:Target; text:string; icon:string; exhaust?:boolean; art?:string }
export const CARDS:Record<Kind,Definition> = {
  'bass-possum':{name:'Bass Possum',owner:'DJ Rip Current',cost:1,target:'crew',text:'Cancel the next Chaos surge and its Liability. The possum leaves after helping. Exhaust.',icon:'♫',exhaust:true,art:'bass-possum'},
  boombox:{name:'Bootleg Boombox',owner:'DJ Rip Current',cost:0,target:'self',text:'Gain 2 Actions and 2 Chaos. The county cannot find the volume knob. Exhaust.',icon:'▣',exhaust:true,art:'boombox'},
  'putt-putt':{name:'Putt-Putt',owner:'Cheryl Vortex',cost:1,target:'generator',text:'If power is off, switch it on and gain 3 Chaos. If on, gain 3 Stability and switch it off. Exhaust.',icon:'♢',exhaust:true,art:'putt-putt'},
  putter:{name:'Cursed Putter',owner:'Cheryl Vortex',cost:1,target:'sinkhole',text:'Gain 3 Stability. Power adds +1 Stability.',icon:'⌁',art:'putter'},
  raccoon:{name:'Judgmental Raccoon',owner:'Mara Key',cost:1,target:'barricade',text:'Gain 3 Block. It has reviewed your technique and found it wanting.',icon:'◉',art:'raccoon'},
  multitool:{name:'Questionable Multitool',owner:'Mara Key',cost:1,target:'generator',text:'If power is off, switch it on and gain 1 Chaos. If on, gain 2 Stability and switch it off. Exhaust.',icon:'✦',exhaust:true,art:'multitool'},
  possum:{name:'Emotional Support Possum',owner:'Companion',cost:1,target:'crew',text:'Cancel the next Chaos surge, including its Liability. Leaves after helping. Exhaust.',icon:'♡',exhaust:true,art:'possum'},
  chihuahua:{name:'Rhinestone Chihuahua',owner:'Companion',cost:1,target:'sinkhole',text:'Distract spirits this turn. Gain 1 Chaos. Stays as a companion for Pool Noodle. Exhaust.',icon:'♢',exhaust:true,art:'chihuahua'},
  noodle:{name:'Pool Noodle of Protection',owner:'Equipment',cost:1,target:'barricade',text:'Gain 2 Block, or 4 with an active companion. Block caps at 4.',icon:'∿',art:'noodle'},
  crystal:{name:'Gas Station Crystal',owner:'Souvenir',cost:1,target:'sinkhole',text:'Gain 3 Stability and 1 Chaos. Power adds +1 Stability.',icon:'◆',art:'crystal'},
  iguana:{name:'Iguana in the Fuse Box',owner:'Wildlife',cost:1,target:'generator',text:'If off: power on, +3 Chaos. If on: +3 Stability, then power off. Exhaust.',icon:'ϟ',exhaust:true,art:'iguana'},
  flamingo:{name:'Haunted Lawn Flamingo',owner:'Companion',cost:1,target:'crew',text:'After each of the next 2 incidents, gain 2 Stability (+1 if powered), if alive. Exhaust.',icon:'⌁',exhaust:true,art:'flamingo'},
  cone:{name:'Orange Cone Authority',owner:'Darlene',cost:1,target:'barricade',text:'Gain 2 Block. Bureaucracy has its advantages.',icon:'▱'},
  jurisdiction:{name:'County Jurisdiction',owner:'Darlene',cost:2,target:'sinkhole',text:'Gain 5 Stability. +2 if you have Block.',icon:'✦'},
  generator:{name:'Emergency Requisition',owner:'Darlene',cost:1,target:'generator',text:'Power on: Stability cards gain +1. Gain 2 Chaos. Exhaust.',icon:'ϟ',exhaust:true},
  bait:{name:'Questionable Bait',owner:'Ron',cost:1,target:'sinkhole',text:'Gain 2 Stability. Distract spirits for Catch and Release this turn.',icon:'◎'},
  release:{name:'Catch and Release',owner:'Ron',cost:2,target:'sinkhole',text:'Relocate 1 spirit. Relocate 2 if distracted; consume distraction.',icon:'↗'},
  notes:{name:'Field Notes',owner:'Ron',cost:0,target:'self',text:'Draw 1 card. Exhaust.',icon:'≋',exhaust:true},
  coffee:{name:'Fresh Pot',owner:'Manager',cost:1,target:'crew',text:'Restore 3 Endurance. Somehow, it helps.',icon:'☕'},
  house:{name:'On the House',owner:'Manager',cost:0,target:'self',text:'Gain 2 Actions and 2 Chaos. Exhaust.',icon:'✧',exhaust:true},
  closing:{name:'Closing Time',owner:'Manager',cost:2,target:'sinkhole',text:'Choose +4 Stability or relocate 1 spirit (2 if powered). +2 Chaos. Exhaust.',icon:'⌁',exhaust:true},
  liability:{name:'Wrong Department',owner:'County',cost:0,target:'self',text:'Unplayable. Your complaint has been forwarded.',icon:'×'}
};
export const INCIDENTS = [
  {name:'Spectral Tail Slap',damage:2,chaos:1},
  {name:'Parking-Lot Stampede',damage:3,chaos:1},
  {name:'Something Under the Asphalt',damage:3,chaos:2},
  {name:'The Awning Gives Way',damage:4,chaos:1},
  {name:'Final Manifestation',damage:5,chaos:2}
];
export interface State {
  version:1; level:LevelId; seed:number; rng:number; tutorial:boolean; revision:number;
  turn:number; endurance:number; stability:number; spirits:number; actions:number; chaos:number; block:number;
  generator:boolean; distracted:boolean; liabilities:number; played:number;
  expanded:boolean; roster:CrewId[]; possum:boolean; chihuahua:boolean; flamingo:number;
  status:'playing'|'sealed'|'relocated'|'defeat'; reason:string;
  draw:Card[]; hand:Card[]; discard:Card[]; exhaust:Card[]; log:string[];
}
export type Command = {type:'play';id:string;target:Target;mode?:Mode;revision:number}|{type:'end';revision:number};
export const CREW:Record<CrewId,{name:string;role:string;art:string;deck:Kind[]}>={
  darlene:{name:'Darlene Bix',role:'County Authority',art:'darlene',deck:['cone','jurisdiction','generator','cone']},
  ron:{name:'Gator Ron',role:'Wildlife Deputy',art:'ron',deck:['bait','release','notes','bait']},
  manager:{name:'The Manager',role:'Diner Management',art:'manager',deck:['coffee','house','closing','coffee']},
  dj:{name:'DJ Rip Current',role:'Pirate Radio Host',art:'dj',deck:['bass-possum','boombox','bass-possum','boombox']},
  cheryl:{name:'Cheryl Vortex',role:'Mini Golf Owner',art:'cheryl',deck:['putt-putt','putter','putt-putt','putter']},
  mara:{name:'Mara Key',role:'Night Technician',art:'mara',deck:['raccoon','multitool','raccoon','multitool']}
};
export const DEFAULT_CREW:CrewId[]=['darlene','ron','manager'];
// Preserve the fixed instructional deal and legacy save identity ordering.
const order:Kind[]=['cone','jurisdiction','bait','coffee','generator','cone','bait','release','house','closing','coffee','notes'];
export const EXPANSION:Kind[]=['possum','chihuahua','noodle','crystal','iguana','flamingo'];
export function crewDeck(roster:CrewId[]){return roster.flatMap(id=>CREW[id].deck);}
export function hasCompanion(s:State){return s.possum||s.chihuahua||s.flamingo>0;}
function shuffle(s:State, cards:Card[]) {
  for(let i=cards.length-1;i>0;i--){s.rng=(Math.imul(1664525,s.rng)+1013904223)>>>0;const j=Math.floor(s.rng/4294967296*(i+1));[cards[i],cards[j]]=[cards[j],cards[i]];}
}
function draw(s:State,n:number){for(let i=0;i<n;i++){if(!s.draw.length){s.draw=s.discard.splice(0);shuffle(s,s.draw);}const c=s.draw.shift();if(c)s.hand.push(c);else break;}}
function log(s:State,msg:string){s.log.push(msg);s.log=s.log.slice(-60);}
export function createGame(seed=Date.now()>>>0,tutorial=false,roster:CrewId[]=DEFAULT_CREW,level:LevelId='county'):State{
  if(level!=='county'&&level!=='vortex')throw Error('Unknown encounter.');
  const selected=tutorial?DEFAULT_CREW:[...roster];
  if(selected.length!==3||new Set(selected).size!==3||selected.some(id=>!Object.hasOwn(CREW,id)))throw Error('Choose exactly three different crew members.');
  const deck=tutorial?order:[...crewDeck(selected),...EXPANSION];
  const s:State={version:1,level,expanded:!tutorial,roster:selected,possum:false,chihuahua:false,flamingo:0,seed:seed>>>0,rng:seed>>>0,tutorial,revision:0,turn:1,endurance:12,stability:0,spirits:3,actions:3,chaos:0,block:0,generator:false,distracted:false,liabilities:0,played:0,status:'playing',reason:'',draw:deck.map((kind,i)=>({id:`c${i}`,kind})),hand:[],discard:[],exhaust:[],log:[`${selected.map(id=>CREW[id].name).join(', ')} reported for one unpermitted portal.`]};
  if(!tutorial)shuffle(s,s.draw);draw(s,5);return s;
}
export function threat(s:State){
  const i=(s.level==='vortex'?VORTEX_INCIDENTS:INCIDENTS)[s.turn-1];const relocation=s.turn===3?0:3-s.spirits;const stable=s.turn===5&&s.stability>=8?2:0;
  return {...i,relocation,stable,raw:Math.max(0,i.damage-relocation-stable),net:Math.max(0,i.damage-relocation-stable-s.block)};
}
export function unavailable(s:State,c:Card,mode?:Mode):string{
  if(s.status!=='playing')return 'This incident is complete.';
  if(!s.hand.some(h=>h.id===c.id&&h.kind===c.kind))return 'That card is no longer in your hand.';
  if(c.kind==='liability')return 'Unplayable. Discarded when your turn ends.';
  if(CARDS[c.kind].cost>s.actions)return 'Not enough Actions.';
  if(c.kind==='coffee'&&s.endurance===12)return 'Your crew already has full Endurance.';
  if(c.kind==='generator'&&s.generator)return 'Power is already on.';
  if((c.kind==='cone'||c.kind==='noodle'||c.kind==='raccoon')&&s.block===4)return 'Crew protection is already at 4 Block.';
  if(c.kind==='bass-possum'&&s.possum)return 'Bass Possum is already protecting the crew.';
  if((c.kind==='release'||c.kind==='closing'&&mode==='relocate')&&s.spirits===0)return 'There are no spirits to relocate.';
  if(c.kind==='notes'&&!s.draw.length&&!s.discard.length)return 'There are no cards left to draw.';
  return '';
}
function checks(s:State){
  while(s.chaos>=6){s.chaos-=6;if(s.possum){s.possum=false;log(s,'POSSUM SUPPORT: surge and Liability canceled. The possum clocks out.');continue;}s.endurance=Math.max(0,s.endurance-2);s.liabilities++;s.discard.push({id:`l${s.liabilities}`,kind:'liability'});log(s,'MANIFESTATION: −2 Endurance. Wrong Department added to discard.');}
  if(s.endurance<=0){s.status='defeat';s.reason='The crew ran out of Endurance.';}
  else if(s.stability>=12){s.status='sealed';s.reason=s.level==='vortex'?'The final putt sealed the vortex. Hole 18 is just a hole again.':'The portal is structurally compliant. Probably.';}
  else if(s.spirits===0){s.status='relocated';s.reason=s.level==='vortex'?'All three course spirits have found a new home. The windmill can finally rest.':'Three deceased alligators have found a new home.';}
}
export function apply(s:State,cmd:Command):State{
  if(s.status!=='playing')throw Error('This incident is complete.');
  if(cmd.revision!==s.revision)throw Error('That action has already resolved.');
  const n:State=structuredClone(s);n.revision++;
  if(cmd.type==='play'){
    const index=n.hand.findIndex(c=>c.id===cmd.id);if(index<0)throw Error('Card not found.');
    const c=n.hand[index],d=CARDS[c.kind],why=unavailable(n,c,cmd.mode);if(why)throw Error(why);
    if(cmd.target!==d.target)throw Error('Choose a valid target.');
    if(c.kind==='closing'&&cmd.mode!=='seal'&&cmd.mode!=='relocate')throw Error('Choose a Closing Time effect.');
    n.hand.splice(index,1);n.actions-=d.cost;n.played++;
    const gain=(x:number)=>{n.stability=Math.min(12,n.stability+x+(n.generator?1:0));};
    switch(c.kind){
      case 'bass-possum':n.possum=true;break;
      case 'boombox':n.actions=Math.min(5,n.actions+2);n.chaos+=2;break;
      case 'putt-putt':if(n.generator){n.generator=false;gain(3);}else{n.generator=true;n.chaos+=3;}break;
      case 'putter':gain(3);break;
      case 'raccoon':n.block=Math.min(4,n.block+3);break;
      case 'multitool':if(n.generator){n.generator=false;gain(2);}else{n.generator=true;n.chaos++;}break;
      case 'possum':n.possum=true;break;
      case 'chihuahua':n.chihuahua=true;n.distracted=true;n.chaos++;break;
      case 'noodle':n.block=Math.min(4,n.block+(hasCompanion(n)?4:2));break;
      case 'crystal':gain(3);n.chaos++;break;
      case 'iguana':if(n.generator){n.generator=false;gain(3);}else{n.generator=true;n.chaos+=3;}break;
      case 'flamingo':n.flamingo=2;break;
      case 'cone':n.block=Math.min(4,n.block+2);break;
      case 'jurisdiction':gain(5+(n.block>0?2:0));break;
      case 'generator':n.generator=true;n.chaos+=2;break;
      case 'bait':gain(2);n.distracted=true;break;
      case 'release':n.spirits=Math.max(0,n.spirits-(n.distracted?2:1));n.distracted=false;break;
      case 'notes':draw(n,1);break;
      case 'coffee':n.endurance=Math.min(12,n.endurance+3);break;
      case 'house':n.actions+=2;n.chaos+=2;break;
      case 'closing':if(cmd.mode==='seal')gain(4);else n.spirits=Math.max(0,n.spirits-(n.generator?2:1));n.chaos+=2;break;
    }
    (d.exhaust?n.exhaust:n.discard).push(c);
    log(n,`${d.name}${c.kind==='closing'?` · ${cmd.mode}`:''}`);
    checks(n);
  }else{
    n.discard.push(...n.hand.splice(0));const t=threat(n);
    n.endurance=Math.max(0,n.endurance-t.net);n.block=0;n.distracted=false;n.chaos+=t.chaos;
    log(n,`Turn ${n.turn}: ${t.name} · −${t.net} Endurance, +${t.chaos} Chaos.`);checks(n);
    if(n.status==='playing'&&n.flamingo>0){n.flamingo--;const boost=2+(n.generator?1:0);n.stability=Math.min(12,n.stability+boost);log(n,`HAUNTED FLAMINGO: +${boost} Stability. ${n.flamingo} incident boosts left.`);checks(n);}
    if(n.status==='playing'&&n.turn===5){n.status='defeat';n.reason=n.level==='vortex'?'The haunted course swallowed Hole 18 before the incident was resolved.':'The parking lot collapsed before the incident was resolved.';}
    if(n.status==='playing'){n.turn++;n.actions=3;draw(n,5);}
  }
  return n;
}
export function preview(s:State,c:Card,mode:Mode='seal'){
  try{const n=apply(s,{type:'play',id:c.id,target:CARDS[c.kind].target,mode,revision:s.revision});
    const parts:string[]=[];
    const fields:[keyof State,string][]=[['stability','Stability'],['block','Block'],['endurance','Endurance'],['actions','Actions'],['chaos','Chaos']];
    for(const [key,label]of fields){const diff=(n[key]as number)-(s[key]as number);if(diff)parts.push(`${diff>0?'+':''}${diff} ${label}`);}
    if(n.spirits<s.spirits)parts.push(`Relocate ${s.spirits-n.spirits}`);
    if(n.generator&&!s.generator)parts.push('Power on');
    if(!n.generator&&s.generator)parts.push('Power off');
    if(c.kind==='possum'||c.kind==='bass-possum')parts.push('Protect next surge');
    if(c.kind==='chihuahua')parts.push('Companion stays');
    if(c.kind==='flamingo')parts.push('2 incident boosts');
    if(s.possum&&!n.possum)parts.push('Possum canceled surge');
    if(n.distracted&&!s.distracted)parts.push('Distract');
    if(c.kind==='notes')parts.push('Draw 1');
    if(n.liabilities>s.liabilities)parts.push('Manifestation: +1 Liability');
    if(n.status==='defeat')parts.push('CREW DEFEATED');else if(n.status!=='playing')parts.push('INCIDENT RESOLVED');
    return parts.join(' · ');
  }catch(e){return (e as Error).message;}
}
export function restore(raw:string):State|null{
  try{
    const s=JSON.parse(raw) as State;if(s.version!==1||!['playing','sealed','relocated','defeat'].includes(s.status))return null;
    if(s.level===undefined)s.level='county';
    if(s.level!=='county'&&s.level!=='vortex')return null;
    // Pre-expansion saves retain their exact 12-card deck.
    if(s.expanded===undefined){s.expanded=false;s.possum=false;s.chihuahua=false;s.flamingo=0;}
    if(s.roster===undefined)s.roster=[...DEFAULT_CREW];
    if(typeof s.expanded!=='boolean'||typeof s.possum!=='boolean'||typeof s.chihuahua!=='boolean'||!Number.isInteger(s.flamingo)||s.flamingo<0||s.flamingo>2)return null;
    if(!Array.isArray(s.roster)||s.roster.length!==3||new Set(s.roster).size!==3||s.roster.some(id=>typeof id!=='string'||!Object.hasOwn(CREW,id)))return null;
    const ranges:Record<string,[number,number]>={seed:[0,4294967295],rng:[0,4294967295],revision:[0,10000],turn:[1,5],endurance:[0,12],stability:[0,12],spirits:[0,3],actions:[0,5],chaos:[0,5],block:[0,4],liabilities:[0,30],played:[0,1000]};
    for(const [k,[lo,hi]]of Object.entries(ranges)){const v=(s as unknown as Record<string,unknown>)[k];if(!Number.isInteger(v)||(v as number)<lo||(v as number)>hi)return null;}
    if(typeof s.generator!=='boolean'||typeof s.distracted!=='boolean'||typeof s.tutorial!=='boolean'||typeof s.reason!=='string')return null;
    if(!Array.isArray(s.log)||s.log.length>60||s.log.some(x=>typeof x!=='string'||x.length>400))return null;
    let all:Card[]=[];for(const p of ['draw','hand','discard','exhaust']as const){if(!Array.isArray(s[p])||s[p].length>50)return null;all.push(...s[p]);}
    // Restore the shared roadside deck to in-progress normal saves made by the
    // short-lived 12-card roster build. Tutorial deals remain fixed and exact.
    if(!s.tutorial&&!s.expanded&&s.status==='playing'&&all.length===12+s.liabilities){
      s.draw.push(...EXPANSION.map((kind,i)=>({id:`c${i+12}`,kind})));s.expanded=true;shuffle(s,s.draw);
      log(s,'Six roadside wildcards were returned to the incident deck.');
      all=[];for(const p of ['draw','hand','discard','exhaust']as const)all.push(...s[p]);
    }
    const expected=s.expanded?[...crewDeck(s.roster),...EXPANSION]:crewDeck(s.roster);
    if(all.length!==expected.length+s.liabilities||new Set(all.map(c=>c.id)).size!==all.length)return null;
    if(all.some(c=>!c||typeof c.id!=='string'||!Object.hasOwn(CARDS,c.kind)))return null;
    for(let i=0;i<expected.length;i++){if(!all.some(c=>c.id===`c${i}`))return null;}
    const expectedCounts=new Map<Kind,number>();for(const kind of expected)expectedCounts.set(kind,(expectedCounts.get(kind)||0)+1);
    const actualCounts=new Map<Kind,number>();for(const card of all.filter(c=>c.id.startsWith('c')))actualCounts.set(card.kind,(actualCounts.get(card.kind)||0)+1);
    if([...expectedCounts].some(([kind,count])=>actualCounts.get(kind)!==count)||actualCounts.size!==expectedCounts.size)return null;
    if((s.possum&&!s.exhaust.some(c=>c.kind==='possum'||c.kind==='bass-possum'))||(s.chihuahua&&!s.exhaust.some(c=>c.kind==='chihuahua'))||(s.flamingo>0&&!s.exhaust.some(c=>c.kind==='flamingo')))return null;
    for(let i=1;i<=s.liabilities;i++){if(!all.some(c=>c.id===`l${i}`&&c.kind==='liability'))return null;}
    if(s.status==='playing'&&(s.endurance===0||s.stability===12||s.spirits===0))return null;
    return s;
  }catch{return null;}
}
