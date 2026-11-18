#!/usr/bin/env python3
"""Static demonstration of COPY-P08. No submission endpoint or backend."""
import html
import json
import hashlib
from pathlib import Path

ROOT=Path(__file__).resolve().parent
MEDIA=ROOT.parent/'media-branding'
content=json.loads((ROOT/'content.json').read_text())
presentation=json.loads((MEDIA/'presentation-copy.json').read_text())
proposal={item['role']:item for item in presentation['blocks']}
blocks={block['id']:block for section in content['sections'] for block in section['blocks']}
esc=lambda value:html.escape(str(value),quote=True)
def block(section,number,tag='p',css='',identity=''):
    key=f'COPY-P08-S{section:02d}-B{number:02d}'
    text=blocks[key]['text'].strip('[]')
    attrs=f' id="{identity}"' if identity else ''
    return f'<{tag}{attrs} class="{css}" data-copy="{key}">{esc(text)}</{tag}>'

choices=''.join(f'<label class="need-option"><input type="radio" name="necesidad" value="{number}" {"checked" if number==2 else ""}><span data-copy="COPY-P08-S02-B{number:02d}">{esc(blocks[f"COPY-P08-S02-B{number:02d}"]["text"])}</span></label>' for number in range(2,7))
fields=[]
for number,kind,autocomplete in [(7,'text','name'),(8,'text','organization'),(9,'email','email'),(10,'tel','tel')]:
    key=f'COPY-P08-S02-B{number:02d}';identity=f'contact-field-{number}'
    fields.append(f'<div class="contact-field"><label for="{identity}" data-copy="{key}">{esc(blocks[key]["text"])}</label><input id="{identity}" type="{kind}" autocomplete="off"></div>')
textarea=f'<div class="contact-field contact-message"><label for="project-context" data-copy="COPY-P08-S02-B11">{esc(blocks["COPY-P08-S02-B11"]["text"])}</label><textarea id="project-context" rows="5" aria-describedby="project-help"></textarea></div>'
send=block(2,13,'span')
footer='<footer class="contact-footer"><a href="/media-branding/"><img src="../assets/brand/media-branding/horizontal-blanco.svg" width="202" height="60" alt="Media Branding"></a><a href="../experimentos/inicio-v01/" aria-label="Grupo Branding · Inicio">Grupo Branding<img src="../media-branding/assets/icons/arrow-up-right.svg" width="20" height="20" alt=""></a></footer>'
page=f'''<!doctype html>
<html lang="es"><head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#080f12">
  <title>Contacto | Grupo Branding</title>
  <link rel="icon" href="../assets/brand/grupo-branding/isotipo-color.svg" type="image/svg+xml">
  <link rel="stylesheet" href="../media-branding/tokens.css?v={hashlib.sha256((MEDIA/'tokens.css').read_bytes()).hexdigest()[:12]}">
  <link rel="stylesheet" href="../media-branding/styles.css?v={hashlib.sha256((MEDIA/'styles.css').read_bytes()).hexdigest()[:12]}">
  <link rel="stylesheet" href="contact.css?v={hashlib.sha256((ROOT/'contact.css').read_bytes()).hexdigest()[:12]}">
  <script src="../media-branding/assets/vendor/gsap.min.js" defer></script>
  <script src="contact.js?v={hashlib.sha256((ROOT/'contact.js').read_bytes()).hexdigest()[:12]}" defer></script>
</head><body class="division-page contact-page">
  <a class="skip-link" href="#contenido">Saltar al contenido</a>
  <header class="division-header contact-header"><a class="brand-link" href="../experimentos/inicio-v01/" aria-label="Grupo Branding · Inicio"><img src="../assets/brand/grupo-branding/horizontal-blanco.svg" width="180" height="64" alt="Grupo Branding"></a><nav aria-label="Grupo Branding"><a href="/media-branding/">Media Branding</a><a href="#contenido" aria-current="page">Contacto</a></nav></header>
  <main id="contenido" class="contact-main">
    <section class="contact-hero" aria-labelledby="contact-title">{block(1,1,'h1',identity='contact-title')}{block(1,2,'p','contact-introduction')}</section>
    <aside class="owner-context" id="predios-privados" aria-labelledby="owner-context-title" hidden><h2 id="owner-context-title">Predios privados</h2><p class="owner-email" data-demonstration-email>{esc(proposal['demonstrationEmail']['text'])}</p><span class="demo-status">Demostración</span></aside>
    <div class="contact-layout">
      <section class="contact-form" role="form" aria-labelledby="contact-form-title">
        {block(2,1,'h2',identity='contact-form-title')}
        <div class="need-options" role="radiogroup" aria-labelledby="contact-form-title">{choices}</div>
        <div class="contact-fields">{''.join(fields)}{textarea}</div>
        {block(2,12,'p','contact-help','project-help')}
        <div class="contact-form-action"><button type="button" class="button contact-send" disabled aria-describedby="contact-demo-status">{send}<img src="../media-branding/assets/icons/arrow-up-right.svg" width="22" height="22" alt=""></button><span class="demo-status" id="contact-demo-status">Demostración</span></div>
      </section>
      <section class="contact-details" aria-labelledby="contact-details-title">
        {block(3,1,'h2',identity='contact-details-title')}{block(3,2,'p','contact-details-introduction')}
        <div class="contact-channel">{block(3,3,'h3')}{block(3,4)}{block(3,5)}{block(3,6)}</div>
        <div class="contact-offices">{block(3,7,'h3')}{block(3,8)}</div>
      </section>
    </div>
    {footer}
  </main>
</body></html>'''
(ROOT/'index.html').write_text(page)
print('Rendered COPY-P08 → contacto/index.html (demonstration only)')
