"""Build the downloadable app from current sources; never include an old archive."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
files = ['index.html', 'style.css', 'guided.css', 'app.js', 'guided-builder.js', 'guided-ui.js', 'core.js', 'life-data.js', 'character-life.js', 'criminal-history.js', 'additions.js',
         'right-now-data.js', 'right-now.js', 'dialogue-data.js', 'dialogue.js', 'languages.js', 'app-updates.js', 'character-tools.js', 'medical.js', 'character-canvas.js', 'original-data.js',
         'character_elements.json', 'manifest.webmanifest', 'sw.js',
         'icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'README.md',
         'verify.cjs', 'verify-life.cjs', 'verify-criminal.cjs', 'verify-criminal-browser.cjs', 'verify-life-browser.cjs', 'verify-guided.cjs', 'verify-guided-browser.cjs', 'verify-browser.cjs', 'verify-updates-browser.cjs', 'package-app.py']
base = Path(__file__).resolve().parent
with ZipFile(base / 'character-maker.zip', 'w', ZIP_DEFLATED) as archive:
    for name in files:
        archive.write(base / name, 'character-maker/' + name)
print('Packaged', len(files), 'current files.')
