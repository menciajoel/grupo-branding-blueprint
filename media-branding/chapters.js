/* Shared division chapter behaviors. Approved hero choreography lives in motion.js. */
(() => {
  'use strict';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const header=document.querySelector('.division-header');
  const tabs=[...document.querySelectorAll('[data-format]')];
  const panels=[...document.querySelectorAll('[data-format-panel]')];
  const gallery=document.querySelector('.format-visual');
  let selected=0;
  let request=0;
  let imageTransition=null;

  function finishFormat(index) {
    panels.forEach((panel,i)=>{
      panel.hidden=i!==index;
      panel.inert=i!==index;
      panel.setAttribute('aria-hidden',String(i!==index));
      panel.style.removeProperty('clip-path');panel.style.removeProperty('z-index');
      panel.style.removeProperty('opacity');panel.style.removeProperty('transform');
      panel.querySelector('.format-caption')?.style.removeProperty('visibility');
    });
    tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});
    gallery.dataset.activeFormat=String(index);
    gallery.setAttribute('aria-busy','false');
  }
  async function selectFormat(index) {
    const intent=++request;
    const image=panels[index].querySelector('img');
    gallery.setAttribute('aria-busy','true');
    image.loading='eager';
    try {await image.decode();} catch (_) { /* Preserve the previous frame if loading failed. */ }
    if (intent!==request) return;
    if (!image.naturalWidth) {gallery.setAttribute('aria-busy','false');return;}
    imageTransition?.kill();imageTransition=null;
    finishFormat(selected);
    const previous=selected;selected=index;
    tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});
    panels[index].hidden=false;panels[index].inert=false;panels[index].setAttribute('aria-hidden','false');
    panels[previous].inert=previous!==index;panels[previous].setAttribute('aria-hidden',String(previous!==index));
    if (!window.gsap||reduced.matches||previous===index) {finishFormat(index);return;}
    panels[index].style.zIndex='2';
    panels[previous].querySelector('.format-caption').style.visibility='hidden';
    // One cancellable interaction: the decoded next image covers the previous
    // frame progressively. Captions share its transform and timing.
    imageTransition=gsap.timeline({onComplete:()=>{finishFormat(index);imageTransition=null;}})
      .fromTo(panels[index],{opacity:0,y:8},{opacity:1,y:0,duration:.5,ease:'power3.out'},0)
      .fromTo(panels[previous],{opacity:1,y:0},{opacity:0,y:-6,duration:.5,ease:'power2.inOut'},0);
  }
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>selectFormat(index));
    tab.addEventListener('keydown',event=>{
      let target=index;
      if (['ArrowDown','ArrowRight'].includes(event.key)) target=(index+1)%tabs.length;
      else if (['ArrowUp','ArrowLeft'].includes(event.key)) target=(index+tabs.length-1)%tabs.length;
      else if (event.key==='Home') target=0;
      else if (event.key==='End') target=tabs.length-1;
      else return;
      event.preventDefault();tabs[target].focus({preventScroll:true});selectFormat(target);
    });
  });
  finishFormat(0);
  reduced.addEventListener('change',()=>{++request;imageTransition?.kill();imageTransition=null;finishFormat(selected);});

  // Only the new anchors are handled here; the approved hero owns Inicio/S02.
  document.querySelectorAll('[data-section-link]').forEach(link=>{
    if (['#inicio','#que-resolvemos'].includes(link.hash)) return;
    link.addEventListener('click',event=>{
      const target=document.getElementById(link.hash.slice(1));
      if (!target) return;
      event.preventDefault();
      document.querySelector('#division-navigation').removeAttribute('data-open');
      const toggle=document.querySelector('.menu-toggle');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menú');
      window.scrollTo({top:scrollY+target.getBoundingClientRect().top-header.offsetHeight-20,behavior:reduced.matches?'instant':'smooth'});
      const heading=target.querySelector('h2');
      heading?.setAttribute('tabindex','-1');heading?.focus({preventScroll:true});
      history.replaceState(null,'',link.hash);
    });
  });
  const chapters=[...document.querySelectorAll('.extended-page section[data-section]')];
  const scene=document.querySelector('.journey-stage');
  const links=[...document.querySelectorAll('[data-section-link]')];
  let navFrame=0;
  let current='';
  function updateNavigation() {
    navFrame=0;
    let next=scene.dataset.state==='hero'?'inicio':'que-resolvemos';
    const line=header.offsetHeight+innerHeight*.32;
    for (const chapter of chapters) if (chapter.getBoundingClientRect().top<=line) next=chapter.id;
    if (current===next) return;
    current=next;
    header.toggleAttribute('data-editorial',!['inicio','que-resolvemos'].includes(next));
    links.forEach(link=>{if(link.hash===`#${current}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
  }
  function scheduleNavigation() {if(!navFrame)navFrame=requestAnimationFrame(updateNavigation);}
  addEventListener('scroll',scheduleNavigation,{passive:true});
  addEventListener('resize',scheduleNavigation,{passive:true});
  const sceneObserver=new MutationObserver(scheduleNavigation);
  sceneObserver.observe(scene,{attributes:true,attributeFilter:['data-state']});
  updateNavigation();

  if (!window.gsap||!window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const media=gsap.matchMedia();
  media.add({motion:'(prefers-reduced-motion: no-preference)',mobile:'(max-width:700px)',desktop:'(min-width:1101px)'},context=>{
    if (!context.conditions.motion) return;
    const mobile=context.conditions.mobile;
    const distance=mobile?10:24;
    const speed=mobile?.48:.68;
    const entries=[];
    // Entries run in time after crossing the threshold. A paused wheel never
    // strands text at a scrubbed opacity; returning upwards keeps it readable.
    const entry=(scope,id,start,trigger=scope)=>{
      const element=document.querySelector(scope);
      element.dataset.reveal='ready';
      const timeline=gsap.timeline({defaults:{ease:'power3.out'},onStart:()=>{element.dataset.reveal='running';},onComplete:()=>{element.dataset.reveal='complete';},scrollTrigger:{id,trigger,start,toggleActions:'play none none none'}});
      entries.push({element,timeline});
      return timeline;
    };
    const heading=(scope,id,start)=>entry(scope,id,start)
      .fromTo(`${scope} h2`,{y:distance,opacity:0},{y:0,opacity:1,duration:speed},0)
      .fromTo(`${scope} .chapter-prose,${scope}>.chapter-paragraph`,{y:distance*.55,opacity:0},{y:0,opacity:1,duration:speed,stagger:.08},mobile?.1:.18);
    entry('.chapter-index','mb-index','top 86%').fromTo('.chapter-links a',{y:8,opacity:.65},{y:0,opacity:1,duration:.45,stagger:.025});
    heading('.exterior-chapter .chapter-heading','mb-exterior-copy',mobile?'top 76%':'top 72%');
    entry('.exterior-composition','mb-exterior-image',mobile?'top 82%':'top 78%')
      .fromTo('.exterior-primary .photo-shell',{clipPath:`inset(0% ${mobile?35:68}% 0% 0%)`},{clipPath:'inset(0% 0% 0% 0%)',duration:mobile?.65:1,ease:'power3.out'},0)
      .fromTo('.exterior-primary img',{scale:1.025},{scale:1,duration:mobile?.65:1},0)
      .fromTo('.exterior-detail .photo-shell',{clipPath:'inset(32% 0% 0% 0%)'},{clipPath:'inset(0% 0% 0% 0%)',duration:.65},.18);
    entry('.retail-copy','mb-retail-copy',mobile?'top 78%':'top 72%')
      .fromTo('.retail-copy h2',{y:distance*.75,opacity:0},{y:0,opacity:1,duration:speed},.08)
      .fromTo('.retail-copy .chapter-paragraph',{y:distance*.5,opacity:0},{y:0,opacity:1,duration:speed},.2);
    entry('.retail-visuals','mb-retail-image',mobile?'top 82%':'top 76%')
      .fromTo('.retail-primary .photo-shell',{clipPath:`inset(0% 0% 0% ${mobile?18:38}%)`,x:mobile?0:12},{clipPath:'inset(0% 0% 0% 0%)',x:0,duration:mobile?.6:.85},0)
      .fromTo('.retail-detail .photo-shell',{clipPath:'inset(0% 24% 0% 0%)',y:mobile?6:14},{clipPath:'inset(0% 0% 0% 0%)',y:0,duration:.6},.16);
    heading('.formats-chapter .chapter-heading','mb-formats-copy',mobile?'top 78%':'top 72%');
    entry('.format-explorer','mb-formats-gallery',mobile?'top 82%':'top 78%')
      .fromTo('.format-visual',{clipPath:'inset(0% 0% 18% 0%)',y:distance*.5},{clipPath:'inset(0% 0% 0% 0%)',y:0,duration:speed},0);
    entry('.format-tabs','mb-formats-controls',mobile?'top 88%':'top 80%')
      .fromTo('.format-tabs button',{y:mobile?6:14,opacity:0},{y:0,opacity:1,duration:.45,stagger:mobile?.035:.065},0);
    // Coverage alone has continuous depth. No parallax on mobile or tablet.
    if (context.conditions.desktop) gsap.fromTo('.coverage-visual img',{yPercent:-2,scale:1.055},{yPercent:2,scale:1.055,ease:'sine.inOut',scrollTrigger:{id:'mb-coverage-depth',trigger:'.coverage-chapter',start:'top bottom',end:'bottom top',scrub:.6,invalidateOnRefresh:true}});
    heading('.projects-chapter .chapter-heading','mb-projects-copy',mobile?'top 76%':'top 70%');
    entry('.properties-grid','mb-properties',mobile?'top 78%':'top 74%')
      .fromTo('.properties-grid h2',{y:distance*.5,opacity:0},{y:0,opacity:1,duration:.5},0)
      .fromTo('.properties-grid .chapter-paragraph,.property-types',{y:8,opacity:0},{y:0,opacity:1,duration:.5,stagger:.06},.12);
    entry('.pending-resources','mb-properties-resources',mobile?'top 86%':'top 78%')
      .fromTo('.pending-resources li',{y:8,opacity:0},{y:0,opacity:1,duration:.45,stagger:.09},0);
    entry('.closing-content','mb-closing-title',mobile?'top 82%':'top 78%','.closing-content h2')
      .fromTo('.closing-line>span',{y:35,opacity:0},{y:0,opacity:1,duration:mobile?.6:.8,stagger:.09,ease:'power3.out'},0);
    entry('.closing-action','mb-closing-action',mobile?'top 90%':'top 86%')
      .fromTo('.closing-rule',{scaleX:0},{scaleX:1,duration:.6,ease:'power2.out'},0)
      .fromTo('.closing-action>.chapter-paragraph,.closing-action>div',{y:20,opacity:0},{y:0,opacity:1,duration:.6,stagger:.12,ease:'power3.out'},.18);
    if (!mobile) gsap.fromTo('.closing-visual img',{scale:1.06},{scale:1,ease:'power2.out',scrollTrigger:{id:'mb-closing-photo',trigger:'.closing-chapter',start:'top bottom',end:'bottom top',scrub:.6,invalidateOnRefresh:true}});
    const revealFocused=event=>entries.forEach(({element,timeline})=>{if(element.contains(event.target)&&timeline.progress()<1)timeline.progress(1);});
    document.addEventListener('focusin',revealFocused);
    return ()=>{document.removeEventListener('focusin',revealFocused);entries.forEach(({element})=>delete element.dataset.reveal);};
  });
})();
