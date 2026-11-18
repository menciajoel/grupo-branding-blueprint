/* A navigable demonstration: fields have no form owner and send stays disabled.
   No fetch, submission endpoint, storage, mail link or success simulation. */
(() => {
  'use strict';
  const owner=document.querySelector('.owner-context');
  // Explicit allowlist: origins never become arbitrary URLs or injected markup.
  const params=new URLSearchParams(location.search);
  const origins={
    'media-branding':{name:'Media Branding',href:'../media-branding/',service:'2'},
    linkbranding:{name:'Linkbranding',href:'../linkbranding/',service:'3'},
    'media-print':{name:'Media Print',href:'../media-print/',service:'4'},
    'grupo-branding':{name:'Grupo Branding',href:'../experimentos/inicio-v01/',service:null}
  };
  const known=key=>Object.prototype.hasOwnProperty.call(origins,key);
  // Preserve already-shared ?servicio=division links, only when origen is absent.
  const requested=params.has('origen')?params.get('origen'):params.get('servicio');
  const key=known(requested)?requested:'grupo-branding';
  const origin=origins[key];
  document.body.dataset.contactOrigin=key;
  document.querySelectorAll('input[name="necesidad"]').forEach(input=>{input.checked=input.value===origin.service;});
  document.querySelectorAll('[data-contact-return]').forEach(link=>{
    link.setAttribute('href',origin.href);
    link.querySelector('[data-contact-return-label]').textContent=origin.name;
  });
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
