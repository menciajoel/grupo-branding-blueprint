#!/usr/bin/env python3
"""Check the eight client identities, source provenance and reserved copy slot."""
import argparse
import hashlib
import json
from html.parser import HTMLParser
from pathlib import Path
import re
import struct

ROOT = Path(__file__).resolve().parent


class ClientImages(HTMLParser):
    def __init__(self):
        super().__init__()
        self.images = []
        self.groups = []

    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        if 'data-client-logo' in data:
            assert tag == 'img'
            self.images.append(data)
        if data.get('class') == 'client-logos':
            self.groups.append(data)


def verify(originals=False):
    manifest = json.loads((ROOT / 'clients.json').read_text())
    assert manifest['source']['page'] == 'https://mediabranding.net/spanish.html'
    assert len(manifest['source']['clientAssetURLs']) == 23
    assert manifest['fulfills'] == {'copyBlock': 'COPY-P01-S05-B03', 'pendingId': 'COPY-P01-S05-P01'}
    assert manifest['excluded'] == ['MAPFRE', 'Salvavidas']
    clients = manifest['clients']
    assert len(clients) == len({c['id'] for c in clients}) == 8
    assert {c['name'] for c in clients} == {'Coca-Cola', 'Pepsi', 'Nestlé', 'Bimbo', 'BAC Credomatic', 'Gatorade', 'Lipton', 'Pandora'}
    page = (ROOT / 'index.html').read_text()
    doc = ClientImages()
    doc.feed(page)
    assert len(doc.groups) == 1 and len(doc.images) == 8
    assert doc.groups[0]['data-copy'] == manifest['fulfills']['copyBlock']
    assert doc.groups[0]['data-pending-id'] == manifest['fulfills']['pendingId']
    assert doc.groups[0]['role'] == 'list'
    assert 'Logotipos de clientes por incorporar' not in page
    assert f'clients.css?v={hashlib.sha256((ROOT / "clients.css").read_bytes()).hexdigest()[:12]}' in page
    snapshot = ROOT / manifest['source']['snapshot']
    if snapshot.is_file():
        data = snapshot.read_bytes()
        assert hashlib.sha256(data).hexdigest() == manifest['source']['sha256']
        section = data.decode().split('<div id="clientDiv">', 1)[1].split('<div id="contactDiv">', 1)[0]
        urls = ['https://mediabranding.net/' + name.lstrip('./') for name in re.findall(r'<img[^>]+src="([^"]+)"', section)]
        assert urls == manifest['source']['clientAssetURLs']
    for client, rendered in zip(clients, doc.images):
        assert client['sourceURL'] in manifest['source']['clientAssetURLs']
        assert not any(name in client['sourceURL'].lower() for name in ('mapfre', 'salvavida'))
        assert rendered['data-client-logo'] == client['id'] and rendered['alt'] == client['name']
        image = client['image']
        assert rendered['src'] == image['file'] and rendered['loading'] == 'lazy'
        assert (int(rendered['width']), int(rendered['height'])) == (image['width'], image['height'])
        data = (ROOT / image['file']).read_bytes()
        assert data[:8] == b'\x89PNG\r\n\x1a\n' and len(data) == image['bytes']
        assert hashlib.sha256(data).hexdigest() == image['sha256']
        assert struct.unpack('>II', data[16:24]) == (image['width'], image['height'])
        assert image['height'] == round(client['sourceHeight'] * image['width'] / client['sourceWidth'])
        original = ROOT / client['sourceFile']
        if original.is_file():
            assert hashlib.sha256(original.read_bytes()).hexdigest() == client['sourceSha256']
        if originals:
            from PIL import Image
            with Image.open(original) as source, Image.open(ROOT / image['file']) as target:
                expected = source.convert('RGBA').resize(target.size, Image.Resampling.LANCZOS)
                assert expected.tobytes() == target.convert('RGBA').tobytes(), 'Only proportional resizing is allowed'
    print('PASS · 8 original-source clients / 23 published · exclusions respected · reserved block fulfilled · PNG hashes/proportions exact')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--originals', action='store_true', help='Also check decoded pixels against the full-canvas resize; requires Pillow')
    verify(parser.parse_args().originals)
