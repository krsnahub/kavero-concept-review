(() => {
  const api = window.kaveroFeedback;
  if (!api) return;
  const form = document.createElement('form');
  form.method = 'POST'; form.action = 'https://kavero-story-review.netlify.app/thanks.html';
  const fields = {'form-name':'kavero-story-review', reviewer:'', revision:'ecb9c3e', review:'', 'bot-field':''};
  for (const [name,value] of Object.entries(fields)) {
    const input = document.createElement('input'); input.type='hidden';input.name=name;input.value=value;form.append(input);
  }
  const button = document.createElement('button');button.type='submit';button.textContent='Send review';form.append(button);
  form.addEventListener('submit', event => {
    const review = api.review();
    if (!review.stories.some(s => s.selected !== null || s.comment.trim())) {
      event.preventDefault();api.status.textContent='Choose a heart or add a comment before sending.';return;
    }
    form.elements.namedItem('reviewer').value=review.reviewer || 'Anonymous reviewer';
    form.elements.namedItem('review').value=JSON.stringify(review);
    button.disabled=true;button.textContent='Sending…';
    setTimeout(()=>{button.disabled=false;button.textContent='Send review';},10000);
  });
  api.panel.querySelector('.review-actions').prepend(form);
  const note=document.createElement('p');note.textContent='No sign-in needed. Press Send review to share all your hearts and comments with the book creator. You can send a revised review later; untouched stories stay “Not reviewed.”';api.panel.append(note);
})();
