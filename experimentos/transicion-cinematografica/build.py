#!/usr/bin/env python3
"""Rebuild the local reference from the consolidated Inicio and shared motion."""
from pathlib import Path
import re
import shutil
import sys

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
SOURCE = ROOT / 'experimentos/inicio-v01'
MOTION = ROOT / 'shared/inicio'
sys.path.insert(0, str(ROOT / 'tools'))
from build_site import route_html

for name in ('styles.css', 'motion.js'):
    shutil.copy2(SOURCE / name, HERE / name)
shutil.copytree(SOURCE / 'assets', HERE / 'assets', dirs_exist_ok=True)
for name in ('cinematic.css', 'cinematic.js', 'closing.css', 'closing.js'):
    shutil.copy2(MOTION / name, HERE / name)
page = route_html((SOURCE / 'index.html').read_text(), '', connect_inicio=True)
page = re.sub(r'<title>.*?</title>', '<title>Grupo Branding · Transición Soluciones → Proyectos · Experimento local</title>', page)
for name in ('cinematic.css', 'cinematic.js', 'closing.css', 'closing.js'):
    page = page.replace(f'../../shared/inicio/{name}', name)
assert page.count('class="cinematic-stack"') == 1, 'Consolidated Inicio must contain one approved stack'
(HERE / 'index.html').write_text(page)
# baseline.json is the historical approval record, never a generated output.
print('Local reference rebuilt; production sources and approval records untouched.')
