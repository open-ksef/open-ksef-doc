---
sidebar_position: 4
title: Kreator konfiguracji
---

# Kreator konfiguracji (Admin Setup)

Kreator konfiguracji automatyzuje pierwszą konfigurację systemu. Zamiast ręcznie edytować pliki `.env`, kopiować sekrety z Keycloak i restartować kontenery -- wystarczy uruchomić `docker compose up` i przejść przez webowy wizard pod adresem `http://localhost:8080/admin-setup`.

:::tip Nie masz jeszcze uruchomionego stacku?
Przejdź do [Szybki start](instalacja/szybki-start) -- uruchomienie zajmuje mniej niż 5 minut.
:::

## Wymagania wstępne

- Stack Docker uruchomiony (`docker compose up -d`)
- Port 8080 dostępny (gateway)

## Kroki wizarda

### Krok 1: Uwierzytelnienie administratora Keycloak

![Krok 1 - logowanie Keycloak](/img/screenshots/portal/admin-setup-step1.png)

Wprowadź dane logowania admina Keycloak (domyślnie: `admin` / `admin` z `docker-compose.yml`). Wizard uwierzytelnia się w realm `master` i zapisuje dane logowania w tymczasowym tokenie sesji (ważnym 10 minut), który jest używany do konfiguracji Keycloak w kolejnych krokach.

### Krok 2: Konfiguracja podstawowa

![Krok 2 - konfiguracja podstawowa](/img/screenshots/portal/admin-setup-step2.png)

| Pole | Opis | Domyślnie |
|------|------|-----------|
| Zewnętrzny URL | Publiczny adres systemu | Bieżący adres przeglądarki |
| Środowisko KSeF | Test lub Produkcja | Test (`ksef-test.mf.gov.pl`) |
| Email admina | Email pierwszego użytkownika | *(wymagany)* |
| Hasło admina | Hasło pierwszego użytkownika | *(wymagane, min. 8 znaków)* |
| Imię / Nazwisko | Opcjonalne dane użytkownika | Admin |

### Krok 3: Uwierzytelnianie i email

![Krok 3 - autoryzacja i email](/img/screenshots/portal/admin-setup-step3.png)

**Polityka logowania:**
- Rejestracja użytkowników (domyślnie: WŁĄCZONA)
- Weryfikacja email (domyślnie: WYŁĄCZONA, wymaga SMTP)
- Logowanie emailem (domyślnie: WŁĄCZONE)
- Reset hasła (domyślnie: WŁĄCZONY, wymaga SMTP)

**Polityka haseł:**
- Podstawowa: minimum 8 znaków
- Silna: 12 znaków, znaki specjalne, wielkie litery, cyfry

**SMTP (opcjonalnie):**

Jeśli włączysz weryfikację email lub reset hasła, potrzebujesz SMTP:

| Dostawca | Host | Port | TLS |
|----------|------|------|-----|
| Gmail | smtp.gmail.com | 587 | StartTLS |
| Outlook/O365 | smtp.office365.com | 587 | StartTLS |
| Własny | (ręcznie) | (ręcznie) | (ręcznie) |

:::tip Gmail
Gmail wymaga **Hasła aplikacji** (nie zwykłego hasła). Wygeneruj je w ustawieniach konta Google: Bezpieczeństwo > Weryfikacja dwuetapowa > Hasła aplikacji.
:::

### Krok 4: Bezpieczeństwo

![Krok 4 - bezpieczeństwo](/img/screenshots/portal/admin-setup-step4.png)

Wizard automatycznie generuje:
- **Klucz szyfrowania AES-256** do szyfrowania tokenów KSeF w bazie danych
- **Secret klienta API** pobrany z klienta Keycloak `openksef-api`

Dane są zapisywane bezpiecznie w bazie i udostępniane między serwisami automatycznie.

### Krok 5: Integracje (opcjonalne)

![Krok 5 - integracje](/img/screenshots/portal/admin-setup-step5.png)

**Google OAuth:** Jeśli chcesz logowanie przez Google, utwórz Google Cloud OAuth 2.0 Client ID i wprowadź dane. URI przekierowania jest uzupełniony automatycznie.

**Powiadomienia push:** Trzy tryby:

- **Relay OpenKSeF (domyślny, zalecany)** -- Używa serwera relay do dostarczania push via FCM/APNs. Nie wymaga konfiguracji Firebase. URL relay (`https://push.open-ksef.pl`) jest wypełniony automatycznie.
- **Własny projekt Firebase (zaawansowane)** -- Wklej JSON service account Firebase. Szczegóły w [Powiadomienia push](powiadomienia-push).
- **Tylko lokalne (SignalR)** -- Brak zdalnych powiadomień. Użytkownicy otrzymują powiadomienia tylko gdy aplikacja mobilna jest aktywnie połączona z serwerem.

SignalR działa zawsze, niezależnie od wybranego trybu. Tryb wpływa tylko na zdalne (background) dostarczanie.

### Krok 6: Podsumowanie i zastosowanie

![Krok 6 - podsumowanie](/img/screenshots/portal/admin-setup-step6.png)

Przejrzyj wszystkie ustawienia i kliknij "Zastosuj". Wizard:

1. Tworzy realm `openksef` w Keycloak (jeśli nie istnieje)
2. Tworzy klienty OAuth: `openksef-api`, `openksef-mobile`, `openksef-portal-web`
3. Generuje klucz szyfrowania
4. Pobiera secret klienta API z Keycloak
5. Włącza token-exchange dla service account
6. Aktualizuje URI przekierowań z zewnętrznym URL
7. Konfiguruje realm Keycloak (polityka logowania, haseł, SMTP)
8. Tworzy konto admina w Keycloak
9. Konfiguruje Google IdP (jeśli podano)
10. Zapisuje całą konfigurację w bazie danych
11. Przekierowuje na stronę logowania

## Architektura

### Przechowywanie konfiguracji

Konfiguracja jest przechowywana w tabeli `system_config` (klucz-wartość). Serwis `ISystemConfigService` czyta z tej tabeli z cache'em w pamięci, z fallbackiem na zmienne środowiskowe.

**Priorytet:** Kreator (baza danych) > plik `.env` > wartości domyślne w `docker-compose.yml`

Oznacza to, że po przejściu kreatora jego ustawienia mają najwyższy priorytet. Plik `.env` jest opcjonalny i nadpisuje tylko te wartości, których kreator nie ustawił.

### Endpointy API

| Endpoint | Autoryzacja | Cel |
|----------|-------------|-----|
| `GET /api/system/setup-status` | Anonimowy | Zwraca `{isInitialized: bool}` |
| `POST /api/system/setup/authenticate` | Anonimowy | Waliduje dane admina KC, zwraca token |
| `POST /api/system/setup/apply` | Token setup (X-Setup-Token) | Wykonuje pełną konfigurację |

Wszystkie endpointy setup są blokowane po inicjalizacji (zwracają 403).

### Routing portalu

Portal sprawdza `/api/system/setup-status` przy każdym ładowaniu chronionej strony. Jeśli `isInitialized` jest `false`, wszystkie ścieżki przekierowują na `/admin-setup`.

## Rozwiązywanie problemów

| Problem | Rozwiązanie |
|---------|-------------|
| Wizard się nie pojawia | Sprawdź, czy tabela `system_config` jest pusta. Usuń wiersze i zrestartuj API. |
| Logowanie Keycloak nie działa | Sprawdź, czy Keycloak działa (`docker compose logs keycloak`). Domyślne dane: admin/admin. |
| Apply zwraca 500 | Sprawdź logi API (`docker compose logs api`). Częsta przyczyna: Keycloak nie jest jeszcze gotowy. |
| Test email SMTP nie działa | Zweryfikuj dane SMTP. Gmail wymaga Hasła aplikacji. |
| Pętla przekierowań po setup | Wyczyść cache/cookies przeglądarki. Portal cachuje status setup na 60 sekund. |
| Chcę uruchomić wizard ponownie | Usuń wszystkie wiersze z tabeli `system_config` i zrestartuj kontener API. |
