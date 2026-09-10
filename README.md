# mkcarservice.de

Website von MK Car Service, Kfz-Meisterwerkstatt in Gütersloh. Zehn statische
HTML-Seiten, gehostet auf GitHub Pages. Die Seite lädt nichts von fremden
Servern, setzt keine Cookies und speichert nichts im Browser.

## Aufbau

| Pfad               | Inhalt                                                           |
| ------------------ | ---------------------------------------------------------------- |
| `*.html`           | Die zehn Seiten. Das ist der Quelltext, es gibt keine Templates. |
| `src/css/site.css` | Das Stylesheet, eine Datei.                                      |
| `src/js/site.js`   | Das Skript für Navigation und Untermenü.                         |
| `assets/`          | Gebaute Dateien: `site.<hash>.css`, `site.<hash>.js`, Schriften. |
| `bilder/`          | Alle Bilder, mit sprechenden Dateinamen.                         |
| `build.mjs`        | Der Build, siehe unten.                                          |

## Ändern und veröffentlichen

Texte stehen direkt in den HTML-Dateien. Stylesheet und Skript liegen in `src/`
und werden vor dem Veröffentlichen gebaut:

```
npm install
npm run build
```

Der Build minifiziert beide Dateien nach `assets/`, hängt einen Hash des
Inhalts an den Dateinamen und trägt die neuen Namen in alle HTML-Seiten ein.
Ein neuer Hash ist eine neue URL. Browser laden deshalb nach jedem Deployment
die neue Fassung, auch wenn sie die alte noch im Cache haben. Die gebauten
Dateien werden mit eingecheckt, GitHub Pages liefert sie unverändert aus.

Lokal testen:

```
docker compose up -d
```

Danach ist die Seite unter http://localhost:8080 erreichbar.

## Regeln

- Keine Cookies, keine Datensammlung, keine Inhalte von fremden Servern.
- Seiten-URLs bleiben stabil. Neue Seiten gehören in `sitemap.xml`.
- Neue Bilder nach `bilder/`, mit sprechendem Namen, als WebP oder optimiertes
  JPEG, höchstens 1920 Pixel breit.
