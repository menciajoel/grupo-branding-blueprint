"""Shared static presentation for the two new divisions. Approved pages stay read-only."""
from pathlib import Path
import hashlib
import html
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'media-branding'))
from projects_render import project_gallery


def esc(value):
    return html.escape(str(value), quote=True)


def render(folder):
    page_root = ROOT / folder
    page = json.loads((page_root / 'content.json').read_text())
    config = json.loads((page_root / 'design.json').read_text())
    media = json.loads((page_root / 'media.json').read_text())
    sections = {int(s['id'].rsplit('S', 1)[1]): s for s in page['sections']}
    images = {i['id']: i for i in media['items']}
    name = page['name']
    prefix = page['id']
    contact = '../contacto/?servicio=' + folder + '&amp;origen=' + folder
    icons = '../media-branding/assets/icons/'

    def icon(kind='arrow-up-right', size=22):
        return f'<img src="{icons}{kind}.svg" width="{size}" height="{size}" alt="">'

    def item(s, b):
        return next(x for x in sections[s]['blocks'] if x['id'].endswith(f'B{b:02}'))

    def block(s, b, tag=None, css=''):
        value = item(s, b)
        tag = tag or value['type'] if value['type'] in ('h1', 'h2', 'h3') else tag or 'p'
        identity = f' id="heading-{s}"' if tag == 'h2' else ''
        return f'<{tag}{identity} class="{css}" data-copy="{value["id"]}">{esc(value["text"])}</{tag}>'

    def action(s, b, target=None):
        value = item(s, b)
        return f'<a class="button" href="{target or contact}" data-copy="{value["id"]}" data-destination="{value.get("destinationArchitectureId", "ARQ-P08")}"><span>{esc(value["text"].strip("[]"))}</span>{icon()}</a>'

    def label(s, number):
        return f'<p class="section-label"><span aria-hidden="true">{number:02} / </span>{esc(sections[s]["name"])}</p>'

    def image(key, css='', eager=False, position=None):
        m = images[key]
        source = m.get('externalPrefix', 'assets/media/' + key)
        widths = m['sizes']
        srcset = ', '.join(f'{source}-{w}.webp {w}w' for w in widths)
        w, h = m['originalDimensions']
        loading = 'fetchpriority="high"' if eager else 'loading="lazy"'
        return f'<img class="{css}" src="{source}-{widths[-2]}.webp" srcset="{srcset}" sizes="(max-width:700px) 100vw, 75vw" width="{w}" height="{h}" {loading} decoding="async" alt="{esc(m["alt"])}" style="object-position:{position or m.get("position", "50% 50%")}">'

    def photo(key, css=''):
        return f'<figure class="division-photo {css}" data-media="{key}"><div class="photo-shell">{image(key)}</div><figcaption>{esc(images[key]["disclosure"])}</figcaption></figure>'

    def opening(s, number, css='', photo_id=None):
        return f'<section class="division-section {css}" id="{config["anchors"][str(s)]}" data-section="{sections[s]["id"]}" aria-labelledby="heading-{s}"><div class="section-inner"><div class="section-copy">{label(s, number)}{block(s, 1)}{block(s, 2, css="section-description")}</div>{photo(photo_id) if photo_id else ""}'

    if folder == 'linkbranding':
        chapters = opening(3, 2, 'split-chapter light-chapter', 'link-calle') + '</div></section>'
        chapters += opening(4, 3, 'event-chapter', 'experiencias') + '</div></section>'
        chapters += '<div class="participation-group">'
        for n, s in enumerate((5, 6, 7), 4):
            chapters += opening(s, n, 'participation-chapter') + '<div class="editorial-rule" aria-hidden="true"></div></div></section>'
        chapters += photo('link-calle', 'participation-photo') + '</div>'
        chapters += opening(8, 7, 'statement-chapter') + '</div></section>'
        chapters += opening(9, 8, 'coordination-chapter') + '</div></section>'
        chapters += opening(11, 9, 'group-chapter')
        chapters += '<div class="group-composition">' + ''.join(f'<a href="../{route}/"><img src="../assets/brand/{brand}/horizontal-color-blanco-01.svg" width="300" height="100" alt="{title}"></a>' for route, brand, title in [('media-branding', 'media-branding', 'Media Branding'), ('media-print', 'media-printing', 'Media Print')]) + '</div>'
        chapters += action(11, 3, '../experimentos/inicio-v01/#divisiones') + '</div></section>'
        last = 12
    else:
        chapters = opening(3, 2, 'production-chapter light-chapter', 'print-espacios')
        chapters += '<div class="production-capabilities">'
        for b in (4, 6, 8):
            chapters += '<article>' + block(3, b) + block(3, b + 1) + '</article>'
        chapters += '</div></div></section>'
        chapters += opening(4, 3, 'special-chapter', 'print-vehiculo')
        chapters += '<div class="special-capabilities">'
        for b in (3, 5):
            chapters += '<article>' + block(4, b) + block(4, b + 1) + '</article>'
        chapters += '</div></div></section>'
        data = json.loads((page_root / 'projects.json').read_text())
        gallery = project_gallery(data, images).replace('heading-11', 'heading-5').replace('src="assets/icons/', f'src="{icons}')
        chapters += f'<section class="division-section projects-chapter" id="proyectos" data-section="{prefix}-S05" aria-labelledby="heading-5"><div class="section-inner section-heading"><div>{label(5,4)}{block(5,1)}</div>{block(5,2,css="section-description")}</div>{gallery}</section>'
        last = 6

    chapters += f'<section class="division-section division-closing" id="consulta" data-section="{prefix}-S{last:02}" aria-labelledby="heading-{last}">{photo(config["closingImage"], "closing-image")}<div class="closing-shade" aria-hidden="true"></div><div class="section-inner"><p class="section-label">{esc(name)}</p>{block(last,1)}<div class="editorial-rule" aria-hidden="true"></div><div class="closing-action">{block(last,2)}{action(last,3)}</div></div></section>'

    def nav_links(items):
        return ''.join(f'<a href="{target}" data-section-link>{esc(title)}</a>' for title, target in items)

    logo = '../assets/brand/' + config['brandFolder'] + '/horizontal-color-blanco-01.svg'
    group = '../assets/brand/grupo-branding/horizontal-blanco.svg'
    words = item(1, 1)['text'].split()
    lines = []
    for count in config['heroLineBreaks']:
        if words:
            lines.append(' '.join(words[:count]))
            words = words[count:]
    if words:
        lines.append(' '.join(words))
    heading = f'<h1 id="hero-title" data-copy="{item(1,1)["id"]}" aria-label="{esc(item(1,1)["text"])}">' + ' '.join(f'<span class="headline-line" aria-hidden="true"><span>{esc(line)}</span></span>' for line in lines) + '</h1>'
    resolve_detail = block(2, 3, css='resolve-description') if len(sections[2]['blocks']) == 3 else ''
    resolve_label = sections[2]['name']
    css_paths = ['../media-branding/styles.css', '../shared/divisions/sections.css', 'theme.css', '../shared/focus/focus.css']
    js_paths = ['../shared/focus/focus.js', '../shared/divisions/hero.js', '../shared/divisions/sections.js']
    if folder == 'media-print':
        css_paths.insert(1, '../media-branding/projects.css')
        js_paths.append('../media-branding/projects.js')
    def url(path):
        return path + '?v=' + hashlib.sha256((page_root / path).resolve().read_bytes()).hexdigest()[:12]
    styles = ''.join(f'<link rel="stylesheet" href="{url(path)}">' for path in css_paths)
    scripts = ''.join(f'<script src="{url(path)}" defer></script>' for path in js_paths)
    # Read-only measurement source; no second page, assets or animation is loaded.
    reference_source = (ROOT / 'media-branding/index.html').read_text()
    reference = ''.join(re.search(r'<section class="' + css + r'".*?</section>', reference_source, re.S)[0]
                        for css in ('hero-copy', 'resolve-copy'))
    reference = re.sub(r'\s(?:id|data-copy|aria-labelledby|tabindex)="[^"]*"', '', reference)
    reference = re.sub(r'<img\b[^>]*>', '<span style="display:block;width:22px;height:22px;flex-shrink:0"></span>', reference)
    reference_data = json.dumps(reference, ensure_ascii=False).replace('<', '\\u003c')
    result = f'''<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="{config['canvas']}">
<title>{esc(name)} | Grupo Branding</title><meta name="description" content="{esc(item(1,2)['text'])}"><link rel="icon" href="../contacto/assets/{folder}-isotipo.svg" type="image/svg+xml">
{styles}<script type="application/json" id="hero-geometry-reference">{reference_data}</script><script src="../media-branding/assets/vendor/gsap.min.js" defer></script><script src="../media-branding/assets/vendor/ScrollTrigger.min.js" defer></script>{scripts}</head>
<body class="division-page new-division {folder}" data-resolve-label="{esc(resolve_label)}"><a class="skip-link" href="#contenido">Saltar al contenido</a>
<header class="division-header"><a class="brand-link" href="#inicio" aria-label="{esc(name)} · Inicio"><img src="{logo}" width="{config['logoWidth']}" height="{config['logoHeight']}" alt="{esc(name)}"></a><button class="menu-toggle" type="button" aria-controls="division-navigation" aria-expanded="false" aria-label="Abrir menú" hidden><span>Menú</span>{icon('menu',24)}</button><nav id="division-navigation" aria-label="{esc(name)}">{nav_links(config['navigation'])}<a href="{contact}">Contacto</a></nav></header>
<main id="contenido"><div class="division-journey" id="inicio"><div class="journey-stage" data-state="hero"><div class="photo-window"><div class="photo-depth">{image(config['heroImage'],'journey-photo',True)}</div></div><div class="photo-shade" aria-hidden="true"></div>
<section class="hero-copy" aria-labelledby="hero-title" data-section="{prefix}-S01">{heading}{block(1,2,css='hero-description')}<div class="hero-action">{action(1,3)}</div></section>
<section class="resolve-copy" id="que-resolvemos" tabindex="-1" aria-labelledby="heading-2" data-section="{prefix}-S02"><p class="section-label">01 / {esc(resolve_label)}</p><div class="resolve-title-mask">{block(2,1)}</div><div class="resolve-paragraphs">{block(2,2,css='resolve-lead')}{resolve_detail}</div></section>
<a class="continue-link" href="#que-resolvemos"><span>{esc(resolve_label)}</span>{icon('arrow-down',20)}</a><span class="scene-index" aria-hidden="true"><span class="scene-current">01</span><span class="index-rule"></span>02</span><span class="hero-provenance">{esc(images[config['heroImage']]['disclosure'])}</span></div></div>
<div class="extended-page">{chapters}</div></main>
<footer class="division-footer section-inner"><div class="footer-identities"><a href="#inicio"><img src="{logo}" width="{config['logoWidth']}" height="{config['logoHeight']}" alt="{esc(name)}"></a><a href="../experimentos/inicio-v01/" aria-label="Grupo Branding · Inicio"><img src="{group}" width="200" height="65" alt="Grupo Branding"></a></div><nav aria-label="Divisiones">{''.join(f'<a href="../{route}/">{title}</a>' for title,route in [('Media Branding','media-branding'),('Linkbranding','linkbranding'),('Media Print','media-print')] if route != folder)}<a href="{contact}">Contacto</a><a href="#inicio">Volver al inicio</a></nav></footer></body></html>'''
    (page_root / 'index.html').write_text(result + '\n')
    trace = [{'id': b['id'], 'text': b['text'], 'rendered': True} for s in page['sections'] for b in s['blocks']]
    (page_root / 'editorial-trace.json').write_text(json.dumps({'source': 'docs/arq.html — COPY-03', 'blocks': trace}, ensure_ascii=False, indent=2) + '\n')
    print(f'{name}: {len(sections)} sections / {len(trace)} approved blocks rendered')
