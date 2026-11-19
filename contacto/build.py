#!/usr/bin/env python3
"""Build the approved Contacto Inteligente presentation; no submission backend."""
from pathlib import Path
import copy
import hashlib
import html
import json
import re
import xml.etree.ElementTree as ET
from urllib.parse import quote

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
content = json.loads((ROOT / 'contacto/content.json').read_text())
sections = content['sections']


def block(section, number):
    return sections[section - 1]['blocks'][number - 1]


def icon(name='arrow-up-right'):
    """Reuse the site's Lucide geometry; never depend on an OS symbol font."""
    source = 'arrow-up-right' if name == 'arrow-up-right' else 'arrow-down'
    paths = ''.join(re.findall(r'<path\b[^>]*/>', (ROOT / f'media-branding/assets/icons/{source}.svg').read_text()))
    if name in ('arrow-right', 'arrow-left'):
        paths = f'<g transform="rotate({-90 if name == "arrow-right" else 90} 12 12)">{paths}</g>'
    elif name == 'plus':
        paths = '<path d="M5 12h14M12 5v14"/>'
    # Keep the former glyph's optical footprint inside the same 1em wrapper.
    # Diagonals are open/thin; horizontal arrows keep their long, low profile.
    viewport = '4.5 4.5 15 15' if name == 'arrow-up-right' else '4 -8 16 40' if name in ('arrow-right', 'arrow-left') else '0 0 24 24'
    stroke = '1' if name == 'arrow-up-right' else '2'
    return ('<svg class="contact-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" '
            f'viewBox="{viewport}" preserveAspectRatio="none" fill="none" stroke="currentColor" stroke-width="{stroke}" '
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'
            + paths + '</svg>')


def official_contact(item):
    text = item['text']
    pieces, position = [], 0
    for match in re.finditer(r'[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}|\b\d{4}-\d{4}\b', text):
        pieces.append(html.escape(text[position:match.start()]))
        value = match.group()
        href = 'mailto:' + value if '@' in value else 'tel:' + value.replace('-', '')
        pieces.append(f'<a href="{html.escape(href)}">{html.escape(value)}</a>')
        position = match.end()
    pieces.append(html.escape(text[position:]))
    return f'<p data-copy="{item["id"]}">{"".join(pieces)}</p>'


def contact_pairs(item):
    return re.findall(r'([\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}) / (\d{4}-\d{4})', item['text'])


def contact_rows(item):
    return ''.join(
        f'<div class="contact-person"><a class="contact-email" href="mailto:{html.escape(email)}">'
        f'{html.escape(email)}<span aria-hidden="true">{icon()}</span></a>'
        f'<a class="contact-phone" href="tel:{phone.replace("-", "")}">{phone}</a></div>'
        for email, phone in contact_pairs(item))


company_names = {'media-branding': 'Media Branding', 'linkbranding': 'Linkbranding', 'media-print': 'Media Printing'}
# COPY-P08-S03-B06 is shared with Media Printing by the director's explicit
# authorization of 18 Nov 2026; it is not reclassified in the approved source.
company_sources = {'media-branding': block(3, 4), 'linkbranding': block(3, 5), 'media-print': block(3, 6)}
contact_tabs, contact_panels = [], []
for company, title in company_names.items():
    initial = company == 'media-branding'
    contact_tabs.append(
        f'<button type="button" class="contact-tab" role="tab" id="contact-tab-{company}" '
        f'data-contact-company="{company}" aria-controls="contact-panel-{company}" '
        f'aria-selected="{str(initial).lower()}" tabindex="{0 if initial else -1}">{title}</button>')
    item = company_sources[company]
    contact_panels.append(
        f'<div class="contact-panel" role="tabpanel" id="contact-panel-{company}" '
        f'aria-labelledby="contact-tab-{company}" tabindex="0" data-source-copy="{item["id"]}"'
        f'{"" if initial else " hidden inert"}>{contact_rows(item)}</div>')

offices_text = block(3, 8)['text']
office_addresses = re.fullmatch(r'(Tegucigalpa:.*?) (San Pedro Sula:.*)', offices_text).groups()
office_links = []
for address in office_addresses:
    city, street = address.split(': ', 1)
    target = 'https://www.google.com/maps/search/?api=1&query=' + quote(address, safe='')
    office_links.append(
        f'<div class="contact-office"><h3>{html.escape(city)}</h3><p>{html.escape(street)}</p>'
        f'<a href="{html.escape(target)}" target="_blank" rel="noopener noreferrer" '
        f'aria-label="Cómo llegar a la oficina de {html.escape(city)} (abre Google Maps en otra pestaña)">'
        f'Cómo llegar<span aria-hidden="true">{icon()}</span></a></div>')

contact_data = {
    'source': 'contacto/content.json',
    'companies': {key: {'name': company_names[key], 'sourceCopy': item['id'], 'contacts': [
        {'email': email, 'phone': phone} for email, phone in contact_pairs(item)]}
        for key, item in company_sources.items()},
    'offices': list(office_addresses),
    'generalSourceCopy': block(3, 6)['id'],
    'sharedMediaPrintAuthorization': 'Director: Media Printing utiliza ese contacto compartido · 2026-11-18'
}


# Extract existing official vector nodes, including their original styles.
# No geometry is redrawn; originals remain untouched.
ET.register_namespace('', 'http://www.w3.org/2000/svg')
icons = {
    'media-branding': ('media-branding', '0 0 195.89 157.51', 'polygons'),
    'linkbranding': ('linkbranding', '0 0 143.2 200.77', 0),
    'media-print': ('media-printing', '0 0 134 136.46', 2),
}
provenance = {}
(HERE / 'assets').mkdir(exist_ok=True)
for name, (folder, viewbox, group_index) in icons.items():
    source = ROOT / 'assets/brand' / folder / 'horizontal-color-blanco-01.svg'
    original = ET.fromstring(source.read_bytes())
    vector = ET.Element('{http://www.w3.org/2000/svg}svg', {'viewBox': viewbox})
    # The supplied dark-background exports have inline fills and no defs block.
    # Select their original isotype nodes; never redraw or recolor them.
    selected = list(original)[:17] if group_index == 'polygons' else [original[0][group_index]]
    for node in selected:
        vector.append(copy.deepcopy(node))
    target = HERE / 'assets' / f'{name}-isotipo.svg'
    ET.ElementTree(vector).write(target, encoding='utf-8', xml_declaration=True)
    provenance[name] = {'source': str(source.relative_to(ROOT)), 'sourceSha256': hashlib.sha256(source.read_bytes()).hexdigest(), 'viewBox': viewbox, 'selection': group_index, 'assetSha256': hashlib.sha256(target.read_bytes()).hexdigest()}

options = []
categories = ['media-branding', 'linkbranding', 'media-print', 'combinada', 'indefinida']
for index, category in enumerate(categories):
    item = block(2, index + 2)
    options.append(f'''<button class="category-choice" type="button" data-category="{category}" aria-pressed="false" disabled>
      <span class="choice-number" aria-hidden="true">0{index + 1}</span><span data-copy="{item['id']}">{html.escape(item['text'])}</span><span class="choice-arrow" aria-hidden="true">{icon()}</span>
    </button>''')

values = {
    'ARROW_UP_RIGHT': icon(),
    'ARROW_RIGHT': icon('arrow-right'),
    'ARROW_LEFT': icon('arrow-left'),
    'PLUS_ICON': icon('plus'),
    'OPTIONS': '\n'.join(options),
    'DIRECT_INTRO': html.escape(block(3, 2)['text']),
    'CONTACTS': '\n'.join(official_contact(block(3, i)) for i in (4, 5, 6)),
    'OFFICES': html.escape(block(3, 8)['text']),
    'CONTACT_TABS': '\n'.join(contact_tabs),
    'CONTACT_PANELS': '\n'.join(contact_panels),
    'CONTACT_OFFICES': '\n'.join(office_links),
    'GENERAL_CONTACT': contact_rows(block(3, 6)),
    'CSS_HASH': hashlib.sha256((HERE / 'contact.css').read_bytes()).hexdigest()[:12],
    'JS_HASH': hashlib.sha256((HERE / 'contact.js').read_bytes()).hexdigest()[:12],
    'FOCUS_CSS_HASH': hashlib.sha256((ROOT / 'shared/focus/focus.css').read_bytes()).hexdigest()[:12],
    'FOCUS_JS_HASH': hashlib.sha256((ROOT / 'shared/focus/focus.js').read_bytes()).hexdigest()[:12],
}
page = (HERE / 'template.html').read_text()
for key, value in values.items():
    page = page.replace('{{' + key + '}}', value)
assert not re.search(r'\{\{\w+\}\}', page)
(HERE / 'index.html').write_text(page)
(HERE / 'assets/provenance.json').write_text(json.dumps(provenance, indent=2) + '\n')
(HERE / 'assets/contact-data.json').write_text(json.dumps(contact_data, ensure_ascii=False, indent=2) + '\n')
print('Contacto Inteligente · 3 approved stages · neutral completion · official contacts/vectors')
