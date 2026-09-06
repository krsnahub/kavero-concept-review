(() => {
  const KEY = 'kavero-review-ecb9c3e-v1';
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch {}
  const state = saved && typeof saved === 'object' ? saved : {};
  const cards = [...document.querySelectorAll('article')];
  const status = document.createElement('p');
  status.className = 'feedback-status'; status.setAttribute('role', 'status');
  const panel = document.createElement('section');
  panel.className = 'feedback-panel';
  panel.innerHTML = '<h2>Your story review</h2><p>Tap the heart to select a story; tap again to leave it out. Untouched stories remain “Not reviewed.” You can comment on any story.</p><label for="reviewer-name">Your name (optional)</label><input id="reviewer-name" maxlength="80" autocomplete="name"><div class="review-actions"><button type="button" id="download-feedback">Download feedback</button></div><p>Your draft is saved in this browser when storage is available. Downloading creates a file; it does not send your feedback.</p>';
  document.querySelector('header').after(panel);
  panel.append(status);
  const name = panel.querySelector('input'); name.value = typeof state.name === 'string' ? state.name : '';
  function persist() {
    state.name = name.value;
    try { localStorage.setItem(KEY, JSON.stringify(state)); status.textContent = 'Draft saved on this device. Not submitted yet.'; }
    catch { status.textContent = 'Browser storage is unavailable. Keep this page open and download your feedback.'; }
  }
  name.addEventListener('input', persist);
  cards.forEach(card => {
    const book = card.closest('.book').id.replace('book-', '');
    const number = Number(card.querySelector('.number').textContent.match(/STORY (\d+)/)[1]);
    const id = `b${book}-s${String(number).padStart(2, '0')}`;
    let entry = state[id];
    if (!entry || typeof entry !== 'object') entry = state[id] = { selected: null, comment: '' };
    if (![true, false, null].includes(entry.selected)) entry.selected = null;
    if (typeof entry.comment !== 'string') entry.comment = '';
    const area = document.createElement('div'); area.className = 'story-feedback';
    const heart = document.createElement('button'); heart.type = 'button'; heart.className = 'heart';
    function redraw() {
      heart.textContent = entry.selected === true ? '♥ Selected' : entry.selected === false ? '♡ Not selected' : '♡ Not reviewed';
      heart.setAttribute('aria-pressed', String(entry.selected === true));
      heart.setAttribute('aria-label', `${heart.textContent.slice(2)}: ${card.querySelector('h3').textContent}`);
      card.dataset.selection = String(entry.selected);
    }
    heart.addEventListener('click', () => { entry.selected = entry.selected !== true; redraw(); persist(); });
    const reset = document.createElement('button'); reset.type = 'button'; reset.className = 'reset-vote'; reset.textContent = 'Clear choice';
    reset.addEventListener('click', () => { entry.selected = null; redraw(); persist(); });
    const label = document.createElement('label'); label.htmlFor = `comment-${id}`; label.textContent = 'Comment / suggested change';
    const comment = document.createElement('textarea'); comment.id = label.htmlFor; comment.rows = 3; comment.maxLength = 2000; comment.value = entry.comment;
    comment.placeholder = 'What would you keep, change, or replace?';
    comment.addEventListener('input', () => { entry.comment = comment.value; persist(); });
    area.append(heart, reset, label, comment); card.append(area); redraw();
    card.dataset.storyId = id;
  });
  function review() {
    return { schemaVersion: 1, conceptRevision: 'ecb9c3e', catalogRevision: 'replacement-options-r2', reviewer: name.value.trim(), createdAt: new Date().toISOString(), stories: cards.map(card => ({id: card.dataset.storyId, title: card.querySelector('h3').textContent, planStatus: card.dataset.planStatus || 'existing', ...state[card.dataset.storyId]})) };
  }
  panel.querySelector('#download-feedback').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(review(), null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = 'kavero-story-feedback.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = 'Feedback downloaded. Share the file with the book creator to send it.';
  });
  window.kaveroFeedback = { review, panel, status };
})();
