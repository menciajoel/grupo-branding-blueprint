/* Shared new-division hero. Derived from approved Media Branding 1be0bcc; original remains immutable. */
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
  const iconBase = "../media-branding/assets/icons/";
  const resolveLabel = body.dataset.resolveLabel;
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
  let rebuildingScene = null;
  let sceneLayoutKey = '';
  let entryResume = 0;
  let resizeIntent = false;
  const clamp = value => Math.max(0,Math.min(1,value));
  // svh stays stable while browser chrome expands/collapses on Android/iOS.
  // It is measured, never inferred from a device's physical screen size.
  const viewportMeasure = document.createElement('div');
  viewportMeasure.setAttribute('aria-hidden','true');
  viewportMeasure.style.cssText='position:fixed;top:0;left:0;width:0;height:100svh;visibility:hidden;pointer-events:none;contain:strict';
  body.append(viewportMeasure);
  const stableHeight = () => viewportMeasure.offsetHeight || document.documentElement.clientHeight;
  const layoutKey = () => `${innerWidth}x${stableHeight()}`;
  viewportKey=layoutKey();
  const adaptiveProperties=['--adaptive-height','--hero-title-size','--hero-description-size','--hero-button-size','--hero-top','--hero-bottom','--resolve-title-size','--resolve-lead-size','--resolve-description-size','--resolve-bottom','--flow-photo-height','--flow-hero-height'];
  function clearAdaptive(target=stage) {
    delete target.dataset.adaptive;delete target.dataset.compact;delete target.dataset.fit;delete target.dataset.motion;
    adaptiveProperties.forEach(property=>target.style.removeProperty(property));
  }
  function measureAdaptive(mobile,portrait,scope={stage,hero,resolve}) {
    const {stage,hero,resolve}=scope;
    clearAdaptive(stage);
    body.classList.add('motion-ready');
    const height=stableHeight(),head=header.offsetHeight;
    const title=hero.querySelector('h1'),description=hero.querySelector('.hero-description'),button=hero.querySelector('.button');
    const resolveTitle=resolve.querySelector('h2'),lead=resolve.querySelector('.resolve-lead'),detail=resolve.querySelector('.resolve-description')||lead;
    const size=element=>parseFloat(getComputedStyle(element).fontSize);
    const base={title:size(title),description:size(description),button:size(button),resolve:size(resolveTitle),lead:size(lead),detail:size(detail)};
    const heroStyle=getComputedStyle(hero);
    const top=parseFloat(heroStyle.paddingTop),bottom=parseFloat(heroStyle.paddingBottom);
    const resolveBottom=mobile?70:portrait?100:80;
    stage.dataset.adaptive='true';
    stage.style.setProperty('--adaptive-height',`${height}px`);
    const set=(name,value)=>stage.style.setProperty(name,`${value}px`);
    set('--hero-top',top);set('--hero-bottom',bottom);set('--resolve-bottom',resolveBottom);
    const typography=factor=>{
      set('--hero-title-size',Math.max(30,base.title*factor));
      set('--hero-description-size',Math.max(16,base.description*factor));
      set('--hero-button-size',Math.max(16,base.button*factor));
      set('--resolve-title-size',Math.max(32,base.resolve*factor));
      set('--resolve-lead-size',Math.max(21,base.lead*factor));
      set('--resolve-description-size',Math.max(16,base.detail*factor));
    };
    typography(1);
    const occupied=()=>[...hero.children].reduce((total,element)=>{
      const css=getComputedStyle(element);return total+element.offsetHeight+parseFloat(css.marginTop)+parseFloat(css.marginBottom);
    },0);
    const heroFits=()=>occupied()+parseFloat(getComputedStyle(hero).paddingTop)+parseFloat(getComputedStyle(hero).paddingBottom)<=height+1;
    const resolveHeight=()=>[...resolve.children].reduce((total,element)=>{
      const css=getComputedStyle(element);return total+element.offsetHeight+parseFloat(css.marginTop)+parseFloat(css.marginBottom);
    },0);
    const resolveFits=()=>resolveHeight()+head+resolveBottom+Math.min(100,height*.16)+20<=height;
    if(!heroFits()||!resolveFits()) {
      stage.dataset.compact='true';
      set('--hero-top',head+20);set('--hero-bottom',mobile?80:88);set('--resolve-bottom',mobile?70:80);
      for(let factor=1;factor>=.639;factor-=.04){typography(factor);if(heroFits()&&resolveFits())break;}
    }
    const fits=heroFits()&&resolveFits();
    stage.dataset.fit=fits?'pinned':'flow';
    const window=stage.querySelector('.photo-window');
    // Layout coordinates deliberately exclude the previous tween's transforms.
    const photoTop=window.offsetTop,photoHeight=window.offsetHeight;
    const copyTop=resolve.offsetTop+resolve.firstElementChild.offsetTop;
    const baseBottom=mobile?37:portrait?43:12;
    const bottomInset=Math.max(baseBottom,100-(copyTop-20-photoTop)/Math.max(1,photoHeight)*100);
    const mask=mobile?`inset(0% 8% ${Math.min(88,bottomInset)}% 8%)`:portrait?`inset(12% 8% ${Math.min(84,bottomInset)}% 8%)`:'inset(20% 5% 12% 44%)';
    set('--flow-photo-height',Math.max(100,Math.min(210,height*.32)));
    set('--flow-hero-height',Math.max(height,occupied()+head+108));
    return {height,fits,mask};
  }

  let referenceMeasurement=null;
  function measureReference(mobile,portrait) {
    const key=layoutKey()+'|'+document.fonts.status;
    if(referenceMeasurement?.key===key)return referenceMeasurement.layout;
    const host=document.createElement('div');
    host.className='motion-ready';host.inert=true;host.setAttribute('aria-hidden','true');
    host.style.cssText=`position:fixed;left:-100000px;top:0;width:${innerWidth}px;height:${stableHeight()}px;visibility:hidden;pointer-events:none;contain:layout style paint;font-family:${getComputedStyle(body).fontFamily}`;
    const reference=jsonSafeReference();
    host.innerHTML='<div class="journey-stage"><div class="photo-window"></div>'+reference+'</div>';
    // Outside .new-division, so only the immutable approved geometry rules apply.
    document.documentElement.append(host);
    try {
      const referenceStage=host.firstElementChild;
      const layout=measureAdaptive(mobile,portrait,{stage:referenceStage,hero:host.querySelector('.hero-copy'),resolve:host.querySelector('.resolve-copy')});
      referenceMeasurement={key,layout};return layout;
    } finally {host.remove();}
  }
  function jsonSafeReference() {
    // Authored at build time from the approved local page, never a URL parameter.
    return JSON.parse(document.getElementById('hero-geometry-reference').textContent);
  }
  function fitResolveToFrame(mask) {
    const inset=mask.match(/[\d.]+/g).map(Number),window=stage.querySelector('.photo-window');
    const copyMin=window.offsetTop+window.offsetHeight*(1-inset[2]/100)+20;
    const title=resolve.querySelector('h2'),lead=resolve.querySelector('.resolve-lead'),detail=resolve.querySelector('.resolve-description');
    const size=element=>parseFloat(getComputedStyle(element).fontSize);
    const initial={title:size(title),lead:size(lead),detail:detail?size(detail):16};
    const fits=()=>resolve.offsetTop+resolve.firstElementChild.offsetTop>=copyMin-1;
    for(let factor=1;factor>=.639&&!fits();factor-=.04) {
      stage.style.setProperty('--resolve-title-size',Math.max(32,initial.title*factor)+'px');
      stage.style.setProperty('--resolve-lead-size',Math.max(21,initial.lead*factor)+'px');
      stage.style.setProperty('--resolve-description-size',Math.max(16,initial.detail*factor)+'px');
    }
    return fits();
  }

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
    if (resizeMemory!==null||layoutKey()!==sceneLayoutKey||reduce.matches||restoring) return;
    const top=scrollY+stage.getBoundingClientRect().top;
    const end=journeyTrigger?.end ?? scrollY+resolve.getBoundingClientRect().top;
    const start=journeyTrigger?.start ?? top;
    const inScene=scrollY>=start-2&&scrollY<=end+2;
    const anchor=(!inScene&&scrollY>end+2?document.elementFromPoint(innerWidth*.35,Math.min(innerHeight-1,header.offsetHeight+24))?.closest('.extended-page section'):null)??document.querySelector('.extended-page');
    readingSnapshot={progress:activeTimeline?activeTimeline.progress():clamp((scrollY-start)/Math.max(1,end-start)),inScene,
      after:scrollY>end+2,anchor,anchorTop:anchor.getBoundingClientRect().top};
  }
  function applyResize(forceMeasure=false) {
    if (resizeMemory===null||restoring||reduce.matches) return;
    restoring=true;
    try {
      if(forceMeasure||layoutKey()!==sceneLayoutKey)rebuildingScene?.();
      ScrollTrigger.refresh();
      if(!resizeIntent) {
        if(resizeMemory.inScene) {
          const start=journeyTrigger?.start??scrollY+stage.getBoundingClientRect().top;
          const end=journeyTrigger?.end??scrollY+resolve.getBoundingClientRect().top;
          window.scrollTo({top:start+(end-start)*resizeMemory.progress,behavior:'instant'});
        } else if(resizeMemory.after) {
          const anchor=resizeMemory.anchor?.isConnected?resizeMemory.anchor:document.querySelector('.extended-page');
          window.scrollTo({top:scrollY+anchor.getBoundingClientRect().top-resizeMemory.anchorTop,behavior:'instant'});
        }
      }
      ScrollTrigger.update();
      journeyTrigger?.getTween()?.progress(1);
      if(resizeMemory.inScene&&activeTimeline&&!resizeIntent)activeTimeline.progress(resizeMemory.progress);
      renderScene?.();
      stage.dataset.resizeRestored=(activeTimeline?.progress()??resizeMemory.progress).toFixed(4);
      sceneLayoutKey=layoutKey();
    } finally {restoring=false;}
  }
  function queueResize() {
    if (resizeMemory===null||resizeFrame||restoring) return;
    resizeFrame=requestAnimationFrame(()=>{resizeFrame=0;applyResize();});
  }
  function rememberResize() {
    const nextKey=layoutKey();
    if(nextKey===viewportKey)return;
    entryResume=entry?.time()??entryResume;
    viewportKey=nextKey;
    if(resizeMemory===null) {
      resizeMemory=readingSnapshot??{progress:activeTimeline?.progress()??0,inScene:scrollY<stage.offsetHeight,after:false,anchorTop:0};
      resizeIntent=false;
    }
    stage.dataset.resizing='true';clearTimeout(resizeTimer);
    resizeTimer=setTimeout(()=>{
      if(resizeFrame)cancelAnimationFrame(resizeFrame);
      resizeFrame=0;applyResize();resizeMemory=null;resizeIntent=false;
      delete stage.dataset.resizing;rememberReading();
    },180);
    queueResize();
  }
  function cancelResize() {
    // A new gesture takes priority over an older resize snapshot. Layout still
    // updates, but no delayed scrollTo can pull the visitor back afterwards.
    if(resizeMemory!==null)resizeIntent=true;
  }
  addEventListener('resize',rememberResize,{capture:true,passive:true});
  addEventListener('scroll',rememberReading,{passive:true});
  ['wheel','touchstart','pointerdown','keydown'].forEach(type=>addEventListener(type,cancelResize,{passive:true}));
  gsap.addEventListener('matchMediaInit',rememberResize);
  ScrollTrigger.addEventListener('refresh',queueResize);
  const mm = gsap.matchMedia();
  mm.add({reduce:'(prefers-reduced-motion: reduce)',desktop:'(min-width:1101px)',mobile:'(max-width:700px)',short:'(min-width:1101px) and (max-height:739px)',portrait:'(orientation:portrait)',fine:'(hover:hover) and (pointer:fine)'}, context => {
    let sceneContext;
    const buildScene=()=>{
    const {reduce:reduced,desktop,mobile,short,fine,portrait} = context.conditions;
    const adaptive=!desktop&&!reduced;
    const layout=adaptive?measureAdaptive(mobile,portrait):null;
    if(layout) {
      const reference=measureReference(mobile,portrait);
      layout.mask=reference.mask;
      // Fit the second scene's copy to the common frame, rather than trimming
      // the photograph differently for every division's paragraph length.
      if(layout.fits&&(mobile||portrait)&&!fitResolveToFrame(layout.mask)) {
        layout.fits=false;stage.dataset.fit='flow';
      }
    }
    const pinned=!reduced&&(adaptive?layout.fits:!short);
    let pointerMove, pointerLeave;
    let finishedEntry = false;
    stage.dataset.motion = reduced ? 'reduced' : pinned ? 'pinned' : adaptive ? 'flow-animated' : 'flow';
    if(!pinned)body.classList.remove('motion-ready');
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
      .fromTo(lines,{y:0,yPercent:110},{y:0,yPercent:0,duration:.85,stagger:.09},.08)
      .fromTo('.hero-description',{y:18,opacity:0},{y:0,opacity:1,duration:.6},.7)
      .fromTo('.hero-action',{y:14,opacity:0},{y:0,opacity:1,duration:.5},.94);
    if (hasEntered) entry.progress(1);
    else if(entryResume)entry.time(entryResume);
    const finishEntry = () => {
      if (!finishedEntry) { entry.progress(1); finishedEntry=true;hasEntered=true; }
    };
    if (pinned || adaptive) {
      if(pinned)body.classList.add('motion-ready');
      // Each format gets its own mask trajectory; the photograph is never replaced.
      const portraitTablet = !mobile && !desktop && portrait;
      const finalMask = adaptive&&pinned ? layout.mask : mobile ? 'inset(0% 8% 37% 8%)' : portraitTablet ? 'inset(12% 8% 43% 8%)' : desktop ? 'inset(18% 7% 12% 30%)' : 'inset(20% 5% 12% 44%)';
      const timeline = gsap.timeline({defaults:{ease:'none'},scrollTrigger:{
        id:'division-hero-editorial',trigger:'.division-journey',start:'top top',end:() => `+=${Math.round(adaptive?(pinned?layout.height*(mobile?.76:.9):hero.offsetHeight):innerHeight*.9)}`,
        pin:pinned?stage:false,pinSpacing:true,scrub:.45,invalidateOnRefresh:true,anticipatePin:1,
        onUpdate:self => {
          if (self.progress > .001) finishEntry();
        },
        onRefresh:self => {
          stage.dataset.scrollStart = self.start.toFixed(2);
          stage.dataset.scrollEnd = self.end.toFixed(2);
        }
      }});
      // Easing is encoded in these finite scrub intervals, never a competing tween.
      timeline.to(hero,{y:!pinned?-12:mobile?-38:-64,autoAlpha:pinned?0:1,duration:.21,ease:'power2.in'},.05)
        .fromTo('.photo-depth',{y:0,xPercent:0,yPercent:mobile?-22:portraitTablet?-18:0},{y:0,xPercent:!mobile&&!desktop&&!portrait?26:0,yPercent:()=>adaptive&&stage.hasAttribute('data-compact')?(mobile?-22:portraitTablet?-18:0):mobile?-Math.min(22,Math.max(0,(innerWidth-390)/210*22)):0,duration:.77,ease:'power2.inOut'},.12)
        .to('.photo-window',{y:adaptive&&!pinned?()=>resolve.offsetTop:0,clipPath:finalMask,duration:.77,ease:'power2.inOut'},.12)
        .to('.photo-shade',{opacity:mobile?0:portraitTablet?.75:.8,duration:.65,ease:'sine.inOut'},.18)
        .fromTo(resolve,{autoAlpha:0},{autoAlpha:1,duration:.03},.24)
        .fromTo('.resolve-copy .section-label',{y:12,opacity:0},{y:0,opacity:1,duration:.22,ease:'power2.out'},.23)
        .fromTo('.resolve-copy h2',{yPercent:105},{yPercent:0,duration:.31,ease:'power3.out'},.26)
        .fromTo('.resolve-lead',{y:24,opacity:0},{y:0,opacity:1,duration:.3,ease:'power2.out'},.45)
        .to({}, {duration:.11},.89);
      const detailTarget=resolve.querySelector('.resolve-description');
      if(detailTarget)timeline.fromTo(detailTarget,{y:18,opacity:0},{y:0,opacity:1,duration:.28,ease:'power2.out'},.52);
      journeyTrigger = timeline.scrollTrigger;
      activeTimeline = timeline;
      cleanVisibility();
      resolve.inert=true; resolve.setAttribute('aria-hidden','true');
      // Animation progress is the source of visibility during scrub settling too.
      const synchronize = () => {
        const p=timeline.progress();
        stage.dataset.progress=p.toFixed(4);
        stage.dataset.state=p<.25?'hero':p<.7?'transition':'resolve';
        hero.inert=pinned&&p>=.26; hero.setAttribute('aria-hidden',String(pinned&&p>=.26));
        resolve.inert=pinned&&p<.26; resolve.setAttribute('aria-hidden',String(pinned&&p<.26));
        if (p>.7&&pendingFocus) {pendingFocus.focus({preventScroll:true});pendingFocus=null;}
        document.querySelector('.scene-current').textContent=p<.5?'01':'02';
        const onward=document.querySelector('.continue-link');
        onward.href=p>.9?'#inicio':'#que-resolvemos';
        onward.querySelector('span').textContent=p>.9?'Volver al inicio':resolveLabel;
        onward.querySelector('img').src=`${iconBase}${p>.9?'arrow-up-right':'arrow-down'}.svg`;
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
      onward.href='#que-resolvemos';onward.querySelector('span').textContent=resolveLabel;
      onward.querySelector('img').src=iconBase+'arrow-down.svg';
      document.querySelector('.scene-current').textContent='01';
      delete stage.dataset.progress;delete stage.dataset.scrollStart;delete stage.dataset.scrollEnd;
      clearAdaptive();
    };
    };
    const rebuild=()=>{
      entryResume=entry?.time()??entryResume;
      sceneContext?.revert();
      sceneContext=gsap.context(buildScene);
      sceneLayoutKey=layoutKey();
      if(resizeMemory?.inScene&&activeTimeline&&!resizeIntent) {
        activeTimeline.progress(resizeMemory.progress);
        renderScene?.();
      }
    };
    rebuild();
    rebuildingScene=()=>{if(!context.conditions.desktop)rebuild();};
    return ()=>{rebuildingScene=null;sceneContext.revert();};
  });
  // Images and font metrics can finish after defer. Refresh once their sizes settle.
  Promise.all([document.fonts.ready,photo.decode().catch(() => {})]).then(() => {
    if(reduce.matches){ScrollTrigger.refresh();return;}
    rememberReading();
    const ownsSnapshot=resizeMemory===null;
    if(ownsSnapshot)resizeMemory=readingSnapshot??{progress:activeTimeline?.progress()??0,inScene:true,after:false,anchorTop:0};
    applyResize(true);
    if(ownsSnapshot){resizeMemory=null;rememberReading();}
  });
})();
