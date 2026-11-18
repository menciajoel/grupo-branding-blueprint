#!/usr/bin/env python3
"""Create responsive WebP derivatives of the supplied photograph. Pillow, offline."""
import io
import json
from pathlib import Path
from PIL import Image, ImageCms, ImageOps

ROOT = Path(__file__).resolve().parent
manifest = json.loads((ROOT / 'media.json').read_text())['hero']
original = Image.open(ROOT.parent / manifest['source'])
image = ImageOps.exif_transpose(original).convert('RGB')
srgb = ImageCms.createProfile('sRGB')
if original.info.get('icc_profile'):
    image = ImageCms.profileToProfile(image, ImageCms.ImageCmsProfile(io.BytesIO(original.info['icc_profile'])), srgb, outputMode='RGB')
profile = ImageCms.ImageCmsProfile(srgb).tobytes()
for width in manifest['files']:
    size = (width, round(image.height * width / image.width))
    image.resize(size, Image.Resampling.LANCZOS).save(ROOT / f'assets/media/unipolar-vu018-{width}.webp', quality=84, method=6, icc_profile=profile)
print('WebP generated with sRGB profile. Original photograph unchanged.')
