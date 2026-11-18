/* Division pilot: one reversible composition, native scroll, no routing/backend. */
(() => {
  'use strict';
  const header = document.querySelector('.division-header');
  const menu = document.querySelector('#division-navigation');
  const menuToggle = document.querySelector('.menu-toggle');
  const stage = document.querySelector('.journey-stage');
  const hero = document.querySelector('.hero-copy');
  const resolve = document.querySelector('.resolve-copy');
  const photo = document.querySelector('.journey-photo');
  const body = document.body;
  let journeyTrigger = null;
  let entry = null;
  let hasEntered = false;
  let pendingFocus = null;
  let activeTimeline = null;
  let renderScene = null;
  let viewportKey = `${innerWidth}x${innerHeight}`;
  let readingSnapshot = null;
  let resizeMemory = null;
  let resizeFrame = 0;
  let resizeTimer = 0;
  let restoring = false;

  header.dataset.enhanced = '';
  menuToggle.hidden = false;
  function closeMenu(restoreFocus = false) {
    menu.removeAttribute('data-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label','Abrir menú');
    if (restoreFocus) menuToggle.focus({preventScroll:true});
  }
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');
    menu.toggleAttribute('data-open', open);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.hasAttribute('data-open')) closeMenu(true);
  });
  document.addEventListener('pointerdown', event => {
    if (!header.contains(event.target)) closeMenu();
  });
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('a[href="#inicio"],a[href="#que-resolvemos"],.skip-link').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    closeMenu();
    const destination = link.hash === '#que-resolvemos' ? resolve : document.querySelector('#contenido');
    const y = destination === resolve && journeyTrigger ? journeyTrigger.end : destination.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
    window.scrollTo({top:Math.max(0,y),behavior:reduce.matches?'instant':'smooth'});
    pendingFocus=destination===resolve&&journeyTrigger?resolve:null;
    if (destination===resolve&&!journeyTrigger) resolve.focus({preventScroll:true});
    history.replaceState(null,'',link.hash);
  }));

  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  function rememberReading() {
    if (resizeMemory!==null||`${innerWidth}x${innerHeight}`!==viewportKey||reduce.matches) return;
    if (journeyTrigger&&activeTimeline) {
      readingSnapshot={progress:activeTimeline.progress(),inScene:scrollY>=journeyTrigger.start-2&&scrollY<=journeyTrigger.end+2};
    } else {
      const sectionY=scrollY+resolve.getBoundingClientRect().top;
      readingSnapshot={progress:scrollY+innerHeight*.45>=sectionY?1:0,inScene:scrollY>=0&&stage.getBoundingClientRect().bottom>header.offsetHeight};
    }
  }
  function applyResize() {
    if (resizeMemory===null||restoring||reduce.matches) return;
    restoring=true;
    try {
      ScrollTrigger.refresh();
      if (journeyTrigger&&activeTimeline) {
        window.scrollTo({top:journeyTrigger.start+(journeyTrigger.end-journeyTrigger.start)*resizeMemory,behavior:'instant'});
        ScrollTrigger.update();
        journeyTrigger.getTween()?.progress(1);
        activeTimeline.progress(resizeMemory);
        renderScene?.();
      } else {
        const target=resizeMemory<.26?0:scrollY+resolve.getBoundingClientRect().top-header.offsetHeight-24;
        window.scrollTo({top:Math.max(0,target),behavior:'instant'});
        ScrollTrigger.update();
      }
      stage.dataset.resizeRestored=resizeMemory.toFixed(4);
    } finally {restoring=false;}
  }
  function queueResize() {
    if (resizeMemory===null||resizeFrame||restoring) return;
    resizeFrame=requestAnimationFrame(()=>{resizeFrame=0;applyResize();});
  }
  function rememberResize() {
    const nextKey=`${innerWidth}x${innerHeight}`;
    if (nextKey===viewportKey) return;
    viewportKey=nextKey;
    // Preserve one reading point across the entire resize burst. Intermediate
    // refreshes and media-query rebuilds must never become the new anchor.
    if (resizeMemory===null) {
      if (!readingSnapshot?.inScene) return;
      resizeMemory=readingSnapshot.progress;
    }
    stage.dataset.resizing='true';
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(()=>{
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      resizeFrame=0;applyResize();resizeMemory=null;
      delete stage.dataset.resizing;rememberReading();
    },260);
    queueResize();
  }
  function cancelResize() {
    if (resizeMemory===null) return;
    clearTimeout(resizeTimer);cancelAnimationFrame(resizeFrame);
    resizeFrame=0;resizeMemory=null;delete stage.dataset.resizing;
    rememberReading();
  }
  addEventListener('resize',rememberResize,{capture:true,passive:true});
  addEventListener('scroll',rememberReading,{passive:true});
  ['wheel','touchstart','pointerdown','keydown'].forEach(type=>addEventListener(type,cancelResize,{passive:true}));
  gsap.addEventListener('matchMediaInit',rememberResize);
  ScrollTrigger.addEventListener('refresh',queueResize);
  const mm = gsap.matchMedia();
  mm.add({reduce:'(prefers-reduced-motion: reduce)',desktop:'(min-width:1101px)',mobile:'(max-width:700px)',short:'(max-height:739px)',portrait:'(orientation:portrait)',mobileFits:'(min-height:840px)',tabletFits:'(min-height:900px)',fine:'(hover:hover) and (pointer:fine)'}, context => {
    const {reduce:reduced,desktop,mobile,short,fine,portrait,mobileFits,tabletFits} = context.conditions;
    const pinned = !reduced && !short && (!mobile||mobileFits) && (desktop||mobile||!portrait||tabletFits);
    let pointerMove, pointerLeave;
    let finishedEntry = false;
    stage.dataset.motion = reduced ? 'reduced' : pinned ? 'pinned' : 'flow';
    stage.dataset.state = 'hero';
    const cleanVisibility = () => {
      hero.inert = false; resolve.inert = false;
      hero.removeAttribute('aria-hidden'); resolve.removeAttribute('aria-hidden');
    };
    cleanVisibility();
    if (reduced) {readingSnapshot=null;return () => { delete stage.dataset.motion; };}

    const lines = gsap.utils.toArray('.headline-line>span');
    entry = gsap.timeline({defaults:{ease:'power3.out'},onComplete:() => {finishedEntry=true;hasEntered=true;stage.dataset.entry='complete';}})
      .fromTo(photo,{scale:1.075},{scale:1,duration:1.5,ease:'power2.out'},0)
      .fromTo(lines,{yPercent:110},{yPercent:0,duration:.85,stagger:.09},.08)
      .fromTo('.hero-description',{y:18,opacity:0},{y:0,opacity:1,duration:.6},.7)
      .fromTo('.hero-action',{y:14,opacity:0},{y:0,opacity:1,duration:.5},.94);
    if (hasEntered) entry.progress(1);
    const finishEntry = () => {
      if (!finishedEntry) { entry.progress(1); finishedEntry=true;hasEntered=true; }
    };
    if (pinned) {
      body.classList.add('motion-ready');
      // Each format gets its own mask trajectory; the photograph is never replaced.
      const portraitTablet = !mobile && !desktop && portrait;
      const finalMask = mobile ? 'inset(0% 8% 37% 8%)' : portraitTablet ? 'inset(12% 8% 43% 8%)' : desktop ? 'inset(18% 7% 12% 30%)' : 'inset(20% 5% 12% 44%)';
      const timeline = gsap.timeline({defaults:{ease:'none'},scrollTrigger:{
        id:'division-hero-editorial',trigger:'.division-journey',start:'top top',end:() => `+=${Math.round(innerHeight*(mobile?.76:.9))}`,
        pin:stage,pinSpacing:true,scrub:.45,invalidateOnRefresh:true,anticipatePin:1,
        onUpdate:self => {
          if (self.progress > .001) finishEntry();
        },
        onRefresh:self => {
          stage.dataset.scrollStart = self.start.toFixed(2);
          stage.dataset.scrollEnd = self.end.toFixed(2);
        }
      }});
      // Easing is encoded in these finite scrub intervals, never a competing tween.
      timeline.to(hero,{y:mobile?-38:-64,autoAlpha:0,duration:.21,ease:'power2.in'},.05)
        .fromTo('.photo-depth',{y:0,xPercent:0,yPercent:mobile?-22:portraitTablet?-18:0},{y:0,xPercent:!mobile&&!desktop&&!portrait?26:0,yPercent:()=>mobile?-Math.min(22,Math.max(0,(innerWidth-390)/210*22)):0,duration:.77,ease:'power2.inOut'},.12)
        .to('.photo-window',{clipPath:finalMask,duration:.77,ease:'power2.inOut'},.12)
        .to('.photo-shade',{opacity:mobile?0:portraitTablet?.75:.8,duration:.65,ease:'sine.inOut'},.18)
        .fromTo(resolve,{autoAlpha:0},{autoAlpha:1,duration:.03},.24)
        .fromTo('.resolve-copy .section-label',{y:12,opacity:0},{y:0,opacity:1,duration:.22,ease:'power2.out'},.23)
        .fromTo('.resolve-copy h2',{yPercent:105},{yPercent:0,duration:.31,ease:'power3.out'},.26)
        .fromTo('.resolve-lead',{y:24,opacity:0},{y:0,opacity:1,duration:.3,ease:'power2.out'},.45)
        .fromTo('.resolve-description',{y:18,opacity:0},{y:0,opacity:1,duration:.28,ease:'power2.out'},.52)
        .to({}, {duration:.11},.89);
      journeyTrigger = timeline.scrollTrigger;
      activeTimeline = timeline;
      cleanVisibility();
      resolve.inert=true; resolve.setAttribute('aria-hidden','true');
      // Animation progress is the source of visibility during scrub settling too.
      const synchronize = () => {
        const p=timeline.progress();
        stage.dataset.progress=p.toFixed(4);
        stage.dataset.state=p<.25?'hero':p<.7?'transition':'resolve';
        hero.inert=p>=.26; hero.setAttribute('aria-hidden',String(p>=.26));
        resolve.inert=p<.26; resolve.setAttribute('aria-hidden',String(p<.26));
        if (p>.7&&pendingFocus) {pendingFocus.focus({preventScroll:true});pendingFocus=null;}
        document.querySelector('.scene-current').textContent=p<.5?'01':'02';
        const onward=document.querySelector('.continue-link');
        onward.href=p>.9?'#inicio':'#que-resolvemos';
        onward.querySelector('span').textContent=p>.9?'Volver al inicio':'Qué resolvemos';
        onward.querySelector('img').src=`assets/icons/${p>.9?'arrow-up-right':'arrow-down'}.svg`;
        rememberReading();
      };
      timeline.eventCallback('onUpdate',synchronize);
      renderScene=synchronize;
      synchronize();
    } else {
      // Small heights keep both sections in flow. The same photograph recedes
      // naturally with the hero; the next copy is revealed over its own background.
      gsap.fromTo('.resolve-copy h2,.resolve-paragraphs',{y:22,opacity:.3},{y:0,opacity:1,duration:1,ease:'power2.out',scrollTrigger:{id:'division-editorial-flow',trigger:resolve,start:'top 90%',end:'top 40%',scrub:.3,onEnter:finishEntry}});
    }
    if (desktop && fine) {
      const depth = document.querySelector('.photo-depth');
      const moveX=gsap.quickTo(depth,'x',{duration:.7,ease:'power2.out'});
      const moveY=gsap.quickTo(depth,'y',{duration:.7,ease:'power2.out'});
      pointerMove=event => {moveX((event.clientX/innerWidth-.5)*7);moveY((event.clientY/innerHeight-.5)*5);};
      pointerLeave=() => {moveX(0);moveY(0);};
      stage.addEventListener('pointermove',pointerMove,{passive:true});
      stage.addEventListener('pointerleave',pointerLeave);
    }
    return () => {
      body.classList.remove('motion-ready');
      cleanVisibility();
      stage.removeEventListener('pointermove',pointerMove);
      stage.removeEventListener('pointerleave',pointerLeave);
      journeyTrigger=null;activeTimeline=null;renderScene=null;entry=null;
      const onward=document.querySelector('.continue-link');
      onward.href='#que-resolvemos';onward.querySelector('span').textContent='Qué resolvemos';
      onward.querySelector('img').src='assets/icons/arrow-down.svg';
      document.querySelector('.scene-current').textContent='01';
      delete stage.dataset.progress;delete stage.dataset.scrollStart;delete stage.dataset.scrollEnd;
    };
  });
  // Images and font metrics can finish after defer. Refresh once their sizes settle.
  Promise.all([document.fonts.ready,photo.decode().catch(() => {})]).then(() => ScrollTrigger.refresh());
})();
