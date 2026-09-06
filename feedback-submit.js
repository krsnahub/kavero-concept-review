(() => {
  const api = window.kaveroFeedback;
  if (!api) return;
  const endpoint = 'https://kavero-story-review.netlify.app';
  const clientKey = 'kavero-review-client';
  let clientId;
  try { clientId = localStorage.getItem(clientKey) || crypto.randomUUID(); localStorage.setItem(clientKey, clientId); } catch { clientId = crypto.randomUUID(); }
  let timer, active = false, again = false, lastSaved = '';
  const indicators = new Map();
  const signature = () => JSON.stringify({reviewer:api.review().reviewer,stories:api.review().stories});
  const message = text => { api.status.textContent = text; indicators.forEach(el => el.textContent = text); };
  function save() {
    clearTimeout(timer);
    if (active) { again = true; return; }
    const current = signature();
    if (current === lastSaved) { message('Saved online ✓'); return; }
    const review = {...api.review(), clientId, saveId:crypto.randomUUID(), kind:'autosave-snapshot'};
    active = true; message('Saving online…');
    const frame = document.createElement('iframe'); frame.name='save-'+review.saveId; frame.hidden=true;frame.title='Save feedback';document.body.append(frame);
    const form=document.createElement('form');form.method='POST';form.action=endpoint+'/thanks.html#receipt='+review.saveId;form.target=frame.name;form.hidden=true;
    for (const [name,value] of Object.entries({'form-name':'kavero-story-review',reviewer:review.reviewer || 'Anonymous reviewer',revision:review.conceptRevision,review:JSON.stringify(review),'bot-field':''})) {
      const input=document.createElement('input');input.name=name;input.value=value;form.append(input);
    }
    document.body.append(form);
    let finished=false;
    const finish=ok=>{
      if(finished)return;finished=true;clearTimeout(timeout);window.removeEventListener('message',receive);frame.remove();form.remove();active=false;
      if(ok) {lastSaved=current;message('Saved online ✓');} else message('Not saved online yet. Your draft is kept here—tap Save comment to retry, or Download feedback.');
      if(again || (ok && signature()!==lastSaved)){again=false;timer=setTimeout(save,1500);}
    };
    const receive=event=>{if(event.origin===endpoint && event.source===frame.contentWindow && event.data?.kaveroSaved===review.saveId)finish(true);};
    window.addEventListener('message',receive);
    const timeout=setTimeout(()=>finish(false),25000);
    form.submit();
  }
  const button=document.createElement('button');button.type='button';button.textContent='Save all feedback';button.addEventListener('click',save);api.panel.querySelector('.review-actions').prepend(button);
  document.querySelectorAll('.story-feedback').forEach(area=>{
    const button=document.createElement('button');button.type='button';button.textContent='Save comment';button.addEventListener('click',save);
    const status=document.createElement('p');status.className='feedback-status';status.setAttribute('role','status');status.textContent='Draft on this device';
    area.append(button,status);indicators.set(area,status);
    const changed=()=>{message('Unsaved changes—saving shortly…');clearTimeout(timer);timer=setTimeout(save,1500);};
    area.querySelector('textarea').addEventListener('input',changed);
    area.querySelectorAll('.heart,.reset-vote').forEach(b=>b.addEventListener('click',changed));
  });
  api.panel.querySelector('input').addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(save,1500);});
  window.addEventListener('online',save);
  window.addEventListener('beforeunload',e=>{if(signature()!==lastSaved){e.preventDefault();e.returnValue='';}});
  if(api.review().stories.some(s=>s.selected!==null || s.comment.trim())){message('Restored draft—saving online…');timer=setTimeout(save,1500);}else lastSaved=signature();
})();
