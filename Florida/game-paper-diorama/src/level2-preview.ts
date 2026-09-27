import './level2-preview.css';
import {LevelTwoScene} from './level2-scene';

const host=document.getElementById('level2Scene') as HTMLElement;
const loading=document.getElementById('level2Loading') as HTMLElement;
try{
  const scene=new LevelTwoScene(host,1.07);
  const progressButton=document.getElementById('progressPreview') as HTMLButtonElement;
  let stability=0;
  progressButton.addEventListener('click',()=>{
    stability=stability===12?0:stability+3;
    scene.setProgress(stability,stability===0?0:4);
    progressButton.textContent=stability===12?'Reset motion preview':`Preview progress · ${stability}/12`;
    (document.getElementById('previewStatus') as HTMLElement).textContent=stability===12?'Preview: vortex sealed. Ball sunk; blades stopped.':`Preview only: ${stability} of 12 Stability. No game state changed.`;
  });
  const spiritButton=document.getElementById('spiritPreview') as HTMLButtonElement;
  spiritButton.addEventListener('click',()=>{
    scene.previewRehome();
    (document.getElementById('previewStatus') as HTMLElement).textContent='Preview only: one haunted golf ball rehomed. No game state changed.';
  });
  window.addEventListener('beforeunload',()=>scene.dispose(),{once:true});
  scene.ready.then(()=>loading.classList.add('done')).catch(()=>{loading.textContent='A STAGE IMAGE COULD NOT LOAD. PLEASE RELOAD.';});
}catch{
  loading.textContent='WEBGL COULD NOT OPEN THE COURSE';
}

const layoutButton=document.getElementById('layoutToggle') as HTMLButtonElement;
layoutButton.addEventListener('click',()=>{
  const active=document.querySelector('.preview-shell')!.classList.toggle('game-layout');
  layoutButton.setAttribute('aria-pressed',String(active));
  layoutButton.textContent=active?'Expand stage':'Check game layout';
  (document.getElementById('objectiveStudy') as HTMLElement).hidden=!active;
});
