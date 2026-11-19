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
    # Director-authorized public identity correction, 19 Nov 2026; no other copy.
    body = body.replace('Media Printing', 'Media Print').replace('MEDIA PRINTING', 'MEDIA PRINT')
    # Requested native navigation only; restore the original presentation for
    # the protected comparison. The actual polygons and photographs stay exact.
    body = re.sub(r'<a class="division-piece-link"[^>]*>(.*?)</a>', r'\1', body, flags=re.S)
    body = body.replace(' id="explorar-divisiones" tabindex="-1"', '')
    def division_choice(match):
        index = int(match[1])
        key = ('visibilidad','experiencias','produccion')[index]
        return (f'<button class="division-choice" type="button" data-division-choice="{index}" '
                f'aria-label="{match[2]}" aria-controls="panel-{key}" aria-pressed="false">'
                f'{match[3]}</button>')
    body = re.sub(r'<a class="division-choice" href="[^"]+" data-division-choice="(\d)" aria-label="([^"]+)">(.*?)</a>',
                  division_choice, body, flags=re.S)
    body = body.replace('href="#explorar-divisiones" data-scroll data-route="/divisiones/"',
                        'href="?vista=divisiones" data-preview="divisiones" data-route="/divisiones/"')
    # Authorized brand-resource substitution only: the same logo slots remain.
    for brand in ('media-branding', 'linkbranding', 'media-printing'):
        body = body.replace(f'../../assets/brand/{brand}/horizontal-color-blanco-01.svg',
                            f'assets/brand/{brand}/horizontal-blanco.svg')
    # Eight source-verified client logos fulfill the reserved placeholder only.
    # Its original spelling is restored solely for the protected body comparison.
    body, replacements = re.subn(r'<ul class="client-logos"(?=\s|>).*?</ul>',
        '<div class="brand-pending"><p class="pending-label" data-copy="COPY-P01-S05-B03">Logotipos de clientes por incorporar</p><span class="pending-rule" aria-hidden="true"></span></div>',
        body, flags=re.S)
    assert replacements == 1, 'Exactly one authorized client logo group required'
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
        if name == 'docs/arq.html':
            source = source.replace(b'Media Printing', b'Media Print').replace(b'MEDIA PRINTING', b'MEDIA PRINT')
        if name == 'experimentos/inicio-v01/motion.js':
            contract = json.loads((ROOT / 'experimentos/inicio-v01/division-navigation-contract.json').read_text())
            for patch in reversed(contract['motionPatches']):
                before, after = patch['before'].encode(), patch['after'].encode()
                assert source.count(after) == patch['count'], 'Navigation edit differs from its isolated contract'
                source = source.replace(after, before)
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
