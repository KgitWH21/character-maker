"""Build the downloadable app from current sources; never include an old archive."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import json
files = ['index.html', 'style.css', 'guided.css', 'app.js', 'guided-builder.js', 'guided-ui.js', 'core.js', 'life-data.js', 'character-life.js', 'criminal-history.js', 'additions.js',
         'right-now-data.js', 'right-now.js', 'dialogue-data.js', 'dialogue.js', 'languages.js', 'app-updates.js', 'character-tools.js', 'medical.js', 'character-canvas.js', 'original-data.js',
         'character_elements.json', 'story_elements.json', 'social-issues-additions.json', 'game-genres.json',
         'story-data.js', 'game-genres-data.js', 'story-metadata.js', 'story-elements.js', 'affinity-data.js', 'character-affinities.js', 'clothing.js', 'manifest.webmanifest', 'sw.js',
         'icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'README.md',
         'verify.cjs', 'verify-birthday.cjs', 'verify-birthday-browser.cjs', 'verify-clothing.cjs', 'verify-clothing-browser.cjs', 'verify-story.cjs', 'verify-story-browser.cjs', 'verify-affinities.cjs', 'verify-affinities-browser.cjs', 'verify-life.cjs', 'verify-criminal.cjs', 'verify-criminal-browser.cjs', 'verify-life-browser.cjs', 'verify-guided.cjs', 'verify-guided-browser.cjs', 'verify-browser.cjs', 'verify-detail-pages-browser.cjs', 'verify-updates-browser.cjs', 'package-app.py']
base = Path(__file__).resolve().parent
# The browser loads this wrapper, so every package must include the current JSON pools.
elements = json.loads((base / 'character_elements.json').read_text(encoding='utf-8'))
(base / 'original-data.js').write_text(
    'window.ORIGINAL_ELEMENTS = ' + json.dumps(elements, ensure_ascii=False, indent=2) + ';\n',
    encoding='utf-8',
)
story = json.loads((base / 'story_elements.json').read_text(encoding='utf-8'))
story['additions'] = json.loads((base / 'social-issues-additions.json').read_text(encoding='utf-8'))
for filename, variable, data in [
    ('story-data.js', 'StoryData', story),
    ('game-genres-data.js', 'GameGenres', json.loads((base / 'game-genres.json').read_text(encoding='utf-8'))),
]:
    (base / filename).write_text('window.' + variable + ' = ' + json.dumps(data, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
with ZipFile(base / 'character-maker.zip', 'w', ZIP_DEFLATED) as archive:
    for name in files:
        archive.write(base / name, 'character-maker/' + name)
print('Packaged', len(files), 'current files.')
