#!/usr/bin/env python3
"""Audit every ecosystem contact entry point in the actual static artifact."""
import argparse
from html.parser import HTMLParser
import json
from pathlib import Path
from urllib.parse import parse_qs, urljoin, urlsplit

PAGES = {'experimentos/inicio-v01': ('grupo-branding', 5),
         'media-branding': ('media-branding', 5),
         'linkbranding': ('linkbranding', 4), 'media-print': ('media-print', 4)}


class Anchors(HTMLParser):
    def __init__(self):
        super().__init__()
        self.current = None
        self.links = []

    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            self.current = [dict(attrs), []]

    def handle_data(self, text):
        if self.current is not None:
            self.current[1].append(text)

    def handle_endtag(self, tag):
        if tag == 'a' and self.current is not None:
            attrs, text = self.current
            self.links.append((attrs, ' '.join(''.join(text).split())))
            self.current = None


def validate(root, base):
    root = Path(root)
    destination = base + '/contacto/'
    inventory = {}
    for page, (origin, count) in PAGES.items():
        parsed = Anchors()
        parsed.feed((root / page / 'index.html').read_text())
        contacts = []
        for attrs, label in parsed.links:
            href = attrs.get('href', '')
            if 'contacto' not in href and label != 'Contacto':
                continue
            url = urlsplit(urljoin('https://static.invalid' + base + '/' + page + '/', href))
            assert url.path == destination, (page, label, href, 'Old or escaping contact destination')
            assert parse_qs(url.query).get('origen') == [origin], (page, label, 'Missing origin')
            assert not url.fragment, (page, label, 'Stale fragment')
            assert 'data-preview' not in attrs and 'data-scroll' not in attrs, (page, label, 'Intercepted navigation')
            contacts.append({'label': label, 'href': href, 'origin': origin})
        assert len(contacts) == count, (page, len(contacts), count)
        inventory[page] = contacts
    contact = (root / 'contacto/index.html').read_text()
    assert all(f'data-view="{step}"' in contact for step in ('1', '2', '3'))
    assert 'Has completado el recorrido.' in contact
    assert 'contact-send' not in contact and 'id="project-button"' in contact
    assert not (root / 'experimentos/contacto-inteligente').exists(), 'Experiment must remain outside Pages'
    assert [str(path.relative_to(root)) for path in root.rglob('*.html') if 'id="details-form"' in path.read_text()] == ['contacto/index.html']
    print('PASS · 18 contact links/CTA, four origins, one public contact experience, no legacy interception')
    return inventory


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--directory', default='_site')
    parser.add_argument('--base-path', default='')
    parser.add_argument('--report', type=Path)
    args = parser.parse_args()
    report = validate(args.directory, args.base_path.rstrip('/'))
    if args.report:
        args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
