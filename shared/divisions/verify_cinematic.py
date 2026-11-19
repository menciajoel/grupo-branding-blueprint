"""Check the three requested pairs and exact reuse of the approved controller."""
from html.parser import HTMLParser
from pathlib import Path
from cinematic import resources

ROOT = Path(__file__).resolve().parents[2]


class Planes(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.nodes = []

    def handle_starttag(self, tag, attrs):
        node = {'tag': tag, 'attrs': dict(attrs), 'parent': self.stack[-1] if self.stack else None, 'children': []}
        if node['parent']:
            node['parent']['children'].append(node)
        self.nodes.append(node)
        if tag not in ('area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'):
            self.stack.append(node)

    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1, -1, -1):
            if self.stack[i]['tag'] == tag:
                del self.stack[i:]
                break


def verify():
    for name, expected in resources().items():
        assert (ROOT / 'shared/divisions' / name).read_text() == expected, 'Stale adapted approved cinematic resource: ' + name
    for folder, outgoing, incoming in [('media-branding','retail','vallas-y-formatos-publicitarios'),
                                        ('linkbranding','eventos','activaciones'),
                                        ('media-print','rotulacion-y-desarrollos','proyectos')]:
        page = (ROOT / folder / 'index.html').read_text()
        doc = Planes(); doc.feed(page)
        back = [n for n in doc.nodes if 'data-cinematic-back' in n['attrs']]
        front = [n for n in doc.nodes if 'data-cinematic-front' in n['attrs']]
        assert len(back) == len(front) == 1, folder + ': one pair only'
        back, front = back[0], front[0]
        assert back['attrs']['id'] == outgoing, folder + ': wrong outgoing section'
        assert back['parent'] is front['parent'] and 'cinematic-stack' in back['parent']['attrs'].get('class',''), folder
        assert back['parent']['children'] == [back, front], folder + ': no artificial spacer or extra content in the stack'
        first = front['children'][0] if folder == 'linkbranding' else front
        assert first['attrs']['id'] == incoming, folder + ': incoming chapter must be 04'
        for extension in ('css','js'):
            assert page.count('../shared/divisions/cinematic.' + extension + '?v=') == 1, folder
    print('PASS · 3 exact chapter-04 pairs · original approved cinematic clock/scales · one unpinned controller per page')


if __name__ == '__main__':
    verify()
