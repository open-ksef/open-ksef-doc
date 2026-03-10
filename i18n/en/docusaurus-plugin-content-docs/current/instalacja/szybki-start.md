---
sidebar_position: 2
title: Quick Start
---

# Quick Start

Getting OpenKSeF up and running takes less than 5 minutes. All you need is Docker and a browser.

## Step 1: Create `docker-compose.yml`

Create a new directory and save a `docker-compose.yml` file with the following content:

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

:::tip Copying
Click the copy icon in the top-right corner of the code block to copy the entire content. Paste it into a new `docker-compose.yml` file.
:::

## Step 2: Start

```bash
docker compose up -d
```

Docker will pull images from GitHub Container Registry and start 6 containers:

| Container | Description |
|-----------|-------------|
| **postgres** | PostgreSQL 16 database |
| **keycloak** | OIDC authentication (realm created by the setup wizard) |
| **api** | .NET 8 backend |
| **worker** | Background invoice synchronization |
| **portal-web** | React interface |
| **gateway** | Nginx reverse proxy (configuration built into the image) |

:::info First launch
The first launch may take a few minutes -- Docker pulls ~2 GB of images. Subsequent starts take seconds.
:::

## Step 3: Configure

Open **http://localhost:8080** in your browser.

The system will detect that it's not yet configured and automatically redirect you to the **setup wizard** (`/admin-setup`). The wizard will guide you through:

1. Logging in with Keycloak admin credentials (`admin` / `admin`)
2. Setting basic data (URL, KSeF environment, admin account)
3. Login policy and optionally SMTP
4. Automatic generation of encryption key and API secret
5. Optionally: Google OAuth, push notifications
6. Click "Apply" -- done!

Detailed description of each step can be found in the [Setup Wizard](../admin-setup).

## Service URLs

| Service | URL |
|---------|-----|
| Portal (via gateway) | http://localhost:8080 |
| API Swagger | http://localhost:8081/swagger |
| Keycloak (admin console) | http://localhost:8082/auth/admin |
| Portal (direct) | http://localhost:8083 |

## Stopping

```bash
docker compose down
```

PostgreSQL data is persisted in a Docker volume. To also remove data:

```bash
docker compose down -v
```

## Advanced configuration

The quick start above works without any `.env` file -- all variables have sensible defaults, and the setup wizard automatically generates missing secrets.

If you want to change the default settings **before** launching (e.g. passwords, ports, URL), create an `.env` file in the same directory as `docker-compose.yml`:

```bash
# Postgres
POSTGRES_USER=openksef
POSTGRES_PASSWORD=change_me

# Keycloak admin
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=change_me

# Public URL (set if accessing from outside localhost)
# APP_EXTERNAL_BASE_URL=http://192.168.1.50:8080

# Ports (optional, default values below)
# APP_HOST_PORT=8080
# API_HOST_PORT=8081
# KEYCLOAK_HOST_PORT=8082
# PORTAL_WEB_HOST_PORT=8083
# POSTGRES_HOST_PORT=5432

# KSeF environment (default: test)
# KSEF_BASE_URL=https://ksef-test.mf.gov.pl/api

# Firebase push notifications (optional)
# FIREBASE_CREDENTIALS_JSON={"type":"service_account",...}
```

:::info Configuration priority
Setup wizard (database) > `.env` file > defaults in `docker-compose.yml`

This means that after completing the wizard, its settings take the highest priority. The `.env` file only overrides values that the wizard didn't set.
:::

Full description of all variables can be found in [Configuration](konfiguracja).

## Next steps

- [Configuration](konfiguracja) -- full list of environment variables
- [Setup Wizard](../admin-setup) -- details of each wizard step
- [Push notifications](../powiadomienia-push) -- how to configure notifications
