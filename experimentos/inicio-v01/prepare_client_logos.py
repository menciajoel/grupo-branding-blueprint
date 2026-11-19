#!/usr/bin/env python3
"""Create web-sized PNGs from the eight preserved official-source originals.

Optional preparation only: Pillow is needed here, never for the normal build.
The complete original canvas, colors and transparency remain; no logo is redrawn.
"""
from pathlib import Path
import hashlib
import json
import struct

from PIL import Image, PngImagePlugin

ROOT = Path(__file__).resolve().parent


def color_chunks(data):
    info = PngImagePlugin.PngInfo()
    offset = 8
    while offset < len(data):
        size = struct.unpack('>I', data[offset:offset + 4])[0]
        name = data[offset + 4:offset + 8]
        if name in (b'cHRM', b'gAMA', b'sRGB'):
            info.add(name, data[offset + 8:offset + 8 + size])
        offset += size + 12
    return info


def main():
    path = ROOT / 'clients.json'
    manifest = json.loads(path.read_text())
    target_dir = ROOT / 'assets/media/clients'
    target_dir.mkdir(parents=True, exist_ok=True)
    for client in manifest['clients']:
        source = ROOT / client['sourceFile']
        data = source.read_bytes()
        assert hashlib.sha256(data).hexdigest() == client['sourceSha256']
        with Image.open(source) as original:
            size = (800, round(original.height * 800 / original.width))
            resized = original.convert('RGBA').resize(size, Image.Resampling.LANCZOS)
            target = target_dir / (client['id'] + '.png')
            resized.save(target, optimize=True, compress_level=9,
                         pnginfo=color_chunks(data),
                         **({'icc_profile': original.info['icc_profile']} if 'icc_profile' in original.info else {}))
        client['image'] = {
            'file': str(target.relative_to(ROOT)), 'width': size[0], 'height': size[1],
            'bytes': target.stat().st_size,
            'sha256': hashlib.sha256(target.read_bytes()).hexdigest(),
            'processing': 'Lienzo completo reducido proporcionalmente; sin recorte, recoloreado, filtros ni IA.'
        }
    path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    print('Prepared 8 proportional PNGs:', sum(c['image']['bytes'] for c in manifest['clients']), 'bytes')


if __name__ == '__main__':
    main()
