"""Server-rendered documentary cases using the approved case registry."""
import html
import json


def render(root, content, icon):
    evidence = json.loads((root / 'project-cases.json').read_text())
    images = json.loads((root / 'project-images.json').read_text())['images']
    registry = {item['id']: item for item in content['projects']}
    esc = lambda value: html.escape(str(value), quote=True)

    def photo(case, catalog=False):
        image = images[case['id']]
        sizes = '(max-width:700px) calc(100vw - 64px), (max-width:1100px) 80vw, 650px'
        if catalog:
            sizes = '(max-width:700px) 85vw, 360px'
        variants = image['variants']
        srcset = ', '.join(f'{v["file"]} {v["width"]}w' for v in variants)
        return (f'<img src="{esc(variants[1]["file"])}" '
                f'srcset="{esc(srcset)}" '
                f'sizes="{sizes}" width="{image["width"]}" height="{image["height"]}" '
                f'alt="{esc(case["alt"])}" loading="lazy" decoding="async">')

    templates, fallback, catalog = [], [], []
    for case in evidence['cases']:
        approved = registry[case['id']]
        quote = approved['testimonial']
        full = ''.join(f'<p>{esc(text)}</p>' for text in case['testimonialParagraphs'])
        article = (f'<article class="case-layout" data-case-id="{case["id"]}" '
                   f'data-portrait="{str(images[case["id"]]["height"] > images[case["id"]]["width"]).lower()}">'
                   f'<figure class="case-figure">{photo(case)}</figure><div class="case-copy">'
                   f'<h2 class="case-project-title">{esc(approved["name"])}</h2>'
                   f'<p class="case-description">{esc(approved["presentation"])} {esc(approved["execution"])}</p>'
                   f'<blockquote><p>“{esc(quote["quote"])}”</p><cite>{esc(quote["attribution"])}</cite></blockquote>'
                   f'<details class="case-testimony" open><summary><span>Testimonio completo</span>{icon("arrow-down",18)}</summary>'
                   f'<div class="case-letter">{full}</div></details></div></article>')
        templates.append(f'<template id="project-case-{case["slug"]}">{article}</template>')
        fallback.append(f'<section class="case-fallback-item" id="caso-{case["asset"]}">'
                        f'<h3>{esc(approved["name"])}</h3>{article}</section>')
        catalog.append(f'<a class="case-catalog-link" href="?vista={case["slug"]}#caso-{case["asset"]}" '
                       f'data-case-link="{case["slug"]}"><figure>{photo(case,True)}</figure>'
                       f'<div><h3>{esc(approved["name"])}</h3>{icon(size=22)}</div></a>')
    catalog_body = esc(content['destinations']['/portafolio/']['body'])
    templates.append('<template id="project-case-portafolio">'
                     f'<p class="case-catalog-intro">{catalog_body}</p>'
                     f'<div class="case-catalog">{"".join(catalog)}</div></template>')
    return ''.join(templates), '<noscript id="project-cases-fallback"><div class="case-no-script">' + ''.join(fallback) + '</div></noscript>'
