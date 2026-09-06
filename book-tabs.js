(() => {
 const tabs=[...document.querySelectorAll('.book-tabs [role=tab]')];
 const panels=[...document.querySelectorAll('section.book')];
 function choose(value,updateHash=false){
  tabs.forEach(t=>{const active=t.dataset.books===value;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;});
  panels.forEach(p=>{p.hidden=!(value==='23'?['book-2','book-3'].includes(p.id):p.id==='book-'+value);});
  if(updateHash)history.replaceState(null,'','#book-'+(value==='23'?'2':value));
 }
 tabs.forEach((tab,i)=>{
  tab.addEventListener('click',()=>choose(tab.dataset.books,true));
  tab.addEventListener('keydown',e=>{let j;if(e.key==='ArrowRight')j=(i+1)%tabs.length;else if(e.key==='ArrowLeft')j=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')j=0;else if(e.key==='End')j=tabs.length-1;else return;e.preventDefault();tabs[j].focus();choose(tabs[j].dataset.books,true);});
 });
 const fromHash=()=>choose(['#book-4','#book-5'].includes(location.hash)?location.hash.slice(-1):'23');
 window.addEventListener('hashchange',fromHash);fromHash();
})();
