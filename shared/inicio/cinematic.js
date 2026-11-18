/* One reversible, unpinned transition. The approved motion.js is an exact copy. */
(() => {
  'use strict';
  if (!window.gsap || !window.ScrollTrigger) return;
  const outgoing = document.getElementById('soluciones');
  const incoming = document.getElementById('proyectos');
  const stack = outgoing?.closest('.cinematic-stack');
  const toggle = document.querySelector('.motion-toggle');
  if (!outgoing || !incoming || !stack) return;
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  media.add({ roomy:'(min-width:701px)', mobile:'(max-width:700px), (max-width:1000px) and (max-height:500px)', reduce:'(prefers-reduced-motion:reduce)' }, context => {
    let effect = null;
    let localTrigger = null;
    let refreshFrame = null;
    const controls = Array.from(outgoing.querySelectorAll('a[href],button,input,select,textarea,[tabindex]'));
    const originalInert = new Map(controls.map(control => [control, control.inert]));
    const restoreControls = () => controls.forEach(control => {control.inert=originalInert.get(control);});
    const clear = () => {
      effect?.revert();
      effect = null;
      localTrigger = null;
      delete outgoing.dataset.cinematicActive;
      delete outgoing.dataset.cinematicProgress;
      delete outgoing.dataset.cinematicStart;
      delete outgoing.dataset.cinematicEnd;
      delete outgoing.dataset.cinematicDepth;
      delete stack.dataset.cinematicEnabled;
      restoreControls();
      for (const name of ['--cinematic-stop-top','--cinematic-crop-top','--cinematic-origin-y']) outgoing.style.removeProperty(name);
    };
    const rebuild = () => {
      clear();
      if (context.conditions.reduce || toggle?.getAttribute('aria-pressed') === 'true') return;
      const mobile = context.conditions.mobile;
      stack.dataset.cinematicEnabled = 'true';
      effect = gsap.context(() => {
        const geometry = () => {
          const height = outgoing.offsetHeight;
          const frame = Math.min(height, window.innerHeight);
          const crop = height - frame;
          outgoing.style.setProperty('--cinematic-stop-top',`${-crop}px`);
          outgoing.style.setProperty('--cinematic-crop-top',`${crop}px`);
          outgoing.style.setProperty('--cinematic-origin-y',`${crop + frame / 2}px`);
        };
        geometry();
        const accessiblePlane = progress => {
          if (progress <= .00001) {restoreControls();return;}
          const box = outgoing.getBoundingClientRect();
          const crop = Math.max(0, outgoing.offsetHeight - innerHeight);
          const scale = 1 - (mobile ? .06 : .12) * progress;
          const top = Math.max(document.querySelector('.site-header')?.getBoundingClientRect().bottom || 0, box.top + crop * scale);
          const bottom = Math.min(innerHeight, box.bottom, incoming.getBoundingClientRect().top);
          controls.forEach(control => {
            const rect = control.getBoundingClientRect();
            const hidden = originalInert.get(control) || rect.top < top - 1 || rect.bottom > bottom + 1;
            if (control.inert !== hidden) control.inert=hidden;
          });
        };
        const sync = animation => {
          outgoing.dataset.cinematicProgress = animation.progress().toFixed(4);
          outgoing.dataset.cinematicDepth = String(animation.progress() > .00001);
          accessiblePlane(animation.progress());
        };
        const sequence = gsap.timeline({
          defaults:{duration:1, ease:'none', force3D:false},
          onUpdate:function () {sync(this);},
          scrollTrigger:{
              id:'cinematic-soluciones-proyectos',
              trigger:stack,
              start:() => `top+=${Math.max(0, outgoing.offsetHeight - window.innerHeight)} top`,
              end:() => `+=${Math.min(outgoing.offsetHeight, window.innerHeight)}`,
              scrub:true,
              invalidateOnRefresh:true,
              onRefreshInit:geometry,
              onToggle:self => {outgoing.dataset.cinematicActive=String(self.isActive);},
              onRefresh:self => {
                outgoing.dataset.cinematicStart=String(self.start);
                outgoing.dataset.cinematicEnd=String(self.end);
                sync(self.animation);
              }
          }
        });
        localTrigger = sequence.scrollTrigger;
        sequence.fromTo(outgoing,
          {scale:1, y:0, '--cinematic-shade':0},
          {scale:mobile ? .94 : .88, y:mobile ? -4 : -8, '--cinematic-shade':mobile ? .12 : .20}, 0);
        // Proyectos moves in native document flow, above the suspended rear plane.
        sync(sequence);
      });
    };
    rebuild();
    // The approved hero ignores small mobile height changes. Refresh this local
    // stack independently so browser bars/orientation never leave stale bounds.
    const refreshLocal = () => {
      if (refreshFrame !== null) return;
      refreshFrame = requestAnimationFrame(() => {
        refreshFrame = null;
        localTrigger?.refresh();
      });
    };
    addEventListener('resize', refreshLocal, {passive:true});
    const bounds = new ResizeObserver(refreshLocal);
    bounds.observe(stack);
    // The original manual motion control is respected as well as the OS setting.
    const observer = new MutationObserver(rebuild);
    if (toggle) observer.observe(toggle, {attributes:true, attributeFilter:['aria-pressed']});
    return () => {
      observer.disconnect();
      bounds.disconnect();
      removeEventListener('resize', refreshLocal);
      if (refreshFrame !== null) cancelAnimationFrame(refreshFrame);
      clear();
    };
  });
})();
