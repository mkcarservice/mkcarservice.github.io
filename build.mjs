// Build: bündelt und minifiziert src/css/site.css und src/js/site.js nach assets/,
// hängt einen Hash des Inhalts an den Dateinamen und trägt die neuen Namen in
// alle HTML-Seiten ein. Ein neuer Hash bedeutet eine neue URL, deshalb laden
// Browser nach einem Deployment die neue Fassung, egal wie lange sie die alte
// im Cache hatten.
//
//   npm run build

import { build } from 'esbuild';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { execSync } from 'node:child_process';

const ausgaben = [
  { quelle: 'src/css/site.css', muster: /assets\/site\.[a-f0-9]{8}\.css/g, endung: 'css' },
  { quelle: 'src/js/site.js', muster: /assets\/site\.[a-f0-9]{8}\.js/g, endung: 'js' },
];

const seiten = readdirSync('.').filter((f) => f.endsWith('.html'));
const ersetzungen = [];

for (const { quelle, muster, endung } of ausgaben) {
  const ergebnis = await build({
    entryPoints: [quelle],
    bundle: false,
    minify: true,
    write: false,
    target: ['es2020', 'chrome100', 'firefox100', 'safari15'],
    legalComments: 'none',
  });
  const inhalt = ergebnis.outputFiles[0].text;
  const hash = createHash('sha256').update(inhalt).digest('hex').slice(0, 8);
  const ziel = `assets/site.${hash}.${endung}`;

  for (const alt of readdirSync('assets')) {
    if (new RegExp(`^site\\.[a-f0-9]{8}\\.${endung}$`).test(alt) && `assets/${alt}` !== ziel) {
      unlinkSync(`assets/${alt}`);
    }
  }
  writeFileSync(ziel, inhalt);
  ersetzungen.push({ muster, ziel });
  console.log(`${ziel}  ${inhalt.length} Bytes (Quelle ${readFileSync(quelle).length} Bytes)`);
}

for (const seite of seiten) {
  const vorher = readFileSync(seite, 'utf8');
  let nachher = vorher;
  for (const { muster, ziel } of ersetzungen) {
    nachher = nachher.replace(muster, ziel);
  }
  if (nachher !== vorher) writeFileSync(seite, nachher);
}
console.log(`${seiten.length} Seiten geprüft.`);

// Sitemap mit lastmod: Datum des letzten Commits je Seite, bei nicht
// eingecheckten Änderungen das heutige Datum.
const heute = new Date().toISOString().slice(0, 10);
function letzteAenderung(seite) {
  const geaendert = execSync(`git status --porcelain -- "${seite}"`).toString().trim() !== '';
  if (geaendert) return heute;
  const datum = execSync(`git log -1 --format=%cs -- "${seite}"`).toString().trim();
  return datum || heute;
}
const eintraege = seiten
  .filter((s) => s !== '404.html')
  .map((s) => `  <url>\n    <loc>https://mkcarservice.de/${s === 'index.html' ? '' : s}</loc>\n    <lastmod>${letzteAenderung(s)}</lastmod>\n  </url>`);
writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${eintraege.join('\n')}\n</urlset>\n`);
console.log(`sitemap.xml mit ${eintraege.length} Seiten geschrieben.`);
