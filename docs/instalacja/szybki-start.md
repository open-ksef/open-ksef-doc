---
sidebar_position: 2
title: Szybki start
---

# Szybki start

Uruchomienie OpenKSeF zajmuje mniej niż 5 minut. Potrzebujesz tylko Dockera i przeglądarki.

## Krok 1: Utwórz `docker-compose.yml`

Utwórz nowy katalog i zapisz w nim plik `docker-compose.yml` z poniższą zawartością:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: openksef-postgres
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-openksef}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-openksef_dev_password}
    entrypoint:
      - sh
      - -c
      - |
        echo "CREATE DATABASE keycloak;" > /docker-entrypoint-initdb.d/01-keycloak.sql
        exec docker-entrypoint.sh postgres
    ports:
      - "${POSTGRES_HOST_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-openksef}"]
      interval: 5s
      timeout: 5s
      retries: 20

  keycloak:
    image: quay.io/keycloak/keycloak:26.0
    container_name: openksef-keycloak
    command: start-dev --features=token-exchange,admin-fine-grained-authz
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgres:5432/keycloak
      KC_DB_USERNAME: ${KC_DB_USERNAME:-${POSTGRES_USER:-openksef}}
      KC_DB_PASSWORD: ${KC_DB_PASSWORD:-${POSTGRES_PASSWORD:-openksef_dev_password}}

      KEYCLOAK_ADMIN: ${KEYCLOAK_ADMIN:-admin}
      KEYCLOAK_ADMIN_PASSWORD: ${KEYCLOAK_ADMIN_PASSWORD:-admin}

      KC_HTTP_ENABLED: "true"
      KC_HTTP_RELATIVE_PATH: /auth
      KC_PROXY_HEADERS: xforwarded
      KC_HOSTNAME_STRICT: "false"
      KC_HOSTNAME_STRICT_HTTPS: "false"
    ports:
      - "${KEYCLOAK_HOST_PORT:-8082}:8080"

  api:
    image: ghcr.io/open-ksef/openksef-api:latest
    container_name: openksef-api
    depends_on:
      postgres:
        condition: service_healthy
      keycloak:
        condition: service_started
    environment:
      ASPNETCORE_ENVIRONMENT: Development
      ASPNETCORE_URLS: http://0.0.0.0:8081
      ConnectionStrings__Db: Host=postgres;Port=5432;Database=openksef;Username=${POSTGRES_USER:-openksef};Password=${POSTGRES_PASSWORD:-openksef_dev_password}
      Auth__Authority: http://keycloak:8080/auth/realms/openksef
      Auth__PublicAuthority: ${APP_EXTERNAL_BASE_URL:-http://localhost:8080}/auth/realms/openksef
      ENCRYPTION_KEY: ${ENCRYPTION_KEY:-}
      Auth__ServiceAccount__ClientId: openksef-api
      Auth__ServiceAccount__ClientSecret: ${API_CLIENT_SECRET:-}
      KSeF__BaseUrl: ${KSEF_BASE_URL:-https://ksef-test.mf.gov.pl/api}
      Firebase__CredentialsJson: ${FIREBASE_CREDENTIALS_JSON:-}
    ports:
      - "${API_HOST_PORT:-8081}:8081"

  worker:
    image: ghcr.io/open-ksef/openksef-worker:latest
    container_name: openksef-worker
    depends_on:
      postgres:
        condition: service_healthy
      keycloak:
        condition: service_started
    environment:
      ConnectionStrings__Db: Host=postgres;Port=5432;Database=openksef;Username=${POSTGRES_USER:-openksef};Password=${POSTGRES_PASSWORD:-openksef_dev_password}
      Auth__Authority: http://keycloak:8080/auth/realms/openksef
      ENCRYPTION_KEY: ${ENCRYPTION_KEY:-}
      KSeF__BaseUrl: ${KSEF_BASE_URL:-https://ksef-test.mf.gov.pl/api}

  portal-web:
    image: ghcr.io/open-ksef/openksef-portal-web:latest
    container_name: openksef-portal-web
    depends_on:
      keycloak:
        condition: service_started
    environment:
      VITE_API_BASE_URL: /api
      VITE_AUTH_AUTHORITY: /auth/realms/openksef
      VITE_AUTH_CLIENT_ID: openksef-portal-web
    ports:
      - "${PORTAL_WEB_HOST_PORT:-8083}:80"

  gateway:
    image: ghcr.io/open-ksef/openksef-gateway:latest
    container_name: openksef-gateway
    depends_on:
      keycloak:
        condition: service_started
      portal-web:
        condition: service_started
    ports:
      - "${APP_HOST_PORT:-8080}:8080"

volumes:
  postgres_data:
```

:::tip Kopiowanie
Kliknij ikonę kopiowania w prawym górnym rogu bloku kodu, żeby skopiować całą zawartość. Wklej ją do nowego pliku `docker-compose.yml`.
:::

## Krok 2: Uruchom

```bash
docker compose up -d
```

Docker pobierze obrazy z GitHub Container Registry i uruchomi 6 kontenerów:

| Kontener | Opis |
|----------|------|
| **postgres** | Baza danych PostgreSQL 16 |
| **keycloak** | Uwierzytelnianie OIDC (realm tworzony przez kreator konfiguracji) |
| **api** | Backend .NET 8 |
| **worker** | Synchronizacja faktur w tle |
| **portal-web** | Interfejs React |
| **gateway** | Nginx reverse proxy (konfiguracja wbudowana w obraz) |

:::info Pierwsze uruchomienie
Pierwsze uruchomienie może potrwać kilka minut -- Docker pobiera ~2 GB obrazów. Kolejne starty trwają sekundy.
:::

## Krok 3: Skonfiguruj

Otwórz **http://localhost:8080** w przeglądarce.

System wykryje, że nie jest jeszcze skonfigurowany i automatycznie przekieruje Cię do **kreatora konfiguracji** (`/admin-setup`). Kreator przeprowadzi Cię przez:

1. Logowanie danymi admina Keycloak (`admin` / `admin`)
2. Ustawienie podstawowych danych (URL, środowisko KSeF, konto admina)
3. Politykę logowania i opcjonalnie SMTP
4. Automatyczne wygenerowanie klucza szyfrowania i secretu API
5. Opcjonalnie: Google OAuth, powiadomienia push
6. Kliknij "Zastosuj" -- gotowe!

Szczegółowy opis każdego kroku znajdziesz w [Kreatorze konfiguracji](../admin-setup).

## Adresy usług

| Usługa | URL |
|--------|-----|
| Portal (przez gateway) | http://localhost:8080 |
| API Swagger | http://localhost:8081/swagger |
| Keycloak (konsola admina) | http://localhost:8082/auth/admin |
| Portal (bezpośrednio) | http://localhost:8083 |

## Zatrzymywanie

```bash
docker compose down
```

Dane w PostgreSQL są zachowywane w wolumenie Docker. Aby usunąć również dane:

```bash
docker compose down -v
```

## Konfiguracja zaawansowana

Powyższy quick start działa bez żadnego pliku `.env` -- wszystkie zmienne mają sensowne wartości domyślne, a kreator konfiguracji automatycznie generuje brakujące sekrety.

Jeśli chcesz zmienić domyślne ustawienia **przed** uruchomieniem (np. hasła, porty, URL), utwórz plik `.env` w tym samym katalogu co `docker-compose.yml`:

```bash
# Postgres
POSTGRES_USER=openksef
POSTGRES_PASSWORD=change_me

# Keycloak admin
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=change_me

# Publiczny URL (ustaw jeśli dostęp spoza localhost)
# APP_EXTERNAL_BASE_URL=http://192.168.1.50:8080

# Porty (opcjonalne, domyślne wartości poniżej)
# APP_HOST_PORT=8080
# API_HOST_PORT=8081
# KEYCLOAK_HOST_PORT=8082
# PORTAL_WEB_HOST_PORT=8083
# POSTGRES_HOST_PORT=5432

# Środowisko KSeF (domyślnie test)
# KSEF_BASE_URL=https://ksef-test.mf.gov.pl/api

# Firebase push notifications (opcjonalne)
# FIREBASE_CREDENTIALS_JSON={"type":"service_account",...}
```

:::info Priorytet konfiguracji
Kreator konfiguracji (baza danych) > plik `.env` > wartości domyślne w `docker-compose.yml`

Oznacza to, że po przejściu kreatora jego ustawienia mają najwyższy priorytet. Plik `.env` nadpisuje tylko te wartości, których kreator nie ustawił.
:::

Pełny opis wszystkich zmiennych znajdziesz w [Konfiguracja](konfiguracja).

## Następne kroki

- [Konfiguracja](konfiguracja) -- pełna lista zmiennych środowiskowych
- [Kreator konfiguracji](../admin-setup) -- szczegóły każdego kroku wizarda
- [Powiadomienia push](../powiadomienia-push) -- jak skonfigurować powiadomienia
