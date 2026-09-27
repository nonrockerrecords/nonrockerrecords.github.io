/* Deliberately independent of game engines: claim works even if a bundle fails. */
(()=>{
  const dialog=document.querySelector('#claim-dialog');let opener;
  window.campClaim=()=>{if(!dialog)return;opener=document.activeElement;dialog.showModal();dialog.querySelector('input')?.focus();};
  document.querySelectorAll('[data-claim]').forEach(b=>b.addEventListener('click',window.campClaim));
  dialog?.querySelector('.close')?.addEventListener('click',()=>dialog.close());
  dialog?.addEventListener('close',()=>opener?.focus());
  if(new URLSearchParams(location.search).has('embed')){
    new ResizeObserver(()=>parent.postMessage({type:'camp:height',height:document.body.scrollHeight},location.origin)).observe(document.body);
  }
  window.addEventListener('message',e=>{
    if(e.origin!==location.origin||e.data?.type!=='camp:height')return;
    const frame=[...document.querySelectorAll('iframe')].find(f=>f.contentWindow===e.source);
    if(frame&&Number.isFinite(e.data.height))frame.style.height=Math.max(400,Math.min(1800,e.data.height))+'px';
  });
  document.querySelectorAll('.signup-form').forEach(form=>{
    const input=form.querySelector('input'),error=form.querySelector('.form-error');
    form.addEventListener('submit',e=>{
      e.preventDefault();
      if(!input.value.trim()||!input.validity.valid){input.setAttribute('aria-invalid','true');error.textContent='Enter a valid email address to preview your pass.';input.focus();return;}
      input.removeAttribute('aria-invalid');input.value='';error.textContent='';
      const result=form.parentElement.querySelector('.pass-result');form.hidden=true;result.hidden=false;result.focus();
      window.dispatchEvent(new CustomEvent('camp:claim'));
    });
    input.addEventListener('input',()=>{input.removeAttribute('aria-invalid');error.textContent='';});
  });
  document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{
    const code=b.closest('.pass-result').querySelector('code');
    try{await navigator.clipboard.writeText(code.textContent);b.textContent='Copied';}
    catch{const range=document.createRange();range.selectNodeContents(code);const selection=getSelection();selection.removeAllRanges();selection.addRange(range);b.textContent='Code selected — copy manually';}
  }));
})();
