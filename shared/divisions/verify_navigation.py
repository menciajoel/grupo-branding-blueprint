"""Keep the cross-division destinations complete, semantic and source-generated."""
from html.parser import HTMLParser
from pathlib import Path
import re
from navigation import DESTINATIONS

ROOT = Path(__file__).resolve().parents[2]


class Navigation(HTMLParser):
    def __init__(self):
        super().__init__()
        self.summary = {}
        self.destinations = []
        self.groups = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'summary':
            self.summary = attrs
        if tag == 'a' and 'data-division-destination' in attrs:
            self.destinations.append((attrs['data-division-destination'], attrs['href']))
        if attrs.get('id') == 'division-destinations':
            self.groups.append(attrs)


def verify():
    for current in ('media-branding', 'linkbranding', 'media-print'):
        text = (ROOT / current / 'index.html').read_text()
        header = re.search(r'<header\b[^>]*>[\s\S]*?</header>', text)[0]
        parsed = Navigation(); parsed.feed(header)
        expected = [(key, route) for key, _, route, _, _ in DESTINATIONS if key != current]
        assert parsed.destinations == expected, (current, 'Group first; exactly the other three live routes')
        assert len(parsed.groups) == 1, (current, 'One shared desktop/mobile list')
        assert parsed.summary.get('aria-controls') == parsed.groups[0]['id']
        # Native details owns its state without JS; the enhancement synchronizes
        # aria-expanded at runtime rather than freezing a fallback declaration.
        assert 'aria-expanded' not in parsed.summary
        assert parsed.summary.get('role') == 'button'
        contact = re.search(r'<a\b[^>]*href="[^"]*contacto[^\"]*"[^>]*>', header)
        assert contact and header.index('data-division-switcher') < contact.start(), (current, 'Immediately before Contacto')
        for extension in ('css', 'js'):
            assert text.count('../shared/divisions/navigation.' + extension + '?v=') == 1, (current, extension)
    print('PASS · Cross-division headers: Group first, current excluded, 3 real destinations, one accessible list per page')


if __name__ == '__main__':
    verify()
