/* A navigable demonstration: fields have no form owner and send stays disabled.
   No fetch, submission endpoint, storage, mail link or success simulation. */
(() => {
  'use strict';
  const owner=document.querySelector('.owner-context');
  const updateContext=()=>{owner.hidden=location.hash!=='#predios-privados';};
  addEventListener('hashchange',updateContext);
  updateContext();
  if (!window.gsap) return;
  const media=gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)',()=>{
    const entry=gsap.timeline({defaults:{ease:'power3.out'},onComplete:()=>{document.body.dataset.contactEntry='complete';}})
      .fromTo('.contact-hero h1',{y:18,opacity:0},{y:0,opacity:1,duration:.65},0)
      .fromTo('.contact-introduction',{y:12,opacity:0},{y:0,opacity:1,duration:.55},.12);
    const finishOnFocus=()=>entry.progress(1);
    document.addEventListener('focusin',finishOnFocus);
    return ()=>{document.removeEventListener('focusin',finishOnFocus);delete document.body.dataset.contactEntry;};
  });
})();
