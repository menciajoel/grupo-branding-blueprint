"""Static rendering primitives for division pages, independent of a runtime/CMS."""
import html

def esc(value):
    return html.escape(str(value), quote=True)

def icon(name='arrow-up-right', size=20):
    return f'<img src="assets/icons/{name}.svg" width="{size}" height="{size}" alt="">'

def editorial_block(block, element=None, css='', identity=''):
    element = element or ('h2' if block['type']=='h2' else 'p')
    attrs = f' id="{identity}"' if identity else ''
    return f'<{element}{attrs} class="{css}" data-copy="{block["id"]}">{esc(block["text"])}</{element}>'

def action(block, target='/contacto/', css='button', pending=True):
    status = ' data-pending' if pending else ''
    return f'<a class="{css}" href="{target}"{status} data-copy="{block["id"]}"><span>{esc(block["text"].strip("[]"))}</span>{icon(size=22)}</a>'

def figure(item, css='', sizes='(max-width:700px) 100vw, 60vw', extra=''):
    key=item['id']; asset=item.get('filePrefix',key); widths=item['sizes']; w,h=item.get('processedDimensions',item['originalDimensions'])
    sources=', '.join(f'assets/media/{asset}-{width}.webp {width}w' for width in widths)
    caption=f'<figcaption class="concept-disclosure">{esc(item["disclosure"])}</figcaption>' if item['type']=='generated' else f'<figcaption class="evidence-caption">{esc(item["caption"])}</figcaption>' if item.get('caption') else ''
    return f'<figure class="editorial-figure {css}" data-media="{key}" {extra}><div class="photo-shell"><img src="assets/media/{asset}-{widths[0]}.webp" srcset="{sources}" sizes="{sizes}" width="{w}" height="{h}" loading="lazy" decoding="async" alt="{esc(item["alt"])}" style="object-position:{esc(item.get("position","50% 50%"))}"></div>{caption}</figure>'

def section_label(number, label):
    return f'<p class="section-label"><span aria-hidden="true">{number:02d} / </span>{esc(label)}</p>'

def section_links(items, css='', omit_resolve=False):
    chosen=[item for item in items if not omit_resolve or item['target']!='#que-resolvemos']
    return f'<nav class="{css}" aria-label="Secciones de Media Branding">'+''.join(f'<a href="{item["target"]}" data-section-link><span>{esc(item["label"])}</span>{icon(size=16)}</a>' for item in chosen)+'</nav>'
