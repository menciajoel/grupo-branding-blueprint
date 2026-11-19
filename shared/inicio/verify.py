#!/usr/bin/env python3
"""Preserve the exact approved motion assets and the approved Inicio body."""
import hashlib
import json
from pathlib import Path
import re

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
LIVE = {'/media-branding/', '/linkbranding/', '/media-print/', '/contacto/'}


def canonical_body(page):
    body = re.search(r'<body\b[^>]*>[\s\S]*?</body>', page).group(0)
    # Authorized brand-resource substitution only: the same logo slots remain.
    for brand in ('media-branding', 'linkbranding', 'media-printing'):
        body = body.replace(f'../../assets/brand/{brand}/horizontal-color-blanco-01.svg',
                            f'assets/brand/{brand}/horizontal-blanco.svg')
    # The authorized documentary cases replace one obsolete photography note,
    # add native no-JS content and anchor fallbacks. The rest stays byte-exact.
    body = re.sub(r'^      <noscript id="project-cases-fallback">.*?</noscript>\n', '', body, flags=re.M|re.S)
    if '<p class="evidence-note">' not in body:
        body = body.replace('      <div class="project-index">',
            '      <p class="evidence-note">Casos documentados · Fotografías de los proyectos por incorporar</p>\n      <div class="project-index">', 1)
    def anchor(match):
        tag = match.group(0)
        for slug in ('dunkin', 'issima', 'flying-fish'):
            tag = tag.replace(f'href="?vista=proyecto-{slug}#caso-{slug}"', f'href="?vista=proyecto-{slug}"')
        route = re.search(r'\bdata-route="([^"]+)"', tag)
        if route and route[1] in LIVE:
            tag = re.sub(r'\bhref="[^"]*"', f'href="{route[1]}"', tag)
            tag = re.sub(r'\sdata-preview="[^"]*"', '', tag)
        elif 'href="/contacto/?origen=grupo-branding"' in tag:
            # Navigation now opens Contacto Inteligente; compare presentation
            # against the approved hash using its original anchor spelling.
            tag = tag.replace('href="/contacto/?origen=grupo-branding"', 'href="#contacto" data-scroll')
        return tag
    return re.sub(r'<a\b[^>]*>', anchor, body)


def verify():
    approved = json.loads((HERE / 'approval.json').read_text())
    for name, digest in approved['motionFiles'].items():
        assert hashlib.sha256((HERE / name).read_bytes()).hexdigest() == digest, f'Approved motion changed: {name}'
    for name, digest in approved['protectedSources'].items():
        source = (ROOT / name).read_bytes()
        if name == 'experimentos/inicio-v01/motion.js':
            hook = b"    document.dispatchEvent(new CustomEvent('project-preview-render',{detail:{slug}}));\n"
            assert source.count(hook) == 1, 'One synchronous documentary renderer hook required'
            source = source.replace(hook, b'')
        assert hashlib.sha256(source).hexdigest() == digest, f'Approved source changed: {name}'
    page = (ROOT / 'experimentos/inicio-v01/index.html').read_text()
    assert hashlib.sha256(canonical_body(page).encode()).hexdigest() == approved['bodySha256'], 'Inicio body differs from the approved experiment'
    for name, digest in approved['motionFiles'].items():
        assert f'../../shared/inicio/{name}?v={digest[:12]}' in page, f'Missing/stale motion resource: {name}'
    assert page.count('class="cinematic-stack"') == 1, 'Exactly one approved section stack required'
    print('PASS · Cinematic/closing assets exact · documentary project scope isolated · hero/styles/documents preserved')


if __name__ == '__main__':
    verify()
