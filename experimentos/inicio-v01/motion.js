/* Presentation-only controller. Editable words, URLs and media live in JSON. */
(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const journey = $('#journey');
  const scene = $('.scene');
  const title = $('#hero-title');
  const support = $('.hero-support');
  const intro = $('.division-intro');
  const cards = $('.division-grid');
  const cue = $('.scroll-cue');
  const rule = $('.scene-rule span');
  const photos = [...document.querySelectorAll('[data-photo]')];
  const toggle = $('.motion-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const large = matchMedia('(min-width: 1000px) and (min-height: 760px)');
  const destinations = JSON.parse($('#destination-data').textContent);
  const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ramp = (p, a, b) => clamp((p - a) / (b - a));
  const smooth = t => t * t * (3 - 2 * t);
  let mode = 'static', manualReduced = false, raf = 0, metrics = {}, progress = 0;
  let expandedMedia = false;

  function setOpacity(element, value) {
    element.style.opacity = value.toFixed(3);
    element.style.visibility = value <= .001 ? 'hidden' : 'visible';
  }

  function frame(element, rect) {
    // Three absolutely positioned crop windows; no document-flow geometry changes.
    element.style.transform = `translate3d(${rect.x.toFixed(2)}px,${rect.y.toFixed(2)}px,0)`;
    element.style.width = `${rect.w.toFixed(2)}px`;
    element.style.height = `${rect.h.toFixed(2)}px`;
  }

  function renderDesktop() {
    const {w, h, gutter, gap, column, top, travel} = metrics;
    progress = clamp((scrollY - top) / travel);
    const p = progress;
    const spatial = smooth(ramp(p, .06, .8));
    const start = {x:w * .345, y:h * .14, w:w * .61, h:h * .715};
    const end = {x:gutter, y:h * .325, w:column, h:h * .29};
    frame(photos[0], Object.fromEntries(Object.keys(start).map(key => [key, lerp(start[key], end[key], spatial)])));
    photos[0].style.setProperty('--shade', lerp(.28, .03, spatial).toFixed(3));
    photos[0].style.setProperty('--main-image-scale', lerp(1, 1.4, spatial).toFixed(3));

    for (let i = 1; i < photos.length; i++) {
      const enter = smooth(ramp(p, i === 1 ? .18 : .28, i === 1 ? .76 : .84));
      const targetX = gutter + (column + gap) * i;
      frame(photos[i], {x:lerp(w + column * (i - 1) * .55, targetX, enter), y:lerp(h * .12, end.y, spatial), w:column, h:lerp(h * .64, end.h, spatial)});
      setOpacity(photos[i], ramp(p, .16 + i * .04, .38 + i * .04));
    }

    const fold = smooth(ramp(p, 0, .53));
    title.style.transform = `translate3d(${fold * -22}px,${fold * -h * .16}px,0) scale(${lerp(1,.76,fold)})`;
    setOpacity(title, 1 - smooth(ramp(p, .2, .5)));
    support.style.transform = `translate3d(0,${fold * -35}px,0)`;
    setOpacity(support, 1 - smooth(ramp(p, .08, .29)));
    const reveal = smooth(ramp(p, .5, .74));
    intro.style.transform = `translate3d(0,${lerp(30,0,reveal)}px,0)`;
    setOpacity(intro, reveal);
    const read = smooth(ramp(p, .65, .88));
    cards.style.transform = `translate3d(0,${lerp(25,0,read)}px,0)`;
    setOpacity(cards, read);
    setOpacity(cue, 1 - ramp(p, .04, .2));
    rule.style.transform = `scaleX(${p})`;
    scene.dataset.progress = p.toFixed(3);

    if (p > .015 && !expandedMedia) {
      expandedMedia = true;
      photos.slice(1).forEach(photo => { photo.querySelector('img').loading = 'eager'; });
    }
  }

  function paint() {
    raf = 0;
    if (mode === 'desktop') renderDesktop();
    else if (mode === 'mobile') {
      const fraction = clamp(scrollY / (metrics.heroHeight || innerHeight));
      scene.style.setProperty('--mobile-inset', `${(fraction * 20).toFixed(2)}px`);
      scene.style.setProperty('--mobile-type-x', `${(fraction * -12).toFixed(2)}px`);
    }
  }
  function schedule() { if (!raf) raf = requestAnimationFrame(paint); }

  function measure() {
    const box = journey.getBoundingClientRect();
    const gutter = parseFloat(getComputedStyle(scene).getPropertyValue('--gutter')) || innerWidth * .045;
    // Resolve clamp()/vw custom properties via the real intro position, once per resize.
    const realGutter = mode === 'desktop' ? intro.getBoundingClientRect().left : gutter;
    metrics = {w:innerWidth, h:innerHeight, gutter:realGutter, gap:24,
      column:(innerWidth - realGutter * 2 - 48) / 3,
      top:box.top + scrollY, travel:Math.max(1,journey.offsetHeight - scene.offsetHeight),
      heroHeight:$('.hero-copy').offsetHeight};
    paint();
  }

  function configure() {
    const next = reduced.matches || manualReduced ? 'static' : large.matches ? 'desktop' : 'mobile';
    const previous = mode;
    const oldProgress = progress;
    if (next !== mode) {
      document.body.classList.remove('motion-desktop', 'motion-mobile');
      [title, support, intro, cards, cue, ...photos].forEach(element => element.removeAttribute('style'));
      scene.removeAttribute('style');
      mode = next;
      if (mode !== 'static') document.body.classList.add(`motion-${mode}`);
    }
    toggle.hidden = reduced.matches;
    toggle.setAttribute('aria-pressed', String(manualReduced));
    toggle.setAttribute('aria-label', manualReduced ? 'Activar movimiento' : 'Reducir movimiento');
    toggle.querySelector('img').src = `assets/icons/${manualReduced ? 'play' : 'pause'}.svg`;
    measure();
    if (previous === 'desktop' && next !== 'desktop' && oldProgress > .5) {
      intro.scrollIntoView({block:'start', behavior:'instant'});
    }
  }

  toggle.addEventListener('click', () => { manualReduced = !manualReduced; configure(); });
  reduced.addEventListener('change', configure);
  large.addEventListener('change', configure);
  addEventListener('resize', configure, {passive:true});
  addEventListener('scroll', schedule, {passive:true});

  function goToDivisions(focus = false) {
    if (mode === 'desktop') {
      scrollTo({top:metrics.top + metrics.travel, behavior:'instant'});
      paint();
    } else intro.scrollIntoView({behavior:'instant', block:'start'});
    if (focus) intro.focus({preventScroll:true});
  }

  document.querySelectorAll('a[href="#divisiones"]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    history.replaceState(null, '', '#divisiones');
    goToDivisions(true);
  }));
  document.querySelectorAll('a[href="#inicio"]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    history.replaceState(null, '', location.pathname);
    scrollTo({top:0, behavior:'instant'});
    paint();
  }));

  // Keyboard users reach the actual visible state of each spatial region.
  support.addEventListener('focusin', () => {
    if (mode === 'desktop' && progress > .15) {
      scrollTo({top:metrics.top, behavior:'instant'}); paint();
    }
  });
  cards.addEventListener('focusin', () => { if (mode === 'desktop' && progress < .88) goToDivisions(); });

  function openDialog(dialog) { dialog.showModal(); }
  document.querySelectorAll('[data-open-credits]').forEach(button => button.addEventListener('click', () => openDialog($('#credits-dialog'))));
  document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
  document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  }));
  document.querySelectorAll('[data-route]').forEach(link => link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const route = link.getAttribute('href');
    const target = destinations[route];
    if (!target) return;
    event.preventDefault();
    $('#route-path').textContent = route;
    $('#route-title').textContent = target.headline;
    $('#route-body').textContent = target.body;
    openDialog($('#route-dialog'));
  }));

  configure();
  document.fonts.ready.then(() => {
    measure();
    if (location.hash === '#divisiones') goToDivisions();
  });
})();
