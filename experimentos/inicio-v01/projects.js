/* Extend the existing preview renderer synchronously. It still owns the URL,
   modal opening/closing, history and focus restoration. No GSAP changes. */
(() => {
  'use strict';
  const dialog = document.getElementById('preview-dialog');
  const body = document.getElementById('preview-body');
  const rows = [...document.querySelectorAll('.project-row[data-preview]')];
  const desktop = matchMedia('(min-width:1001px)');

  function adaptTestimony() {
    if (!dialog.classList.contains('project-case-dialog')) return;
    const testimony = body.querySelector('.case-testimony');
    const copy = body.querySelector('.case-copy');
    if (!testimony || !copy) return;
    testimony.open = desktop.matches || testimony.dataset.compactOpen === 'true';
    // Each layout has one keyboard-accessible reading area. The modal header
    // stays outside that area; no focus() or page-scroll change is necessary.
    for (const [area, active] of [[copy, desktop.matches], [body, !desktop.matches]]) {
      if (active) {
        area.tabIndex = 0;
        area.setAttribute('role', 'region');
        area.setAttribute('aria-label', 'Contenido del proyecto');
      } else {
        area.removeAttribute('tabindex');
        area.removeAttribute('role');
        area.removeAttribute('aria-label');
      }
    }
  }
  desktop.addEventListener('change', adaptTestimony);
  body.addEventListener('toggle', event => {
    if (!desktop.matches && event.target.matches('.case-testimony')) {
      event.target.dataset.compactOpen = String(event.target.open);
    }
  }, true);
  rows.forEach(link => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.setAttribute('aria-controls', 'preview-dialog');
  });
  document.addEventListener('project-preview-render', event => {
    const slug = event.detail.slug;
    const template = document.getElementById(`project-case-${slug}`);
    const documented = template instanceof HTMLTemplateElement;
    dialog.classList.toggle('project-case-dialog', documented && slug !== 'portafolio');
    dialog.classList.toggle('project-catalog-dialog', documented && slug === 'portafolio');
    document.getElementById('preview-path').hidden = documented;
    document.getElementById('preview-note').hidden = documented;
    body.removeAttribute('tabindex');
    body.removeAttribute('role');
    body.removeAttribute('aria-label');
    if (!documented) return;
    body.replaceChildren(template.content.cloneNode(true));
    const label = document.getElementById('preview-label');
    if (slug === 'portafolio') {
      label.textContent = 'Proyectos';
    } else {
      const isotype = document.createElement('img');
      isotype.className = 'case-brand-isotype';
      isotype.src = '../../contacto/assets/media-branding-isotipo.svg';
      isotype.width = 40;
      isotype.height = 32;
      isotype.alt = 'Media Branding';
      label.replaceChildren(isotype);
      body.querySelector('.case-testimony').dataset.compactOpen = 'false';
      adaptTestimony();
    }
    dialog.scrollTop = 0;
    body.scrollTop = 0;
    // A closed dialog has no layout box, so its retained scroll offset cannot
    // reliably be reset yet. The existing owner calls showModal() synchronously
    // after this render event; reset the reading area once that call completes.
    queueMicrotask(() => {
      if (!dialog.open) return;
      dialog.scrollTop = 0;
      body.scrollTop = 0;
    });
  });
  body.addEventListener('click', event => {
    const link = event.target.closest('[data-case-link]');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const original = rows.find(row => row.dataset.preview === link.dataset.caseLink);
    if (!original) return;
    event.preventDefault();
    // Reuse the approved navigation handler, including its URL/history rules.
    original.click();
    dialog.querySelector('[data-close]').focus({preventScroll:true});
  });
})();
