"""Check original editorial blocks, routes and references for both new pages."""
from html.parser import HTMLParser
from pathlib import Path
import json
import re
import sys

ROOT=Path(__file__).resolve().parents[2]
source=json.JSONDecoder().raw_decode((ROOT/'docs/arq.html').read_text().split('const copyBlueprint = ',1)[1])[0]


class CopyParser(HTMLParser):
    def __init__(self):
        super().__init__();self.stack=[];self.blocks={}
    def handle_starttag(self,tag,attrs):
        if tag not in ('img','input','meta','link','br','hr','source'):
            self.stack.append(dict(attrs).get('data-copy'))
        value=dict(attrs).get('data-copy')
        if value:self.blocks.setdefault(value,[]).append('')
    def handle_endtag(self,tag):
        if self.stack:self.stack.pop()
    def handle_data(self,data):
        for key in self.stack:
            if key:self.blocks[key][-1]+=data


normalize=lambda s:' '.join(s.split())
for folder,page_id in [('linkbranding','COPY-P05'),('media-print','COPY-P06')]:
    root=ROOT/folder
    original=next(p for p in source['pages'] if p['id']==page_id)
    assert json.loads((root/'content.json').read_text())==original,folder+' content registry diverges'
    parser=CopyParser();page=(root/'index.html').read_text();parser.feed(page)
    expected={b['id']:b['text'].strip('[]') for s in original['sections'] for b in s['blocks']}
    assert set(parser.blocks)==set(expected),(folder,set(expected)-set(parser.blocks))
    for key,text in expected.items():
        assert len(parser.blocks[key])==1,(key,'duplicated')
        assert normalize(parser.blocks[key][0])==normalize(text),(key,parser.blocks[key],text)
    for section in original['sections']:assert f'data-section="{section["id"]}"' in page,section['id']
    assert f'../contacto/?servicio={folder}' in page
    for item in json.loads((root/'media.json').read_text())['items']:
        if item['type']=='generated':
            assert item['disclosure']=='Visualización conceptual · Imagen provisional'
            for width in item['sizes']:assert (root/f'assets/media/{item["id"]}-{width}.webp').is_file()
    print(f'PASS: {folder}: {len(original["sections"])} sections / {len(expected)} original blocks exact, once; concepts disclosed; contextual CTA.')
print('ARQ-P03 standalone page remains pending; Linkbranding uses the approved existing Inicio divisions section as its documented navigable equivalent.')
from verify_cinematic import verify as verify_cinematic
verify_cinematic()
from verify_navigation import verify as verify_navigation
verify_navigation()
