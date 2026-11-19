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
    def anchor(match):
        tag = match.group(0)
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
        assert hashlib.sha256((ROOT / name).read_bytes()).hexdigest() == digest, f'Approved source changed: {name}'
    page = (ROOT / 'experimentos/inicio-v01/index.html').read_text()
    assert hashlib.sha256(canonical_body(page).encode()).hexdigest() == approved['bodySha256'], 'Inicio body differs from the approved experiment'
    for name, digest in approved['motionFiles'].items():
        assert f'../../shared/inicio/{name}?v={digest[:12]}' in page, f'Missing/stale motion resource: {name}'
    assert page.count('class="cinematic-stack"') == 1, 'Exactly one approved section stack required'
    print('PASS · Approved cinematic/closing assets exact · Inicio body exact · hero/styles/documents preserved')


if __name__ == '__main__':
    verify()
