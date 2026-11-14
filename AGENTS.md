# AGENTS.md

Instrukcje dla agentów AI pracujących z tym repozytorium.

## Koncept

To repozytorium (`open-ksef-doc`) zawiera stronę dokumentacji i marketingu dla projektu **OpenKSeF** -- systemu z publicznie dostępnym kodem źródłowym do synchronizacji i przeglądania faktur z polskiego KSeF.

### Czym jest to repo

- **Strona GitHub Pages** dostępna pod `https://open-ksef.pl`
- **Framework:** Docusaurus 3.x (React, TypeScript, Markdown)
- **Język:** polski (polski odbiorca)
- **Cel:** dokumentacja instalacji/konfiguracji + landing page marketingowy

### Architektura organizacji GitHub

```
GitHub Org: open-ksef
├── open-ksef            # kod aplikacji (.NET API, Worker, React portal)
├── open-ksef-mobile     # aplikacja mobilna (.NET MAUI Android)
└── open-ksef-doc        # TO REPO -- strona docs/marketing (Docusaurus → GitHub Pages)
```

Kod aplikacji żyje w `open-ksef` (backend + portal) i `open-ksef-mobile` (aplikacja mobilna). To repo NIE zawiera kodu aplikacji -- tylko dokumentację, screenshoty i stronę marketingową.

### Design

Strona wizualnie nawiązuje do portalu OpenKSeF:
- Primary color: `#4f46e5` (light), `#a5b4fc` (dark)
- Footer: `#f3f4f8` (light), `#1c2033` (dark)
- Font: Inter + JetBrains Mono, lokalne pliki woff2 w `src/fonts`, licencje OFL w `static/fonts`
- Strona główna bez gradientów: pełna szerokość, sekcje na przemian tło i powierzchnia, karty z obramowaniem
- Logo: `static/img/mark.svg` (ciemny motyw: `mark-dark.svg`) + "OpenKSeF"

Design tokens zdefiniowane w `src/css/custom.css` (nadpisują zmienne Docusaurus `--ifm-*`, własne mają prefiks `--site-`). Bez `src/theme`, klas układu Infima (`container`, `row`), `!important` i stałej maksymalnej szerokości strony głównej.

### Struktura dokumentacji

```
docs/
  intro.md                    # Wprowadzenie -- czym jest OpenKSeF
  instalacja/
    wymagania.md              # Wymagania systemowe
    szybki-start.md           # docker-compose.yml, .env, docker compose up, kreator
    konfiguracja.md           # Zmienne środowiskowe, KSeF test/prod
  admin-setup.md              # Kreator konfiguracji (wizard krok po kroku)
  logowanie.md                # Strona logowania, Google OAuth, rejestracja
  token-ksef.md               # Jak uzyskać token KSeF i gdzie go wkleić
  certyfikat-ksef.md          # Certyfikat KSeF (Uwierzytelnianie) zamiast tokenu, ważność, odnowienie
  faktury.md                  # Lista, szczegóły, pozycje, status płatności, przelew/QR, resynchronizacja
  wystawianie-faktur.md       # Dane do faktur, numeracja, wystawianie, statusy, XML/UPO/PDF, odrzucona faktura, ograniczenia
  powiadomienia-push.md       # Push notifications (SignalR, relay, Firebase, email)
  aplikacja-mobilna.md        # MAUI Android, ngrok, build
  o-projekcie.md              # AI disclaimer, self-hosting, odpowiedzialność
  licencja.md                 # Elastic License 2.0 + formalny disclaimer bezpieczeństwa
  polityka-prywatnosci.md     # Polityka prywatności (wymóg Google Play)
```

### Landing page

`src/pages/index.tsx` i `index.module.css` -- strona główna, bez osobnych komponentów, z sekcjami:
- Hero (zrzut strony Start, CTA)
- Co robi OpenKSeF (4 karty)
- Tak wygląda portal (2 zrzuty)
- Co działa, a czego nie ma (`#zakres`, 2 listy)
- Jak zacząć (3 kroki)
- Gdzie są Twoje dane
- Kod, licencja i status

### Screenshoty

`static/img/screenshots/portal/` -- screeny portalu webowego do dokumentacji (strona logowania Keycloak, dashboard, admin-setup kroki 1-3, 5, 6, lista faktur, szczegóły, pozycje, opłacona, QR, strona Telefon, zatwierdzenie parowania, telefon zalogowany), tylko jasny motyw
`static/img/screenshots/home/` -- screeny na stronę główną (start, start na telefonie, lista, płatność), jasny i ciemny motyw

`static/img/screenshots/mobile/` -- screeny aplikacji mobilnej (ekran logowania, kod parowania), w docs przez `<img width="320">`

Screeny zawierają wyłącznie dane fikcyjne (np. NIP 1111111111, nazwy "Przykład"). Żadnych prawdziwych NIP-ów, numerów KSeF, nazw firm ani adresów serwerów.

Screeny robione Playwrightem z osobnego stacku z wydanej wersji (`docker compose -p <nazwa>`) z danymi fikcyjnymi. Nigdy z bazy dev ani produkcji: są w nich prawdziwe dane. Stack bez Workera, usuń go po zrzutach. **Zastosuj** w kreatorze w trybie Relay rejestruje instancję w produkcyjnym relay: po zrzucie kroku 6 wróć do kroku 5 i wybierz **Tylko lokalne (SignalR)**. Gateway podaje w OIDC port 8080, więc stack musi działać na tym porcie.

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

1. Cała treść po **polsku** (polski odbiorca), poza `README.md`
2. Dokumentacja musi być **spójna** z aktualnym stanem kodu w `open-ksef` i `open-ksef-mobile`
3. Design musi **nawiązywać** do portalu (paleta indigo, Inter font, karty)
4. Sekcja "O projekcie" zawiera **disclaimer**: projekt stworzony z pomocą AI, self-hosting = odpowiedzialność użytkownika
5. Licencja **Elastic License 2.0 (ELv2)** -- bez opłat za uruchomienie u siebie, zakaz SaaS bez zgody autora
6. Przy zmianach **modyfikuj istniejące pliki** -- nie twórz równoległych wersji. Jeśli strona/komponent już istnieje, refaktoryzuj go zamiast dodawać nowy obok.
7. Usuwaj nieużywany kod po refaktoryzacji.
