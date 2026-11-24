#!/usr/bin/env python3
"""Render the division pilot from approved, editable content. No build dependencies."""
import hashlib
import html
import json
import sys
from pathlib import Path
from components import editorial_block, figure, section_label, section_links, action as editorial_action
from projects_render import project_gallery

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT.parent / 'shared/divisions'))
from cinematic import write_assets
from navigation import division_navigation
write_assets()
content = json.loads((ROOT / 'content.json').read_text())
media = json.loads((ROOT / 'media.json').read_text())
presentation = json.loads((ROOT / 'presentation-copy.json').read_text())
proposals = {item['role']:item for item in presentation['blocks']}
blocks = {b['id']: b for section in content['sections'] for b in section['blocks']}
esc = lambda value: html.escape(str(value), quote=True)

def block(section, number, element, css=''):
    key = f'COPY-P04-S{section:02d}-B{number:02d}'
    identity = ' id="resolve-title"' if section == 2 and number == 1 else ''
    return f'<{element}{identity} class="{css}" data-copy="{key}">{esc(blocks[key]["text"])}</{element}>'

def navigation():
    links = []
    for i, item in enumerate(content['navigation']):
        if item['target'] == '/contacto/':
            links.append(division_navigation('media-branding'))
        attrs = ' data-section-link' if item['target'].startswith('#') else ''
        current = ' aria-current="page"' if i == 0 else ''
        links.append(f'<a href="{esc(item["target"])}"{attrs}{current} aria-label="{esc(item["label"])}"><span>{esc(item["label"])}</span></a>')
    return '\n'.join(links)

headline = blocks['COPY-P04-S01-B01']['text']
lines = ['Publicidad exterior', 'y espacios estratégicos', 'para hacer visible', 'tu marca']
assert ' '.join(lines) == headline
heading = '<h1 id="hero-title" data-copy="COPY-P04-S01-B01">' + ' '.join(f'<span class="headline-line"><span>{esc(line)}</span></span>' for line in lines) + '</h1>'
cta = blocks['COPY-P04-S01-B03']
assert cta['destinationArchitectureId'] == 'ARQ-P08'
media_by_id={item['id']:item for item in media['items']}
projects=json.loads((ROOT/'projects.json').read_text())
def b(section,number): return blocks[f'COPY-P04-S{section:02d}-B{number:02d}']
def h(section,css=''):
    if section==12:
        lines=['Encuentra el','espacio para tu','próxima campaña']
        assert ' '.join(lines)==b(section,1)['text']
        return '<h2 id="heading-12" data-copy="COPY-P04-S12-B01">'+' '.join(f'<span class="closing-line"><span>{esc(line)}</span></span>' for line in lines)+'</h2>'
    return editorial_block(b(section,1),'h2',css,f'heading-{section}')
def p(section,number,css=''): return editorial_block(b(section,number),'p',css)
def photo(key,css='',sizes='(max-width:700px) 100vw, 60vw',extra=''): return figure(media_by_id[key],css,sizes,extra)

format_data=[('unipolares','Vallas unipolares','exterior-unipolar'),('puentes','Puentes','formato-puentes'),('banderines','Banderines','formato-banderines'),('minivallas','Minivallas','formato-minivallas')]
format_tabs=''.join(f'<button type="button" role="tab" id="tab-{key}" aria-selected="{str(i==0).lower()}" aria-controls="format-{key}" tabindex="{0 if i==0 else -1}" data-format="{i}"><span class="format-number" aria-hidden="true">0{i+1}</span><span>{label}</span><span class="format-marker" aria-hidden="true"></span></button>' for i,(key,label,_) in enumerate(format_data))
format_panels=''.join(photo(image_id,'format-panel','(max-width:700px) 100vw, 65vw',f'id="format-{key}" role="tabpanel" aria-labelledby="tab-{key}" data-format-panel="{i}" {"hidden" if i else ""}').replace('</figure>',f'<figcaption class="format-caption" aria-hidden="true">{esc(label)}</figcaption></figure>') for i,(key,label,image_id) in enumerate(format_data))
def proposal(role,element,css=''):
    item=proposals[role]
    return f'<{element} class="{css}" data-presentation-copy="{item["id"]}">{esc(item["text"])}</{element}>'
page_sections=f'''
  <div class="chapter-index page-width">{section_links(content['sectionNavigation'],'chapter-links')}</div>
  <section class="chapter exterior-chapter" id="publicidad-exterior" aria-labelledby="heading-3" data-section="COPY-P04-S03">
    <div class="chapter-heading page-width"><div>{section_label(2,'Publicidad exterior')}{h(3)}</div><div class="chapter-prose">{p(3,2)}{p(3,3)}</div></div>
    <div class="exterior-composition page-width">{photo('exterior-puente','exterior-primary','(max-width:700px) 100vw, 75vw')}{photo('exterior-unipolar','exterior-detail','(max-width:700px) 52vw, 27vw')}</div>
  </section>
  <div class="cinematic-stack">
  <section class="chapter retail-chapter" id="retail" aria-labelledby="heading-4" data-section="COPY-P04-S04" data-cinematic-back>
    <div class="retail-grid page-width"><div class="retail-copy">{section_label(3,'Retail y punto de venta')}{h(4)}{p(4,2,'chapter-paragraph')}</div><div class="retail-visuals">{photo('concepto-retail','retail-primary','(max-width:700px) 85vw, 38vw')}{photo('concepto-retail-detalle','retail-detail','(max-width:700px) 64vw, 24vw')}</div></div>
  </section>
  <section class="chapter formats-chapter" id="vallas-y-formatos-publicitarios" aria-labelledby="heading-6" data-section="COPY-P04-S06" data-cinematic-front>
    <div class="chapter-heading page-width"><div>{section_label(4,'Vallas y formatos publicitarios')}{h(6)}</div>{p(6,2,'chapter-paragraph')}</div>
    <div class="format-explorer page-width"><div class="format-visual" aria-busy="false">{format_panels}</div><div class="format-tabs" role="tablist" aria-label="Vallas y formatos publicitarios" aria-orientation="vertical">{format_tabs}</div></div>
  </section>
  </div>
  <section class="chapter coverage-chapter" id="cobertura" aria-labelledby="heading-10" data-section="COPY-P04-S10">
    {photo('cobertura-ciudad','coverage-visual','100vw')}<div class="coverage-shade" aria-hidden="true"></div>
    <div class="coverage-copy page-width">{section_label(5,'Cobertura')}{h(10,'coverage-heading').replace('Honduras','<span>Honduras</span>')}{p(10,2,'chapter-paragraph')}</div>
  </section>
  <section class="chapter projects-chapter" id="proyectos" aria-labelledby="heading-11" data-section="COPY-P04-S11">
    <div class="chapter-heading page-width"><div>{section_label(6,'Proyectos')}{h(11).replace('su espacio','<span class="project-title-last">su espacio</span>')}</div><div class="chapter-prose">{p(11,2)}</div></div>
    {project_gallery(projects,media_by_id)}
  </section>
  <section class="chapter properties-chapter" id="predios-privados" aria-labelledby="heading-13" data-section="COPY-P04-S13">
    <div class="properties-grid page-width"><div><p class="section-label"><span aria-hidden="true">07 / </span><span data-copy="COPY-P04-S13-B01">{esc(b(13,1)['text'])}</span></p><h2 id="heading-13" data-presentation-copy="{proposals['headline']['id']}">{esc(proposals['headline']['text'])}</h2>{proposal('paragraph','p','chapter-paragraph')}</div><ul class="pending-resources property-contact" aria-label="Predios privados"><li><p class="property-types" data-copy="COPY-P04-S13-B03">{esc(b(13,3)['text'])}</p><a class="button" href="{proposals['cta']['target']}" data-presentation-copy="{proposals['cta']['id']}"><span>{esc(proposals['cta']['text'])}</span><img src="assets/icons/arrow-up-right.svg" width="22" height="22" alt=""></a></li><li><span class="demo-state">Demostración</span>{proposal('demonstrationEmail','p','property-demo-email')}</li></ul></div>
  </section>
  <section class="chapter closing-chapter" id="consulta" aria-labelledby="heading-12" data-section="COPY-P04-S12">
    {photo('concepto-cierre','closing-visual','100vw')}<div class="closing-shade" aria-hidden="true"></div>
    <div class="page-width closing-content">{section_label(8,'Media Branding')}{h(12)}<div class="closing-rule" aria-hidden="true"></div><div class="closing-action">{p(12,2,'chapter-paragraph')}<div>{editorial_action(b(12,3),pending=False)}</div></div></div>
  </section>'''
page_footer=f'<footer class="division-footer page-width"><div class="footer-identity"><img src="{esc(media["brand"]["source"])}" width="404" height="120" alt="Media Branding"><a href="../experimentos/inicio-v01/" data-route="/" aria-label="Grupo Branding · Inicio"><img src="../assets/brand/grupo-branding/horizontal-blanco.svg" width="180" height="64" alt="Grupo Branding"></a></div>{section_links(content["sectionNavigation"],"footer-links")}<div class="footer-bottom"><a href="#inicio">Volver al inicio</a><a href="/contacto/">Contacto</a></div></footer>'
replacements = {
    'NAVIGATION': navigation(),
    'HERO_HEADING': heading,
    'HERO_PARAGRAPH': block(1, 2, 'p', 'hero-description'),
    'HERO_CTA': f'<a class="button" href="/contacto/" data-copy="{cta["id"]}"><span>{esc(cta["text"].strip("[]"))}</span><img src="assets/icons/arrow-up-right.svg" width="22" height="22" alt=""></a>',
    'RESOLVE_TITLE': block(2, 1, 'h2'),
    'RESOLVE_LEAD': block(2, 2, 'p', 'resolve-lead'),
    'RESOLVE_PARAGRAPH': block(2, 3, 'p', 'resolve-description'),
    'BRAND': esc(media['brand']['source']),
    'HERO_ALT': esc(media['hero']['alt']),
    'HERO_PREFIX': esc(media['hero'].get('filePrefix', 'unipolar-vu018')),
    'HERO_WIDTH': str(media['hero'].get('processedDimensions', media['hero']['originalDimensions'])[0]),
    'HERO_HEIGHT': str(media['hero'].get('processedDimensions', media['hero']['originalDimensions'])[1]),
    'HERO_SIZES': esc(media['hero'].get('responsiveSizes', '(max-width:700px) 100vw, (max-width:1100px) 82vw, 74vw')),
    'PAGE_SECTIONS':page_sections,
    'PAGE_FOOTER':page_footer,
}
for filename in ['tokens.css', 'styles.css', 'chapters.css', 'motion.js', 'chapters.js', 'projects.css', 'projects.js']:
    replacements[filename.upper()] = hashlib.sha256((ROOT / filename).read_bytes()).hexdigest()[:12]
for ext in ('css', 'js'):
    replacements[f'FOCUS_{ext.upper()}_HASH'] = hashlib.sha256((ROOT.parent / f'shared/focus/focus.{ext}').read_bytes()).hexdigest()[:12]
    replacements[f'CINEMATIC_{ext.upper()}_HASH'] = hashlib.sha256((ROOT.parent / f'shared/divisions/cinematic.{ext}').read_bytes()).hexdigest()[:12]
    replacements[f'NAVIGATION_{ext.upper()}_HASH'] = hashlib.sha256((ROOT.parent / f'shared/divisions/navigation.{ext}').read_bytes()).hexdigest()[:12]
page = (ROOT / 'template.html').read_text()
for token, value in replacements.items():
    page = page.replace('{{' + token + '}}', value)
assert '{{' not in page
page = page.replace('href="/contacto/"','href="/contacto/?origen=media-branding"').replace('href="/contacto/#','href="/contacto/?origen=media-branding#')
(ROOT / 'index.html').write_text(page)
replacement_map={source:item['id'] for item in presentation['blocks'] for source in item.get('replaces',[])}
pending={item['id']:item for section in content['sections'] for item in section.get('pending',[])}
trace=[]
for section in content['sections']:
    for item in section['blocks']:
        trace.append({'sourceId':item['id'],'originalText':item.get('text',pending.get(item.get('pendingId'),{}).get('sourceText','')),'registry':'content.json','presentationId':replacement_map.get(item['id']),'renderedOriginal':item['id'] not in presentation['withheldSourceIds'],'status':'not-shown-no-phone-authorized' if item['id']=='COPY-P04-S13-B06' else 'presentation-substitution' if item['id'] in replacement_map else 'unchanged'})
(ROOT/'editorial-trace.json').write_text(json.dumps({'source':'docs/arq.html — ARQ-02 + COPY-03','registeredCount':len(trace),'blocks':trace,'presentationSource':'presentation-copy.json'},ensure_ascii=False,indent=2)+'\n')
print('Rendered all COPY-P04 sections → media-branding/index.html')
