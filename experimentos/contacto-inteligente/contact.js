/* Isolated local demonstration. No endpoint, fetch, persistence or success claim. */
(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const categories = {
    'media-branding': {name:'Media Branding', color:'#2e70b4', icon:'assets/media-branding-isotipo.svg', question:'¿Dónde te gustaría que tu marca tuviera presencia?'},
    linkbranding: {name:'Linkbranding', color:'#86be3a', icon:'assets/linkbranding-isotipo.svg', question:'¿Qué experiencia te gustaría crear?'},
    'media-print': {name:'Media Printing', color:'#ce2a6c', icon:'assets/media-print-isotipo.svg', question:'¿Qué necesitas hacer realidad?'},
    combinada: {name:'Solución combinada', color:'#0035d8', question:'Cuéntanos qué tienes en mente.\nNosotros conectamos las piezas.'},
    indefinida: {name:'Aún no estoy seguro', color:'#0035d8', question:'No necesitas tenerlo todo definido.\nCuéntanos lo que buscas.'}
  };
  const origins = {
    'media-branding': {name:'Media Branding', href:'../../media-branding/'},
    linkbranding: {name:'Linkbranding', href:'../../linkbranding/'},
    'media-print': {name:'Media Printing', href:'../../media-print/'},
    'grupo-branding': {name:'Grupo Branding', href:'../inicio-v01/'}
  };
  const known = (object,key) => Object.prototype.hasOwnProperty.call(object,key);
  const query = new URLSearchParams(location.search);
  const requested = query.has('origen') ? query.get('origen') : query.get('servicio');
  const originKey = known(origins,requested) ? requested : 'grupo-branding';
  const origin = origins[originKey];
  let selected = known(categories,originKey) ? originKey : null;
  let view = '1', returnView = '1', channel = 'email', showBoth = false;
  let entry = null, colorTween = null, inkFrame = null, layoutFrame = null;
  let contactEngaged = false, greetingActive = false, greetingTween = null;
  let conversationFrame = null, greetingTransitions = 0;
  let contactCompany = known(categories,originKey)&&categories[originKey].icon ? originKey : 'media-branding';
  let displayedContactCompany = 'media-branding', contactTween = null;
  let contactInkFrame = null;
  let pendingGreeting = 'Empecemos por conocernos.';
  const panels = $$('.step');
  const name = $('#visitor-name'), email = $('#visitor-email'), phone = $('#visitor-phone');
  const progressLabels = {'1':'Entenderte','2':'Conocerte','3':'Escucharte',final:'Recorrido completado',direct:'Contacto directo'};
  $$('[data-return]').forEach(link => {link.href=origin.href;link.querySelector('[data-return-label]').textContent=originKey==='grupo-branding'?'Volver al Inicio':`Volver a ${origin.name}`;});
  document.body.dataset.origin = originKey;

  function greetingSpace(text) {
    const title=$('#title-2'), probe=title.cloneNode(false);
    probe.removeAttribute('id');probe.removeAttribute('tabindex');
    probe.setAttribute('aria-hidden','true');
    probe.style.cssText=`position:fixed;left:0;top:0;visibility:hidden;pointer-events:none;min-height:0;height:auto;transform:none;width:${title.clientWidth}px`;
    probe.textContent=text;title.parentElement.append(probe);
    const height=Math.max(title.offsetHeight,probe.offsetHeight);
    probe.remove();return height;
  }

  function conversation(animate = true) {
    const fullName=name.value.trim().replace(/\s+/g,' ');
    const contactPresent=Boolean(email.value.trim()||phone.value.trim());
    if(contactPresent)contactEngaged=true;
    if(!fullName)contactEngaged=contactPresent;
    const active=Boolean(fullName)&&contactEngaged;
    pendingGreeting=active?`Mucho gusto, ${fullName}.`:'Empecemos por conocernos.';
    $('#title-3').textContent=fullName?`Ahora te escuchamos, ${fullName.split(' ')[0]}.`:'Ahora te escuchamos.';
    const title=$('#title-2'), modeChanged=active!==greetingActive;
    greetingActive=active;
    title.dataset.greeting=active?'personalized':'initial';
    if(!modeChanged&&animate){
      if(!greetingTween)title.textContent=pendingGreeting;
      if(!greetingTween)scheduleLayout();
      return;
    }
    greetingTween?.kill();greetingTween=null;
    if(!animate||view!=='2'||reduce.matches||!window.gsap){
      title.textContent=pendingGreeting;title.style.minHeight='';
      if(window.gsap)gsap.set(title,{clearProps:'opacity,transform'});
      scheduleLayout();return;
    }
    title.style.minHeight=greetingSpace(pendingGreeting)+'px';
    greetingTransitions+=1;title.dataset.transitions=String(greetingTransitions);
    greetingTween=gsap.timeline({onComplete:()=>{
      greetingTween=null;title.textContent=pendingGreeting;title.style.minHeight='';
      gsap.set(title,{clearProps:'opacity,transform'});scheduleLayout();
    }})
      .to(title,{y:-5,opacity:0,duration:.12,ease:'power2.in'})
      .add(()=>{title.textContent=pendingGreeting;})
      .fromTo(title,{y:7,opacity:0},{y:0,opacity:1,duration:.3,ease:'power3.out'});
  }

  // Event-driven batching catches multi-field autofill without guessing when
  // a person has finished typing a name. Headings are deliberately not live.
  function scheduleConversation() {
    if(conversationFrame!==null)cancelAnimationFrame(conversationFrame);
    conversationFrame=requestAnimationFrame(()=>{conversationFrame=null;conversation();updateContinue();});
  }

  function settle() {
    entry?.kill(); entry=null;
    if(window.gsap) gsap.set($$('.step [data-motion],.final-isotype'),{clearProps:'transform,opacity,visibility'});
  }

  // Keep CTA text at AA contrast throughout color interpolation, too.
  function inkFor(value) {
    const rgb=value.startsWith('#')?[1,3,5].map(i=>Number.parseInt(value.slice(i,i+2),16)):(value.match(/[\d.]+/g)||[]).slice(0,3).map(Number);
    if(rgb.length!==3)return '#ffffff';
    const linear=rgb.map(c=>{c/=255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4;});
    const light=linear[0]*.2126+linear[1]*.7152+linear[2]*.0722;
    const dark=.007666239637210588; // Relative luminance of the existing #101712 ink.
    return 1.05/(light+.05)>=4.5?'#ffffff':(light+.05)/(dark+.05)>=4.5?'#101712':'#000000';
  }

  function contrastInk() {
    document.body.style.setProperty('--on-accent',inkFor(getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()));
  }

  function watchContinueContrast() {
    if(inkFrame!==null)cancelAnimationFrame(inkFrame);
    const buttons=[$('#continue-button'),$('#project-button')], until=performance.now()+650;
    const sample=()=>{
      buttons.forEach(button=>{button.style.color=inkFor(getComputedStyle(button).backgroundColor);});
      inkFrame=!reduce.matches&&performance.now()<until?requestAnimationFrame(sample):null;
    };
    sample();
  }

  function readiness() {
    const emailUsed=!$('#email-field').hidden&&Boolean(email.value.trim());
    const phoneUsed=!$('#phone-field').hidden&&Boolean(phone.value.trim());
    const digits=phone.value.replace(/\D/g,'');
    return {
      nameValid:Boolean(name.value.trim()), emailUsed,phoneUsed,
      emailValid:emailUsed&&email.checkValidity(),
      phoneValid:phoneUsed&&/^[+\d\s().-]+$/.test(phone.value)&&digits.length>=7&&digits.length<=15
    };
  }

  function updateContinue() {
    const data=readiness(), complete=data.nameValid&&(data.emailValid||data.phoneValid);
    const button=$('#continue-button');
    if(button.disabled===!complete)return;
    button.disabled=!complete;
    $('#continue-label').textContent=complete?'Continuar':'Completa tus datos';
    watchContinueContrast();
  }

  function updateProject() {
    const complete=Boolean($('#project-description').value.trim());
    const button=$('#project-button');
    if(button.disabled===!complete)return;
    button.disabled=!complete;
    $('#project-button-label').textContent=complete?'Enviar mi solicitud':'Cuéntanos tu idea';
    watchContinueContrast();
  }

  // Natural document growth is the safety fallback. No overflow clipping or
  // scripted page scrolling: choose the least compact composition that fits.
  function fitComposition() {
    layoutFrame=null;
    const height=Math.floor(window.visualViewport?.height||innerHeight);
    document.documentElement.style.setProperty('--view-height',height+'px');
    for(const density of ['roomy','compact','tight']) {
      document.body.dataset.density=density;
      if(document.body.scrollHeight<=height)break;
    }
    document.body.dataset.viewportFit=String(document.body.scrollHeight<=height);
  }

  function scheduleLayout() {
    if(layoutFrame!==null)cancelAnimationFrame(layoutFrame);
    layoutFrame=requestAnimationFrame(fitComposition);
  }

  function viewportChanged() {
    // A heading slot measured in the previous viewport must not survive resize.
    if(greetingTween)conversation(false);
    if(contactTween)settleContact();
    scheduleLayout();
  }

  function renderContact(company, announce = true) {
    $$('.contact-panel').forEach(panel=>{
      const active=panel.id===`contact-panel-${company}`;
      panel.hidden=!active;panel.inert=!active;
      if(window.gsap)gsap.set(panel,{clearProps:'opacity,transform'});
    });
    displayedContactCompany=company;
    if(announce&&view==='direct')$('#contact-announcement').textContent=`Información de contacto de ${categories[company].name}.`;
    scheduleLayout();
  }

  function settleContact() {
    if(!contactTween)return;
    contactTween.kill();contactTween=null;
    renderContact(contactCompany,false);
  }

  function watchContactInk() {
    if(contactInkFrame!==null)cancelAnimationFrame(contactInkFrame);
    const button=$('#return-to-journey'), until=performance.now()+300;
    const sample=()=>{
      button.style.color=inkFor(getComputedStyle(button).backgroundColor);
      contactInkFrame=view==='direct'&&!reduce.matches&&performance.now()<until?requestAnimationFrame(sample):null;
    };
    sample();
  }

  function selectContact(company, animate = true) {
    if(!known(categories,company)||!categories[company].icon)return;
    contactTween?.kill();contactTween=null;
    contactCompany=company;
    $$('.contact-tab').forEach(tab=>{
      const active=tab.dataset.contactCompany===company;
      tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;
    });
    const color=categories[company].color, content=$('.direct-content');
    content.dataset.contactCompany=company;
    content.style.setProperty('--direct-accent',color);
    content.style.setProperty('--direct-ink',inkFor(color));
    watchContactInk();
    if(!animate||view!=='direct'||reduce.matches||!window.gsap||displayedContactCompany===company){
      renderContact(company);return;
    }
    const outgoing=$(`#contact-panel-${displayedContactCompany}`);
    const incoming=$(`#contact-panel-${company}`);
    outgoing.inert=true;
    contactTween=gsap.timeline({onComplete:()=>{contactTween=null;}})
      .to(outgoing,{y:-4,opacity:0,duration:.1,ease:'power2.in'})
      .add(()=>{renderContact(company);gsap.set(incoming,{y:5,opacity:0});})
      .to(incoming,{y:0,opacity:1,duration:.15,ease:'power2.out',clearProps:'opacity,transform'});
  }

  function identity(animate = true) {
    const category = selected ? categories[selected] : null;
    document.body.dataset.category = selected || 'grupo-branding';
    colorTween?.kill();
    const color = category?.color || '#0035d8';
    if(window.gsap && !reduce.matches && animate) colorTween=gsap.to(document.documentElement,{'--accent':color,duration:.28,ease:'power2.out',onUpdate:contrastInk});
    else document.documentElement.style.setProperty('--accent',color);
    contrastInk();
    watchContinueContrast();
    $$('.category-choice').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.category===selected)));
    $('#category-label').textContent=category?.icon?category.name:'Grupo Branding';
    const icon=$('#category-icon');
    icon.hidden=!category?.icon;
    if(category?.icon) icon.src=category.icon;
    else icon.removeAttribute('src');
    $('#project-question').textContent=category?.question || categories.indefinida.question;
  }

  // A single live panel: no stacked or colliding headings during rapid input.
  function show(next, focus = true) {
    settle();
    settleContact();
    conversation(false);
    updateProject();
    view=String(next);
    document.body.dataset.view=view;
    const panel=panels.find(element=>element.dataset.view===view);
    panels.forEach(element=>{element.hidden=element!==panel;});
    const step=Number(view)||Number(returnView)||3;
    $('#step-number').textContent=String(step).padStart(2,'0');
    $('#step-label').textContent=progressLabels[view];
    $('#progress-fill').style.width=(view==='final'?100:step/3*100)+'%';
    $('#go-back').hidden=view==='1'||view==='direct';
    $('#show-direct').hidden=view==='direct';
    $('.experience-meta').hidden=view==='direct';
    $('.progress-rule').hidden=view==='direct';
    $('#journey-navigation').hidden=view==='direct';
    if(view==='direct')selectContact(contactCompany,false);
    $('#step-announcement').textContent=view==='direct'?'Contacto directo. Contactos oficiales.':view==='final'?'Has completado el recorrido.':`Paso ${step} de 3. ${progressLabels[view]}.`;
    fitComposition();
    // Stages move inside the scene. Native scrolling remains available for
    // zoom, virtual keyboards and screens that cannot contain legible content.
    if(focus) panel.querySelector('h1').focus({preventScroll:document.body.dataset.viewportFit==='true'});
    const items=[panel.querySelector('.editorial'),...panel.querySelector('.step-content').children];
    items.forEach(element=>element.dataset.motion='');
    if(window.gsap && !reduce.matches) {
      const travel=Math.min(18,Number.parseFloat(getComputedStyle(panel).paddingBottom)||18);
      entry=gsap.timeline({defaults:{ease:'power3.out'}})
        .fromTo(items,{y:travel,opacity:0},{y:0,opacity:1,duration:.42,stagger:.045,clearProps:'transform,opacity'},0);
      if(view==='final') entry.fromTo('.final-isotype',{rotation:-9,y:5},{rotation:0,y:0,duration:.65,ease:'power2.out',clearProps:'transform'},.18);
    }
  }

  function channels() {
    $('#email-field').hidden=channel!=='email'&&!showBoth;
    $('#phone-field').hidden=channel!=='phone'&&!showBoth;
    const additional=$('#add-channel');
    additional.textContent=showBoth?'Ocultar medio adicional':channel==='email'?'Añadir teléfono (opcional)':'Añadir correo (opcional)';
    const sign=document.createElement('span');
    sign.setAttribute('aria-hidden','true');sign.textContent=showBoth?'−':'＋';additional.append(sign);
    additional.setAttribute('aria-expanded',String(showBoth));
    additional.setAttribute('aria-controls',channel==='email'?'phone-field':'email-field');
    $('#details-form').dataset.both=String(showBoth);
    $('#details-form').dataset.preferredChannel=channel;
    updateContinue();scheduleConversation();scheduleLayout();
  }

  function error(field,message) {
    const key=field===name?'name':field===email?'email':'phone';
    const box=$(`#${key}-error`);
    box.textContent=message;box.hidden=!message;
    if(message) field.setAttribute('aria-invalid','true');
    else field.removeAttribute('aria-invalid');
  }

  function validate() {
    [name,email,phone].forEach(field=>error(field,''));
    $('#contact-error').hidden=true;
    let first=null;
    if(!name.value.trim()){error(name,'Escribe tu nombre.');first=name;}
    const data=readiness();
    if(!data.emailValid&&!data.phoneValid){
      if(data.emailUsed&&!data.emailValid){error(email,'Revisa tu correo electrónico. Por ejemplo: nombre@dominio.com.');first ||= email;}
      if(data.phoneUsed&&!data.phoneValid){error(phone,'Escribe un teléfono válido, con entre 7 y 15 dígitos.');first ||= phone;}
      if(!data.emailUsed&&!data.phoneUsed){const target=channel==='email'?email:phone;error(target,'Añade al menos un correo electrónico o teléfono válido.');first ||= target;}
    }
    if(first){$('#contact-error').textContent='Revisa los campos indicados para continuar.';$('#contact-error').hidden=false;scheduleLayout();first.focus();return false;}
    return true;
  }

  $$('.category-choice').forEach(button=>{
    button.disabled=false;
    button.addEventListener('click',()=>{selected=button.dataset.category;identity();show('2');});
  });
  $$('input[name=channel]').forEach(input=>input.addEventListener('change',()=>{channel=input.value;channels();}));
  $('#add-channel').addEventListener('click',()=>{showBoth=!showBoth;channels();if(showBoth)(channel==='email'?phone:email).focus();});
  [name,email,phone].forEach(field=>{
    field.addEventListener('input',()=>{error(field,'');$('#contact-error').hidden=true;updateContinue();scheduleConversation();});
    field.addEventListener('change',()=>{updateContinue();scheduleConversation();});
    field.addEventListener('blur',()=>{
      const data=readiness();
      if(field===email&&data.emailUsed&&!data.emailValid)error(email,'Revisa tu correo electrónico. Por ejemplo: nombre@dominio.com.');
      if(field===phone&&data.phoneUsed&&!data.phoneValid)error(phone,'Escribe un teléfono válido, con entre 7 y 15 dígitos.');
      scheduleConversation();scheduleLayout();
    });
  });
  $('#details-form').addEventListener('submit',event=>{event.preventDefault();if(validate())show('3');});
  ['input','change'].forEach(type=>$('#project-description').addEventListener(type,updateProject));
  $('#idea-form').addEventListener('submit',event=>{
    event.preventDefault();
    if(!$('#project-description').value.trim()){updateProject();$('#project-description').focus();return;}
    if(!selected){show('1');return;}
    if(!validate()){show('2',false);$('.details-form [aria-invalid=true]')?.focus();return;}
    $('#final-name').textContent=name.value.trim();
    show('final');
  });
  $('#go-back').addEventListener('click',()=>show(view==='final'?'3':String(Math.max(1,Number(view)-1))));
  $('#show-direct').addEventListener('click',()=>{if(view!=='direct')returnView=view;show('direct');});
  $('#return-to-journey').addEventListener('click',()=>show(returnView));
  $$('.contact-tab').forEach((tab,index,tabs)=>{
    tab.addEventListener('click',()=>selectContact(tab.dataset.contactCompany));
    tab.addEventListener('keydown',event=>{
      let target;
      if(event.key==='ArrowRight')target=(index+1)%tabs.length;
      else if(event.key==='ArrowLeft')target=(index+tabs.length-1)%tabs.length;
      else if(event.key==='Home')target=0;
      else if(event.key==='End')target=tabs.length-1;
      else return;
      event.preventDefault();tabs[target].focus();selectContact(tabs[target].dataset.contactCompany);
    });
  });
  reduce.addEventListener('change',()=>{settle();settleContact();if(view==='direct')watchContactInk();conversation(false);colorTween?.kill();identity(false);watchContinueContrast();});
  addEventListener('resize',viewportChanged,{passive:true});
  window.visualViewport?.addEventListener('resize',viewportChanged,{passive:true});
  document.fonts?.ready.then(scheduleLayout);
  addEventListener('pageshow',scheduleConversation);
  document.addEventListener('animationstart',event=>{if(event.animationName==='contact-autofill')scheduleConversation();});
  // Keyboard focus always exposes the active control immediately during entry.
  document.addEventListener('focusin',event=>{if(event.target.matches('input,textarea,button,a')){entry?.progress(1);colorTween?.progress(1);scheduleConversation();}});
  identity(false);channels();show('1',false);
})();
