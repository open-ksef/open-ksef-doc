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
      POSTGRES_USER: ${POSTGRES_USER:?POSTGRES_USER is required}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}
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
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 5s
      timeout: 5s
      retries: 20

  keycloak:
    image: quay.io/keycloak/keycloak:26.0
    container_name: openksef-keycloak
    command: start --features=token-exchange,admin-fine-grained-authz
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgres:5432/keycloak
      KC_DB_USERNAME: ${KC_DB_USERNAME:-${POSTGRES_USER}}
      KC_DB_PASSWORD: ${KC_DB_PASSWORD:-${POSTGRES_PASSWORD}}

      KEYCLOAK_ADMIN: ${KEYCLOAK_ADMIN:?KEYCLOAK_ADMIN is required}
      KEYCLOAK_ADMIN_PASSWORD: ${KEYCLOAK_ADMIN_PASSWORD:?KEYCLOAK_ADMIN_PASSWORD is required}

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
      ASPNETCORE_ENVIRONMENT: Production
      Auth__RequireHttpsMetadata: "false"
      ASPNETCORE_URLS: http://0.0.0.0:8081
      ConnectionStrings__Db: Host=postgres;Port=5432;Database=openksef;Username=${POSTGRES_USER:?POSTGRES_USER is required};Password=${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}
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
      ConnectionStrings__Db: Host=postgres;Port=5432;Database=openksef;Username=${POSTGRES_USER:?POSTGRES_USER is required};Password=${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}
      Auth__Authority: http://keycloak:8080/auth/realms/openksef
      ENCRYPTION_KEY: ${ENCRYPTION_KEY:-}
      KSeF__BaseUrl: ${KSEF_BASE_URL:-https://ksef-test.mf.gov.pl/api}
      Firebase__CredentialsJson: ${FIREBASE_CREDENTIALS_JSON:-}

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

:::tip[Copying]
Click the copy icon in the top-right corner of the code block to copy the entire content. Paste it into a new `docker-compose.yml` file.
:::

In the same directory, create an `.env` file with the credentials (usernames and passwords) for PostgreSQL and the Keycloak admin console. Without it, `docker compose up` fails (e.g. `POSTGRES_USER is required`):

```bash
POSTGRES_USER=openksef
POSTGRES_PASSWORD=change_me
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=change_me_too
```

:::warning[Credentials]
Use your own strong passwords. `docker-compose.yml` has no defaults for these four variables on purpose.
:::

:::caution[Upgrading an existing installation]
If you previously ran an older version of this file (without `.env`), the `postgres_data` volume already holds user `openksef` with password `openksef_dev_password`, and Keycloak has the admin account `admin` / `admin`. PostgreSQL and Keycloak read these variables only on first start, so new passwords in `.env` change nothing and the API cannot connect to the database.

1. Put the old values in `.env`: `POSTGRES_USER=openksef`, `POSTGRES_PASSWORD=openksef_dev_password`, `KEYCLOAK_ADMIN=admin`, `KEYCLOAK_ADMIN_PASSWORD=admin` and run `docker compose up -d`.
2. Change the database password: `docker compose exec postgres psql -U openksef -c "ALTER USER openksef WITH PASSWORD 'new_password';"`, put it in `POSTGRES_PASSWORD` in `.env` and run `docker compose up -d` again.
3. Change the Keycloak admin password in the console (http://localhost:8082/auth/admin, realm `master` > **Users** > `admin` > **Credentials** > **Reset password**) and put it in `KEYCLOAK_ADMIN_PASSWORD` in `.env`.
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
| **api** | .NET 10 backend |
| **worker** | Background invoice synchronization |
| **portal-web** | React interface |
| **gateway** | Nginx reverse proxy (configuration built into the image) |

:::info[First launch]
The first launch may take a few minutes -- Docker pulls ~2 GB of images. Subsequent starts take seconds.
:::

## Step 3: Configure

:::tip[Wait for Keycloak]
After `docker compose up -d`, wait 30-60 seconds until Keycloak is up (`docker compose logs -f keycloak`, look for the `Listening on` line). Before that, the first wizard step reports a credentials error even when they are correct.
:::

Open **http://localhost:8080** in your browser.

The system will detect that it's not yet configured and automatically redirect you to the **setup wizard** (`/admin-setup`). The wizard will guide you through:

1. Logging in with Keycloak admin credentials (`KEYCLOAK_ADMIN` / `KEYCLOAK_ADMIN_PASSWORD` from `.env`)
2. **Pierwsze konto i firma** (first account and company): external URL, KSeF environment, e-mail and password of the first user, and the company NIP
3. Login policy and optionally SMTP
4. Automatic generation of encryption key and API secret
5. Optionally: Google OAuth, push notifications
6. Click "Apply" -- done!

Detailed description of each step can be found in the [Setup Wizard](../admin-setup).

:::info[Encryption key]
The wizard stores the encryption key in the database (table `SystemConfigs`, key `encryption_key`), and the database value takes precedence over the `ENCRYPTION_KEY` variable. You do not need to add the key to `.env` or restart containers. Because the key lives in the database, a backup of the `postgres_data` volume contains it together with the encrypted KSeF tokens -- protect it like a password.
:::

## Service URLs

| Service | URL |
|---------|-----|
| Portal (via gateway) | http://localhost:8080 |
| API health check | http://localhost:8081/health |
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

The `.env` file from step 1 only needs the credentials. Other variables have defaults, and the setup wizard automatically generates missing secrets.

If you want to change other settings **before** launching (e.g. ports, URL), add them to the same `.env` file, below the credentials from step 1:

```bash
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

:::info[Configuration priority]
Setup wizard (database) > `.env` file > defaults in `docker-compose.yml`

Applies to settings the wizard stores (e.g. encryption key, API secret, public URL, KSeF environment). After the wizard runs, its values take precedence, and `.env` applies only to values the wizard did not set. PostgreSQL and Keycloak credentials always come from `.env`.
:::

Full description of all variables can be found in [Configuration](konfiguracja).

## Next steps

- [Configuration](konfiguracja) -- full list of environment variables
- [Setup Wizard](../admin-setup) -- details of each wizard step
- [Push notifications](../powiadomienia-push) -- how to configure notifications
