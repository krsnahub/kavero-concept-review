(() => {
 const tabs=[...document.querySelectorAll('.book-tabs [role=tab]')];
 const panels=[...document.querySelectorAll('section.book')];
 function choose(value,updateHash=false){
  tabs.forEach(t=>{const active=t.dataset.books===value;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;});
  panels.forEach(p=>{p.hidden=p.id!=='book-'+value;});
  if(updateHash)history.replaceState(null,'','#book-'+value);
 }
 tabs.forEach((tab,i)=>{
  tab.addEventListener('click',()=>choose(tab.dataset.books,true));
  tab.addEventListener('keydown',e=>{let j;if(e.key==='ArrowRight')j=(i+1)%tabs.length;else if(e.key==='ArrowLeft')j=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')j=0;else if(e.key==='End')j=tabs.length-1;else return;e.preventDefault();tabs[j].focus();choose(tabs[j].dataset.books,true);});
 });
 const fromHash=()=>choose(panels.some(p=>'#'+p.id===location.hash)?location.hash.replace('#book-',''):'2');
 window.addEventListener('hashchange',fromHash);fromHash();
})();
