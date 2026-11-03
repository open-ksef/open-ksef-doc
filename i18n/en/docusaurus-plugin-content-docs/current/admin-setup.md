---
sidebar_position: 4
title: Setup Wizard
---

# Setup Wizard (Admin Setup)

The setup wizard automates the initial system configuration. Instead of manually editing `.env` files, copying secrets from Keycloak, and restarting containers -- just run `docker compose up` and go through the web wizard at `http://localhost:8080/admin-setup`.

:::tip[Don't have the stack running yet?]
Go to [Quick Start](instalacja/szybki-start) -- getting it up takes less than 5 minutes.
:::

## Prerequisites

- Docker stack running (`docker compose up -d`) with `ENCRYPTION_KEY` set, see [Encryption key](#encryption-key)
- Port 8080 available (gateway)

New installations only. On an existing installation do not run `docker compose up -d`: follow the [upgrade procedure](#upgrade-from-v007-or-earlier).

## Wizard steps

### Step 1: Keycloak administrator authentication

![Step 1 - Keycloak login](/img/screenshots/portal/admin-setup-step1.png)

Enter the Keycloak admin credentials (default: `admin` / `admin` from `docker-compose.yml`). The wizard authenticates against the `master` realm and stores the credentials in a temporary session token (valid for 10 minutes), which is used to configure Keycloak in subsequent steps.

### Step 2: Basic configuration

![Step 2 - basic configuration](/img/screenshots/portal/admin-setup-step2.png)

| Field | Description | Default |
|-------|-------------|---------|
| External URL | Public system address | Current browser address |
| KSeF environment | Test or Production | Test (`ksef-test.mf.gov.pl`) |
| Admin email | First user's email | *(required)* |
| Admin password | First user's password | *(required, min. 8 characters)* |
| First name / Last name | Optional user details | Admin |

### Step 3: Authentication and email

![Step 3 - authentication and email](/img/screenshots/portal/admin-setup-step3.png)

**Login policy:**
- User registration (default: ON)
- Email verification (default: OFF, requires SMTP)
- Email login (default: ON)
- Password reset (default: ON, requires SMTP)

**Password policy:**
- Basic: minimum 8 characters
- Strong: 12 characters, special characters, uppercase letters, digits

**SMTP (optional):**

If you enable email verification or password reset, you need SMTP:

| Provider | Host | Port | TLS |
|----------|------|------|-----|
| Gmail | smtp.gmail.com | 587 | StartTLS |
| Outlook/O365 | smtp.office365.com | 587 | StartTLS |
| Custom | (manual) | (manual) | (manual) |

:::tip[Gmail]
Gmail requires an **App Password** (not a regular password). Generate one in Google account settings: Security > 2-Step Verification > App Passwords.
:::

### Step 4: Security

The wizard fetches the **API client secret** from the Keycloak `openksef-api` client and stores it in the database.

The **AES-256 encryption key** is not part of the wizard. Set `ENCRYPTION_KEY` on API and Worker before you start the stack, and keep a copy outside the database. Without a valid key the wizard does not apply the configuration and changes nothing in Keycloak. See [Encryption key](#encryption-key).

### Step 5: Integrations (optional)

![Step 5 - integrations](/img/screenshots/portal/admin-setup-step5.png)

**Google OAuth:** If you want Google sign-in, create a Google Cloud OAuth 2.0 Client ID and enter the details. The redirect URI is filled in automatically.

**Push notifications:** Three modes:

- **OpenKSeF Relay (default, recommended)** -- Uses a relay server to deliver push via FCM/APNs. No Firebase configuration required. The relay URL (`https://push.open-ksef.pl`) is filled in automatically.
- **Own Firebase project (advanced)** -- Paste the Firebase service account JSON. Details in [Push notifications](powiadomienia-push).
- **Local only (SignalR)** -- No remote notifications. Users receive notifications only when the mobile app is actively connected to the server.

SignalR always works regardless of the selected mode. The mode only affects remote (background) delivery.

### Step 6: Summary and apply

![Step 6 - summary](/img/screenshots/portal/admin-setup-step6.png)

Review all settings and click "Apply". The wizard:

1. Creates the `openksef` realm in Keycloak (if it doesn't exist)
2. Creates OAuth clients: `openksef-api`, `openksef-mobile`, `openksef-portal-web`
3. Fetches the API client secret from Keycloak
4. Enables token-exchange for the service account
5. Updates redirect URIs with the external URL
6. Configures the Keycloak realm (login policy, password policy, SMTP)
7. Creates the admin account in Keycloak
8. Configures the Google IdP (if provided)
9. Saves the entire configuration to the database
10. Redirects to the login page

## Encryption key

This section applies to version `WERSJA-T-026` and later.

:::danger[Check ENCRYPTION_KEY before you upgrade]
Before any `docker compose pull`, `docker compose up -d`, stack update or automatic updater run, check `ENCRYPTION_KEY` in `.env` or the stack environment. If it holds a valid value, the first start of the new images moves the key to that value, with no stop and no backup. Follow the [upgrade procedure](#upgrade-from-v007-or-earlier) first.

Has the key already moved (the query in its step 1 returns 0)? Keep that value, because it is the only copy of the key, and [rotate the key](#rotate-the-key) only if you want a new one. Is the value empty? Do not generate a key and do not run `docker compose up -d`. Step 1 of the procedure says where to recover it.
:::

The key encrypts stored KSeF tokens and certificates. Losing it loses them: they must be entered again.

A valid key is 32 bytes in base64, which is 44 characters. Generate it with one of these commands:

```bash
openssl rand -base64 32
# or, without openssl, with Docker alone:
docker run --rm postgres:16-alpine sh -c "head -c 32 /dev/urandom | base64"
```

The commands in the procedures below are written for bash. On Windows use WSL or Git Bash. PowerShell corrupts a database dump when it redirects with `>`.

### What happens if you only pull the new images

A plain `docker compose pull` gets you the `:latest` images. Up to and including v0.0.7 the key lives in the database next to the encrypted data, so every database dump can decrypt it. The new version changes that, but only once you provide a key:

| State after the upgrade | Result |
|---|---|
| New images, key in the database, `ENCRYPTION_KEY` empty | **Legacy mode.** The system works as before and nothing is lost. The key stays in the database and security is unchanged. Each start logs an Error |
| New images, key in the database, `ENCRYPTION_KEY` malformed (e.g. wrong format or length) | The same: legacy mode and an Error at each start |
| New images, key in the database, `ENCRYPTION_KEY` valid | The key moves at the first start, to exactly this value. Make sure you have it stored outside the database, and follow the procedure below **before** you pull the images |
| New `docker-compose.yml` without `ENCRYPTION_KEY` | `docker compose` refuses. Its message sends an existing installation to this page and names the generator command for a new one. `stop`, `exec`, `ps`, `logs` refuse unless the project name is set. `up`, `pull`, `run` always refuse. Running containers stay untouched |

Legacy mode is temporary: we plan for later releases to stop reading the key from the database. Move the key as soon as you can.

### Upgrade from v0.0.7 or earlier

The first start with a valid configured key re-encrypts all credentials and deletes the key row from the database, in one transaction.

Run steps 1 to 3 with the compose file you use now. The new `docker-compose.yml` arrives at step 6.

`docker compose` refuses to run (old file overwritten or `.env` lost)? Do not add the key to get past it: one `up` moves the key with no backup. Run steps 1 to 3 with Docker alone, then continue the procedure from step 4. Run one command at a time. The first is step 1: on a result of `0`, stop as that step says. `.env` lost: rebuild it as the [`docker compose` reports a missing](#troubleshooting) row says. The container names are fixed:

```bash
echo "SELECT count(*) FROM \"SystemConfigs\" WHERE \"Key\"='encryption_key';" | docker exec -i openksef-postgres sh -c 'psql -U "$POSTGRES_USER" -d openksef -tA'
```

`is not running`? Run `docker start openksef-postgres`, wait a few seconds, then run the query.

`No such container`? Go to the directory with the stack's `docker-compose.yml` and `.env`: compose names the project after the directory, and another directory means a new empty volume. Run `docker volume ls --filter name=postgres_data` and note your volume: `<project>_postgres_data`, where `<project>` is the directory name or the Portainer stack name. An empty list means no database remains: stop and restore your backup. Start Postgres alone. This command starts neither API nor Worker and moves no key: `ENCRYPTION_KEY=unused docker compose up -d --no-deps postgres`. This needs `POSTGRES_USER`, `POSTGRES_PASSWORD`, `KEYCLOAK_ADMIN` and `KEYCLOAK_ADMIN_PASSWORD` in `.env`. Check the volume: `docker inspect openksef-postgres --format '{{range .Mounts}}{{.Name}}{{end}}'` must print the noted name. Another name means an empty database that is not yours: run `docker rm -f openksef-postgres`, which keeps the volumes, and repeat from the right directory. No such directory, as with a Portainer stack: put `COMPOSE_PROJECT_NAME=<project>` before the command. Wait a few seconds, then run the query. Any error, such as `relation "SystemConfigs" does not exist`, is not a result of `0`: do not continue and do not generate a key. Check the volume and `POSTGRES_USER`, then retry. With API and Worker gone, `docker stop` below reports `No such container`: continue.

Continue only if the result is `1`:

```bash
docker stop openksef-api openksef-worker
docker exec openksef-postgres sh -c 'pg_dump -U "$POSTGRES_USER" -Fc openksef' > before-key-move.dump
docker exec -i openksef-postgres pg_restore -l < before-key-move.dump > /dev/null; echo "exit=$?"
```

1. **Check that the key is still in the database:**
   ```bash
   echo "SELECT count(*) FROM \"SystemConfigs\" WHERE \"Key\"='encryption_key';" | docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d openksef -tA'
   ```
   Continue only if the result is `1`. A result of `0` means the key has already moved, and `ENCRYPTION_KEY` is its only copy. **Stop this procedure, do not change `ENCRYPTION_KEY`.** If `ENCRYPTION_KEY` is empty, **do not generate a key and do not run `docker compose up -d`**. Restore the previous value. If you have no copy, the containers still hold it: `docker inspect openksef-api | grep '"ENCRYPTION_KEY='`. This command prints a secret to the terminal. If it shows no value (`"ENCRYPTION_KEY="` or no such container), run it on `openksef-worker`. If that shows none either, no copy remains. Only then generate a key, set it, run `docker compose up -d` and follow the `New key lost` row under Rollback below. `does not decrypt` stays in the logs until every credential is re-entered. Once the key is back in `ENCRYPTION_KEY`, run `docker compose up -d` and check that one manual sync succeeds. [Rotate the key](#rotate-the-key) only if you want a new one.
2. **Stop API and Worker:** `docker compose stop api worker`. Stop both, because compose starts them in no fixed order. An old API that still serves while the key moves writes under the old key, and that data is lost.
3. **Back up:** `docker compose exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" -Fc openksef' > before-key-move.dump`. This dump holds the old key together with the encrypted data, so protect it. Verify it: `docker compose exec -T postgres pg_restore -l < before-key-move.dump > /dev/null; echo "exit=$?"` must print `exit=0`.
4. **Generate the key:** `openssl rand -base64 32`, or the Docker command above. It must have 44 characters. **Store it in a password manager before the next step**, outside the database and its backups. Do not reuse an older `ENCRYPTION_KEY` value.
5. **Set the key:** copy the current `ENCRYPTION_KEY` value, if one is set, to a password manager before you overwrite it. Then put the new value in `ENCRYPTION_KEY` in `.env` or the stack environment.
6. **Start the new images:** replace `docker-compose.yml` with the new file from [Quick start](instalacja/szybki-start) or attached to the [release page](https://github.com/open-ksef/open-ksef/releases), then `docker compose pull api worker portal-web gateway` and `docker compose up -d`.
7. **Verify:**
   - In `docker compose logs api worker` one service logs `Encryption key moved out of the database`. The other logs nothing about it. Neither logs Critical.
   - The query from step 1 returns 0.
   - One manual sync succeeds: **Dane logowania** (Credentials) > the company row > **Wymuś synchronizację** (Force sync).

The dump from step 3 is now the only copy of the old key. Keep it at least until a sync succeeds. Dumps taken before the key moved can decrypt the tokens until you delete them.

A Critical log `Moving the encryption key out of the database failed` followed on the next line by `Credential <id> cannot be decrypted` means that credential could not be decrypted, and nothing changed. Delete or re-enter that credential in the portal and restart the services. If the log says `does not decrypt`, restore the key and delete nothing. The same Critical with no credential line means nothing changed: restart the services. For `cannot be used`, see [Troubleshooting](#troubleshooting).

**Rollback**

Previous images carry a release tag, e.g. `:v0.0.7`. Set it in the `image:` lines of `docker-compose.yml`, then run `docker compose up -d`.

| Situation | Result |
|---|---|
| Key row still in the database, back to the previous images | Works, nothing changed |
| Row gone, previous images, `ENCRYPTION_KEY` kept | Works: the previous images read the key from the variable when no row exists |
| Row gone, previous images, key only in `ENCRYPTION_KEY_FILE` | Credential use fails: the previous images do not read that file. Set `ENCRYPTION_KEY` to the same value |
| Row gone, previous images, `ENCRYPTION_KEY` reverted or emptied | Services run, credential use fails with logs, no data changes. Restore the new key. **Do not revert the key** |
| New key lost | Current data cannot be recovered. Companies re-enter tokens, or you restore a dump from before the key moved and lose later changes |
| Dump from step 3 restored | The row and old data return. The next start moves the key again |

To restore a dump, stop both services first, then run `docker compose exec -T postgres sh -c 'pg_restore -U "$POSTGRES_USER" -d openksef --clean --if-exists' < before-key-move.dump`.

### Rotate the key

Run this on a stack that already runs the current images and has moved the key: the query from step 1 of the upgrade procedure returns 0.

1. Generate the new key: `openssl rand -base64 32`, or the Docker command above. **Store it in a password manager before you run anything.** Keep the old key until step 6 succeeds.
2. Stop API and Worker: `docker compose stop api worker`.
3. Back up and verify the dump, as in the upgrade, but to `before-rotation.dump`. Do not overwrite `before-key-move.dump`.
4. Re-encrypt, with `ENCRYPTION_KEY` still on the old key. The new key is read from the environment and is never a command argument:
   ```bash
   read -rsp 'New key: ' ENCRYPTION_KEY_NEW && echo && export ENCRYPTION_KEY_NEW
   docker compose run --rm -e ENCRYPTION_KEY_NEW api rotate-encryption-key
   unset ENCRYPTION_KEY_NEW
   ```
   It prints `Re-encrypted N credentials.` and exits 0. A re-run is safe and reports 0.
5. Put the new value in `ENCRYPTION_KEY` in `.env` or the stack environment, then `docker compose up -d`.
6. Verify: no Critical in the logs and one manual sync succeeds. Only then discard the old key.

The command exits 1 and writes nothing when:

- `ENCRYPTION_KEY_NEW` is missing, malformed or equal to the current key, or the current key is missing or malformed.
- Other clients with no application name are connected to the database. This catches a running Worker and a busy API. An API idle for several minutes holds no connection and is not caught, so always do step 2. Tools that set a name (`psql`, `pg_dump`, pgAdmin) and autovacuum do not count. Close any other client the message counts. To find them: `SELECT pid, usename, client_addr, backend_start FROM pg_stat_activity WHERE datname = current_database() AND backend_type = 'client backend' AND application_name = '';`
- The database is not on this image's version, or the key is still in the database. Start the app once, stop it and retry.
- A credential cannot be decrypted. The message names it.

**Rollback**

| Situation | Action |
|---|---|
| Command refused | Nothing changed. Fix the reason and retry |
| After step 4, problem before step 6 | Stop API and Worker. Then rotate back (`ENCRYPTION_KEY` = new key, `ENCRYPTION_KEY_NEW` = old key), then set `ENCRYPTION_KEY` to the old key and run `docker compose up -d`, or restore `before-rotation.dump` and keep the old key |
| New key lost after step 4 | Restore `before-rotation.dump` with the old key, and lose later changes. Without the old key, companies re-enter tokens |

`before-rotation.dump` is the dump that rolls back a rotation. Restore it with the same command as in the upgrade procedure, after you stop both services. `before-key-move.dump` returns to the state before the key moved and does not roll back a rotation.

## Architecture

### Configuration storage

Configuration is stored in the `SystemConfigs` table (key-value). The `ISystemConfigService` reads from this table with an in-memory cache, falling back to environment variables.

**Priority:** Setup wizard (database) > `.env` file > defaults in `docker-compose.yml`

This means that after completing the wizard, its settings take the highest priority. The `.env` file only overrides values that the wizard didn't set. The exception is the [encryption key](#encryption-key): the wizard does not store it.

### API endpoints

| Endpoint | Authorization | Purpose |
|----------|---------------|---------|
| `GET /api/system/setup-status` | Anonymous | Returns `{isInitialized: bool}` |
| `POST /api/system/setup/authenticate` | Anonymous | Validates KC admin credentials, returns token |
| `POST /api/system/setup/apply` | Setup token (X-Setup-Token) | Performs full configuration |

All setup endpoints are blocked after initialization (return 403).

### Portal routing

The portal checks `/api/system/setup-status` on every protected page load. If `isInitialized` is `false`, all routes redirect to `/admin-setup`.

## Troubleshooting

:::danger[Legacy mode and deleting rows]
While the key is in the database, the `encryption_key` row is its only copy. If you delete rows from `SystemConfigs` before [moving the key](#upgrade-from-v007-or-earlier), you lose stored KSeF tokens and certificates. After the key has moved, the wizard must run with the same `ENCRYPTION_KEY`, or the credentials stop decrypting.
:::

| Problem | Solution |
|---------|----------|
| Wizard doesn't appear | Only if the query from [upgrade step 1](#upgrade-from-v007-or-earlier) returns 0: check if the `SystemConfigs` table is empty. Delete rows and restart the API. |
| Keycloak login doesn't work | Check if Keycloak is running (`docker compose logs keycloak`). Credentials: `KEYCLOAK_ADMIN` / `KEYCLOAK_ADMIN_PASSWORD` from `.env`. |
| Apply returns 500 | Check API logs (`docker compose logs api`). Common cause: Keycloak is not ready yet. |
| SMTP email test fails | Verify SMTP credentials. Gmail requires an App Password. |
| Redirect loop after setup | Clear browser cache/cookies. The portal caches setup status for 60 seconds. |
| Want to run the wizard again | Only if the query from [upgrade step 1](#upgrade-from-v007-or-earlier) returns 0: delete all rows from the `SystemConfigs` table and restart the API container. |
| Wizard reports no valid encryption key | Generate a key, set `ENCRYPTION_KEY`, keep a copy outside the database and run `docker compose up -d`. Then click **Dalej** (Next) and go through the wizard again. Entered data is kept. |
| `docker compose` reports a missing `ENCRYPTION_KEY`, `POSTGRES_USER` or another required variable | The new `docker-compose.yml` requires the key. On an existing installation first run the key row query in its `docker exec` form from the [upgrade](#upgrade-from-v007-or-earlier). Result 1: follow the upgrade, because setting the key alone skips stopping the services and the backup. Result 0: the key has already moved, so restore the previous `ENCRYPTION_KEY` value and do not generate a new one, because a new key does not decrypt the stored data. If you have no copy, the containers still hold it: `docker inspect openksef-api \| grep '"ENCRYPTION_KEY='`. This command prints a secret to the terminal. No value: see upgrade step 1. Do not run `docker compose up -d` before that. Other variables: restore them from the old `.env` before `up -d`. `docker inspect openksef-postgres \| grep POSTGRES_` and `docker inspect openksef-keycloak \| grep -E 'KEYCLOAK_ADMIN\|KC_DB_'` print them, including secrets. Do the same for the optional values, because `up -d` removes this copy: `docker inspect openksef-api --format '{{range .Config.Env}}{{println .}}{{end}}' \| grep -E 'Auth__PublicAuthority\|KSeF__BaseUrl\|Auth__ServiceAccount__ClientSecret\|Firebase__CredentialsJson'`. This command prints secrets too. In `.env` they are `APP_EXTERNAL_BASE_URL` (`Auth__PublicAuthority` without `/auth/realms/openksef`), `KSEF_BASE_URL`, `API_CLIENT_SECRET` and `FIREBASE_CREDENTIALS_JSON`. `docker ps` shows custom host ports. In `.env` they are `APP_HOST_PORT`, `API_HOST_PORT`, `KEYCLOAK_HOST_PORT`, `PORTAL_WEB_HOST_PORT` and `POSTGRES_HOST_PORT`. |
| Critical: `The configured encryption key does not decrypt` | The configured key does not match the data in the database. Restore the key that encrypted it. |
| Critical: `The configured encryption key cannot be used` | The key is no longer in the database and `ENCRYPTION_KEY` is empty or malformed. Login and invoice reads work. Adding credentials, sync and send do not. Restore the key. |
