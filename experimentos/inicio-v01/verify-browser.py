#!/usr/bin/env python3
"""Browser checks using the existing Playwright CLI, without installed project deps."""
import argparse
import json
import os
import subprocess
from pathlib import Path

ROOT=Path(__file__).resolve().parent
parser=argparse.ArgumentParser()
parser.add_argument('--url',default='http://127.0.0.1:4173/experimentos/inicio-v01/')
parser.add_argument('--session',default='gb-redesign')
parser.add_argument('--label',default='local')
args=parser.parse_args()
cli=Path(os.environ.get('PLAYWRIGHT_WRAPPER',str(Path.home()/'.codex/skills/playwright/scripts/playwright_cli.sh')))
assert cli.is_file(), 'Set PLAYWRIGHT_WRAPPER to an existing Playwright CLI wrapper'
output=ROOT/'output/playwright';output.mkdir(parents=True,exist_ok=True)

def run(code):
    result=subprocess.run([str(cli),'-s='+args.session,'run-code',code],cwd=ROOT,env={**os.environ,'npm_config_offline':'true'},text=True,capture_output=True)
    if result.returncode or '### Error' in result.stdout:
        raise RuntimeError(result.stdout+result.stderr)
    match=result.stdout.split('### Result\n',1)
    return json.loads(match[1].split('\n### ',1)[0]) if len(match)>1 else None

setup='''async page => {
  page.__gbAudit={errors:[],http:[],failed:[],posts:[],external:[]};
  if (!page.__gbListening) {
    page.__gbListening=true;
    page.on('pageerror',e=>page.__gbAudit.errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')page.__gbAudit.errors.push(m.text());});
    page.on('response',r=>{if(r.status()>=400)page.__gbAudit.http.push([r.status(),r.url()]);});
    page.on('requestfailed',r=>page.__gbAudit.failed.push([r.failure()?.errorText,r.url()]));
    page.on('request',r=>{if(r.method()!=='GET')page.__gbAudit.posts.push([r.method(),r.url()]);if(new URL(r.url()).origin!==new URL(page.url()).origin)page.__gbAudit.external.push(r.url());});
  }
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.setViewportSize({width:1440,height:900});
  await page.goto(__BASE__,{waitUntil:'networkidle'});
  await page.evaluate(()=>{history.replaceState(null,'',location.pathname);scrollTo(0,0)});
  await page.waitForTimeout(1700);
  return await page.evaluate(()=>({gsap:gsap.version,scrollTrigger:ScrollTrigger.version,viewport:[innerWidth,innerHeight]}));
}'''.replace('__BASE__',json.dumps(args.url))
results={'runtime':run(setup)}
print('Runtime:',results['runtime'],flush=True)

results['desktop']=run('''async page => {
  const check=(v,m)=>{if(!v)throw new Error(m)};
  check(await page.locator('main section').count()===8,'Eight homepage sections');
  check(await page.locator('[data-copy^="COPY-P01-"]').count()===46,'46 approved blocks');
  check(await page.evaluate(()=>!!ScrollTrigger.getById('brand-convergence')),'Desktop pin exists');
  const phases=[];
  for(const p of [0,.28,.5,.74,1,0]){
    await page.evaluate(p=>scrollTo(0,ScrollTrigger.getById('brand-convergence').end*p),p);
    await page.waitForTimeout(1000);
    phases.push(await page.evaluate(()=>({phase:document.querySelector('.convergence-scene').dataset.phase,progress:Number(document.querySelector('.convergence-scene').dataset.progress)})));
    const rigid=await page.evaluate(()=>[...document.querySelectorAll('.brand-art .piece-stage')].every(e=>{const m=e.getCTM();return Math.abs(Math.hypot(m.a,m.b)-Math.hypot(m.c,m.d))<.001 && Math.abs(m.a*m.c+m.b*m.d)<.001;}));
    check(rigid,'Isotype rigid transforms');
  }
  check(phases[0].phase==='hero' && phases[4].phase==='divisions' && phases[5].phase==='hero','Reversible scroll states');
  await page.getByRole('navigation',{name:'Navegación principal',exact:true}).getByRole('link',{name:'Divisiones',exact:true}).click();
  await page.waitForTimeout(850);
  for(let i=0;i<3;i++){
    const tab=page.locator('[data-tab]').nth(i);await tab.click();
    check(await tab.getAttribute('aria-selected')==='true','Selected division '+i);
    check(await page.locator('[data-panel]').nth(i).isVisible(),'Visible division panel '+i);
  }
  await page.locator('[data-tab]').nth(2).press('Home');
  check(await page.locator('[data-tab]').nth(0).getAttribute('aria-selected')==='true','Keyboard Home');
  await page.locator('[data-tab]').nth(0).press('ArrowDown');
  check(await page.locator('[data-tab]').nth(1).getAttribute('aria-selected')==='true','Keyboard arrow');
  await page.locator('[data-panel]').nth(1).getByRole('link').click();
  check(await page.locator('#preview-dialog').evaluate(e=>e.open),'Division CTA dialog');
  check(await page.locator('#preview-path').textContent()==='/linkbranding/','Approved division destination');
  await page.keyboard.press('Escape');
  check(await page.locator('[data-panel]').nth(1).getByRole('link').evaluate(e=>e===document.activeElement),'Dialog focus return');
  await page.getByRole('button',{name:'Abrir menú',exact:true}).click();
  check(await page.locator('#menu-dialog').evaluate(e=>e.open),'Native menu');
  await page.locator('#menu-dialog').getByRole('link',{name:'Proyectos',exact:true}).click();
  check(!(await page.locator('#menu-dialog').evaluate(e=>e.open)),'Menu closes on navigation');
  const names=['Dunkin','ISSIMA','Flying Fish'];
  for(let i=0;i<3;i++){
    await page.locator('.project-row').nth(i).click();
    check(await page.locator('#preview-title').textContent()===names[i],'Case title');
    check((await page.locator('#preview-body').textContent()).includes('Evidencia fotográfica documentada'),'Documented case evidence');
    check(await page.locator('#preview-body img').count()===0,'No stock project image');
    await page.keyboard.press('Escape');
  }
  await page.locator('[data-solution-select]').nth(3).click();await page.waitForTimeout(800);
  check(await page.locator('[data-solution-select]').nth(3).getAttribute('aria-pressed')==='true','Solution selector');
  await page.getByRole('navigation',{name:'Navegación principal',exact:true}).getByRole('link',{name:'Contacto',exact:true}).click();
  const contactTop=await page.locator('#contacto').evaluate(e=>e.getBoundingClientRect().top);
  check(contactTop>=90 && contactTop<=110,'Header-safe contact destination');
  await page.locator('#contacto [data-preview]').click();
  check(await page.locator('#preview-path').textContent()==='/contacto/','Contact CTA');await page.keyboard.press('Escape');
  await page.locator('#newsletter-email').fill('invalid');await page.locator('.newsletter-form button').click();
  check(await page.locator('.form-error').isVisible(),'Invalid email feedback');
  await page.locator('#newsletter-email').fill('review@example.test');await page.locator('[name=consent]').check();await page.locator('.newsletter-form button').click();
  check(await page.locator('#newsletter-dialog').evaluate(e=>e.open),'Valid form preview');
  check((await page.locator('#newsletter-dialog').textContent()).includes('No se ha registrado tu dirección'),'No false subscription');
  await page.keyboard.press('Escape');
  await page.locator('.footer-meta [data-credits]').click();
  check(await page.locator('#credits-dialog .credit-list a').count()===3,'Photo credit links');await page.keyboard.press('Escape');
  await page.goto(BASE+'?vista=contacto',{waitUntil:'networkidle'});
  check(await page.locator('#preview-dialog').evaluate(e=>e.open),'Direct CTA preview URL');await page.keyboard.press('Escape');
  await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(1000);
  await page.locator('.motion-toggle').click();await page.waitForTimeout(350);
  check(await page.evaluate(()=>ScrollTrigger.getAll().length===0),'Manual reduced motion has no scroll animation');
  check(await page.locator('.division-surface').evaluate(e=>!e.inert),'Static divisions accessible');
  await page.locator('.motion-toggle').click();await page.waitForTimeout(1500);
  check(await page.evaluate(()=>!!ScrollTrigger.getById('brand-convergence')),'Movement restored');
  return {phases,divisionTabs:3,documentedCases:3,newsletter:'validated/no transmission',dialogs:'menu/destination/cases/credits/form',keyboard:'tabs/menu/Escape/focus return',motionToggle:'pass'};
}'''.replace('BASE',json.dumps(args.url)))
print('Desktop interactions passed',flush=True)

results['responsive']=run('''async page => {
  const report=[];
  for(const [width,height] of [[1672,941],[1440,900],[1280,800],[1100,780],[1024,768],[768,1024],[390,844],[320,800]]){
    await page.setViewportSize({width,height});await page.goto(BASE,{waitUntil:'networkidle'});
    await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(1600);
    const metrics=await page.evaluate(()=>({viewport:[innerWidth,innerHeight],scrollWidth:document.documentElement.scrollWidth,pins:document.querySelectorAll('.pin-spacer').length,viewBox:document.querySelector('.brand-art').getAttribute('viewBox'),dpr:devicePixelRatio}));
    if(metrics.scrollWidth>width)throw new Error('Horizontal overflow '+width);
    if(width<1100 && metrics.pins)throw new Error('Pinned mobile/tablet');
    await page.screenshot({path:'output/playwright/'+LABEL+'-'+width+'-hero.png'});
    if(width>=1100){
      await page.evaluate(()=>scrollTo(0,ScrollTrigger.getById('brand-convergence').end*.5));await page.waitForTimeout(1000);
      await page.screenshot({path:'output/playwright/'+LABEL+'-'+width+'-convergence.png'});
    }
    const nav=width<=700 ? page.locator('#menu-dialog') : page.getByRole('navigation',{name:'Navegación principal',exact:true});
    if(width<=700)await page.getByRole('button',{name:'Abrir menú',exact:true}).click();
    await nav.getByRole('link',{name:'Divisiones',exact:true}).click();await page.waitForTimeout(1000);
    await page.locator('[data-tab]').nth(2).click();
    if(!(await page.locator('[data-panel]').nth(2).isVisible()))throw new Error('Division panel '+width);
    await page.screenshot({path:'output/playwright/'+LABEL+'-'+width+'-divisions.png'});
    await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await page.waitForTimeout(500);
    if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw new Error('Footer overflow '+width);
    report.push(metrics);
  }
  await page.setViewportSize({width:1440,height:900});await page.emulateMedia({reducedMotion:'reduce'});await page.goto(BASE,{waitUntil:'networkidle'});
  if(!(await page.evaluate(()=>ScrollTrigger.getAll().length===0)))throw new Error('OS reduced motion');
  if(await page.locator('.motion-toggle').isVisible())throw new Error('OS preference overruled');
  await page.getByRole('navigation',{name:'Navegación principal',exact:true}).getByRole('link',{name:'Divisiones',exact:true}).click();await page.locator('[data-tab]').nth(1).click();
  if(!(await page.locator('[data-panel]').nth(1).isVisible()))throw new Error('Reduced motion tabs');
  await page.screenshot({path:'output/playwright/'+LABEL+'-reduced-motion.png'});
  await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(1600);
  return {viewports:report,reducedMotion:'pass; no pin/no scroll animation; tabs functional',resizeAndPreferenceChanges:'pass'};
}'''.replace('BASE',json.dumps(args.url)).replace('LABEL',json.dumps(args.label)))
print('Responsive and motion preferences passed',flush=True)

results['audit']=run('''async page=>{
 await page.setViewportSize({width:1672,height:941});await page.goto(BASE,{waitUntil:'networkidle'});await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(1700);
 await page.screenshot({path:'output/playwright/'+LABEL+'-1672-hero.png'});
 return { ...page.__gbAudit,performance:await page.evaluate(()=>({navigation:performance.getEntriesByType('navigation').map(n=>({domContentLoadedMs:Math.round(n.domContentLoadedEventEnd),loadMs:Math.round(n.loadEventEnd)})),resources:performance.getEntriesByType('resource').length})),finalURL:page.url()};
}'''.replace('BASE',json.dumps(args.url)).replace('LABEL',json.dumps(args.label)))
blocking=[x for x in results['audit']['failed'] if x[0]!='net::ERR_ABORTED']
assert not results['audit']['errors'],results['audit']['errors']
assert not results['audit']['http'],results['audit']['http']
assert not results['audit']['posts'],results['audit']['posts']
assert not results['audit']['external'],results['audit']['external']
assert not blocking,blocking
(output/f'{args.label}-test-results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
print('PASS · zero JS errors/HTTP failures/POSTs/external runtime dependencies',flush=True)
print('Report:',output/f'{args.label}-test-results.json')
