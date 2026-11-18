#!/usr/bin/env python3
"""Validate static resources and navigable destinations at a deployment prefix."""
import argparse
from html.parser import HTMLParser
from pathlib import Path
import re
from urllib.parse import unquote, urljoin, urlsplit


class References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for key in ('src', 'href', 'poster'):
            if attrs.get(key):
                self.refs.append(attrs[key])
        if attrs.get('srcset'):
            self.refs.extend(part.strip().split()[0] for part in attrs['srcset'].split(',') if part.strip())


def dependencies(path, root, base):
    refs = []
    if path.suffix in ('.html', '.svg'):
        parser = References()
        parser.feed(path.read_text())
        refs = parser.refs
    if path.suffix in ('.css', '.svg'):
        refs += re.findall(r'url\(\s*[\'\"]?([^\)\'\"\s]+)', path.read_text())
    location = 'https://static.invalid' + base + '/' + str(path.relative_to(root))
    result = set()
    for ref in refs:
        if ref.startswith(('#', '?')):
            continue
        parsed = urlsplit(urljoin(location, ref))
        if parsed.netloc != 'static.invalid' or parsed.scheme != 'https':
            continue
        prefix = base + '/'
        if not parsed.path.startswith(prefix):
            raise AssertionError(f'{path.relative_to(root)} escapes deployment prefix: {ref}')
        name = unquote(parsed.path[len(prefix):])
        if not name or name.endswith('/'):
            name += 'index.html'
        result.add(name)
    return result


def validate(root, base):
    count = 0
    for path in root.rglob('*'):
        if path.is_file():
            assert path.suffix not in ('.py', '.md'), f'Source/report in deployment: {path}'
            assert not any(part in ('output', 'interno', '__pycache__', '.git') for part in path.relative_to(root).parts)
            for name in dependencies(path, root, base):
                target = root / name
                assert target.resolve().is_relative_to(root.resolve()) and target.is_file(), f'{path}: missing {name}'
                count += 1
    print(f'PASS: {count} local asset/link references resolve below {base or "/"}; static artifact only.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--directory', default='_site')
    parser.add_argument('--base-path', default='')
    args = parser.parse_args()
    validate(Path(args.directory).resolve(), args.base_path.rstrip('/'))
