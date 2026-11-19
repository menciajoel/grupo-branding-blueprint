#!/usr/bin/env python3
"""Rebuild in isolation and package only the static site's dependency closure."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile

from verify_site import dependencies, validate

ROOT = Path(__file__).resolve().parents[1]
PAGES = ('experimentos/inicio-v01', 'media-branding', 'contacto', 'linkbranding', 'media-print')
LIVE_ROUTES = {'media-branding': '/media-branding/', 'contacto': '/contacto/',
               'linkbranding': '/linkbranding/', 'media-print': '/media-print/'}


def route_html(text, base, connect_inicio=False):
    def anchor(match):
        tag = match.group()
        preview = re.search(r'\bdata-preview="([^"]+)"', tag)
        if connect_inicio and preview and preview[1] in LIVE_ROUTES:
            tag = re.sub(r'\bhref="[^"]*"', f'href="{LIVE_ROUTES[preview[1]]}"', tag)
            tag = re.sub(r'\sdata-preview="[^"]*"', '', tag)
        if connect_inicio:
            tag = tag.replace('href="/contacto/"','href="/contacto/?origen=grupo-branding"')
        return tag
    text = re.sub(r'<a\b[^>]*>', anchor, text)
    return re.sub(r'\b(href|src)="(/(?!/)[^"]*)"',
                  lambda m: f'{m[1]}="{base}{m[2]}"', text)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-path', default='', help='Empty for localhost, /repository for project Pages')
    parser.add_argument('--output', default='_site')
    args = parser.parse_args()
    base = '/' + args.base_path.strip('/') if args.base_path.strip('/') else ''
    if not re.fullmatch(r'(?:/[A-Za-z0-9._-]+)*', base):
        parser.error('base-path must contain URL path segments only')
    output = Path(args.output).resolve()
    # Only this disposable, ignored directory may be replaced by a build.
    if output != ROOT / '_site':
        parser.error('output must be the repository _site directory')
    with tempfile.TemporaryDirectory(prefix='grupo-branding-build-') as tmp:
        work = Path(tmp).resolve()
        for name in ('index.html', 'docs/arq.html', 'docs/og-image.png'):
            target = work / name
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(ROOT / name, target)
        shutil.copytree(ROOT / 'assets/brand', work / 'assets/brand',
                        ignore=shutil.ignore_patterns('*.png', 'isotipo.svg', 'isotipo_color.svg'))
        shutil.copytree(ROOT / 'shared/divisions', work / 'shared/divisions',
                        ignore=shutil.ignore_patterns('__pycache__', 'output'))
        shutil.copytree(ROOT / 'shared/inicio', work / 'shared/inicio',
                        ignore=shutil.ignore_patterns('__pycache__', 'output'))
        for page in PAGES:
            target = work / page
            target.mkdir(parents=True)
            for source in (ROOT / page).iterdir():
                if source.is_file() and source.suffix in ('.py', '.json', '.html', '.css', '.js'):
                    shutil.copy2(source, target / source.name)
            assets = ROOT / page / 'assets'
            if assets.is_dir():
                shutil.copytree(assets, target / 'assets')
        env = dict(os.environ, PYTHONUTF8='1', PYTHONDONTWRITEBYTECODE='1')
        for page in PAGES:
            subprocess.run([sys.executable, '-B', str(work / page / 'build.py')], cwd=work, env=env, check=True)
        for page in ('experimentos/inicio-v01', 'media-branding'):
            subprocess.run([sys.executable, '-B', str(work / page / 'verify.py')], cwd=work, env=env, check=True)
        subprocess.run([sys.executable, '-B', str(work / 'shared/divisions/verify.py')], cwd=work, env=env, check=True)
        subprocess.run([sys.executable, '-B', str(work / 'shared/inicio/verify.py')], cwd=work, env=env, check=True)
        # Building must reproduce the approved checked-in presentation exactly.
        for page in PAGES:
            if (work / page / 'index.html').read_bytes() != (ROOT / page / 'index.html').read_bytes():
                raise RuntimeError(f'{page}/index.html is stale; regenerate and review it before packaging')
        for page in PAGES:
            path = work / page / 'index.html'
            path.write_text(route_html(path.read_text(), base, page.startswith('experimentos/')), encoding='utf-8')
        queue = ['index.html', 'docs/arq.html', 'docs/og-image.png'] + [f'{page}/index.html' for page in PAGES]
        # Dependencies selected by JavaScript are declared explicitly by the page.
        for page in PAGES:
            runtime = work / page / 'runtime-assets.json'
            if runtime.is_file():
                queue.extend(f'{page}/{name}' for name in json.loads(runtime.read_text()))
        files = set()
        while queue:
            name = queue.pop()
            if name in files:
                continue
            source = work / name
            if not source.is_file() or not source.resolve().is_relative_to(work):
                raise RuntimeError(f'Missing or escaping dependency: {name}')
            files.add(name)
            queue.extend(dependencies(source, work, base))
        # Retain third-party notices alongside the referenced vendor binaries/fonts/icons.
        for page in PAGES:
            assets = work / page / 'assets'
            if assets.exists():
                files.update(str(p.relative_to(work)) for p in assets.rglob('*') if p.is_file()
                             and (p.suffix == '.txt' or p.name in ('LICENSE', 'version.json')))
        if output.exists():
            shutil.rmtree(output)
        output.mkdir()
        for name in sorted(files):
            target = output / name
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(work / name, target)
        (output / '.nojekyll').touch()
        manifest = {'basePath': base, 'sourceCommit': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip(),
                    'files': {name: hashlib.sha256((output / name).read_bytes()).hexdigest() for name in sorted(files)}}
        (output / 'deployment.json').write_text(json.dumps(manifest, indent=2) + '\n')
    validate(output, base)
    subprocess.run([sys.executable, '-B', str(ROOT / 'tools/verify_contact_integration.py'),
                    '--directory', str(output), '--base-path', base], check=True)
    print(f'Packaged {len(files)} static files → {output}; base path: {base or "/"}')


if __name__ == '__main__':
    main()
