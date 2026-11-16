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
        self.stack=[];self.copy={};self.refs=set();self.routes={};self.headings=0;self.ids=[]
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='h1': self.headings+=1
        if 'id' in a: self.ids.append(a['id'])
        if a.get('data-copy'): self.copy[a['data-copy']]=[]
        if a.get('data-route'): self.routes[a['data-preview']]=a['data-route']
        for key in ('src','href'):
            value=a.get(key,'')
            if value and not value.startswith(('#','?','http:','https:')): self.refs.add(value)
        if a.get('srcset'):
            self.refs.update(item.strip().split()[0] for item in a['srcset'].split(','))
        if tag not in ('area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'):
            self.stack.append((tag,a.get('data-copy')))
    def handle_endtag(self,tag):
        for i in range(len(self.stack)-1,-1,-1):
            if self.stack[i][0]==tag:
                del self.stack[i:];break
    def handle_data(self,data):
        for _,copy in self.stack:
            if copy: self.copy[copy].append(data)

doc=Document();doc.feed((ROOT/'index.html').read_text())
assert 'motion.js?v='+hashlib.sha256((ROOT/'motion.js').read_bytes()).hexdigest()[:12] in (ROOT/'index.html').read_text(), 'Rebuild after changing motion.js'
assert doc.headings==1
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
