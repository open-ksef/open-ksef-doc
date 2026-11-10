---
sidebar_position: 3
title: Konfiguracja
---

# Konfiguracja

OpenKSeF konfiguruje się na trzy sposoby (w kolejności priorytetu):

1. **Kreator konfiguracji** (zalecany) -- webowy wizard pod `/admin-setup`, zapisuje ustawienia w bazie danych (`SystemConfigs`)
2. **Plik `.env`** -- zmienne środowiskowe obok `docker-compose.yml`
3. **Wartości domyślne** -- wbudowane w `docker-compose.yml`

**Priorytet:** Kreator (baza danych) > plik `.env` > wartości domyślne

Plik `.env` jest **wymagany**: musi zawierać dane logowania do PostgreSQL i Keycloak (patrz [Zmienne infrastruktury](#zmienne-infrastruktury)) oraz `ENCRYPTION_KEY`. Resztę ustawisz w [kreatorze konfiguracji](../admin-setup). W `.env` możesz też zmienić porty lub publiczny URL przed pierwszym uruchomieniem.

## Architektura kontenerów

Obrazy aplikacji są publikowane na GitHub Container Registry (`ghcr.io/open-ksef/*`) i nie wymagają autentykacji. Keycloak korzysta z oficjalnego obrazu (`quay.io/keycloak/keycloak:26.0`).

| Obraz | Opis |
|-------|------|
| `keycloak/keycloak:26.0` | Keycloak 26 (oficjalny obraz). Realm `openksef` i klienty OAuth tworzone przez [kreator konfiguracji](../admin-setup) |
| `openksef-gateway` | Nginx z wbudowaną konfiguracją reverse proxy (portal `/`, API `/api/*`, Keycloak `/auth/*`) |
| `openksef-api` | Backend .NET 10 |
| `openksef-worker` | Worker .NET 10 (synchronizacja faktur w tle) |
| `openksef-portal-web` | Portal React (SPA) |

Gateway ma konfigurację wbudowaną w obraz. Nie trzeba montować plików konfiguracyjnych ani wolumenów (poza wolumenem danych PostgreSQL).

## Wymagane zmienne (API / Worker)

| Zmienna | Opis | Domyślnie |
|---------|------|-----------|
| `ConnectionStrings__Db` | Connection string PostgreSQL | `Host=postgres;Database=openksef;...` |
| `Auth__Authority` | URL Keycloak realm | `http://keycloak:8080/auth/realms/openksef` |
| `ENCRYPTION_KEY` | Klucz AES-256 do szyfrowania tokenów KSeF, 44 znaki base64 (`openssl rand -base64 32`). Ustaw go przed pierwszym uruchomieniem i przechowuj poza bazą. Kreator go nie generuje. `docker-compose.yml` bez tej zmiennej odmawia działania. Istniejąca instalacja, nieprawidłowa wartość, rotacja: [Klucz szyfrowania](../admin-setup#klucz-szyfrowania) | *(wymagane)* |
| `ENCRYPTION_KEY_FILE` | Ścieżka do pliku z kluczem, czytana gdy `ENCRYPTION_KEY` jest pusty. Wymaga własnego pliku compose: dostarczony `docker-compose.yml` przekazuje tylko `ENCRYPTION_KEY` i odmawia działania bez niego, a sam plik override tego nie zmienia | *(brak)* |
| `ASPNETCORE_ENVIRONMENT` | Środowisko API. `Production` wyłącza Swaggera | `Production` |
| `Auth__RequireHttpsMetadata` | Czy API wymaga HTTPS przy pobieraniu metadanych OIDC z `Auth__Authority`. Compose ustawia `"false"`, bo API łączy się z Keycloak w sieci Docker po HTTP (`http://keycloak:8080`). Domyślnie (bez zmiennej) `true` -- wtedy API odrzuca adres `http://` | `"false"` |
| `KSeF__BaseUrl` | Środowisko KSeF, w `.env` jako `KSEF_BASE_URL`: `test`, `demo` albo `production`, zobacz [Środowiska KSeF](#środowiska-ksef) | środowisko test |

## Wymagane zmienne (Portal Web)

| Zmienna | Opis | Domyślnie |
|---------|------|-----------|
| `VITE_API_BASE_URL` | URL API dla portalu | `/api` |
| `VITE_AUTH_AUTHORITY` | URL Keycloak dla OIDC | `/auth/realms/openksef` |
| `VITE_AUTH_CLIENT_ID` | Client ID w Keycloak | `openksef-portal-web` |

## Zmienne infrastruktury

| Zmienna | Opis | Domyślnie |
|---------|------|-----------|
| `POSTGRES_USER` | Użytkownik PostgreSQL | *(wymagane)* |
| `POSTGRES_PASSWORD` | Hasło PostgreSQL | *(wymagane)* |
| `KEYCLOAK_ADMIN` | Login admina Keycloak | *(wymagane)* |
| `KEYCLOAK_ADMIN_PASSWORD` | Hasło admina Keycloak | *(wymagane)* |
| `KC_DB_USERNAME` | Użytkownik bazy Keycloak (jeśli inny niż Postgres) | wartość `POSTGRES_USER` |
| `KC_DB_PASSWORD` | Hasło bazy Keycloak (jeśli inne niż Postgres) | wartość `POSTGRES_PASSWORD` |

:::warning[Dane logowania]
`docker-compose.yml` nie ma wartości domyślnych dla tych czterech zmiennych -- bez nich `docker compose up` kończy się błędem. Użyj silnych haseł. PostgreSQL i Keycloak czytają je tylko przy pierwszym starcie; jak zmienić hasła w istniejącej instalacji, opisuje [Szybki start](szybki-start).
:::

## Opcjonalne zmienne

| Zmienna | Opis |
|---------|------|
| `APP_EXTERNAL_BASE_URL` | Publiczny URL instancji (np. `http://192.168.1.50:8080`) |
| `API_CLIENT_SECRET` | Secret klienta `openksef-api` w Keycloak *(generowany przez kreator)* |
| `FIREBASE_CREDENTIALS_JSON` | Firebase service account JSON (dla direct push) |

## E-mail o nowych fakturach

Najwyżej 10 e-maili na firmę w jednej synchronizacji, o pozostałych jedno podsumowanie. E-maile o nowych fakturach zakupowych trafiają na adres do powiadomień ustawiony w danych firmy. Wysyła go Worker (automatyczna synchronizacja) i API (ręczna synchronizacja). Ustaw zmienne w `.env`: `docker-compose.yml` od v0.0.12 przekazuje je usługom `api` i `worker`. SMTP z kreatora dotyczy tylko Keycloak i tu nie działa. Więcej: [Powiadomienia push](../powiadomienia-push).

| Zmienna | Opis | Domyślnie |
|---------|------|-----------|
| `EMAIL_ENABLED` | `true` włącza e-mail | `false` |
| `EMAIL_SMTP_HOST` | Serwer SMTP | *(puste)* |
| `EMAIL_SMTP_PORT` | `587`: STARTTLS, `465`: SSL od połączenia | `587` |
| `EMAIL_USE_SSL` | `false`: zwykły SMTP bez TLS | `true` |
| `EMAIL_USERNAME`, `EMAIL_PASSWORD` | Login SMTP. Pusty login: bez logowania | *(puste)* |
| `EMAIL_FROM_ADDRESS` | Adres nadawcy | `noreply@openksef.local` |
| `EMAIL_FROM_NAME` | Nazwa nadawcy | `OpenKSeF` |

## Środowiska KSeF

| Środowisko | `KSEF_BASE_URL` | Adres API KSeF | Zastosowanie |
|------------|-----------------|----------------|-------------|
| **Test** | `test` | `https://api-test.ksef.mf.gov.pl/v2` | Rozwój i testowanie |
| **Demo** | `demo` | `https://api-demo.ksef.mf.gov.pl/v2` | Testy na środowisku przedprodukcyjnym |
| **Produkcja** | `production` | `https://api.ksef.mf.gov.pl/v2` | Prawdziwe faktury |

Puste `KSEF_BASE_URL` oznacza środowisko test. Większość pełnych adresów z wcześniejszych wersji nadal działa. Każda inna wartość, której program nie rozpozna, zatrzymuje API i Workera przy starcie z błędem `Unknown KSeF environment`, więc nic nie trafia do KSeF na zgadniętym środowisku. Dotyczy to także wartości `ksef_environment` zapisanej przez kreator. Które adresy działają i co zrobić: [Środowisko KSeF: aktualizacja](../admin-setup#środowisko-ksef-aktualizacja).

Po kreatorze zmiana `KSEF_BASE_URL` nic nie daje: środowisko zmienisz w Ustawienia > Administracja instancji.

:::warning[Uwaga]
Środowisko produkcyjne KSeF operuje na rzeczywistych danych podatkowych. Upewnij się, że instancja jest odpowiednio zabezpieczona przed przełączeniem na produkcję.
:::

## Porty i dostęp z zewnątrz

`docker-compose.yml` publikuje na hoście tylko gateway.

| Zmienna | Opis | Domyślnie |
|---------|------|-----------|
| `APP_HOST_PORT` | Port gateway na hoście | `8080` |
| `KEYCLOAK_ADMIN_ALLOW` | Adresy, z których gateway otwiera konsolę Keycloak `/auth/admin`, po przecinku, IP lub CIDR (np. `192.168.88.0/24,10.8.0.5`). Puste: 403 dla wszystkich. Za reverse proxy przeczytaj [zastrzeżenie](../admin-setup#aktualizacja-porty-i-konsola-keycloak) | *(puste)* |
| `FORWARD_LIMIT` | Liczba proxy, które dopisują się do `X-Forwarded-For`, łącznie z gateway: sam gateway `1`, Nginx Proxy Manager przed nim `2`, Cloudflare i Nginx Proxy Manager `3`. Zła wartość psuje limity zapytań, zobacz [Adres klienta za proxy](../admin-setup#adres-klienta-za-proxy) | `1` |
| `TRUSTED_PROXY_NETWORKS` | Sieci (CIDR po przecinku), od których API przyjmuje `X-Forwarded-For`. Puste: loopback i sieci prywatne. Nigdy `0.0.0.0/0` | *(puste)* |
| `OPENKSEF_VERSION` | Wersja obrazów `api`, `worker`, `portal-web` i `gateway`, np. `v1.2.3` | wersja wydania, z którego pochodzi `docker-compose.yml` |

`API_HOST_PORT`, `KEYCLOAK_HOST_PORT`, `PORTAL_WEB_HOST_PORT` i `POSTGRES_HOST_PORT` nie są już czytane. Dostęp do PostgreSQL i konsoli Keycloak z hosta opisuje [Aktualizacja: porty i konsola Keycloak](../admin-setup#aktualizacja-porty-i-konsola-keycloak).
