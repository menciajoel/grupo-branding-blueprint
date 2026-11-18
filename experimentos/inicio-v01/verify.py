#!/usr/bin/env python3
"""Verify rendered copy, official vectors and portable local assets against ARQ/COPY."""
import hashlib
import json
import re
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[1]
source = json.loads(re.search(r'const copyBlueprint = (\{.*?\});\s*</script>', (REPO/'docs/arq.html').read_text(), re.S).group(1))
content = json.loads((ROOT/'content.json').read_text())
sections = source['pages'][0]['sections']
assert content['sections'] == {s['id']:s for s in sections}, 'Editorial data differs from COPY-03'
assert content['projects'] == source['projects'], 'Documented case content changed'
assert content['newsletter'] == source['pages'][8], 'Newsletter state/consent content changed'
normalize = lambda value: ' '.join(value.split())

class Document(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack=[];self.copy={};self.refs=set();self.routes={};self.headings=0;self.ids=[];self.choices=[];self.photo_images=[];self.photo_layers=[];self.polygons=[];self.hero_art=0
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='h1': self.headings+=1
        if 'id' in a: self.ids.append(a['id'])
        if 'data-division-choice' in a: self.choices.append((tag,a))
        if tag=='image': self.photo_images.append(a)
        if a.get('class')=='facet-media': self.photo_layers.append(a)
        if tag=='polygon': self.polygons.append(a)
        if a.get('class')=='brand-art':
            assert any(t=='section' and cls=='hero-surface' for t,_,cls in self.stack), 'Hero symbol must stay contained by the hero, including reduced motion'
            self.hero_art+=1
        if a.get('data-copy'): self.copy[a['data-copy']]=[]
        if a.get('data-route'): self.routes[a['data-preview']]=a['data-route']
        for key in ('src','href'):
            value=a.get(key,'')
            if value and not value.startswith(('#','?','http:','https:')): self.refs.add(value)
        if a.get('srcset'):
            self.refs.update(item.strip().split()[0] for item in a['srcset'].split(','))
        if tag not in ('area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'):
            self.stack.append((tag,a.get('data-copy'),a.get('class')))
    def handle_endtag(self,tag):
        for i in range(len(self.stack)-1,-1,-1):
            if self.stack[i][0]==tag:
                del self.stack[i:];break
    def handle_data(self,data):
        for _,copy,_ in self.stack:
            if copy: self.copy[copy].append(data)

doc=Document();doc.feed((ROOT/'index.html').read_text())
assert 'motion.js?v='+hashlib.sha256((ROOT/'motion.js').read_bytes()).hexdigest()[:12] in (ROOT/'index.html').read_text(), 'Rebuild after changing motion.js'
assert doc.headings==1
assert doc.hero_art==1, 'Exactly one contained hero symbol required'
assert len(doc.ids)==len(set(doc.ids)), 'Duplicate IDs'
count=0
for section in sections:
    for block in section['blocks']:
        if 'text' in block: expected=block['text'].strip('[]')
        else: expected=next(p['label'] for p in section['pending'])
        actual=normalize(''.join(doc.copy.get(block['id'],[])))
        assert actual==normalize(expected), f"Missing/altered {block['id']}: {actual}"
        count+=1
assert len(doc.copy)==count+3, 'Unexpected copy fields or missing newsletter states'
assert len(doc.choices)==3, 'Three central division selectors required'
for i,((tag,attrs),key,start) in enumerate(zip(doc.choices,('visibilidad','experiencias','produccion'),(3,6,9))):
    expected=content['sections']['COPY-P01-S02']['blocks'][start-1]['text']
    assert tag=='button' and attrs.get('type')=='button', 'Central selector must be a native button'
    assert attrs['data-division-choice']==str(i) and attrs['aria-label']==expected, 'Selector copy must come from COPY-03'
    assert attrs['aria-controls']==f'panel-{key}' and f'panel-{key}' in doc.ids, 'Selector must control its division panel'
assert len(doc.photo_images)==len(doc.photo_layers)==6, 'Three photographic facets per responsive SVG required'
for layer,(suffix,i) in zip(doc.photo_layers,((s,i) for s in ('main','mobile') for i in range(3))):
    assert layer['clip-path']==f'url(#reveal-{suffix}-{i})', 'Photo layer must retain its original reveal mask'
official=ET.parse(REPO/'assets/brand/grupo-branding/isotipo-color.svg').getroot()
ns='{http://www.w3.org/2000/svg}'
original=list(official.iter(ns+'polygon'))
colors=dict(re.findall(r'\.(cls-\d+)\s*\{\s*fill:\s*(#[a-f0-9]+);',official.find(ns+'defs').find(ns+'style').text))
expected=[(original[i].get('points'),colors[original[i].get('class')]) for i in (2,1,0)]
pieces=[p for p in doc.polygons if p.get('class')=='official-piece']
assert [(p['points'],p['fill']) for p in pieces]==expected*2, 'Official pair geometry/colors must remain exact in both responsive SVGs'
clips=[p['points'] for p in doc.polygons if p.get('class')!='official-piece']
assert clips==[points for points,_ in expected]*2, 'Photographic silhouettes must match the official pairs'
for rel in re.findall(r'url\([\'\"]?([^\)\'\"]+)',(ROOT/'styles.css').read_text()): doc.refs.add(rel)
for ref in doc.refs:
    assert not ref.startswith('/'), f'Root-relative asset: {ref}'
    assert (ROOT/urlsplit(ref).path).is_file(), f'Missing local asset: {ref}'
for path in (ROOT/'assets/brand').rglob('*.svg'):
    original=REPO/'assets/brand'/path.relative_to(ROOT/'assets/brand')
    assert path.read_bytes()==original.read_bytes(), f'Brand SVG changed: {path}'
NS='{http://www.w3.org/2000/svg}'
for variant in ('color','blanco'):
    original=ET.parse(REPO/f'assets/brand/grupo-branding/horizontal-{variant}.svg').getroot()
    extracted=ET.parse(REPO/f'assets/brand/grupo-branding/isotipo-{variant}.svg').getroot()
    assert [p.attrib for p in original.iter(NS+'polygon')]==[p.attrib for p in extracted.iter(NS+'polygon')], 'Isotype geometry altered'
    assert ET.tostring(original.find(NS+'defs'))==ET.tostring(extracted.find(NS+'defs')), 'Isotype fills altered'
# Protected approved documents and public cover, recorded before work.
protected={'index.html':'0578c92afa7c6403207ac28c7c85a5ea297cd5574de2f25f7493374906d2c60d','docs/arq.html':'7a259abc5c10151640a554fce9b586f7b1c93ed8998cc23584184f86ed299e1a'}
for file, expected in protected.items():
    assert hashlib.sha256((REPO/file).read_bytes()).hexdigest()==expected, f'Protected file changed: {file}'
assert all(slug in doc.routes for slug in ('divisiones','contacto','media-branding','linkbranding','media-print','portafolio','proyecto-dunkin','proyecto-issima','proyecto-flying-fish'))
print(f'PASS · {count} approved Inicio blocks · 8 sections · 3 documented cases · newsletter states/consent')
print(f'PASS · {len(doc.refs)} local resources · official vectors exact · protected documents intact')
