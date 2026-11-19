"""Reuse the approved Inicio effect; adapt selectors, never its choreography."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent


def resources():
    source = (ROOT / 'shared/inicio/cinematic.js').read_text()
    substitutions = {
        "document.getElementById('soluciones')": "document.querySelector('[data-cinematic-back]')",
        "document.getElementById('proyectos')": "document.querySelector('[data-cinematic-front]')",
        "document.querySelector('.site-header')": "document.querySelector('.division-header')",
        "id:'cinematic-soluciones-proyectos'": "id:'cinematic-division-chapter-04'",
        # Adaptive heroes rebuild their existing pin after fonts/images settle.
        # Measure this downstream stack after that pin, even if it was recreated.
        'trigger:stack,': 'trigger:stack,\n              refreshPriority:-1,',
    }
    for before, after in substitutions.items():
        assert source.count(before) == 1, 'Approved cinematic selector changed: ' + before
        source = source.replace(before, after)
    source += '\n' + (HERE / 'cinematic-resize.js').read_text()
    css = (ROOT / 'shared/inicio/cinematic.css').read_text()
    css = css.replace('#soluciones', '[data-cinematic-back]').replace('#proyectos', '[data-cinematic-front]')
    # These two existing chapters inherit an opaque canvas from the page. Their
    # suspended/overlapping planes need that same ground, without any restyling.
    css += '\n@media (prefers-reduced-motion:no-preference) {\n'
    css += '  .cinematic-stack[data-cinematic-enabled="true"] .event-chapter[data-cinematic-back],\n'
    css += '  .cinematic-stack[data-cinematic-enabled="true"] .special-chapter[data-cinematic-back],\n'
    css += '  .cinematic-stack[data-cinematic-enabled="true"] .projects-chapter[data-cinematic-front] {background:var(--ink)}\n}\n'
    return {'cinematic.js': source, 'cinematic.css': css}


def write_assets():
    for name, content in resources().items():
        (HERE / name).write_text(content)
