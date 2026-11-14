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
  const tabs = $$('[data-tab]');
  const panels = $$('[data-panel]');
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

  function facetFocus(animate = true) {
    $$('.facet-photo').forEach(element => {
      const opacity = Number(element.dataset.facet) === selectedDivision ? 1 : .32;
      if (element.closest('.brand-art') && !document.body.classList.contains('desktop-motion')) return;
      if (animate && motionAllowed()) gsap.to(element, {opacity,duration:.35,overwrite:'auto',ease:'power2.out'});
      else element.style.opacity = opacity;
    });
  }

  function selectDivision(index, focus = false) {
    selectedDivision = (index + tabs.length) % tabs.length;
    tabs.forEach((tab,i) => {
      tab.setAttribute('aria-selected',String(i === selectedDivision));
      tab.tabIndex = i === selectedDivision ? 0 : -1;
      panels[i].hidden = i !== selectedDivision;
    });
    facetFocus();
    if (focus) tabs[selectedDivision].focus();
  }
  $('.division-tabs').setAttribute('role','tablist');
  $('.division-tabs').setAttribute('aria-orientation','vertical');
  tabs.forEach((tab,i) => {
    tab.setAttribute('role','tab');
    tab.setAttribute('aria-controls',panels[i].id);
    panels[i].setAttribute('role','tabpanel');
    tab.addEventListener('click',event => {event.preventDefault();selectDivision(i);});
    tab.addEventListener('keydown',event => {
      const keys = {ArrowDown:1,ArrowRight:1,ArrowUp:-1,ArrowLeft:-1};
      if (event.key in keys) {event.preventDefault();selectDivision(selectedDivision+keys[event.key],true);}
      else if (event.key === 'Home' || event.key === 'End') {event.preventDefault();selectDivision(event.key==='Home'?0:tabs.length-1,true);}
    });
  });
  document.body.classList.add('is-interactive');
  selectDivision(0);

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
    const target = document.getElementById(id);
    if (!target) return;
    $$('dialog[open]').forEach(dialog => dialog.close());
    const trigger = hasGSAP ? ScrollTrigger.getById('brand-convergence') : null;
    if (id === 'inicio') scrollTo({top:0,behavior:'instant'});
    else if (id === 'divisiones' && trigger) {
      intro?.progress(1);
      scrollTo({top:trigger.end,behavior:'instant'});
      trigger.animation.progress(1);
      hero.inert=true; divisions.inert=false;
      ScrollTrigger.update();
    } else {
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
    motionMedia=gsap.matchMedia();
    motionMedia.add({wide:'(min-width:1100px) and (min-height:780px)',reduce:'(prefers-reduced-motion:reduce)',all:'(min-width:0px)'},context => {
      const reducedNow=context.conditions.reduce || manualReduced;
      const wide=context.conditions.wide && !reducedNow;
      document.body.classList.toggle('desktop-motion',wide);
      document.body.classList.toggle('mobile-motion',!wide && !reducedNow);
      hero.inert=false;divisions.inert=false;
      const pieces=$$('.piece-stage',art);
      const arrivals=$$('.piece-arrival',art);
      const wipes=$$('.photo-wipe',art);
      const photoGroups=$$('.facet-photo',art);
      const originalViewBox='0 0 221.4 211.53';
      updateToggle();

      if (!reducedNow) {
        const size = () => ({w:innerWidth,h:wide?innerHeight:hero.clientHeight});
        const choreography = {progress:0};
        const easePose=gsap.parseEase('power2.inOut');
        const rigid=(element,state) => element.setAttribute('transform',`translate(${state.x} ${state.y}) scale(${state.scale ?? 1}) rotate(${state.rotation} 110.7 105.765)`);
        const renderPieces=() => {
          pieces.forEach((piece,i) => {
            const p=choreography.progress;
            const start=p<.32?'hero':p<.57?'fan':'center';
            const end=p<.32?'fan':p<.57?'center':'aside';
            const t=easePose(p<.32?p/.32:p<.57?(p-.32)/.25:(p-.57)/.43);
            const a=pose(start,i),b=pose(end,i);
            const state={};
            for (const key of ['x','y','scale','rotation']) state[key]=a[key]+(b[key]-a[key])*t;
            rigid(piece,wide?state:pose('hero',i));
          });
        };
        const pose = (name,i) => {
          const {w,h}=size();
          if (!wide) {
            if(w<=700){const slot=$('.mobile-art-slot');return {x:w*.23,y:-slot.clientHeight*.17,scale:w*.94/221.4,rotation:0};}
            return {x:w*.53,y:h*.35,scale:w*.82/221.4,rotation:0};
          }
          if(name==='hero')return {x:w*.49,y:h*.07,scale:w*.64/221.4,rotation:0};
          if(name==='fan'){
            const offsets=[[-.10,.07,-14],[.08,-.04,14],[.04,.02,-5]][i];
            return {x:w*(.32+offsets[0]),y:h*(.18+offsets[1]),scale:Math.min(w*.45,h*.73)/221.4,rotation:offsets[2]};
          }
          const scale = Math.min(w*(name==='center'?.46:.49),h*(name==='center'?.64:.72))/221.4;
          return {x:name==='center'?(w-221.4*scale)/2:w*.60,y:(h-211.53*scale)/2,scale,rotation:0};
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
          renderPieces();
        };
        prepare();
        gsap.set(photoGroups,{opacity:0});
        gsap.set(wipes,{attr:{width:0}});
        const offsets=[[-25,17,-11],[25,-20,12],[9,24,-6]];
        intro=gsap.timeline({defaults:{ease:'power3.out'},onComplete:() => {scene.dataset.entry='complete';}});
        arrivals.forEach((piece,i) => {
          const state={x:offsets[i][0],y:offsets[i][1],rotation:offsets[i][2]};
          rigid(piece,state);
          intro.to(state,{x:0,y:0,rotation:0,duration:1.15,onUpdate:()=>rigid(piece,state)},i*.08);
        });
        intro.fromTo($$('.word-enter'),{yPercent:112},{yPercent:0,stagger:.07,duration:.85},.08)
          .fromTo($('.hero-dash'),{scaleX:0,transformOrigin:'left'},{scaleX:1,duration:.5},.15);

        if (wide) {
          gsap.set($('.division-copy'),{x:-size().w*.16,clipPath:'inset(0 100% 0 0)'});
          divisions.inert=true;
          const timeline=gsap.timeline({defaults:{ease:'power2.inOut'},scrollTrigger:{id:'brand-convergence',trigger:$('#convergence'),pin:scene,start:'top top',end:()=>`+=${innerHeight*1.25}`,scrub:.65,anticipatePin:1,invalidateOnRefresh:true,
            onUpdate:self => {
              const p=self.animation?.progress() ?? self.progress;
              scene.dataset.progress=p.toFixed(3);
              scene.dataset.phase=p>.96?'divisions':p>.12?'convergence':'hero';
              $('[data-counter]').textContent=p<.3?'01':p<.72?'02':'03';
              hero.inert=p>.28;divisions.inert=p<.80;
            }
          }});
          timeline.fromTo($$('.kinetic-line'),{xPercent:0,rotation:0},{xPercent:-108,rotation:-2.5,stagger:.035,duration:.26,ease:'power2.in'},0)
            .fromTo($('.hero-support'),{x:0,clipPath:'inset(0 0% 0 0)'},{x:-90,clipPath:'inset(0 100% 0 0)',duration:.22,ease:'power2.in'},.03)
            .fromTo($('.hero-dash'),{scaleX:1},{scaleX:0,duration:.16},.12);
          timeline.fromTo(choreography,{progress:0},{progress:1,duration:1,ease:'none',onUpdate:renderPieces},0);
          timeline.fromTo(photoGroups,{opacity:0},{opacity:1,duration:.015},.31)
            .fromTo(wipes,{attr:{width:0}},{attr:{width:(i,element)=>Number(element.dataset.width)},stagger:.035,duration:.34},.32)
            .fromTo($('.division-copy'),{x:()=>-size().w*.16,clipPath:'inset(0 100% 0 0)'},{x:0,clipPath:'inset(0 0% 0 0)',duration:.4},.60);
          // Ticker callbacks report the rendered (scrubbed) state, not only wheel position.
          const sync=() => {
            const p=timeline.progress();
            scene.dataset.progress=p.toFixed(3);
            scene.dataset.phase=p>.96?'divisions':p>.12?'convergence':'hero';
            $('[data-counter]').textContent=p<.3?'01':p<.72?'02':'03';
            hero.inert=p>.28;divisions.inert=p<.8;
          };
          timeline.eventCallback('onUpdate',sync);
          ScrollTrigger.addEventListener('refreshInit',prepare);
        } else {
          const release=gsap.timeline({scrollTrigger:{id:'mobile-convergence',trigger:hero,start:'top top',end:'bottom 20%',scrub:true,invalidateOnRefresh:true}});
          pieces.forEach((piece,i) => {
            const state={progress:0};
            release.fromTo(state,{progress:0},{progress:1,duration:1,onUpdate:()=>{const base=pose('hero',i);rigid(piece,{...base,x:base.x+[-22,20,3][i]*state.progress,y:base.y+[0,-10,-7][i]*state.progress,rotation:[-5,5,0][i]*state.progress});}},0);
          });
          ScrollTrigger.addEventListener('refreshInit',prepare);
          release.to(photoGroups,{opacity:1,duration:.1},.25).fromTo(wipes,{attr:{width:0}},{attr:{width:(i,element)=>Number(element.dataset.width)},duration:.6,stagger:.04},.28);
        }

        // Later content uses one continuous image stage; text is never batch faded in.
        const followSolution=i=>{if(solutionIntentY===null || Math.abs(scrollY-solutionIntentY)>12)selectSolution(i);};
        $$('[data-solution]').forEach((row,i) => ScrollTrigger.create({trigger:row,start:'top 55%',end:'bottom 45%',onEnter:()=>followSolution(i),onEnterBack:()=>followSolution(i)}));
        document.fonts.ready.then(()=>ScrollTrigger.refresh());
        return () => {
          intro?.kill();
          document.body.classList.remove('desktop-motion','mobile-motion');
          hero.inert=false;divisions.inert=false;
          art.setAttribute('viewBox',originalViewBox);art.removeAttribute('style');
          // gsap.context reverts SVG transforms, clip windows and ScrollTriggers.
          ScrollTrigger.removeEventListener('refreshInit',prepare);
          [...pieces,...arrivals].forEach(piece=>piece.removeAttribute('transform'));
        };
      }
      scene.dataset.entry='complete';scene.dataset.phase='static';
      return () => {document.body.classList.remove('desktop-motion','mobile-motion');hero.inert=false;divisions.inert=false;};
    });
  }

  toggle.addEventListener('click',() => {
    const before=scene.dataset.phase;
    manualReduced=!manualReduced;updateToggle();
    if(hasGSAP) gsap.matchMediaRefresh();
    if(before==='divisions') goToSection('divisiones');
    facetFocus(false);
  });
  systemReduced.addEventListener('change',updateToggle);
  updateToggle();
  const initialPreview=new URLSearchParams(location.search).get('vista');
  if(initialPreview) showPreview(initialPreview,false);
  if(location.hash && document.getElementById(location.hash.slice(1))) requestAnimationFrame(()=>goToSection(location.hash.slice(1)));
})();
