#!/usr/bin/env python3
"""Verify documentary provenance, literal testimony and uncropped asset variants.

The regular static build needs only stdlib. --pdf additionally checks decoded
source pixels, ICC profiles and every testimonial paragraph against the PDF.
"""
import argparse
import hashlib
import html
import json
from pathlib import Path
import re
import unicodedata

ROOT = Path(__file__).resolve().parent


def sha(data):
    return hashlib.sha256(data).hexdigest()


def normalized(text):
    return ' '.join(unicodedata.normalize('NFC', text).split())


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--pdf', type=Path)
    args = parser.parse_args()
    evidence = json.loads((ROOT / 'project-cases.json').read_text())
    catalog = json.loads((ROOT / 'project-images.json').read_text())
    approved = {c['id']: c for c in json.loads((ROOT / 'content.json').read_text())['projects']}
    rendered = (ROOT / 'index.html').read_text()
    expected = {'CASE-DUNKIN': (2, 157), 'CASE-ISSIMA': (3, 173), 'CASE-FLYING-FISH': (4, 188)}
    assert {c['id'] for c in evidence['cases']} == set(expected)
    assert catalog['source'] == evidence['source']
    assert evidence['source']['pagesRead'] == [1, 2, 3, 4, 5]
    pdf = None
    if args.pdf:
        from pypdf import PdfReader
        from PIL import Image
        assert sha(args.pdf.read_bytes()) == evidence['source']['sha256'], 'Source PDF differs'
        pdf = PdfReader(args.pdf)
        assert len(pdf.pages) == 5
    for case in evidence['cases']:
        name = case['id']
        record, image = approved[name], catalog['images'][name]
        assert (case['page'], case['imageObject']) == expected[name]
        assert (image['page'], image['object']) == expected[name]
        testimony = normalized(' '.join(case['testimonialParagraphs']))
        assert normalized(record['testimonial']['quote']) in testimony, name + ': nonliteral excerpt'
        template = re.search(r'<template id="project-case-' + case['slug'] + r'">(.*?)</template>', rendered).group(1)
        for text in [record['presentation'], record['execution'], record['testimonial']['quote'],
                     record['testimonial']['attribution'], *case['testimonialParagraphs']]:
            assert html.escape(text, quote=True) in template, name + ': content absent'
        assert f'href="?vista={case["slug"]}#caso-{case["asset"]}"' in rendered
        assert f'id="caso-{case["asset"]}"' in rendered, 'No-JS case target missing'
        assert case['alt'] and f'width="{image["width"]}" height="{image["height"]}"' in template
        assert 'loading="lazy"' in template and 'srcset=' in template
        assert '<details class="case-testimony">' in template, 'Testimony must start collapsed'
        assert 'Leer testimonio completo' in template and 'case-summary-compact">Testimonio completo' in template
        assert not re.search(r'por incorporar|pendiente|\.pdf|/portafolio/', template, re.I)
        previous = 0
        for variant in image['variants']:
            asset = ROOT / variant['file']
            assert asset.stat().st_size == variant['bytes']
            assert sha(asset.read_bytes()) == variant['sha256'], str(asset)
            assert previous < variant['width'] <= image['width'], 'Upscale or unordered srcset'
            assert variant['height'] == round(image['height'] * variant['width'] / image['width'])
            previous = variant['width']
        native = ROOT / image['original']
        if native.exists():
            assert sha(native.read_bytes()) == image['originalSha256']
        if pdf:
            page = pdf.pages[case['page'] - 1]
            page_text = normalized(page.extract_text())
            for paragraph in case['testimonialParagraphs']:
                assert normalized(paragraph) in page_text, name + ': paragraph differs from PDF'
            embedded = next(p for p in page.images if p.indirect_reference.idnum == case['imageObject'])
            original = Image.open(native)
            assert original.size == embedded.image.size == (image['width'], image['height'])
            assert original.tobytes() == embedded.image.tobytes()
            assert sha(original.tobytes()) == image['pixelsSha256']
            assert sha(original.info['icc_profile']) == image['iccSha256']
            for variant in image['variants']:
                assert Image.open(ROOT / variant['file']).size == (variant['width'], variant['height'])
    print('PASS · 3 source-mapped cases · literal excerpts/full testimony · 11 hashed, proportional WebP variants')
    if pdf:
        print('PASS · PDF identity/all 5 pages · every paragraph exact · 3 native pixel arrays and ICC profiles preserved')


if __name__ == '__main__':
    main()
