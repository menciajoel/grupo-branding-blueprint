#!/usr/bin/env python3
"""Serve the local experiment and the static approved site, never repository data."""
import argparse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit

HERE = Path(__file__).resolve().parent
STATIC = HERE.parents[1] / '_site'
PREFIX = '/experimentos/contacto-inteligente/'
ALLOWED = {'.html', '.css', '.js', '.svg', '.webp', '.avif', '.png', '.jpg', '.woff2', '.woff', '.ico'}


class Preview(SimpleHTTPRequestHandler):
    def translate_path(self, url):
        path = unquote(urlsplit(url).path)
        if '..' in path.split('/'):
            return str(HERE / '__not_available__')
        if path == '/':
            return str(HERE / 'index.html')
        local = path.startswith(PREFIX)
        base = HERE if local else STATIC
        relative = path[len(PREFIX):] if local else path.lstrip('/')
        target = (base / relative).resolve()
        if target.is_dir():
            target = target / 'index.html'
        if not target.is_relative_to(base.resolve()) or target.suffix not in ALLOWED:
            return str(HERE / '__not_available__')
        return str(target)

    def list_directory(self, path):
        self.send_error(404)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--bind', default='127.0.0.1')
    parser.add_argument('--port', type=int, default=4180)
    args = parser.parse_args()
    print(f'Local preview: http://{args.bind}:{args.port}{PREFIX}', flush=True)
    ThreadingHTTPServer((args.bind, args.port), Preview).serve_forever()
