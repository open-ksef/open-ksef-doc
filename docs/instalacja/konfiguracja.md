---
sidebar_position: 3
title: Konfiguracja
---

# Konfiguracja

OpenKSeF konfiguruje się na trzy sposoby (w kolejności priorytetu):

1. **Kreator konfiguracji** (zalecany) -- webowy wizard pod `/admin-setup`, zapisuje ustawienia w bazie danych (`system_config`)
2. **Plik `.env`** -- zmienne środowiskowe obok `docker-compose.yml`
3. **Wartości domyślne** -- wbudowane w `docker-compose.yml`

**Priorytet:** Kreator (baza danych) > plik `.env` > wartości domyślne

Dla standardowej instalacji **nie musisz tworzyć pliku `.env`** -- wystarczy uruchomić stack i przejść przez [kreator konfiguracji](../admin-setup). Plik `.env` jest przydatny gdy chcesz zmienić porty, hasła do bazy lub publiczny URL przed pierwszym uruchomieniem.

## Architektura kontenerów

Wszystkie obrazy Docker są publikowane na GitHub Container Registry (`ghcr.io/open-ksef/*`) i nie wymagają autentykacji.

| Obraz | Opis |
|-------|------|
| `openksef-keycloak` | Keycloak 26 z wbudowanym realmem OpenKSeF (3 klienty OAuth: API, mobile, portal-web) |
| `openksef-gateway` | Nginx z wbudowaną konfiguracją reverse proxy (portal `/`, API `/api/*`, Keycloak `/auth/*`) |
| `openksef-api` | Backend .NET 8 |
| `openksef-worker` | Worker .NET 8 (synchronizacja faktur w tle) |
| `openksef-portal-web` | Portal React (SPA) |

Keycloak i gateway mają konfigurację **wbudowaną w obraz** -- nie trzeba montować plików konfiguracyjnych ani wolumenów (poza wolumenem danych PostgreSQL).

## Wymagane zmienne (API / Worker)

| Zmienna | Opis | Domyślnie |
|---------|------|-----------|
| `ConnectionStrings__Db` | Connection string PostgreSQL | `Host=postgres;Database=openksef;...` |
| `Auth__Authority` | URL Keycloak realm | `http://keycloak:8080/auth/realms/openksef` |
| `ENCRYPTION_KEY` | Klucz AES-256 do szyfrowania tokenów KSeF | *(generowany przez kreator)* |
| `KSeF__BaseUrl` | Adres API KSeF | `https://ksef-test.mf.gov.pl/api` |

## Wymagane zmienne (Portal Web)

| Zmienna | Opis | Domyślnie |
|---------|------|-----------|
| `VITE_API_BASE_URL` | URL API dla portalu | `/api` |
| `VITE_AUTH_AUTHORITY` | URL Keycloak dla OIDC | `/auth/realms/openksef` |
| `VITE_AUTH_CLIENT_ID` | Client ID w Keycloak | `openksef-portal-web` |

## Zmienne infrastruktury

| Zmienna | Opis | Domyślnie |
|---------|------|-----------|
| `POSTGRES_USER` | Użytkownik PostgreSQL | `openksef` |
| `POSTGRES_PASSWORD` | Hasło PostgreSQL | `openksef_dev_password` |
| `KEYCLOAK_ADMIN` | Login admina Keycloak | `admin` |
| `KEYCLOAK_ADMIN_PASSWORD` | Hasło admina Keycloak | `admin` |
| `KC_DB_USERNAME` | Użytkownik bazy Keycloak (jeśli inny niż Postgres) | wartość `POSTGRES_USER` |
| `KC_DB_PASSWORD` | Hasło bazy Keycloak (jeśli inne niż Postgres) | wartość `POSTGRES_PASSWORD` |

:::warning Produkcja
Dla wdrożeń produkcyjnych **zmień domyślne hasła** w pliku `.env`. Domyślne wartości (`openksef_dev_password`, `admin`) są przeznaczone wyłącznie do celów deweloperskich.
:::

## Opcjonalne zmienne

| Zmienna | Opis |
|---------|------|
| `APP_EXTERNAL_BASE_URL` | Publiczny URL instancji (np. `http://192.168.1.50:8080`) |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID (dla logowania przez Google) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| `API_CLIENT_SECRET` | Secret klienta `openksef-api` w Keycloak *(generowany przez kreator)* |
| `FIREBASE_CREDENTIALS_JSON` | Firebase service account JSON (dla direct push) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` | Konfiguracja poczty (email fallback) |

## Środowiska KSeF

| Środowisko | URL | Zastosowanie |
|------------|-----|-------------|
| **Test** | `https://ksef-test.mf.gov.pl/api` | Rozwój i testowanie |
| **Produkcja** | `https://ksef.mf.gov.pl/api` | Prawdziwe faktury |

:::warning Uwaga
Środowisko produkcyjne KSeF operuje na rzeczywistych danych podatkowych. Upewnij się, że instancja jest odpowiednio zabezpieczona przed przełączeniem na produkcję.
:::

## Tryb uwierzytelniania KSeF

Zmienna `KSeF__AuthMode` obsługuje trzy tryby:

| Tryb | Opis |
|------|------|
| `Token` | Uwierzytelnianie tokenem (domyślnie) |
| `Certificate` | Uwierzytelnianie certyfikatem |
| `Auto` | Token do 1 stycznia 2027, potem certyfikat |

## Porty

Porty można dostosować w `.env`:

```bash
APP_HOST_PORT=8080
API_HOST_PORT=8081
KEYCLOAK_HOST_PORT=8082
PORTAL_WEB_HOST_PORT=8083
POSTGRES_HOST_PORT=5432
```
