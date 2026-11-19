#!/usr/bin/env python3
"""Validate supplied graphic identities and every active page's logo placement."""
from html.parser import HTMLParser
from pathlib import Path
import hashlib
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BRANDS = ROOT / 'assets/brand'
PAGES = ('experimentos/inicio-v01', 'media-branding', 'linkbranding', 'media-print', 'contacto')


class Images(HTMLParser):
    def __init__(self):
        super().__init__()
        self.images = []
        self.icons = []

    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        if tag == 'img':
            self.images.append(data)
        if tag == 'link' and data.get('rel') == 'icon':
            self.icons.append(data['href'])


def verify():
    approved = json.loads((BRANDS / 'approved-usage.json').read_text())
    for name, digest in approved['resources'].items():
        resource = BRANDS / name
        assert hashlib.sha256(resource.read_bytes()).hexdigest() == digest, 'Original logo changed: ' + name
        svg = ET.fromstring(resource.read_bytes())
        assert all(el.tag.split('}')[-1] not in ('text', 'image', 'script', 'foreignObject') for el in svg.iter()), name
        assert not re.search(r'\bhref=', resource.read_text()), 'External SVG dependency: ' + name
    expected = {'experimentos/inicio-v01': 3, 'media-branding': 2, 'linkbranding': 4, 'media-print': 2, 'contacto': 0}
    for folder in PAGES:
        parser = Images()
        parser.feed((ROOT / folder / 'index.html').read_text())
        identities = [i for i in parser.images if 'assets/brand/' in i.get('src', '')]
        division_logos = [i for i in identities if any('/' + b + '/' in i['src'] for b in ('media-branding', 'linkbranding', 'media-printing'))]
        assert len(division_logos) == expected[folder], (folder, 'Logo placement count changed')
        assert all(i['src'].endswith('/horizontal-color-blanco-01.svg') for i in division_logos), folder
        for image in identities:
            assert 'alt' in image and image.get('width') and image.get('height'), (folder, image)
            assert (ROOT / folder / image['src']).resolve().is_file(), (folder, image['src'])
            if '/grupo-branding/' in image['src']:
                allowed = 'isotipo-color.svg' if image.get('class') == 'contact-mark' and folder.startswith('experimentos/') else 'isotipo-blanco.svg' if image.get('class') == 'final-isotype' else 'horizontal-blanco.svg'
                assert image['src'].endswith('/' + allowed), (folder, 'Group identity must remain white')
        expected_icon = 'isotipo-blanco.svg' if folder in ('experimentos/inicio-v01', 'contacto') else folder + '-isotipo.svg'
        assert len(parser.icons) == 1 and parser.icons[0].endswith('/' + expected_icon), folder
    provenance = json.loads((ROOT / 'contacto/assets/provenance.json').read_text())
    for company, record in provenance.items():
        source = ROOT / record['source']
        assert source.name == 'horizontal-color-blanco-01.svg'
        assert hashlib.sha256(source.read_bytes()).hexdigest() == record['sourceSha256']
        original = ET.fromstring(source.read_bytes())
        icon = ET.parse(ROOT / 'contacto/assets' / (company + '-isotipo.svg')).getroot()
        expected_nodes = list(original)[:17] if company == 'media-branding' else [original[0][0 if company == 'linkbranding' else 2]]
        assert [ET.tostring(n) for n in icon] == [ET.tostring(n) for n in expected_nodes], 'Isotype nodes differ from official source: ' + company
        assert icon.get('viewBox') == record['viewBox']
    print('PASS · 5 pages / 11 full division logos · supplied SVG hashes exact · white group identity · 3 native isotype extractions')


if __name__ == '__main__':
    verify()
