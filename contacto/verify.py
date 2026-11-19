#!/usr/bin/env python3
"""Check experiment provenance, approved contact data and protected files."""
from pathlib import Path
import argparse
import hashlib
import html
import json
import re
from urllib.parse import urlsplit, parse_qs
from html.parser import HTMLParser

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--baseline', type=Path)
args = parser.parse_args()
page = (HERE / 'index.html').read_text()
script = (HERE / 'contact.js').read_text()
content = json.loads((ROOT / 'contacto/content.json').read_text())
blueprint = json.JSONDecoder().raw_decode((ROOT / 'docs/arq.html').read_text().split('const copyBlueprint = ', 1)[1])[0]
assert content == next(page for page in blueprint['pages'] if page['id'] == 'COPY-P08'), 'Approved COPY-P08 registry changed'
trace = json.loads((HERE / 'editorial-trace.json').read_text())
assert trace['registeredCount'] == 23 and {item['sourceId'] for item in trace['blocks']} == {item['id'] for section in content['sections'] for item in section['blocks']}
for item in content['sections'][2]['blocks']:
    if item['id'] not in page:
        continue
    match = re.search(r'<(?:p|h2)[^>]*data-copy="' + item['id'] + r'"[^>]*>(.*?)</(?:p|h2)>', page, re.S)
    assert match, item['id']
    text = html.unescape(re.sub(r'<[^>]*>', '', match[1]))
    assert text == item['text'], f'Official contact text changed: {item["id"]}'
for name, info in json.loads((HERE / 'assets/provenance.json').read_text()).items():
    assert hashlib.sha256((ROOT / info['source']).read_bytes()).hexdigest() == info['sourceSha256']
    assert hashlib.sha256((HERE / 'assets' / f'{name}-isotipo.svg').read_bytes()).hexdigest() == info['assetSha256']
for raw in re.findall(r'\b(?:href|src)="([^"]+)"', page):
    url = urlsplit(html.unescape(raw))
    if url.scheme or raw.startswith('#'):
        continue
    target = (HERE / url.path).resolve()
    assert target.exists(), f'Missing local resource: {raw}'
for name in ('contact.css', 'contact.js'):
    digest = hashlib.sha256((HERE / name).read_bytes()).hexdigest()[:12]
    assert f'{name}?v={digest}' in page, f'Rebuild stale HTML: {name}'
assert 'method="dialog"' in page and 'action=' not in page
assert not re.search(r'\b(?:fetch|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB)\s*[.(]', script)
assert 'Recibimos tu solicitud' not in page
assert 'Has completado el recorrido.' in page

# The redesigned contact view changes presentation, never the official data.
directory = json.loads((HERE / 'assets/contact-data.json').read_text())
blocks = {item['id']: item['text'] for section in content['sections'] for item in section['blocks']}
for company in directory['companies'].values():
    approved = re.findall(r'([\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}) / (\d{4}-\d{4})', blocks[company['sourceCopy']])
    assert [(item['email'], item['phone']) for item in company['contacts']] == approved
    for email, phone in approved:
        assert f'href="mailto:{email}"' in page
        assert f'href="tel:{phone.replace("-", "")}"' in page
assert ' '.join(directory['offices']) == blocks['COPY-P08-S03-B08']


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.maps = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        url = urlsplit(attrs.get('href', ''))
        if tag == 'a' and url.netloc == 'www.google.com':
            assert attrs.get('target') == '_blank'
            assert {'noopener', 'noreferrer'} <= set(attrs.get('rel', '').split())
            self.maps.append(parse_qs(url.query)['query'][0])


links = Links()
links.feed(page)
assert links.maps == directory['offices']
print('PASS · tab contacts and encoded Maps searches match approved sources')
if args.baseline:
    baseline = json.loads(args.baseline.read_text())
    changed = [name for name, digest in baseline['trackedFiles'].items()
               if not (ROOT / name).is_file() or hashlib.sha256((ROOT / name).read_bytes()).hexdigest() != digest]
    assert not changed, f'Previously tracked sources changed: {changed}'
    print(f'PASS · {len(baseline["trackedFiles"])} previously tracked files untouched')
print('PASS · official contacts, vector provenance, local resources, fresh HTML and honest demonstration')
