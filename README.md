# CV Workspace

Repository per gestire CV in formato documentale e versione web pubblicabile.

## Tecnologie
- Web CV: `HTML5`, `CSS3`, `JavaScript` vanilla.
- Hosting: `GitHub Pages`.
- Locale: server statico con `python3 -m http.server`.

## Struttura
- `docs/`: materiali sorgente, contenuti profilo/esperienze/competenze e output finali.
- Root progetto: CV web (markup, stile, logica e asset).

## Avvio locale (CV Web)
```bash
python3 -m http.server 8080
```
Apri `http://localhost:8080`.

## Build ottimizzata (minificata)
```bash
npm install
npm run build
```
Output in `dist/`:
- `index.html` minificato
- `styles.css` minificato
- `script.js` minificato
- `assets/` copiati (font `woff2`, immagini, favicon)

## Pubblicazione
1. Esegui commit e push sul repository.
2. In GitHub vai su `Settings > Pages`.
3. Seleziona branch e cartella di pubblicazione (`/`).
4. URL pubblico: `https://sebastianolaurent.github.io/resume/`.

## File principali
- `index.html`: struttura pagina e metadati.
- `styles.css`: design, responsive e stampa.
- `script.js`: contenuti CV e logica rendering.
