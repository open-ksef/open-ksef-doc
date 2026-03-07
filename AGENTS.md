# AGENTS.md

Instrukcje dla agentów AI pracujących z tym repozytorium.

## Koncept

To repozytorium (`open-ksef-doc`) zawiera stronę dokumentacji i marketingu dla projektu **OpenKSeF** -- otwartoźródłowego systemu do synchronizacji i przeglądania faktur z polskiego KSeF.

### Czym jest to repo

- **Strona GitHub Pages** dostępna pod `https://open-ksef.pl`
- **Framework:** Docusaurus 3.x (React, TypeScript, Markdown)
- **Język:** polski (polski odbiorca)
- **Cel:** dokumentacja instalacji/konfiguracji + landing page marketingowy

### Architektura organizacji GitHub

```
GitHub Org: open-ksef
├── open-ksef            # kod aplikacji (.NET API, Worker, React portal)
├── open-ksef-mobile     # aplikacja mobilna (.NET MAUI Android/iOS)
└── open-ksef-doc        # TO REPO -- strona docs/marketing (Docusaurus → GitHub Pages)
```

Kod aplikacji żyje w `open-ksef` (backend + portal) i `open-ksef-mobile` (aplikacja mobilna). To repo NIE zawiera kodu aplikacji -- tylko dokumentację, screenshoty i stronę marketingową.

### Design

Strona wizualnie nawiązuje do portalu OpenKSeF:
- Primary color: `#6366f1` (indigo)
- Dark sidebar/footer: `#1e1b4b`
- Font: Inter + system fallback
- Gradient hero: `linear-gradient(135deg, #1e1b4b, #312e81, #4338ca)`
- Karty z shadow i hover lift
- Logo: ⚡ + "OpenKSeF"

Design tokens zdefiniowane w `src/css/custom.css` (nadpisują zmienne Docusaurus `--ifm-*`).

### Struktura dokumentacji

```
docs/
  intro.md                    # Wprowadzenie -- czym jest OpenKSeF
  instalacja/
    wymagania.md              # Wymagania systemowe
    szybki-start.md           # Docker compose up w 5 minut
    konfiguracja.md           # Zmienne środowiskowe, KSeF test/prod
  admin-setup.md              # Kreator konfiguracji (wizard krok po kroku)
  logowanie.md                # Strona logowania, Google OAuth, rejestracja
  powiadomienia-push.md       # Push notifications (SignalR, relay, Firebase, email)
  aplikacja-mobilna.md        # MAUI Android/iOS, ngrok, build
  o-projekcie.md              # AI disclaimer, self-hosting, odpowiedzialność
  licencja.md                 # MIT + formalny disclaimer bezpieczeństwa
```

### Landing page

`src/pages/index.tsx` -- strona główna z sekcjami:
- Hero (gradient bg, CTA)
- Dlaczego OpenKSeF (6 kart feature'ów)
- Jak zacząć (3 kroki)
- Technologie (ikony stacku)

Komponenty w `src/components/`: `HomepageFeatures`, `HowToStart`, `TechStack`.

### Screenshoty

`static/img/screenshots/portal/` -- screeny portalu webowego (login, admin-setup)
`static/img/screenshots/mobile/` -- screeny aplikacji mobilnej (placeholder)

Screeny robione z działającego środowiska dev za pomocą Playwright/Cursor Browser.

### CI/CD

`.github/workflows/deploy.yml` -- automatyczny deploy na GitHub Pages przy push do `main`.

### Komendy

```bash
npm ci          # instalacja zależności
npm start       # dev server (localhost:3000)
npm run build   # build produkcyjny (folder build/)
npm run serve   # podgląd buildu lokalnie
```

### Ważne zasady

1. Cała treść po **polsku** (polski odbiorca)
2. Dokumentacja musi być **spójna** z aktualnym stanem kodu w `open-ksef` i `open-ksef-mobile`
3. Design musi **nawiązywać** do portalu (paleta indigo, Inter font, karty z shadow)
4. Sekcja "O projekcie" zawiera **disclaimer**: projekt stworzony z pomocą AI, self-hosting = odpowiedzialność użytkownika
5. Licencja **MIT** -- liberalna, bez opłat
