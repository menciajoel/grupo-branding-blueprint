"""Editorial gallery markup. Order/labels/images remain editable in projects.json."""
from components import esc,icon

def project_gallery(data,media):
    items=data['items'];figures=[]
    for i,record in enumerate(items):
        item=media[record['mediaId']];asset=item.get('filePrefix',item['id']);widths=item['sizes'];w,h=item.get('processedDimensions',item['originalDimensions'])
        sources=', '.join(f'assets/media/{asset}-{width}.webp {width}w' for width in widths)
        provenance=item['disclosure'] if item['type']=='generated' else 'Fotografía documental'
        figures.append(f'<figure class="project-slide" role="group" aria-roledescription="fotografía" aria-label="{i+1} de {len(items)}: {esc(record["label"])}" data-project-slide="{i}" data-slot="{i}" data-media="{esc(item["id"])}" data-evidence="{record["evidence"]}" aria-hidden="{str(i>=5).lower()}"><div class="project-photo"><img src="assets/media/{asset}-{widths[0]}.webp" srcset="{sources}" sizes="(max-width:700px) 90vw, (max-width:1100px) 65vw, 50vw" width="{w}" height="{h}" loading="lazy" decoding="async" draggable="false" alt="{esc(item["alt"])}" style="object-position:{esc(item.get("position","50% 50%"))}"></div><figcaption><span class="project-label">{esc(record["label"])}</span><small class="project-provenance">{esc(provenance)}</small></figcaption></figure>')
    return f'''<div class="projects-gallery" id="projects-gallery" role="region" aria-roledescription="galería" aria-labelledby="heading-11" tabindex="0" data-project-gallery data-project-index="0">
      <div class="projects-frame"><div class="projects-track" data-project-track>{''.join(figures)}</div></div>
      <div class="projects-controls"><button class="projects-arrow" type="button" data-project-prev aria-label="Fotografía anterior" aria-controls="projects-gallery" hidden>{icon('arrow-down',30)}</button><div class="projects-counter" aria-hidden="true"><b data-project-current>01</b><span>/</span>{len(items):02d}</div><button class="projects-arrow" type="button" data-project-next aria-label="Fotografía siguiente" aria-controls="projects-gallery" hidden>{icon('arrow-down',30)}</button></div>
      <p class="projects-status" role="status" aria-live="polite" aria-atomic="true" data-project-status>Fotografía 1 de {len(items)}: {esc(items[0]['label'])}.</p>
    </div>'''
