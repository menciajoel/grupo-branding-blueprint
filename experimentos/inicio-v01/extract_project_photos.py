#!/usr/bin/env python3
"""Extract the three verified embedded photographs; export uncropped WebP sizes.

Optional asset workflow: pypdf + Pillow. The static HTML build uses stdlib only.
Usage: python extract_project_photos.py --pdf /path/to/approved.pdf
"""
import argparse
import hashlib
import io
import json
from pathlib import Path

from PIL import Image, ImageCms
from pypdf import PdfReader

HERE = Path(__file__).resolve().parent


def digest(data):
    return hashlib.sha256(data).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--pdf', type=Path, required=True)
    args = parser.parse_args()
    data = json.loads((HERE / 'project-cases.json').read_text())
    assert digest(args.pdf.read_bytes()) == data['source']['sha256'], 'Unrecognized source PDF'
    pdf = PdfReader(args.pdf)
    originals = HERE / 'source-images/projects'
    exports = HERE / 'assets/media/projects'
    originals.mkdir(parents=True, exist_ok=True)
    exports.mkdir(parents=True, exist_ok=True)
    manifest = {'source': data['source'], 'images': {}}
    for case in data['cases']:
        embedded = next(image for image in pdf.pages[case['page'] - 1].images
                        if image.indirect_reference.idnum == case['imageObject'])
        source = embedded.image.copy()
        profile = embedded.indirect_reference.get_object()['/ColorSpace'][1].get_object().get_data()
        width, height = source.size
        native = originals / f'{case["asset"]}.png'
        # The Flate RGB pixels and embedded ICC profile are retained losslessly.
        source.save(native, format='PNG', icc_profile=profile, optimize=True)
        assert Image.open(native).tobytes() == source.tobytes(), 'Native pixels changed'
        managed = ImageCms.profileToProfile(source,
                    ImageCms.ImageCmsProfile(io.BytesIO(profile)),
                    ImageCms.createProfile('sRGB'), outputMode='RGB')
        sizes = sorted({n for n in (480, 800, 1200, width) if n <= width})
        variants = []
        for size in sizes:
            image = managed.resize((size, round(height * size / width)), Image.Resampling.LANCZOS)
            target = exports / f'{case["asset"]}-{size}.webp'
            image.save(target, format='WEBP', quality=86, method=6)
            variants.append({'file': str(target.relative_to(HERE)), 'width': image.width,
                             'height': image.height, 'bytes': target.stat().st_size,
                             'sha256': digest(target.read_bytes())})
        manifest['images'][case['id']] = {
            'page': case['page'], 'object': case['imageObject'], 'width': width, 'height': height,
            'original': str(native.relative_to(HERE)), 'originalSha256': digest(native.read_bytes()),
            'pixelsSha256': digest(source.tobytes()), 'iccSha256': digest(profile),
            'variants': variants}
    (HERE / 'project-images.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    print('Three native photographs retained; optimized sizes exported without crop or upscaling.')


if __name__ == '__main__':
    main()
