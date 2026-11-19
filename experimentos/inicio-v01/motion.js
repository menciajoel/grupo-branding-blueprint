/* Experimental presentation controller. Editorial data is rendered separately. */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const scene = $('.convergence-scene');
  const hero = $('.hero-surface');
  const divisions = $('.division-surface');
  const art = $('.brand-art');
  const geometry = JSON.parse($('#geometry-data').textContent);
  const destinations = JSON.parse($('#destination-data').textContent);
  const switches = $$('[data-company-switch]');
  const panels = $$('[data-panel]');
  const panelSurface = $('.division-panels');
  const switchSurface = $('.division-switches');
  const story=$('.division-story');
  const storyShell=$('.division-story-shell');
  const artWindow=$('.division-choice-art');
  const introduction=$('.division-introduction');
  const preface=$('.division-preface');
  const systemReduced = matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = $('.motion-toggle');
  let manualReduced = false;
  let selectedDivision = 0;
  let selectedSolution = 0;
  let solutionIntentY = null;
  let motionMedia = null;
  let intro = null;
  let activePreview = null;
  const hasGSAP = Boolean(window.gsap && window.ScrollTrigger);
  const reduced = () => systemReduced.matches || manualReduced;
  const motionAllowed = () => hasGSAP && !reduced();
  const routeURL = slug => `${location.pathname}?vista=${encodeURIComponent(slug)}`;

  const choiceSurface=$('.division-choice-surface');
  const choices=$$('[data-division-choice]');
  const connectionGroups=$$('[data-connection]');
  const exploration={start:.44,end:.57};
  let choiceModeWide=false;
  let choiceModeTablet=false;
  let hoverDivision=-1,focusDivision=-1,choiceCanPreview=false;
  let activeStory=null,pendingChapterFocus=null,panelWidth=0,panelViewportHeight=0;
  let editorialViewport=`${innerWidth}x${innerHeight}`,resizeRestore=null,resizeFrame=null,resizeTimer=null,restoringResize=false,readingSnapshot=null;
  let currentChapter=-1;
  let connectionEnds=[];
  let flowAnchors=[];
  const nativeAnchors=$$('.official-piece',art).map((polygon,i)=>{
    const numbers=polygon.getAttribute('points').trim().split(/[\s,]+/).map(Number);
    const points=[];for(let n=0;n<numbers.length;n+=2)points.push({x:numbers[n],y:numbers[n+1]});
    const edge=(i===0?Math.min:Math.max)(...points.map(point=>point.x));
    // Attach Linkbranding to the upper outer corner of its photographic facet.
    // All anchors are existing official vertices; the mark itself is untouched.
    return points.filter(point=>Math.abs(point.x-edge)<(i===1?2.1:.05)).sort((a,b)=>i===1?a.y-b.y:b.y-a.y)[0];
  });
  const clamp=value=>Math.max(0,Math.min(1,value));
  const nativeProgressFor=trigger=>trigger?clamp((scrollY-trigger.start)/Math.max(1,trigger.end-trigger.start)):0;

  const photoLayers=[$$('.facet-media',art),$$('.facet-media',artWindow)];
  const colorLevel={value:0};
  let colorRequested=-1,colorVisible=-1,colorTween=null,colorRevision=0;
  function renderExplorationColor(){
    const visibleLayers=photoLayers[choiceModeWide || choiceModeTablet?0:1];
    // Restore every other photograph first. Only one official pair can be
    // exposed, including an interrupted handoff or an immediate reduced state.
    photoLayers.flat().forEach(layer=>{layer.style.opacity='1';});
    if(colorVisible>=0)visibleLayers[colorVisible].style.opacity=String(1-colorLevel.value);
  }
  function requestExplorationColor(index,immediate=false){
    if(index===colorRequested && !immediate)return;
    colorRequested=index;
    const revision=++colorRevision;
    colorTween?.kill();colorTween=null;
    if(immediate || !motionAllowed()){
      colorVisible=index;colorLevel.value=index<0?0:1;renderExplorationColor();return;
    }
    const reveal=()=>{
      if(revision!==colorRevision)return;
      colorVisible=colorRequested;colorLevel.value=0;renderExplorationColor();
      if(colorVisible<0)return;
      colorTween=gsap.to(colorLevel,{value:1,duration:.09,ease:'power1.out',
        onUpdate:renderExplorationColor,onComplete:()=>{colorTween=null;}});
    };
    if(colorVisible!==index && colorLevel.value>0){
      // Finish recovering the old photograph before exposing the next color.
      // A new scroll/click cancels this single tween and adopts the latest intent.
      colorTween=gsap.to(colorLevel,{value:0,duration:.07,ease:'power1.in',
        onUpdate:renderExplorationColor,onComplete:reveal});
    }else if(colorVisible===index && index>=0){
      colorTween=gsap.to(colorLevel,{value:1,duration:.09,ease:'power1.out',
        onUpdate:renderExplorationColor,onComplete:()=>{colorTween=null;}});
    }else reveal();
  }
  function syncChoiceButtons(){
    const preview=choiceCanPreview?(focusDivision>=0?focusDivision:hoverDivision):-1;
    choiceSurface.dataset.previewCompany=String(preview);
    choiceSurface.dataset.chapter=String(currentChapter);
    choices.forEach((button,i)=>{
      button.setAttribute('aria-pressed','false');
      button.classList.toggle('is-highlighted',i===preview);
      connectionGroups[i].classList.toggle('is-highlighted',i===preview);
    });
    if(choiceCanPreview)requestExplorationColor(preview);
  }
  function measureChoiceConnections(){
    if(!choiceModeWide || !document.body.classList.contains('is-interactive'))return;
    const box=choiceSurface.getBoundingClientRect();
    if(!box.width || !box.height)return;
    connectionEnds=choices.map((button,i)=>{
      const name=$('.choice-name',button);let rect=name.getBoundingClientRect();
      if(choiceModeWide && i===0 && name.textContent.indexOf(' ')>0){
        const firstLine=document.createRange();
        firstLine.setStart(name.firstChild,0);firstLine.setEnd(name.firstChild,name.textContent.indexOf(' '));
        rect=firstLine.getBoundingClientRect();
      }
      return choiceModeWide?{x:(i===0?rect.right+18:rect.left-18)-box.left,y:rect.top-box.top+parseFloat(getComputedStyle(name).lineHeight)/2}:{x:button.getBoundingClientRect().left-box.left+button.offsetWidth/2,y:button.getBoundingClientRect().top-box.top-16};
    });
    if(!choiceModeWide){
      flowAnchors=$$('.mobile-division-art .official-piece',choiceSurface).map((polygon,i)=>{
        const matrix=polygon.getScreenCTM(),point=nativeAnchors[i];
        if(!matrix)return null;
        return {x:matrix.a*point.x+matrix.c*point.y+matrix.e-box.left,y:matrix.b*point.x+matrix.d*point.y+matrix.f-box.top};
      });
      drawChoiceConnections(1);
    }
  }
  function drawChoiceConnections(progress){
    if(!connectionEnds.length)return;
    const matrix=choiceModeWide?$('.isotype-stage',art).getCTM():null;
    if(choiceModeWide && !matrix)return;
    connectionGroups.forEach((group,i)=>{
      const point=nativeAnchors[i],end=connectionEnds[i];
      const anchor=choiceModeWide?{x:matrix.a*point.x+matrix.c*point.y+matrix.e,y:matrix.b*point.x+matrix.d*point.y+matrix.f}:flowAnchors[i];
      if(!anchor)return;
      const direction=Math.sign(end.x-anchor.x)||1;
      const reach=Math.min(55,Math.abs(end.x-anchor.x)/3);
      const points=choiceModeWide?[anchor,{x:anchor.x+direction*reach,y:anchor.y},{x:end.x-direction*reach,y:end.y},end]:[anchor,{x:anchor.x,y:anchor.y+18},{x:end.x,y:end.y-18},end];
      const length=points.slice(1).reduce((sum,p,n)=>sum+Math.hypot(p.x-points[n].x,p.y-points[n].y),0);
      const line=$('polyline',group);line.setAttribute('points',points.map(p=>`${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' '));
      line.style.strokeDasharray=String(length);line.style.strokeDashoffset=String(length*(1-progress));
      const dot=$('rect',group);dot.setAttribute('x',String(anchor.x-2.5));dot.setAttribute('y',String(anchor.y-2.5));dot.style.opacity=String(progress);
    });
  }
  const smooth=value=>{const p=clamp(value);return p*p*(3-2*p);};
  function rememberEditorialResize(){
    const viewport=`${innerWidth}x${innerHeight}`;
    if(viewport===editorialViewport)return;
    editorialViewport=viewport;
    // Keep one semantic anchor for the entire resize burst. Refresh/reparenting
    // can render intermediate times; those are never a new reading position.
    if(!resizeRestore){
      const state=readingSnapshot;
      if(!state?.inScene || (state.wide && state.time<.44))return;
      const time=state.time,depart=state.wide?.57:.12;
      scene.dataset.resizeMemory=`${time.toFixed(4)}:${state.wide}:${viewport}`;
      if(time>=state.mediaStart)resizeRestore={phase:'chapters',progress:clamp((time-state.mediaStart)/state.segment)};
      else if(time>=depart)resizeRestore={phase:'arrival',progress:clamp((time-depart)/(state.mediaStart-depart))};
      else resizeRestore={phase:'center',progress:clamp(state.wide?(time-.44)/.13:time/.12)};
    }
    clearTimeout(resizeTimer);
    // ScrollTrigger also refreshes after a quiet resize. Commit the snapshot
    // after that measurement, while restoring promptly on the next frame too.
    resizeTimer=setTimeout(()=>{
      if(resizeFrame!==null)cancelAnimationFrame(resizeFrame);
      resizeFrame=null;applyEditorialResize();resizeRestore=null;resizeTimer=null;
      if(activeStory)renderEditorial(activeStory.timeline.time());
    },260);
    restoreEditorialResize();
  }
  function restoreEditorialResize(){
    if(!resizeRestore || resizeFrame!==null || restoringResize)return;
    resizeFrame=requestAnimationFrame(()=>{
      resizeFrame=null;applyEditorialResize();
    });
  }
  function applyEditorialResize(){
    if(!resizeRestore || restoringResize)return;
    const saved=resizeRestore;
    // Reparenting the single introduction changes the mobile pin's document
    // offset. Measure the completed layout before restoring its reading point.
    restoringResize=true;
    try {
    ScrollTrigger.refresh();
    const state=activeStory,trigger=state?.timeline.scrollTrigger;
    if(!trigger)return;
    const depart=state.wide?.57:.12;
    const time=saved.phase==='chapters'?state.mediaStart+saved.progress*state.segment:
      saved.phase==='arrival'?depart+saved.progress*(state.mediaStart-depart):
      state.wide?.44+saved.progress*.13:saved.progress*.12;
    scene.dataset.resizeRestored=`${time.toFixed(4)}:${trigger.start}:${trigger.end}`;
    pendingChapterFocus=null;
    scrollTo({top:trigger.start+(trigger.end-trigger.start)*time/state.duration,behavior:'instant'});
    ScrollTrigger.update();trigger.getTween()?.progress(1);state.timeline.time(time);
    renderEditorial(time);
    } finally {restoringResize=false;}
  }
  function cancelEditorialResize(){
    if(!resizeRestore)return;
    clearTimeout(resizeTimer);resizeTimer=null;
    if(resizeFrame!==null)cancelAnimationFrame(resizeFrame);
    resizeFrame=null;resizeRestore=null;
    if(activeStory)renderEditorial(activeStory.timeline.time());
  }
  function setStoryColor(index,amount){
    colorTween?.kill();colorTween=null;colorRequested=-2;
    colorVisible=index;colorLevel.value=clamp(amount);renderExplorationColor();
  }
  function editorialColor(u){
    if(u<.25)return [0,1];
    if(u<.36)return [0,1-smooth((u-.25)/.11)];
    if(u<.47)return [1,smooth((u-.36)/.11)];
    if(u<.58)return [1,1];
    if(u<.69)return [1,1-smooth((u-.58)/.11)];
    if(u<.80)return [2,smooth((u-.69)/.11)];
    return [2,1];
  }
  function renderChapter(u,index){
    const start=u>=.58?.58:.25;
    const p=clamp((u-start)/.22);
    const handoff=(u>=.25 && u<=.47) || (u>=.58 && u<=.80);
    const entering=u>=(u<.58?.36:.69);
    const local=handoff?clamp(entering?(p-.5)*2:p*2):0;
    // A spatial curve inside the scrubbed clock: accelerate the outgoing
    // identity, then decelerate the incoming one. No independent playback.
    const travel=entering?Math.pow(1-local,3):Math.pow(local,3);
    const identityReveal=entering?1-Math.pow(1-local,3):1-Math.pow(local,3);
    panels.forEach((panel,i)=>{
      // Exclusive ownership, including backwards scroll and interrupted jumps.
      // The paragraph and named CTA stay readable while the logo mask changes;
      // never cross-fade two complete brands in the same column.
      panel.hidden=i!==index;
      panel.style.setProperty('--identity-y',`${handoff?(entering?24:-20)*travel:0}px`);
      panel.style.setProperty('--identity-alpha',String(handoff?.88+.12*identityReveal:1));
      panel.style.setProperty('--identity-crop',`${handoff?(1-identityReveal)*100:0}%`);
      panel.style.setProperty('--body-y',`${handoff?(entering?10:-8)*travel:0}px`);
      panel.style.setProperty('--body-alpha',String(handoff?1-.08*travel:1));
    });
    story.dataset.handoff=handoff?(entering?'entry':'exit'):'rest';
    story.dataset.handoffProgress=handoff?p.toFixed(4):'';
  }
  function measureDivisionPanels(force=false){
    const width=panelSurface.clientWidth;
    if(!width || (!force && Math.abs(width-panelWidth)<1 && panelViewportHeight===innerHeight))return;
    panelWidth=width;panelViewportHeight=innerHeight;
    const heights=panels.map(panel=>{
      const style=panel.getAttribute('style'),hidden=panel.hidden,inert=panel.inert,aria=panel.getAttribute('aria-hidden');
      panel.style.cssText='position:absolute;visibility:hidden;left:0;top:0;width:100%;opacity:1;transform:none;clip-path:none';
      panel.inert=true;panel.setAttribute('aria-hidden','true');panel.hidden=false;
      const height=panel.offsetHeight;panel.hidden=hidden;
      if(style===null)panel.removeAttribute('style');else panel.setAttribute('style',style);
      panel.inert=inert;
      if(aria===null)panel.removeAttribute('aria-hidden');else panel.setAttribute('aria-hidden',aria);
      return height;
    });
    panelSurface.style.minHeight=`${Math.ceil(Math.max(...heights))}px`;
  }
  function renderEditorial(time){
    const state=activeStory;if(!state)return;
    const {wide,mediaStart,segment}=state;
    const u=clamp((time-mediaStart)/segment);
    const reveal=wide?Math.min(clamp((time-.30)/.14),1-clamp((time-.57)/.12)):1-clamp((time-.12)/.10);
    choiceCanPreview=wide?time>=.44-.000001 && time<=.57:time<=.12;
    choiceSurface.style.visibility=reveal>0?'visible':'hidden';
    choiceSurface.inert=reveal<=0;
    if(reveal<=0){hoverDivision=-1;focusDivision=-1;}
    if(wide){
      choices.forEach((button,i)=>button.style.clipPath=`inset(0 ${i===0?0:(1-reveal)*100}% 0 ${i===0?(1-reveal)*100:0}%)`);
      if(reveal>0)drawChoiceConnections(reveal);
    }
    const infoVisible=time>=mediaStart-(wide?.20:.08);
    const next=u<.36?0:u<.69?1:2;
    renderChapter(u,next);
    currentChapter=infoVisible?next:-1;selectedDivision=next;
    divisions.inert=!infoVisible;
    panels.forEach((panel,i)=>{panel.inert=!infoVisible || i!==next;panel.setAttribute('aria-hidden',String(!infoVisible || i!==next));});
    switches.forEach((link,i)=>{link.hidden=i===next;});
    story.dataset.chapter=String(currentChapter);story.dataset.storyTime=time.toFixed(4);
    const trigger=state.timeline.scrollTrigger;
    if(trigger){story.dataset.scrollStart=String(trigger.start);story.dataset.scrollEnd=String(trigger.end);story.dataset.duration=String(state.duration);}
    if(trigger && !resizeRestore && `${innerWidth}x${innerHeight}`===editorialViewport)readingSnapshot={wide,time,mediaStart,segment,start:trigger.start,end:trigger.end,inScene:scrollY>=trigger.start && scrollY<=trigger.end};
    scene.dataset.chapter=String(currentChapter);
    syncChoiceButtons();
    if(!choiceCanPreview){
      const colorStart=wide?.72:.20;
      if(time<colorStart)setStoryColor(-1,0);
      else if(time<mediaStart)setStoryColor(0,smooth((time-colorStart)/(mediaStart-colorStart)));
      else {const [index,amount]=editorialColor(u);setStoryColor(index,amount);}
    }
    if(pendingChapterFocus){
      const nativeY=scrollY;
      if((nativeY-pendingChapterFocus.lastY)*pendingChapterFocus.direction<-.5)pendingChapterFocus=null;
      else {
        pendingChapterFocus.lastY=nativeY;
        if(currentChapter===pendingChapterFocus.index && Math.abs(time-pendingChapterFocus.time)<.035){
          const panel=panels[currentChapter];pendingChapterFocus=null;panel.focus({preventScroll:true});
        }
      }
    }
  }
  function addEditorialChapters(timeline,state){
    activeStory={...state,timeline};
    panels.forEach(panel=>{panel.hidden=false;});
    // The same GSAP clock drives typography, mask and official pair color.
    // Chapter rendering is a pure function of that clock; pin length is intact.
    timeline.to({},{duration:state.duration},0);
  }
  function navigateChapter(index,focus=true){
    cancelEditorialResize();
    if(activeStory?.timeline?.scrollTrigger){
      const state=activeStory,trigger=state.timeline.scrollTrigger;
      const time=state.mediaStart+state.segment*[.12,.53,.90][index];
      const target=trigger.start+(trigger.end-trigger.start)*time/state.duration;
      pendingChapterFocus=focus?{index,time,lastY:scrollY,direction:Math.sign(target-scrollY)||1}:null;
      scrollTo({top:target,behavior:motionAllowed()?'smooth':'instant'});
    }else{
      const panel=panels[index];panel.hidden=false;
      scrollTo({top:panel.getBoundingClientRect().top+scrollY-$('.site-header').offsetHeight-16,behavior:'instant'});
      if(focus)panel.focus({preventScroll:true});
    }
  }
  const canHover=()=>choiceModeWide && matchMedia('(hover:hover) and (pointer:fine)').matches;
  choices.forEach((button,i)=>{
    button.addEventListener('click',()=>navigateChapter(i));
    button.addEventListener('pointerenter',()=>{if(canHover()){hoverDivision=i;syncChoiceButtons();}});
    button.addEventListener('pointerleave',()=>{if(hoverDivision===i){hoverDivision=-1;syncChoiceButtons();}});
    button.addEventListener('focus',()=>{if(button.matches(':focus-visible')){focusDivision=i;syncChoiceButtons();}});
    button.addEventListener('blur',()=>{if(focusDivision===i){focusDivision=-1;syncChoiceButtons();}});
  });
  switches.forEach((link,i)=>link.addEventListener('click',event=>{event.preventDefault();navigateChapter(i);}));
  document.body.classList.add('is-interactive');
  function setupDivisionChoices(wide,staticMode=false,mobile=false){
    choiceModeWide=wide;currentChapter=-1;
    if(staticMode)readingSnapshot=null;
    document.body.classList.toggle('editorial-active',!staticMode);
    document.body.classList.toggle('editorial-static',staticMode);
    document.body.classList.toggle('editorial-flow',!wide && !staticMode);
    document.body.classList.toggle('editorial-mobile',mobile);
    document.body.classList.toggle('editorial-landscape',!wide && !mobile && innerWidth>innerHeight);
    if(mobile)preface.append(introduction);
    choices.forEach(button=>button.style.removeProperty('clip-path'));
    panels.forEach(panel=>{panel.hidden=false;panel.inert=false;panel.removeAttribute('aria-hidden');});
    choiceSurface.inert=false;choiceSurface.style.removeProperty('visibility');
    choiceCanPreview=staticMode;
    let measureFrame=null;
    const resize=new ResizeObserver(()=>{
      if(measureFrame!==null)return;
      measureFrame=requestAnimationFrame(()=>{
        measureFrame=null;measureChoiceConnections();if(!staticMode)measureDivisionPanels();
      });
    });
    resize.observe(panelSurface);resize.observe(story);measureChoiceConnections();
    if(!staticMode)measureDivisionPanels(true);else panelSurface.style.removeProperty('min-height');
    syncChoiceButtons();
    return ()=>{
      resize.disconnect();if(measureFrame!==null)cancelAnimationFrame(measureFrame);
      activeStory=null;pendingChapterFocus=null;choiceCanPreview=false;
      hoverDivision=-1;focusDivision=-1;requestExplorationColor(-1,true);
      if(introduction.parentElement===preface)$('.division-copy').prepend(introduction);
      document.body.classList.remove('editorial-active','editorial-static','editorial-flow','editorial-mobile','editorial-landscape');
      choiceSurface.inert=false;choiceSurface.style.removeProperty('visibility');
      choices.forEach(button=>button.style.removeProperty('clip-path'));
      panels.forEach(panel=>{
        panel.hidden=false;panel.inert=false;panel.removeAttribute('aria-hidden');
        ['--identity-y','--identity-alpha','--identity-crop','--body-y','--body-alpha'].forEach(property=>panel.style.removeProperty(property));
      });
      divisions.inert=false;
    };
  }
  function setupFlowEditorial(){
    const mediaStart=.32,segment=.94,duration=mediaStart+segment;
    const metrics={scale:1,y:0};
    const prepare=()=>{
      const header=$('.site-header').offsetHeight;
      story.style.setProperty('--story-header',`${header}px`);
      const height=story.clientHeight,mobile=innerWidth<=700,landscape=!mobile && innerWidth>innerHeight;
      const gap=mobile?(innerHeight<=700?20:30):landscape?30:64;
      const top=mobile?20:landscape?32:70;
      const labels=$('.division-choices').offsetHeight;
      const preferred=mobile?Math.min(innerHeight<=700?190:290,height*.38):landscape?Math.min(innerHeight*.42,340):Math.min(innerWidth*.586,650)*211.53/221.4;
      const initial=Math.max(100,Math.min(preferred,height-top-gap-labels-16));
      story.style.setProperty('--art-height',`${initial}px`);story.style.setProperty('--art-width',`${initial*221.4/211.53}px`);
      story.style.setProperty('--art-top',`${top}px`);story.style.setProperty('--choice-top',`${top+initial+gap}px`);
      measureDivisionPanels(true);
      // Intrinsic content, independent of the scene's remaining grid height.
      // Measuring the stretched grid here would feed its old art position back
      // into the new one on each refresh/rotation.
      const introHeight=introduction.offsetHeight;
      const chapterHeight=parseFloat(panelSurface.style.minHeight)||0;
      const rowGap=parseFloat(getComputedStyle($('.division-copy')).rowGap)||0;
      const companyHeight=chapterHeight+switchSurface.offsetHeight+rowGap;
      const infoHeight=mobile?companyHeight:landscape?Math.max(introHeight,companyHeight):introHeight+companyHeight+rowGap;
      const target=Math.max(90,Math.min(mobile?190:landscape?190:280,height*(mobile?.27:.30),height-infoHeight-56));
      metrics.scale=target/initial;metrics.y=12-top;
      story.style.setProperty('--info-top',`${12+target+20}px`);
    };
    prepare();
    gsap.set(artWindow,{xPercent:-50,transformOrigin:'50% 0%'});
    let timeline;
    timeline=gsap.timeline({scrollTrigger:{id:'division-editorial',trigger:storyShell,pin:story,
      start:()=>`top top+=${$('.site-header').offsetHeight}`,
      end:()=>`+=${Math.max(420,Math.min(760,innerHeight*.78))*duration}`,
      scrub:.4,anticipatePin:1,invalidateOnRefresh:true,onRefresh:()=>{if(timeline)renderEditorial(timeline.time());}
    }});
    timeline.fromTo(artWindow,{scale:1,y:0},{scale:()=>metrics.scale,y:()=>metrics.y,duration:.20,ease:'power2.inOut'},.12)
      .fromTo($('.division-choices'),{opacity:1,y:0},{opacity:0,y:-12,duration:.10,ease:'none'},.12)
      .fromTo(divisions,{autoAlpha:0,y:24},{autoAlpha:1,y:0,duration:.12,ease:'power2.out'},.20);
    addEditorialChapters(timeline,{wide:false,mediaStart,segment,duration});
    timeline.eventCallback('onUpdate',()=>renderEditorial(timeline.time()));
    ScrollTrigger.addEventListener('refreshInit',prepare);
    renderEditorial(timeline.time());
    return ()=>{ScrollTrigger.removeEventListener('refreshInit',prepare);story.removeAttribute('style');};
  }

  function selectSolution(index, animate = true) {
    if (animate && selectedSolution === index) return;
    const previous = selectedSolution;
    selectedSolution = index;
    $$('[data-solution-select]').forEach((button,i) => button.setAttribute('aria-pressed',String(i===index)));
    $$('[data-solution]').forEach((row,i) => row.classList.toggle('is-active',i===index));
    $$('[data-solution-photo]').forEach((photo,i) => {
      photo.setAttribute('aria-hidden',String(i!==index));
      if (i===index) photo.style.zIndex = '2';
      else photo.style.zIndex = i===previous ? '1' : '0';
      if (motionAllowed() && animate && i===index) {
        gsap.fromTo(photo,{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0% 0)',duration:.65,ease:'power3.inOut',overwrite:true});
      } else photo.style.clipPath = 'inset(0 0 0 0)';
    });
  }
  $$('[data-solution]').forEach((row,i) => {
    const choose=()=>{solutionIntentY=scrollY;selectSolution(i);};
    row.addEventListener('pointerenter',choose);
    row.addEventListener('focusin',choose);
    row.addEventListener('click',choose);
  });
  selectSolution(0,false);

  function openDialog(dialog) {
    if (dialog.open) return;
    pendingChapterFocus=null;
    $$('dialog[open]').forEach(open => open.close());
    dialog.showModal();
  }
  $$('[data-close]').forEach(button => button.addEventListener('click',() => button.closest('dialog').close()));
  $$('dialog').forEach(dialog => dialog.addEventListener('click',event => {
    if (event.target !== dialog) return;
    const r=dialog.getBoundingClientRect();
    if(event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom) dialog.close();
  }));
  $('.menu-toggle').addEventListener('click',() => openDialog($('#menu-dialog')));
  $$('[data-credits]').forEach(button => button.addEventListener('click',() => openDialog($('#credits-dialog'))));

  function goToSection(id, focus = false) {
    cancelEditorialResize();
    const target = document.getElementById(id);
    if (!target) return;
    $$('dialog[open]').forEach(dialog => dialog.close());
    pendingChapterFocus=null;
    if(id==='divisiones'){
      intro?.progress(1);navigateChapter(0,focus);
      history.replaceState(null,'',`${location.pathname}#divisiones`);return;
    }
    if (id === 'inicio') scrollTo({top:0,behavior:'instant'});
    else {
      const y=target.getBoundingClientRect().top+scrollY-100;
      scrollTo({top:Math.max(0,y),behavior:'instant'});
    }
    history.replaceState(null,'',`${location.pathname}#${id}`);
    if (focus) {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex','-1');
      target.focus({preventScroll:true});
    }
  }
  $$('[data-scroll]').forEach(link => link.addEventListener('click',event => {
    event.preventDefault();goToSection(link.getAttribute('href').slice(1),true);
  }));

  function paragraph(text, cls = '') {
    const element=document.createElement('p');element.textContent=text;
    if (cls) element.className=cls;
    return element;
  }
  function showPreview(slug, updateURL = true) {
    const item=destinations[slug];
    if (!item) return;
    activePreview=slug;
    $('#preview-title').textContent=item.headline;
    $('#preview-path').textContent=item.route;
    $('#preview-label').textContent=item.evidence ? 'CASO DOCUMENTADO' : 'VISTA DE DESTINO';
    const body=$('#preview-body');body.replaceChildren(paragraph(item.body));
    if (item.execution) body.append(paragraph(item.execution));
    if (item.testimonial) {
      const quote=document.createElement('blockquote');quote.textContent=`“${item.testimonial.quote}”`;
      const cite=document.createElement('cite');cite.textContent=item.testimonial.attribution;
      quote.append(cite);body.append(quote);
    }
    if (item.evidence) body.append(paragraph(`Evidencia fotográfica documentada: ${item.evidence.source} · página ${item.evidence.page}. Fotografías por incorporar al sitio.`,'evidence-source'));
    $('#preview-note').textContent=item.evidence ? 'Esta ficha utiliza el material documentado. No se muestran imágenes de stock como evidencia del proyecto.' : 'La página completa queda fuera del alcance de este prototipo de Inicio.';
    document.dispatchEvent(new CustomEvent('project-preview-render',{detail:{slug}}));
    if (updateURL) history.pushState({vista:slug},'',routeURL(slug));
    openDialog($('#preview-dialog'));
  }
  $$('[data-preview]').forEach(link => link.addEventListener('click',event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();showPreview(link.dataset.preview);
  }));
  $('#preview-dialog').addEventListener('close',() => {
    activePreview=null;
    if (new URLSearchParams(location.search).has('vista')) history.replaceState(null,'',location.pathname);
  });
  addEventListener('popstate',() => {
    const slug=new URLSearchParams(location.search).get('vista');
    if(slug) showPreview(slug,false);
    else if($('#preview-dialog').open) $('#preview-dialog').close();
  });

  $('.newsletter-form').addEventListener('submit',event => {
    event.preventDefault();
    const form=event.currentTarget;
    const error=$('.form-error',form);
    if (!form.checkValidity()) {error.hidden=false;form.reportValidity();return;}
    error.hidden=true;
    openDialog($('#newsletter-dialog'));
    form.reset();
  });

  function updateToggle() {
    toggle.hidden = !hasGSAP || systemReduced.matches;
    toggle.setAttribute('aria-pressed',String(manualReduced));
    toggle.setAttribute('aria-label',manualReduced?'Activar movimiento':'Reducir movimiento');
    $('.ui-icon',toggle).src=`assets/icons/${manualReduced?'play':'pause'}.svg`;
    document.body.classList.toggle('manual-reduced',manualReduced);
  }

  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ignoreMobileResize:true});
    // Preserve the reading point only for a viewport change inside this scene.
    // Native scroll elsewhere, navigation, and motion preferences are unaffected.
    addEventListener('resize',rememberEditorialResize,{passive:true,capture:true});
    // Real navigation intent wins over a pending resize restoration. No event
    // is cancelled and native wheel, touch and keyboard scrolling stay intact.
    ['wheel','touchstart','pointerdown','keydown'].forEach(type=>addEventListener(type,cancelEditorialResize,{passive:true}));
    addEventListener('scroll',()=>{
      if(readingSnapshot && !resizeRestore && `${innerWidth}x${innerHeight}`===editorialViewport)
        readingSnapshot.inScene=scrollY>=readingSnapshot.start && scrollY<=readingSnapshot.end;
    },{passive:true});
    gsap.addEventListener('matchMediaInit',rememberEditorialResize);
    ScrollTrigger.addEventListener('refresh',restoreEditorialResize);
    motionMedia=gsap.matchMedia();
    motionMedia.add({wide:'(min-width:1100px) and (min-height:780px)',tablet:'(min-width:701px) and (max-width:1199px), (min-width:1200px) and (max-width:1366px) and (hover:none) and (pointer:coarse)',mobile:'(max-width:700px)',landscape:'(orientation:landscape)',reduce:'(prefers-reduced-motion:reduce)',all:'(min-width:0px)'},context => {
      const reducedNow=context.conditions.reduce || manualReduced;
      const mobile=context.conditions.mobile;
      const tablet=context.conditions.tablet || (!context.conditions.wide && !mobile);
      const staticMode=reducedNow || innerHeight-$('.site-header').offsetHeight<380;
      const wide=context.conditions.wide && !reducedNow && !tablet;
      document.body.classList.toggle('desktop-motion',wide);
      document.body.classList.toggle('mobile-motion',!wide && !reducedNow && !tablet);
      document.body.classList.toggle('tablet-experience',tablet);
      choiceModeTablet=tablet;
      hero.inert=false;divisions.inert=false;
      const stage=$('.isotype-stage',art);
      const wipes=$$('.photo-wipe',art);
      const photoGroups=$$('.facet-photo',art);
      const originalViewBox='0 0 221.4 211.53';
      if(tablet)$('.division-choice-art').append(art);
      updateToggle();
      const disposeDivisionChoices=setupDivisionChoices(wide,staticMode,mobile);
      const disposeFlowEditorial=!wide && !staticMode?setupFlowEditorial():()=>{};

      if(tablet){
        // One symbol owns the entire tablet journey. Its clipped flow window
        // sits below the copy, then becomes the centered selection artwork.
        // There is no lateral C pose, duplicate artwork or pinned scroll here.
        art.setAttribute('viewBox',originalViewBox);
        scene.dataset.phase=reducedNow?'static':'hero';
        const frame={scale:1.45,rotation:0};
        const render=()=>stage.setAttribute('transform',`translate(${(1-frame.scale)*110.7} ${(1-frame.scale)*105.765}) scale(${frame.scale}) rotate(${frame.rotation} 110.7 105.765)`);
        if(!reducedNow){
          render();gsap.set(photoGroups,{opacity:0});gsap.set(wipes,{attr:{width:0}});
          intro=gsap.timeline({defaults:{ease:'power3.out'},onComplete:()=>{scene.dataset.entry='complete';}});
          intro.fromTo($$('.word-enter'),{yPercent:112},{yPercent:0,stagger:.07,duration:.85},.08)
            .fromTo($('.hero-dash'),{scaleX:0,transformOrigin:'left'},{scaleX:1,duration:.5},.15);
          let journey;
          journey=gsap.timeline({defaults:{ease:'power2.inOut'},scrollTrigger:{
            id:'tablet-convergence',trigger:storyShell,
            start:()=>Math.max(0,storyShell.getBoundingClientRect().top+scrollY-innerHeight*.9),
            end:()=>Math.max(1,storyShell.getBoundingClientRect().top+scrollY-$('.site-header').offsetHeight-70),
            scrub:true,invalidateOnRefresh:true,
            onRefresh:()=>render()
          },onUpdate:()=>{const p=journey?.progress() ?? 0;render();scene.dataset.tabletProgress=p.toFixed(3);scene.dataset.phase=p===0?'hero':p<1?'convergence':'selection';}});
          journey.addLabel('A',0).addLabel('B',1)
            .fromTo(frame,{scale:1.45,rotation:0},{scale:1,rotation:360,duration:1},0)
            .fromTo(photoGroups,{opacity:0},{opacity:1,duration:.015},.42)
            .fromTo(wipes,{attr:{width:0}},{attr:{width:(i,element)=>Number(element.dataset.width)},stagger:.035,duration:.28},.47);
          const followSolution=i=>{if(solutionIntentY===null || Math.abs(scrollY-solutionIntentY)>12)selectSolution(i);};
          $$('[data-solution]').forEach((row,i)=>ScrollTrigger.create({trigger:row,start:'top 55%',end:'bottom 45%',onEnter:()=>followSolution(i),onEnterBack:()=>followSolution(i)}));
        }else{
          stage.removeAttribute('transform');scene.dataset.entry='complete';scene.dataset.tabletProgress='1.000';
        }
        document.fonts.ready.then(()=>ScrollTrigger.refresh());
        return ()=>{
          disposeFlowEditorial();disposeDivisionChoices();intro?.kill();choiceModeTablet=false;
          hero.append(art);art.setAttribute('viewBox',originalViewBox);art.removeAttribute('style');stage.removeAttribute('transform');
          document.body.classList.remove('tablet-experience');
          delete scene.dataset.tabletProgress;
        };
      }

      if (!reducedNow) {
        const size = () => ({w:innerWidth,h:wide?innerHeight:hero.clientHeight});
        const rigid=(element,state) => element.setAttribute('transform',`translate(${state.x} ${state.y}) scale(${state.scale}) rotate(${state.rotation} 110.7 105.765)`);
        let transition=null;
        const pose = name => {
          const {w,h}=size();
          if(!wide && w<=700){
            const slot=$('.mobile-art-slot');
            if(name==='A')return {x:w*.23,y:-slot.clientHeight*.17,scale:w*.94/221.4};
            const scale=slot.clientHeight*.94/211.53;
            return {x:(w-221.4*scale)/2,y:(slot.clientHeight-211.53*scale)/2,scale};
          }
          if(name==='A')return wide?{x:w*.49,y:h*.07,scale:w*.64/221.4}:{x:w*.53,y:h*.35,scale:w*.82/221.4};
          // B restores the exact centered pose from the published transition.
          // C preserves its approved final position beside the divisions.
          const scale=Math.min(w*(name==='B'?.46:.49),h*(name==='B'?.64:.72))/221.4;
          return {x:name==='B'?(w-221.4*scale)/2:w*.60,y:(h-211.53*scale)/2,scale};
        };
        const timing=wide?{B:.44,leaveB:.57,C:1}:{B:.20,leaveB:.32,C:.67};
        const frame={...pose('A')};
        const turn={rotation:0};
        const renderIsotype = () => {
          const time=transition?.time() ?? 0;
          const named=time<.00001?'A':time>=timing.C-.000001?'C':time>=timing.B-.000001 && time<=timing.leaveB+.000001?'B':null;
          // Keep the named poses numerically exact, independent of tween rounding.
          rigid(stage,named?{...pose(named),rotation:named==='A'?0:360}:{...frame,rotation:turn.rotation});
        };
        const varsFor = name => Object.fromEntries(['x','y','scale'].map(key=>[key,()=>pose(name)[key]]));
        const choreograph = timeline => {
          const {B:arrive,leaveB:depart,C:finish}=timing;
          timeline.addLabel('A',0).addLabel('B',arrive).addLabel('salida-B',depart).addLabel('C',finish)
            .fromTo(frame,varsFor('A'),{...varsFor('B'),duration:arrive,ease:'power2.inOut'},0)
            // A numeric proxy preserves the accumulated turn: no shortest-angle interpolation.
            .fromTo(turn,{rotation:0},{rotation:360,duration:arrive,ease:'power2.inOut'},0)
            .fromTo(frame,varsFor('B'),{...varsFor('C'),duration:finish-depart,ease:'power2.inOut',immediateRender:false},depart);
          // Between B and salida-B, native scroll keeps the whole symbol centered.
          // No pause, scroll interception, or transforms on individual pieces.
        };
        const prepare = () => {
          const {w,h}=size();
          if(wide){art.setAttribute('viewBox',`0 0 ${w} ${h}`);}
          else if(w<=700){
            const slot=$('.mobile-art-slot');
            art.style.top=`${slot.getBoundingClientRect().top-scene.getBoundingClientRect().top}px`;
            art.style.left='0';art.style.width='100%';art.style.height=`${slot.clientHeight}px`;
            art.setAttribute('viewBox',`0 0 ${w} ${slot.clientHeight}`);
          }else{
            art.style.top='0';art.style.left='0';art.style.width='100%';art.style.height=`${h}px`;
            art.setAttribute('viewBox',`0 0 ${w} ${h}`);
          }
          renderIsotype();
          measureChoiceConnections();
        };
        prepare();
        gsap.set(photoGroups,{opacity:0});
        gsap.set(wipes,{attr:{width:0}});
        // Keep the symbol united from the first frame; typography retains its timing.
        intro=gsap.timeline({defaults:{ease:'power3.out'},onComplete:() => {scene.dataset.entry='complete';}});
        intro.fromTo($$('.word-enter'),{yPercent:112},{yPercent:0,stagger:.07,duration:.85},.08)
          .fromTo($('.hero-dash'),{scaleX:0,transformOrigin:'left'},{scaleX:1,duration:.5},.15);

        if (wide) {
          gsap.set($('.division-copy'),{x:-size().w*.16,clipPath:'inset(0 100% 0 0)'});
          divisions.inert=true;
          const timeline=transition=gsap.timeline({defaults:{ease:'power2.inOut'},scrollTrigger:{id:'brand-convergence',trigger:$('#convergence'),pin:scene,start:'top top',end:()=>`+=${innerHeight*1.25*1.72}`,scrub:.65,anticipatePin:1,invalidateOnRefresh:true,
            onUpdate:self => {
              const p=self.animation?.time() ?? self.progress*1.72;
              scene.dataset.progress=p.toFixed(3);
              scene.dataset.phase=p>.96?'divisions':p>.12?'convergence':'hero';
              $('[data-counter]').textContent=p<.3?'01':p<.72?'02':'03';
              hero.inert=p>.28;divisions.inert=p<.80;
            },
            onRefresh:()=>{renderIsotype();if(transition){measureChoiceConnections();renderEditorial(transition.time());}}
          }});
          timeline.fromTo($$('.kinetic-line'),{xPercent:0,rotation:0},{xPercent:-108,rotation:-2.5,stagger:.035,duration:.26,ease:'power2.in'},0)
            .fromTo($('.hero-support'),{x:0,clipPath:'inset(0 0% 0 0)'},{x:-90,clipPath:'inset(0 100% 0 0)',duration:.22,ease:'power2.in'},.03)
            .fromTo($('.hero-dash'),{scaleX:1},{scaleX:0,duration:.16},.12);
          choreograph(timeline);
          timeline.fromTo(photoGroups,{opacity:0},{opacity:1,duration:.015},.20)
            .fromTo(wipes,{attr:{width:0}},{attr:{width:(i,element)=>Number(element.dataset.width)},stagger:.035,duration:.15},.22)
            .fromTo($('.division-copy'),{x:()=>-size().w*.16,clipPath:'inset(0 100% 0 0)'},{x:0,clipPath:'inset(0 0% 0 0)',duration:.4},.60);
          addEditorialChapters(timeline,{wide:true,mediaStart:1,segment:.72,duration:1.72});
          // Ticker callbacks report the rendered (scrubbed) state, not only wheel position.
          const sync=() => {
            const p=timeline.time();
            renderIsotype();
            scene.dataset.isotypeState=p<.44?'A-B':p<=.57?'B':p<1?'B-C':'C';
            scene.dataset.progress=p.toFixed(3);
            scene.dataset.phase=p>.96?'divisions':p>.12?'convergence':'hero';
            $('[data-counter]').textContent=p<.3?'01':p<.72?'02':'03';
            hero.inert=p>.28;divisions.inert=p<.8;
            renderEditorial(p);
          };
          timeline.eventCallback('onUpdate',sync);
          ScrollTrigger.addEventListener('refreshInit',prepare);
        } else {
          const release=transition=gsap.timeline({scrollTrigger:{id:'mobile-convergence',trigger:hero,start:'top top',end:'bottom 20%',scrub:true,invalidateOnRefresh:true,onRefresh:renderIsotype}});
          // Mobile has the same three poses, timed inside its unpinned art window.
          choreograph(release);
          release.to({},{duration:1},0)
            .fromTo(photoGroups,{opacity:0},{opacity:1,duration:.015},.06)
            .fromTo(wipes,{attr:{width:0}},{attr:{width:(i,element)=>Number(element.dataset.width)},duration:.09,stagger:.015},.08);
          release.eventCallback('onUpdate',renderIsotype);
          ScrollTrigger.addEventListener('refreshInit',prepare);
        }

        // Later content uses one continuous image stage; text is never batch faded in.
        const followSolution=i=>{if(solutionIntentY===null || Math.abs(scrollY-solutionIntentY)>12)selectSolution(i);};
        $$('[data-solution]').forEach((row,i) => ScrollTrigger.create({trigger:row,start:'top 55%',end:'bottom 45%',onEnter:()=>followSolution(i),onEnterBack:()=>followSolution(i)}));
        document.fonts.ready.then(()=>ScrollTrigger.refresh());
        return () => {
          disposeFlowEditorial();disposeDivisionChoices();
          intro?.kill();
          document.body.classList.remove('desktop-motion','mobile-motion');
          hero.inert=false;divisions.inert=false;
          art.setAttribute('viewBox',originalViewBox);art.removeAttribute('style');
          // gsap.context reverts SVG transforms, clip windows and ScrollTriggers.
          ScrollTrigger.removeEventListener('refreshInit',prepare);
          stage.removeAttribute('transform');
        };
      }
      scene.dataset.entry='complete';scene.dataset.phase='static';
      return () => {disposeFlowEditorial();disposeDivisionChoices();document.body.classList.remove('desktop-motion','mobile-motion');hero.inert=false;divisions.inert=false;};
    });
  }else{setupDivisionChoices(false,true,innerWidth<=700);}
  document.fonts.ready.then(measureChoiceConnections);

  toggle.addEventListener('click',() => {
    const before=scene.dataset.phase;
    manualReduced=!manualReduced;updateToggle();
    if(hasGSAP) gsap.matchMediaRefresh();
    if(before==='divisions') goToSection('divisiones');
  });
  systemReduced.addEventListener('change',updateToggle);
  updateToggle();
  const initialPreview=new URLSearchParams(location.search).get('vista');
  if(initialPreview) showPreview(initialPreview,false);
  if(location.hash && document.getElementById(location.hash.slice(1))) requestAnimationFrame(()=>goToSection(location.hash.slice(1)));
})();
