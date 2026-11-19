#!/usr/bin/env python3
"""Build the fixed Inicio composition from structured editorial data."""
import html
import hashlib
import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import quote
from project_views import render as render_project_views

ROOT = Path(__file__).resolve().parent
content = json.loads((ROOT / 'content.json').read_text(encoding='utf-8'))
media = json.loads((ROOT / 'media.json').read_text(encoding='utf-8'))
blocks = {b['id']: b for section in content['sections'].values() for b in section['blocks']}
media_by_id = {m['id']: m for m in media['items']}
esc = lambda text: html.escape(str(text), quote=True)
ROUTES = {'ARQ-P03':'/divisiones/','ARQ-P04':'/media-branding/','ARQ-P05':'/linkbranding/','ARQ-P06':'/media-print/','ARQ-P07':'/portafolio/','ARQ-P08':'/contacto/'}
BRANDS = ('media-branding','linkbranding','media-printing')
MEDIA = ('visibilidad','experiencias','produccion')


def block_id(section, number):
    return f'COPY-P01-S{section:02d}-B{number:02d}'


def text(section, number):
    return blocks[block_id(section, number)].get('text','').strip('[]')


def tag(kind, section, number, cls=''):
    heading_ids={2:'division-heading',3:'solutions-heading',4:'projects-heading',5:'brands-heading',6:'why-heading',7:'contact-heading',8:'newsletter-heading'}
    heading=f' id="{heading_ids[section]}"' if kind=='h2' else ''
    return f'<{kind}{heading} class="{cls}" data-copy="{block_id(section,number)}">{esc(text(section,number))}</{kind}>'


def icon(name='arrow-up-right', size=20):
    return f'<img class="ui-icon" src="assets/icons/{name}.svg" width="{size}" height="{size}" alt="">'


def action(section, number, cls='text-link'):
    b = blocks[block_id(section,number)]
    route = ROUTES[b['destinationArchitectureId']]
    slug = route.strip('/')
    if slug == 'contacto':
        return f'<a class="{cls}" href="/contacto/?origen=grupo-branding" data-route="{route}"><span data-copy="{b["id"]}">{esc(b["text"].strip("[]"))}</span>{icon()}</a>'
    return f'<a class="{cls}" href="?vista={quote(slug)}" data-preview="{slug}" data-route="{route}"><span data-copy="{b["id"]}">{esc(b["text"].strip("[]"))}</span>{icon()}</a>'


def photo(key, cls='', eager=False):
    m = media_by_id[key]
    srcset = ', '.join(f'assets/media/{key}-{w}.webp {w}w' for w in m['sizes'])
    src = f'assets/media/{key}-{m["sizes"][0]}.webp'
    return f'<img class="{cls}" src="{src}" srcset="{srcset}" sizes="(min-width:1100px) 50vw, 100vw" width="1600" height="1067" alt="{esc(m["alt"])}" style="object-position:{esc(m["position"])}" {"fetchpriority=high" if eager else "loading=lazy"} decoding="async">'


# Geometry and fills are read from the official extracted asset, never redrawn.
NS = '{http://www.w3.org/2000/svg}'
original = ET.parse(ROOT/'assets/brand/grupo-branding/isotipo-color.svg').getroot()
style = ''.join(original.find(NS+'defs').itertext())
fills = dict(re.findall(r'\.(\S+)\s*\{\s*fill:\s*([^;]+);',style))
source_polygons = list(original.iter(NS+'polygon'))
# The official order is cyan, navy, electric. Content order is visibility, experiences, production.
polygons = [source_polygons[2],source_polygons[1],source_polygons[0]]
geometry = []
for p in polygons:
    nums = [float(n) for n in re.findall(r'-?\d*\.?\d+',p.get('points'))]
    xs, ys = nums[0::2], nums[1::2]
    geometry.append({'points':p.get('points'),'fill':fills[p.get('class')], 'x':min(xs),'y':min(ys),'width':max(xs)-min(xs),'height':max(ys)-min(ys)})


def brand_svg(mobile=False):
    suffix = 'mobile' if mobile else 'main'
    defs, pieces = [], []
    for i,g in enumerate(geometry):
        key = MEDIA[i]
        defs.append(f'<clipPath id="facet-{suffix}-{i}" clipPathUnits="userSpaceOnUse"><polygon points="{g["points"]}"/></clipPath>')
        defs.append(f'<clipPath id="reveal-{suffix}-{i}" clipPathUnits="userSpaceOnUse"><rect class="photo-wipe" data-width="{g["width"]}" x="{g["x"]}" y="{g["y"]}" width="{g["width"]}" height="{g["height"]}"/></clipPath>')
        pieces.append(f'''<g class="piece-stage" data-piece="{i}"><g class="piece-arrival"><polygon class="official-piece" data-native-fill="{g['fill']}" fill="{g['fill']}" points="{g['points']}"/>
          <g class="facet-photo" data-facet="{i}" clip-path="url(#facet-{suffix}-{i})"><g class="facet-media" clip-path="url(#reveal-{suffix}-{i})"><image href="assets/media/{key}-{'800' if i==0 else '720'}.webp" x="{g['x']}" y="{g['y']}" width="{g['width']}" height="{g['height']}" preserveAspectRatio="xMidYMid slice"/></g></g></g></g>''')
    return f'<svg class="{"mobile-division-art" if mobile else "brand-art"}" viewBox="0 0 221.4 211.53" aria-hidden="true" focusable="false"><defs>{"".join(defs)}</defs><g class="isotype-stage">{"".join(pieces)}</g></svg>'


headline = text(1,1)
lines = ['Publicidad exterior,','experiencias de marca','y producción','en un mismo grupo']
if ' '.join(lines) == headline:
    headline_html = '\n'.join(f'<span class="headline-mask"><span class="kinetic-line {"accent-line" if i==3 else ""}"><span class="word-enter">{esc(line)}</span></span></span>' for i,line in enumerate(lines))
else:
    headline_html = f'<span class="headline-mask"><span class="kinetic-line"><span class="word-enter">{esc(headline)}</span></span></span>'

division_switches, division_panels, division_choices = [], [], []
for i,(brand,key,start) in enumerate(zip(BRANDS,MEDIA,(3,6,9))):
    name,category=text(2,start).split(' · ',1)
    division_choices.append(f'<button class="division-choice" type="button" data-division-choice="{i}" aria-label="{esc(text(2,start))}" aria-controls="panel-{key}" aria-pressed="false"><span class="choice-category">{esc(category)}</span><span class="choice-name">{esc(name)}</span><span class="choice-accent" aria-hidden="true"></span></button>')
    division_switches.append(f'<a class="division-switch" href="#panel-{key}" data-company-switch="{i}" aria-controls="panel-{key}">{esc(name)}{icon(size=16)}</a>')
    division_panels.append(f'<article id="panel-{key}" class="division-panel" data-panel="{i}" aria-labelledby="company-{key}" tabindex="-1"><h3 class="sr-only" id="company-{key}" data-copy="{block_id(2,start)}">{esc(text(2,start))}</h3><div class="division-logo-window"><img class="division-logo" src="../../assets/brand/{brand}/horizontal-color-blanco-01.svg" width="150" height="46" alt="" loading="lazy"></div><div class="division-panel-body">{tag("p",2,start+1)}{action(2,start+2,"button button-primary")}</div></article>')

solutions = []
for i,start in enumerate((3,5,7,9)):
    solutions.append(f'<li class="solution-row" data-solution="{i}"><span class="solution-number" aria-hidden="true">0{i+1}</span><div><h3><button type="button" data-solution-select="{i}" aria-controls="solution-visual" aria-pressed="{str(i==0).lower()}"><span data-copy="{block_id(3,start)}">{esc(text(3,start))}</span></button></h3>{tag("p",3,start+1)}</div></li>')
solution_photos = ''.join(f'<figure class="solution-photo" data-solution-photo="{i}">{photo(key)}</figure>' for i,key in enumerate(('visibilidad','experiencias','experiencias','produccion')))

project_rows, destination_data = [], {}
for route,item in content['destinations'].items():
    if route=='/':continue
    destination_data[route.strip('/')]={**item,'route':route}
for i,p in enumerate(content['projects']):
    slug = p['routeProposal'].strip('/').split('/')[-1]
    key='proyecto-'+slug
    division_label=' + '.join(content['destinations'][ROUTES[division]]['name'] for division in p['divisionIds'])
    project_rows.append(f'<a class="project-row" href="?vista={key}#caso-{slug}" data-preview="{key}" data-route="{esc(p["routeProposal"])}"><span class="project-index" aria-hidden="true">0{i+1}</span><h3>{esc(p["name"])}</h3><span class="project-division">{esc(division_label)}</span>{icon(size=32)}</a>')
    destination_data[key]={'name':p['name'],'headline':p['name'],'body':p['presentation'],'execution':p['execution'],'route':p['routeProposal'],'testimonial':p.get('testimonial'),'evidence':p.get('photoEvidence'),'photo':p.get('photo')}

project_templates, project_fallback = render_project_views(ROOT, content, icon)
clients = json.loads((ROOT / 'clients.json').read_text())
client_logos = ('<ul class="client-logos" role="list" aria-label="Clientes" '
                f'data-copy="{block_id(5,3)}" data-pending-id="{clients["fulfills"]["pendingId"]}">'
                + ''.join(f'<li data-client-id="{esc(client["id"])}"><img data-client-logo="{esc(client["id"])}" '
                          f'src="{esc(client["image"]["file"])}" width="{client["image"]["width"]}" '
                          f'height="{client["image"]["height"]}" alt="{esc(client["name"])}" loading="lazy" decoding="async" '
                          f'style="--client-logo-width:{client["opticalWidth"]}px"></li>' for client in clients['clients'])
                + '</ul>')
values = ''.join(f'<article class="value-row"><span class="value-index" aria-hidden="true">0{i+1}</span>{tag("h3",6,start)}{tag("p",6,start+1)}</article>' for i,start in enumerate((3,5,7)))
newsletter_support = content['newsletter']['sections']
consent = next(b for b in newsletter_support[0]['blocks'] if b['type']=='consent')
success = newsletter_support[1]['blocks'][0]
error = newsletter_support[2]['blocks'][0]
credits=''.join(f'<li><a href="{esc(m["source"])}" target="_blank" rel="noopener noreferrer">{esc(m["author"])} · Unsplash{icon(size=18)}</a></li>' for m in media['items'])

values = {
 'CLIENT_STYLE_HASH':hashlib.sha256((ROOT/'clients.css').read_bytes()).hexdigest()[:12],
 'CLIENT_LOGOS':client_logos,
 'PROJECT_STYLE_HASH':hashlib.sha256((ROOT/'projects.css').read_bytes()).hexdigest()[:12],
 'PROJECT_MOTION_HASH':hashlib.sha256((ROOT/'projects.js').read_bytes()).hexdigest()[:12],
 'PROJECT_CASE_TEMPLATES':project_templates,
 'PROJECT_CASES_FALLBACK':project_fallback,
 'FOCUS_CSS_HASH':hashlib.sha256((ROOT.parents[1]/'shared/focus/focus.css').read_bytes()).hexdigest()[:12],
 'FOCUS_JS_HASH':hashlib.sha256((ROOT.parents[1]/'shared/focus/focus.js').read_bytes()).hexdigest()[:12],
 'CINEMATIC_STYLE_HASH':hashlib.sha256((ROOT.parents[1]/'shared/inicio/cinematic.css').read_bytes()).hexdigest()[:12],
 'CINEMATIC_MOTION_HASH':hashlib.sha256((ROOT.parents[1]/'shared/inicio/cinematic.js').read_bytes()).hexdigest()[:12],
 'CLOSING_STYLE_HASH':hashlib.sha256((ROOT.parents[1]/'shared/inicio/closing.css').read_bytes()).hexdigest()[:12],
 'CLOSING_MOTION_HASH':hashlib.sha256((ROOT.parents[1]/'shared/inicio/closing.js').read_bytes()).hexdigest()[:12],
 'MOTION_HASH':hashlib.sha256((ROOT/'motion.js').read_bytes()).hexdigest()[:12],
 'STYLE_HASH':hashlib.sha256((ROOT/'styles.css').read_bytes()).hexdigest()[:12],
 'META':esc(text(1,2)), 'HERO_TITLE':headline_html,'HERO_BODY':tag('p',1,2,'hero-lead'),
 'HERO_ACTIONS':action(1,3,'button button-primary')+action(1,4,'button button-outline'),
 'BRAND_ART':brand_svg(), 'MOBILE_DIVISION_ART':brand_svg(True),
 'DIVISION_TITLE':tag('h2',2,1),'DIVISION_BODY':tag('p',2,2,'division-lead'),
 'DIVISION_CHOICES':''.join(division_choices),
 'DIVISION_SWITCHES':''.join(division_switches),'DIVISION_PANELS':''.join(division_panels),
 'SOLUTIONS_TITLE':tag('h2',3,1),'SOLUTIONS_BODY':tag('p',3,2),
 'SOLUTIONS_ROWS':''.join(solutions),'SOLUTIONS_PHOTOS':solution_photos,
 'PROJECTS_TITLE':tag('h2',4,1),'PROJECTS_BODY':tag('p',4,2),'PROJECTS_ACTION':action(4,3,'text-link'), 'PROJECT_ROWS':''.join(project_rows),
 'BRANDS_TITLE':tag('h2',5,1),'BRANDS_BODY':tag('p',5,2),
 'WHY_TITLE':tag('h2',6,1),'WHY_BODY':tag('p',6,2),'VALUES':values,
 'CONTACT_TITLE':tag('h2',7,1),'CONTACT_BODY':tag('p',7,2),'CONTACT_ACTION':action(7,3,'button button-primary'),
 'NEWS_TITLE':tag('h2',8,1),'NEWS_BODY':tag('p',8,2),
 'EMAIL_LABEL':f'<span data-copy="{block_id(8,3)}">{esc(text(8,3))}</span>',
 'NEWS_BUTTON':f'<span data-copy="{block_id(8,4)}">{esc(text(8,4))}</span>',
 'NEWS_CONSENT':f'<span data-copy="{consent["id"]}">{esc(consent["text"])}</span>',
 'SUCCESS':esc(success['text']),'SUCCESS_ID':success['id'],'ERROR':esc(error['text']),'ERROR_ID':error['id'],
 'CREDITS':credits,
 'DESTINATION_DATA':json.dumps(destination_data,ensure_ascii=False).replace('<','\\u003c'),
 'GEOMETRY_DATA':json.dumps([{k:v for k,v in g.items() if k!='points'} for g in geometry]).replace('<','\\u003c')
}
template=(ROOT/'template.html').read_text(encoding='utf-8')
for heading in ('division','solutions','projects','brands','why','contact','newsletter'):
    template=template.replace(f' id="{heading}-heading"','')
for name,value in values.items():template=template.replace('{{'+name+'}}',value)
assert not re.search(r'\{\{[A-Z_]+\}\}',template), 'Unresolved template field'
(ROOT/'index.html').write_text(template,encoding='utf-8')
print('Inicio completo renderizado · 8 secciones · 3 casos documentados · geometría oficial')
