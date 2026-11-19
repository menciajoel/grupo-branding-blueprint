#!/usr/bin/env python3
"""Check approved copy, real assets, destinations and protection of existing work."""
import hashlib
import argparse
import json
import re
import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parent
source = (REPO / 'docs/arq.html').read_text()
blueprint = json.JSONDecoder().raw_decode(source.split('const copyBlueprint = ', 1)[1])[0]
approved = next(page for page in blueprint['pages'] if page['id'] == 'COPY-P04')['sections']
editable = json.loads((ROOT / 'content.json').read_text())
assert editable['sections'] == approved, 'Editable data differs from COPY-P04'
presentation=json.loads((ROOT/'presentation-copy.json').read_text())
withheld=set(presentation['withheldSourceIds'])

class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.stack=[]; self.copy={}; self.assets=[]; self.ids=[]; self.routes={}; self.proposals={};self.links=[];self.forms=[]
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if a.get('id'): self.ids.append(a['id'])
        if 'data-copy' in a:
            assert a['data-copy'] not in self.copy, 'Duplicated copy'
            self.copy[a['data-copy']]=[]
        if 'data-presentation-copy' in a:
            assert a['data-presentation-copy'] not in self.proposals
            self.proposals[a['data-presentation-copy']]=[]
        if tag in ('img','script','link'):
            path=a.get('src') or a.get('href')
            if path: self.assets.append(path)
            self.assets.extend(part.strip().split()[0] for part in a.get('srcset','').split(',') if part.strip())
        if tag=='a':
            self.links.append(a)
            if 'data-copy' in a:self.routes[a['data-copy']]=a.get('href')
        if tag=='form':self.forms.append(a)
        if tag not in ('img','link','meta','br','hr','input','source'): self.stack.append((tag,a.get('data-copy'),a.get('data-presentation-copy')))
    def handle_endtag(self,tag):
        for i in range(len(self.stack)-1,-1,-1):
            if self.stack[i][0]==tag: self.stack=self.stack[:i];break
    def handle_data(self,data):
        for _,key,proposal in self.stack:
            if key: self.copy[key].append(data)
            if proposal:self.proposals[proposal].append(data)

page=Page();page.feed((ROOT/'index.html').read_text())
for filename in ('motion.js','chapters.js','styles.css','chapters.css'):
    assert sum(urlsplit(asset).path==filename for asset in page.assets)==1, f'Duplicate controller or stylesheet: {filename}'
assert len(page.ids)==len(set(page.ids)), 'Duplicate DOM IDs'
for section in approved:
    for block in section['blocks']:
        if block['id'] in withheld:
            assert block['id'] not in page.copy
            continue
        pending={item['id']:item for item in section.get('pending',[])}
        text=block.get('text',pending.get(block.get('pendingId'),{}).get('sourceText',''))
        expected=' '.join((text if block['type']=='placeholder' else text.strip('[]')).split())
        observed=' '.join(' '.join(page.copy[block['id']]).split())
        assert expected==observed, (block['id'],expected,observed)
assert len(page.copy)==sum(len(s['blocks']) for s in approved)-len(withheld)
assert len(page.proposals)==len(presentation['blocks'])
for item in presentation['blocks']:
    assert ' '.join(' '.join(page.proposals[item['id']]).split())==item['text']
trace=json.loads((ROOT/'editorial-trace.json').read_text())
assert trace['registeredCount']==26 and {x['sourceId'] for x in trace['blocks']}=={b['id'] for s in approved for b in s['blocks']}
official_colors={'#2e70b4','#f08633'}  # Explicit director approval supersedes the earlier pilot selection.
pigments=re.findall(r'--mb-pigment-[\w-]+:\s*(#[0-9a-fA-F]{6})',(ROOT/'tokens.css').read_text())
assert set(pigments)==official_colors, 'UI pigment differs from the explicitly approved palette'
assert page.routes['COPY-P04-S01-B03']=='/contacto/?origen=media-branding'
assert page.routes['COPY-P04-S12-B03']=='/contacto/?origen=media-branding'
for asset in page.assets:
    assert (ROOT/unquote(urlsplit(asset).path)).is_file(), asset
for css_asset in re.findall(r'url\([\'\"]?([^\)\'\"]+)',(ROOT/'styles.css').read_text()):
    assert (ROOT/css_asset).is_file(),css_asset
html=(ROOT/'index.html').read_text()
for text in ['Piloto de diseño','Pendiente de implementación','Contacto pendiente','Contacto · Provisional','Fotografías de los proyectos citados pendientes','POR PROPORCIONAR']:
    assert text not in html,text
assert 'Media Branding | Publicidad exterior en Honduras' in html
assert sum(link.get('href')=='/contacto/?origen=media-branding' for link in page.links)==5
assert all('data-pending' not in link for link in page.links)
assert not any('predios@example.com' in link.get('href','') for link in page.links)
assert 'data-media="proyecto-issima"' in html and 'data-media="concepto-exterior"' not in html
assert 'data-media="concepto-retail-detalle"' in html and 'data-media="concepto-comercial"' not in html
contact_root=REPO/'contacto'
contact_data=json.loads((contact_root/'content.json').read_text())
contact_source=next(x for x in blueprint['pages'] if x['id']=='COPY-P08')
assert contact_data==contact_source
contact=Page();contact.feed((contact_root/'index.html').read_text())
subprocess.run([sys.executable,'-B',str(contact_root/'verify.py')],cwd=REPO,check=True)
for asset in contact.assets:assert (contact_root/unquote(urlsplit(asset).path)).is_file(),asset
assert not any('predios@example.com' in link.get('href','') for link in contact.links)
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--baseline', type=Path, help='Optional local protection manifest; not required in a fresh clone')
baseline_path=parser.parse_args().baseline
if baseline_path is not None:
    changed=[]
    for name,digest in json.loads(baseline_path.read_text()).items():
        path=Path(name)
        if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest()!=digest: changed.append(name)
    assert not changed, f'Pre-existing work changed: {changed}'
print(f'PASS: 26 original blocks registered / {len(page.copy)} rendered unchanged + {len(page.proposals)} authorized presentation blocks; 23 COPY-P08 blocks registered and approved conversational Contacto verified; assets, routes and protected work intact.')
