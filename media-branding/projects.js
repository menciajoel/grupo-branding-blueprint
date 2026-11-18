/* COPY-P04-S11: one gallery controller, no autoplay or vertical scroll interception. */
(() => {
  'use strict';
  const region=document.querySelector('[data-project-gallery]');
  if (!region) return;
  const track=region.querySelector('[data-project-track]');
  const frame=region.querySelector('.projects-frame');
  const slides=[...track.querySelectorAll('[data-project-slide]')];
  const previous=region.querySelector('[data-project-prev]');
  const next=region.querySelector('[data-project-next]');
  const counter=region.querySelector('[data-project-current]');
  const status=region.querySelector('[data-project-status]');
  const mobile=matchMedia('(max-width:700px)');
  const tablet=matchMedia('(max-width:1100px)');
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const count=slides.length;
  const wrap=n=>(n+count)%count;
  let index=0,desired=0,intent=0,transition=null,outgoing=null,entry=null;
  let scrollFrame=0,resizeFrame=0,settleTimer=0,programmatic=false,pointer=null;
  let lastWidth=0,lastMode='',layoutVersion=0;
  const mode=()=>mobile.matches?'mobile':tablet.matches?'tablet':'desktop';
  const sentinel=(slide,name)=>{const copy=slide.cloneNode(true);copy.removeAttribute('data-project-slide');copy.removeAttribute('data-slot');copy.classList.add('project-sentinel');copy.setAttribute('aria-hidden','true');copy.inert=true;copy.dataset.sentinel=name;return copy;};
  const leading=sentinel(slides[count-1],'leading');
  const trailing=sentinel(slides[0],'trailing');
  track.prepend(leading);track.append(trailing);
  const visibleCount=()=>mobile.matches?1:tablet.matches?3:5;
  const label=i=>slides[i].querySelector('.project-label').textContent;
  function announce() {
    counter.textContent=String(index+1).padStart(2,'0');
    status.textContent=`Fotografía ${index+1} de ${count}: ${label(index)}.`;
    region.dataset.projectIndex=String(index);
  }
  function slots() {
    slides.forEach((slide,i)=>{
      const slot=wrap(i-index);
      slide.dataset.slot=String(slot);
      const shown=mobile.matches||slot<visibleCount();
      slide.setAttribute('aria-hidden',String(!shown));
      slide.inert=!shown;
      slide.setAttribute('aria-label',`${i+1} de ${count}: ${label(i)}`);
    });
    announce();
  }
  function finishEntry() {if(entry&&entry.progress()<1)entry.progress(1);}
  function cancelTransition() {
    ++layoutVersion;
    transition?.kill();transition=null;
    outgoing?.remove();outgoing=null;
    programmatic=false;track.removeAttribute('data-animating');
    if (window.gsap) gsap.set(track,{clearProps:'transform,opacity'});
  }
  function positionMobile(element=slides[index]) {
    if(mobile.matches)track.scrollTo({left:element.offsetLeft,behavior:'auto'});
  }
  async function decodeVisible(target) {
    const n=mobile.matches?2:visibleCount();
    await Promise.all(Array.from({length:n},(_,offset)=>{
      const image=slides[wrap(target+offset)].querySelector('img');
      image.loading='eager';
      return image.decode?.().catch(()=>{});
    }));
  }
  async function navigate(target,direction=1) {
    const ticket=++intent;desired=wrap(target);
    finishEntry();
    await decodeVisible(desired);
    if(ticket!==intent)return;
    cancelTransition();
    const old=index;index=desired;
    if(mobile.matches) {
      slots();
      const destination=old===count-1&&index===0&&direction>0?trailing:old===0&&index===count-1&&direction<0?leading:slides[index];
      if(!window.gsap||reduced.matches) {positionMobile();return;}
      programmatic=true;track.setAttribute('data-animating','');
      transition=gsap.to(track,{scrollLeft:destination.offsetLeft,duration:.55,ease:'power2.inOut',onComplete:()=>{
        transition=null;programmatic=false;track.removeAttribute('data-animating');positionMobile();
      }});
      return;
    }
    if(!window.gsap||reduced.matches||old===index) {slots();return;}
    outgoing=track.cloneNode(true);
    outgoing.classList.add('projects-outgoing');outgoing.removeAttribute('data-project-track');
    outgoing.setAttribute('aria-hidden','true');outgoing.inert=true;
    outgoing.querySelectorAll('[data-project-slide]').forEach(el=>el.removeAttribute('data-project-slide'));
    frame.append(outgoing);
    slots();
    const distance=tablet.matches?22:30;
    transition=gsap.timeline({onComplete:()=>{outgoing?.remove();outgoing=null;transition=null;gsap.set(track,{clearProps:'transform,opacity'});}})
      .fromTo(outgoing,{x:0,opacity:1},{x:-direction*distance,opacity:0,duration:.5,ease:'power2.inOut'},0)
      .fromTo(track,{x:direction*distance,opacity:0},{x:0,opacity:1,duration:.55,ease:'power3.out'},.04);
  }
  previous.hidden=false;next.hidden=false;
  previous.addEventListener('click',()=>navigate(desired-1,-1));
  next.addEventListener('click',()=>navigate(desired+1,1));
  region.addEventListener('keydown',event=>{
    const keys={ArrowLeft:()=>navigate(desired-1,-1),ArrowRight:()=>navigate(desired+1,1),Home:()=>navigate(0,-1),End:()=>navigate(count-1,1)};
    if(!keys[event.key])return;
    event.preventDefault();keys[event.key]();
  });
  function settle() {
    clearTimeout(settleTimer);
    if(!mobile.matches||programmatic||pointer?.dragging||lastMode!==mode()||Math.abs(track.clientWidth-lastWidth)>1)return;
    const all=[leading,...slides,trailing];
    const closest=all.reduce((a,b)=>Math.abs(b.offsetLeft-track.scrollLeft)<Math.abs(a.offsetLeft-track.scrollLeft)?b:a);
    const chosen=closest===leading?count-1:closest===trailing?0:slides.indexOf(closest);
    ++intent;index=desired=chosen;slots();
    if(closest===leading||closest===trailing)positionMobile();
  }
  track.addEventListener('scroll',()=>{
    if(!mobile.matches||programmatic)return;
    if(scrollFrame)return;
    scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;clearTimeout(settleTimer);settleTimer=setTimeout(settle,130);});
  },{passive:true});
  track.addEventListener('scrollend',settle,{passive:true});
  track.addEventListener('pointerdown',event=>{
    if(mobile.matches) {
      ++intent;cancelTransition();desired=index;
      if(event.pointerType==='mouse') {pointer={x:event.clientX,y:event.clientY,left:track.scrollLeft,id:event.pointerId,mouse:true,dragging:false};track.setPointerCapture(event.pointerId);}
      return;
    }
    pointer={x:event.clientX,y:event.clientY,id:event.pointerId};
  },{passive:true});
  track.addEventListener('pointermove',event=>{
    if(!mobile.matches||!pointer?.mouse)return;
    const dx=event.clientX-pointer.x,dy=event.clientY-pointer.y;
    if(!pointer.dragging&&Math.abs(dx)>6&&Math.abs(dx)>Math.abs(dy)*1.3) {pointer.dragging=true;track.setAttribute('data-dragging','');}
    if(pointer.dragging) {event.preventDefault();track.scrollLeft=pointer.left-dx;}
  });
  track.addEventListener('pointerup',event=>{
    if(!pointer)return;
    if(mobile.matches) {
      const dragged=pointer.dragging;pointer=null;track.removeAttribute('data-dragging');
      if(dragged) {
        settle();navigate(index,1);
      }
      return;
    }
    const dx=event.clientX-pointer.x,dy=event.clientY-pointer.y;pointer=null;
    if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.4)navigate(desired+(dx<0?1:-1),dx<0?1:-1);
  },{passive:true});
  track.addEventListener('pointercancel',()=>{pointer=null;track.removeAttribute('data-dragging');},{passive:true});
  track.addEventListener('wheel',()=>{if(mobile.matches&&programmatic){++intent;cancelTransition();desired=index;}},{passive:true});
  function resize() {
    resizeFrame=0;
    const width=track.clientWidth,nextMode=mode();
    if(Math.abs(width-lastWidth)<1&&nextMode===lastMode)return;
    lastWidth=width;lastMode=nextMode;++intent;desired=index;clearTimeout(settleTimer);
    pointer=null;track.removeAttribute('data-dragging');
    cancelTransition();slots();
    if(mobile.matches) {
      const ticket=layoutVersion;
      programmatic=true;track.setAttribute('data-animating','');positionMobile();
      // Let the new flex geometry settle before restoring native snap. Ignore
      // scrollend from the previous breakpoint while retaining the logical item.
      requestAnimationFrame(()=>{
        if(ticket!==layoutVersion)return;
        positionMobile();
        requestAnimationFrame(()=>{
          if(ticket!==layoutVersion)return;
          track.removeAttribute('data-animating');programmatic=false;
        });
      });
    }
  }
  addEventListener('resize',()=>{if(!resizeFrame)resizeFrame=requestAnimationFrame(resize);},{passive:true});
  reduced.addEventListener('change',()=>{++intent;desired=index;cancelTransition();slots();positionMobile();});
  resize();
  // Native scroll restores must not select a sentinel on initial page load.
  if(mobile.matches)requestAnimationFrame(()=>positionMobile());
  if(window.gsap&&window.ScrollTrigger) {
    const mm=gsap.matchMedia();
    mm.add('(prefers-reduced-motion:no-preference)',()=>{
      entry=gsap.fromTo(slides,{y:14,opacity:0},{y:0,opacity:1,duration:.55,stagger:.055,ease:'power3.out',scrollTrigger:{id:'mb-projects-mosaic',trigger:frame,start:'top 82%',toggleActions:'play none none none'}});
      return ()=>{entry=null;};
    });
  }
  region.addEventListener('focusin',finishEntry);
})();
