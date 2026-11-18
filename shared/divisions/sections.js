/* New division chapters: time-completed reveals; native scrolling; no extra pin. */
(() => {
  'use strict';
  const header=document.querySelector('.division-header');
  const navigation=document.querySelector('#division-navigation');
  const menu=document.querySelector('.menu-toggle');
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  document.querySelectorAll('[data-section-link]').forEach(link=>{
    if(['#inicio','#que-resolvemos'].includes(link.hash))return;
    link.addEventListener('click',event=>{
      const target=document.getElementById(link.hash.slice(1));if(!target)return;
      event.preventDefault();navigation.removeAttribute('data-open');menu.setAttribute('aria-expanded','false');
      menu.setAttribute('aria-label','Abrir menú');
      scrollTo({top:scrollY+target.getBoundingClientRect().top-header.offsetHeight-20,behavior:reduced.matches?'instant':'smooth'});
      const heading=target.querySelector('h2');heading?.setAttribute('tabindex','-1');heading?.focus({preventScroll:true});
      history.replaceState(null,'',link.hash);
    });
  });
  const scene=document.querySelector('.journey-stage');
  const chapters=[...document.querySelectorAll('.division-section')];
  const links=[...navigation.querySelectorAll('[data-section-link]')];
  let frame=0;
  const update=()=>{
    frame=0;let current=scene.dataset.state==='hero'?'inicio':'que-resolvemos';
    for(const chapter of chapters)if(chapter.getBoundingClientRect().top<header.offsetHeight+innerHeight*.32)current=chapter.id;
    links.forEach(link=>{if(link.hash==='#'+current)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});
  new MutationObserver(schedule).observe(scene,{attributes:true,attributeFilter:['data-state']});update();
  if(!window.gsap||!window.ScrollTrigger)return;
  gsap.registerPlugin(ScrollTrigger);
  const mm=gsap.matchMedia();
  mm.add({motion:'(prefers-reduced-motion:no-preference)',mobile:'(max-width:700px)'},context=>{
    if(!context.conditions.motion)return;
    const mobile=context.conditions.mobile;const entries=[];
    chapters.forEach((section,index)=>{
      const copy=section.querySelector('.section-copy')||section.querySelector('.section-heading')||section.querySelector('.section-inner');
      const title=copy.querySelector('h2');
      const entry=gsap.timeline({defaults:{ease:'power3.out'},onComplete:()=>section.dataset.reveal='complete',scrollTrigger:{id:'division-copy-'+index,trigger:copy,start:section.classList.contains('division-closing')?'top 80%':mobile?'top 79%':'top 76%',toggleActions:'play none none none'}});
      entry.fromTo(title,{clipPath:'inset(0 0 100% 0)',y:20},{clipPath:'inset(0 0 0% 0)',y:0,duration:mobile?.6:.85},0);
      const description=copy.querySelector('.section-description');
      if(description)entry.fromTo(description,{y:12,opacity:0},{y:0,opacity:1,duration:.6},.16);
      const rule=section.querySelector('.editorial-rule');if(rule)entry.fromTo(rule,{scaleX:0},{scaleX:1,duration:.65},.15);
      const action=section.querySelector('.closing-action');if(action)entry.fromTo(action.children,{y:20,opacity:0},{y:0,opacity:1,duration:.6,stagger:.1},.28);
      entries.push({element:section,timeline:entry});
      const photo=section.querySelector('.division-photo:not(.closing-image) .photo-shell');
      if(photo)gsap.fromTo(photo,{clipPath:`inset(0% ${index%2?0:22}% ${index%2?20:0}% 0%)`},{clipPath:'inset(0% 0% 0% 0%)',duration:mobile?.7:1,ease:'power3.out',scrollTrigger:{id:'division-photo-'+index,trigger:photo,start:mobile?'top 85%':'top 82%',toggleActions:'play none none none'}});
    });
    if(!mobile)gsap.fromTo('.closing-image img',{scale:1.06},{scale:1,ease:'none',scrollTrigger:{id:'division-closing-depth',trigger:'.division-closing',start:'top bottom',end:'bottom top',scrub:.6}});
    const focus=event=>entries.forEach(({element,timeline})=>{if(element.contains(event.target))timeline.progress(1);});
    document.addEventListener('focusin',focus);
    return()=>{document.removeEventListener('focusin',focus);chapters.forEach(section=>delete section.dataset.reveal);};
  });
})();
