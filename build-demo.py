"""Bundle demo resources so sandboxed private embeds need no authenticated subrequests."""
from pathlib import Path
import base64
import json

root = Path(__file__).resolve().parent
dist = root / 'dist'
images = {}
for name in ['logo-tiramissu.png', 'product-individual.jpg', 'product-grande.jpg']:
    mime = 'image/png' if name.endswith('.png') else 'image/jpeg'
    images[name] = 'data:' + mime + ';base64,' + base64.b64encode((dist / 'assets' / 'missu' / name).read_bytes()).decode('ascii')
html = (root / 'demo-template.html').read_text(encoding='utf-8')
css = (dist / 'missu-demo.css').read_text(encoding='utf-8')
js = (dist / 'missu-demo.js').read_text(encoding='utf-8')
js = js.replace('assets/missu/${p.img}', '${demoImages[p.img]}')
js = js.replace('assets/missu/logo-tiramissu.png', images['logo-tiramissu.png'])
js = 'const demoImages=' + json.dumps(images) + ';\n' + js
html = html.replace('<link rel="stylesheet" href="missu-demo.css">', '<style>' + css + '</style>')
html = html.replace('<script src="missu-demo.js"></script>', '<script>' + js + '</script>')
html = html.replace('assets/missu/logo-tiramissu.png', images['logo-tiramissu.png'])
assert 'src="assets/' not in html and 'src="missu-demo.js"' not in html
(dist / 'missu-demo.html').write_text(html, encoding='utf-8')
print('Self-contained demo built:', len(html.encode('utf-8')), 'bytes')
