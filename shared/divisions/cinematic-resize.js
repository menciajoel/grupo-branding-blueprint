/* Preserve the visible cinematic reading point while the existing hero rebuilds.
   No timeline, pin, wheel interception or change to the native scroll journey. */
(() => {
  'use strict';
  if (!window.ScrollTrigger) return;
  const back=document.querySelector('[data-cinematic-back]');
  const stack=back?.closest('.cinematic-stack');
  if (!back || !stack) return;
  let progress=null,frame=null,settle=null;
  const cancel=()=>{
    progress=null;clearTimeout(settle);settle=null;
    if(frame!==null)cancelAnimationFrame(frame);
    frame=null;
  };
  const restore=()=>{
    if(progress===null || frame!==null)return;
    frame=requestAnimationFrame(()=>{
      frame=null;
      if(progress===null || stack.dataset.cinematicEnabled!=='true')return;
      const start=Number(back.dataset.cinematicStart),end=Number(back.dataset.cinematicEnd);
      if(!Number.isFinite(start) || !Number.isFinite(end) || end<=start)return;
      scrollTo({top:start+(end-start)*progress,behavior:'instant'});
      ScrollTrigger.update();
    });
  };
  addEventListener('resize',()=>{
    const current=Number(back.dataset.cinematicProgress);
    if(progress===null && stack.dataset.cinematicEnabled==='true' && current>0 && current<1)progress=current;
    clearTimeout(settle);
    settle=setTimeout(()=>{restore();requestAnimationFrame(()=>{progress=null;settle=null;});},400);
  },{capture:true,passive:true});
  // Measurements are published after the upstream pin has been recalculated.
  new MutationObserver(restore).observe(back,{attributes:true,attributeFilter:['data-cinematic-start','data-cinematic-end']});
  ScrollTrigger.addEventListener('refresh',restore);
  // Any new real navigation intent wins over viewport restoration.
  ['wheel','touchstart','pointerdown','keydown','pagehide'].forEach(type=>addEventListener(type,cancel,{passive:true}));
})();
