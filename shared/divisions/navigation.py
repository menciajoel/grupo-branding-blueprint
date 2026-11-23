"""One set of real corporate destinations for the three division headers."""
import html
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[2]
DESTINATIONS = (
    ('grupo-branding', 'Grupo Branding', '../experimentos/inicio-v01/', None, None),
    ('media-branding', 'Media Branding', '../media-branding/', 'media-branding/tokens.css', '--mb-pigment-blue'),
    ('linkbranding', 'Linkbranding', '../linkbranding/', 'linkbranding/theme.css', '--division-accent'),
    ('media-print', 'Media Printing', '../media-print/', 'media-print/theme.css', '--division-accent'),
)


def division_navigation(current):
    assert current in {item[0] for item in DESTINATIONS[1:]}
    links = []
    for key, name, href, source, token in DESTINATIONS:
        if key == current:
            continue
        # The existing identity tokens remain the color authority, including
        # the specifically approved interface blue of Media Branding.
        accent = re.search(re.escape(token) + r'\s*:\s*(#[0-9a-fA-F]{6})',
                           (ROOT / source).read_text())[1] if source else 'currentColor'
        links.append(f'<a href="{href}" data-division-destination="{key}" '
                     f'style="--division-destination-accent:{accent}">{html.escape(name)}</a>')
    return ('''<details class="division-switcher" data-division-switcher>
      <summary role="button" aria-controls="division-destinations">Divisiones<svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false"><path d="m3 6 5 5 5-5" stroke="currentColor" stroke-width="1.5"/></svg></summary>
      <div class="division-destinations" id="division-destinations" role="group" aria-labelledby="division-destinations-label">
        <p class="division-destinations-label" id="division-destinations-label">Otras divisiones</p>
        <div class="division-destination-links">''' + ''.join(links) + '</div></div></details>')
