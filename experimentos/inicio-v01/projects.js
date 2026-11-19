/* Extend the existing preview renderer synchronously. It still owns the URL,
   modal opening/closing, history and focus restoration. No GSAP changes. */
(() => {
  'use strict';
  const dialog = document.getElementById('preview-dialog');
  const body = document.getElementById('preview-body');
  const rows = [...document.querySelectorAll('.project-row[data-preview]')];
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
    if (!documented) return;
    body.replaceChildren(template.content.cloneNode(true));
    document.getElementById('preview-label').textContent = slug === 'portafolio' ? 'Proyectos' : 'Media Branding';
    dialog.scrollTop = 0;
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
