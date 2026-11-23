/* Corporate navigation only; the existing hero and mobile menu keep ownership. */
(() => {
  'use strict';
  const details = document.querySelector('[data-division-switcher]');
  if (!details) return;
  const summary = details.querySelector('summary');
  const navigation = details.closest('nav');
  const header = details.closest('header');
  const contact = details.nextElementSibling;
  const mobileToggle = header.querySelector('.menu-toggle');
  const compact = matchMedia('(max-width:1280px)');
  const hover = matchMedia('(hover:hover) and (pointer:fine)');
  let hoverOnly = false;
  let leaveTimer;
  const setOpen = open => {
    clearTimeout(leaveTimer);
    details.open = open;
    summary.setAttribute('aria-expanded', String(open));
    if (!open) hoverOnly = false;
  };
  const arrange = () => {
    const active = document.activeElement;
    const focused = details.contains(active);
    // A single destination list: DOM and keyboard order follow the visual order.
    if (compact.matches && contact.nextElementSibling !== details) contact.after(details);
    if (!compact.matches && details.nextElementSibling !== contact) contact.before(details);
    setOpen(compact.matches);
    hoverOnly = false;
    if (focused) {
      if (compact.matches) {
        (navigation.hasAttribute('data-open') && active !== summary ? active : mobileToggle).focus({preventScroll:true});
      } else summary.focus({preventScroll:true});
    }
  };
  summary.addEventListener('click', event => {
    if (compact.matches) return;
    event.preventDefault();
    const open = hoverOnly || !details.open;
    hoverOnly = false;
    setOpen(open);
  });
  details.addEventListener('toggle', () => summary.setAttribute('aria-expanded', String(details.open)));
  details.addEventListener('pointerenter', () => {
    clearTimeout(leaveTimer);
    if (!compact.matches && hover.matches && !details.open) {
      setOpen(true);
      hoverOnly = true;
    }
  });
  details.addEventListener('pointerleave', () => {
    if (!compact.matches && hoverOnly && !details.contains(document.activeElement)) {
      leaveTimer = setTimeout(() => setOpen(false), 180);
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || compact.matches || !details.open) return;
    event.preventDefault();
    event.stopPropagation();
    setOpen(false);
    summary.focus({preventScroll:true});
  });
  document.addEventListener('pointerdown', event => {
    if (!compact.matches && !details.contains(event.target)) setOpen(false);
  });
  document.addEventListener('focusin', event => {
    if (!compact.matches && !details.contains(event.target)) setOpen(false);
  });
  details.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    if (compact.matches) {
      navigation.removeAttribute('data-open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.setAttribute('aria-label', 'Abrir menú');
    } else setOpen(false);
    // Native navigation also owns modified clicks and history.
  }));
  compact.addEventListener('change', arrange);
  arrange();
  details.dataset.enhanced = '';
})();
