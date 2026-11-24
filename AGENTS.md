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
    wyprobuj-na-ksef-test.md  # Próba na KSeF TEST: losowe NIP-y A i B, token testowy, wystawienie, odbiór
    konfiguracja.md           # Zmienne środowiskowe, KSeF test/prod
  admin-setup.md              # Kreator konfiguracji (wizard krok po kroku)
  logowanie.md                # Strona logowania, zgubiony telefon, nie pamiętasz hasła, Google OAuth, rejestracja
  weryfikacja-dwuetapowa.md   # 2FA TOTP: włączenie, kody zapasowe, Bezpieczeństwo, reset admina, konsola
  token-ksef.md               # Jak uzyskać token KSeF i gdzie go wkleić
  certyfikat-ksef.md          # Certyfikat KSeF (Uwierzytelnianie) zamiast tokenu, ważność, odnowienie
  wspolne-firmy.md            # Wspólne firmy: role, zaproszenia, dołączanie, opuszczanie, kto oznaczył opłaconą, powiadomienia per firma
  faktury.md                  # Lista, szczegóły, XML/PDF, pozycje, status płatności, przelew/QR, resynchronizacja
  wystawianie-faktur.md       # Dane do faktur, numeracja (serie FV, KOR, ZAL), wystawianie, Pobierz z NIP (limit MF), ostatni nabywcy, podpowiedzi pozycji, szablony, Kopiuj jako nową, statusy, XML/UPO/PDF, odrzucona faktura, ograniczenia
  korekty.md                  # Korekty: kiedy, jak, przyczyna, typ korekty, do zera, błędny NIP (Podręcznik 1.6.4), dane nabywcy, waluta, numeracja KOR
  zaliczki-i-rozliczenia.md   # Zamówienie, ZAL, kolejna i ostatnia zaliczka, ROZ, ROZ na 0,00, KOR_ZAL, KOR_ROZ, numeracja ZAL
  powiadomienia-push.md       # Push notifications (SignalR, relay, Firebase, email)
  aplikacja-mobilna.md        # Logowanie, parowanie kodem, zgoda na powiadomienia, motyw, Zapłać, build
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

`static/img/screenshots/portal/` -- screeny portalu webowego do dokumentacji (strona logowania, weryfikacja dwuetapowa: włączenie, kody zapasowe, kod; Ustawienia > Bezpieczeństwo, reset weryfikacji, dashboard, admin-setup kroki 1-6, administrator danych: kreator, ustawienia, baner, strona Prywatność, lista faktur, szczegóły, pozycje, opłacona, QR, bez QR; wystawianie: dane do faktur, szkic B2B i B2C, Wysyłanie, Przyjęta, PDF z KOD I, Odrzucona, okres numeru, 440, lista; parowanie: Zalogować telefon?, Telefon zalogowany; kod zapasowy), tylko jasny motyw
`static/img/screenshots/home/` -- screeny na stronę główną (start, start na telefonie, lista, płatność), jasny i ciemny motyw

`static/img/screenshots/mobile/` -- screeny aplikacji mobilnej (ekran logowania 1.0.9; Zapłać: szczegóły, kod QR, bez kodu QR 1.0.12). Portal: `mobile-setup.png` (strona Telefon, karta Zaloguj telefon kodem)

Screeny zawierają wyłącznie dane fikcyjne (np. NIP 1111111111, nazwy "Przykład"). Żadnych prawdziwych NIP-ów, numerów KSeF, nazw firm ani adresów serwerów.

Screeny robione Playwrightem z osobnego stacku z wydanej wersji (`docker compose -p <nazwa>`) z danymi fikcyjnymi. Nigdy z bazy dev ani produkcji: są w nich prawdziwe dane. Stack bez Workera, usuń go po zrzutach. **Zastosuj** w kreatorze w trybie Relay rejestruje instancję w produkcyjnym relay: po zrzucie kroku 6 wróć do kroku 5 i wybierz **Tylko lokalne (SignalR)**. Od v0.0.27 gateway bierze port z nagłówka Host, więc stack może działać na innym porcie niż 8080. Zrzuty z wysyłki do KSeF wymagają Workera na KSeF TEST z fikcyjnym NIP; NIP-y i numery KSeF maskuj na 1111111111, kod QR pikselizuj.

### CI/CD

`.github/workflows/deploy.yml` -- automatyczny deploy na GitHub Pages przy push do `main`.
`.github/workflows/build.yml` -- `npm run build` na każdym PR do `main`.

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
