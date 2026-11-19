/* Preserve the existing focus()/scroll choreography. Safari can inherit a
   keyboard-visible ring when a pointer-activated link transfers focus by script.
   Associate only that concrete activation with its known destination. There is
   no global "mouse/keyboard mode", blur(), focus override or timing heuristic. */
(() => {
  'use strict';
  let transfer = null;
  let pointerDestination = null;

  function clear() {
    transfer = null;
    pointerDestination?.removeAttribute('data-pointer-focus');
    pointerDestination = null;
  }

  function destinations(control) {
    // Contact's existing handlers own stage selection and validation.
    if (control.matches('.category-choice, #continue-button, #project-button, #go-back, #show-direct, #return-to-journey')) {
      return [...document.querySelectorAll('#recorrido .step h1[tabindex]')];
    }
    if (control.matches('[data-division-choice], [data-company-switch]')) {
      return [document.getElementById(control.getAttribute('aria-controls'))];
    }
    if (!control.matches('a[href]')) return [];
    const url = new URL(control.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname ||
        url.search !== location.search || !url.hash) return [];
    let id;
    try { id = decodeURIComponent(url.hash.slice(1)); } catch { return []; }
    const target = document.getElementById(id);
    if (!target) return [];
    if (control.matches('[data-scroll]') && id === 'divisiones') {
      return [target, document.querySelector('.division-panel')];
    }
    return [target, target.querySelector('h2')];
  }

  document.addEventListener('click', event => {
    transfer = null;
    // Keyboard/AT activation (detail 0, no pointerType) keeps native heuristics.
    // The MouseEvent fallback covers Safari versions predating PointerEvent click.
    const pointer = event.isTrusted && (event.pointerType || event.detail > 0);
    if (!pointer || event.button !== 0 || event.metaKey || event.ctrlKey ||
        event.shiftKey || event.altKey) return;
    const control = event.target.closest?.('a, button');
    if (!control || control.disabled) return;
    const targets = destinations(control).filter(Boolean);
    if (targets.length) transfer = {control, targets};
  }, true);

  document.addEventListener('focusin', event => {
    if (!transfer) return;
    if (transfer.targets.includes(event.target)) {
      pointerDestination?.removeAttribute('data-pointer-focus');
      pointerDestination = event.target;
      pointerDestination.setAttribute('data-pointer-focus', '');
      transfer = null;
    } else if (event.target !== transfer.control) {
      transfer = null;
    }
  }, true);

  document.addEventListener('focusout', event => {
    if (event.target === pointerDestination) {
      pointerDestination.removeAttribute('data-pointer-focus');
      pointerDestination = null;
    }
  }, true);
  // Cancel only a pending/retained pointer exception. Do not classify input mode.
  document.addEventListener('keydown', clear, true);
  document.addEventListener('pointerdown', clear, true);
  addEventListener('pagehide', clear);
})();
