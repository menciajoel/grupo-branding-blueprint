/* Independent Contacto enhancement; the approved cinematic transition is frozen. */
(() => {
  'use strict';
  if (!window.gsap || !window.ScrollTrigger) return;
  const contact = document.getElementById('contacto');
  const heading = contact?.querySelector('#contact-heading');
  const mark = contact?.querySelector('.contact-mark');
  const message = contact?.querySelector('.contact-bottom p');
  const cta = contact?.querySelector('.contact-bottom .button');
  const toggle = document.querySelector('.motion-toggle');
  if (!contact || !heading || !mark || !message || !cta) return;
  const content = [heading,message,cta];
  const variables = ['--closing-entry-x','--closing-entry-y','--closing-entry-turn','--closing-sign-x','--closing-sign-y','--closing-sign-turn'];
  gsap.registerPlugin(ScrollTrigger);
  let entryHasCompleted = false;
  let signatureHasCompleted = false;
  const media = gsap.matchMedia();
  media.add({all:'(min-width:0px)',reduce:'(prefers-reduced-motion:reduce)'}, context => {
    let effect = null, entry = null, signature = null, entrance = null, signatureGate = null;
    let signaturePending = false;
    let watchdog = null, visibility = null, refreshFrame = null;
    const original = new Map([...content,mark].map(element => [element,element.getAttribute('style')]));
    const clear = () => {
      clearTimeout(watchdog);watchdog=null;
      visibility?.disconnect();visibility=null;
      effect?.revert();effect=null;
      entry=null;signature=null;entrance=null;signatureGate=null;signaturePending=false;
      original.forEach((style,element) => style === null ? element.removeAttribute('style') : element.setAttribute('style',style));
      for (const key of Object.keys(contact.dataset)) if (key.startsWith('closing')) delete contact.dataset[key];
    };
    const finishEntry = () => {
      if (!entry) return;
      entry.progress(1).pause();
      clearTimeout(watchdog);watchdog=null;
    };
    const failOpen = () => {
      clearTimeout(watchdog);watchdog=null;
      visibility?.disconnect();visibility=null;
      entry?.kill();signature?.kill();entrance?.kill();signatureGate?.kill();
      content.forEach(element => {element.style.removeProperty('opacity');element.style.removeProperty('transform');});
      variables.forEach(name => mark.style.removeProperty(name));
      contact.dataset.closingPhase='static-fallback';
    };
    const requestSignature = () => {
      signaturePending=true;
      if (entry?.progress() >= 1 && signature) {
        signaturePending=false;
        signature.play();
      }
    };
    const focusCTA = event => {if (cta.contains(event.target)) finishEntry();};
    const watchVisibleContent = () => {
      clearTimeout(watchdog);
      watchdog=setTimeout(() => {
        const box=heading.getBoundingClientRect();
        if (box.top < innerHeight*.94 && box.bottom > 0 && entry?.progress() < 1) {
          try {finishEntry();} catch {failOpen();}
        }
      },2400);
    };
    const build = () => {
      clear();
      if (context.conditions.reduce || toggle?.getAttribute('aria-pressed') === 'true') return;
      try {
        // Install the fallback before applying any hidden entrance state.
        visibility=new IntersectionObserver(entries => {
          if (entries.some(item => item.isIntersecting)) watchVisibleContent();
        },{threshold:[0,.1,.5]});
        visibility.observe(heading);
        effect=gsap.context(() => {
          contact.dataset.closingPhase='ready';
          gsap.set(heading,{y:35,opacity:0,force3D:false});
          gsap.set(message,{y:18,opacity:0,force3D:false});
          gsap.set(cta,{y:14,opacity:0,force3D:false});
          gsap.set(mark,{'--closing-entry-turn':'-10deg','--closing-entry-x':'8px','--closing-entry-y':'6px'});
          entry=gsap.timeline({paused:true,defaults:{ease:'power3.out'},
            onStart:() => {contact.dataset.closingPhase='entering';},
            onComplete:() => {entryHasCompleted=true;contact.dataset.closingPhase='settled';if(signaturePending) requestSignature();},
            onReverseComplete:() => {contact.dataset.closingPhase='ready';}
          });
          entry.to(heading,{y:0,opacity:1,duration:.9,force3D:false},0)
            .to(mark,{'--closing-entry-turn':'0deg','--closing-entry-x':'0px','--closing-entry-y':'0px',duration:1,ease:'power2.out'},.2)
            .to(message,{y:0,opacity:1,duration:.65,force3D:false},.82)
            .to(cta,{y:0,opacity:1,duration:.6,force3D:false},.97);
          if (entryHasCompleted) finishEntry();

          entrance=ScrollTrigger.create({
            id:'cinematic-contact-entry',trigger:heading.parentElement,start:'top 94%',endTrigger:contact,end:'bottom top',
            onEnter:() => {entry.play();watchVisibleContent();},
            onLeave:finishEntry,
            onEnterBack:finishEntry,
            onLeaveBack:() => {entryHasCompleted=false;signatureHasCompleted=false;signaturePending=false;signature?.reverse();entry.reverse();},
            onRefresh:self => {contact.dataset.closingEntryStart=String(self.start);}
          });
          // Keep the signature within the existing mark's last visible interval,
          // including short phones where the decorative mark exits before the CTA.
          const signatureEnd = () => {
            const bottom=contact.getBoundingClientRect().bottom+scrollY;
            const graphic=mark.offsetTop+contact.getBoundingClientRect().top+scrollY;
            const header=document.querySelector('.site-header')?.offsetHeight || 0;
            return Math.min(bottom-innerHeight*.72,graphic+mark.offsetHeight*.6-header-16);
          };
          const signatureStart = () => Math.min(
            contact.getBoundingClientRect().bottom+scrollY-innerHeight*.94,
            signatureEnd()-Math.max(96,Math.min(180,innerHeight*.22))
          );
          signature=gsap.timeline({paused:true,defaults:{ease:'power2.inOut'},
            onComplete:() => {signatureHasCompleted=true;},
            onUpdate:function () {contact.dataset.closingSignatureProgress=this.progress().toFixed(4);}});
          signature.fromTo(mark,{'--closing-sign-turn':'0deg','--closing-sign-x':'0px','--closing-sign-y':'0px'},
            {'--closing-sign-turn':'2.5deg','--closing-sign-x':'-2px','--closing-sign-y':'-1.5px',duration:.22},0)
            .to(mark,{'--closing-sign-turn':'0deg','--closing-sign-x':'0px','--closing-sign-y':'0px',duration:.38,ease:'power2.out'});
          if (signatureHasCompleted) signature.progress(1).pause();
          signatureGate=ScrollTrigger.create({
            id:'cinematic-contact-signature',trigger:contact,start:signatureStart,end:signatureEnd,
            onEnter:requestSignature,
            onLeaveBack:() => {signatureHasCompleted=false;signaturePending=false;signature.reverse();},
            onRefresh:self => {
              contact.dataset.closingSignatureStart=String(self.start);
              contact.dataset.closingSignatureEnd=String(self.end);
            }
          });
          if (heading.getBoundingClientRect().bottom < 0) finishEntry();
        });
      } catch {failOpen();}
    };
    build();
    const refreshLocal = () => {
      if (refreshFrame !== null) return;
      refreshFrame=requestAnimationFrame(() => {
        refreshFrame=null;
        entrance?.refresh();signatureGate?.refresh();
      });
    };
    const observer=new MutationObserver(build);
    if (toggle) observer.observe(toggle,{attributes:true,attributeFilter:['aria-pressed']});
    const bounds=new ResizeObserver(refreshLocal);bounds.observe(contact);
    addEventListener('resize',refreshLocal,{passive:true});
    contact.addEventListener('focusin',focusCTA);
    document.fonts?.ready.then(refreshLocal);
    return () => {
      observer.disconnect();bounds.disconnect();
      removeEventListener('resize',refreshLocal);
      contact.removeEventListener('focusin',focusCTA);
      if (refreshFrame !== null) cancelAnimationFrame(refreshFrame);
      clear();
    };
  });
})();
