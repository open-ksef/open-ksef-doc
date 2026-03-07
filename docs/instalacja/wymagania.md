---
sidebar_position: 1
title: Wymagania systemowe
---

# Wymagania systemowe

## Minimalne wymagania

| Komponent | Wymaganie |
|-----------|-----------|
| **System operacyjny** | Linux, macOS lub Windows z Docker Desktop |
| **Docker** | Docker Engine 24+ lub Docker Desktop 4.x |
| **Docker Compose** | v2 (wbudowany w Docker Desktop) |
| **RAM** | minimum 4 GB (zalecane 8 GB) |
| **Dysk** | minimum 2 GB wolnego miejsca |
| **Port** | 8080 (gateway) -- jedyny wymagany port |

:::info Nie potrzebujesz git, curl ani żadnych dodatkowych narzędzi
Wystarczy Docker i przeglądarka. Plik `docker-compose.yml` skopiujesz z [Szybkiego startu](szybki-start).
:::

## Porty

Gateway nasłuchuje na porcie **8080** i udostępnia wszystkie usługi pod jednym adresem. Pozostałe porty są opcjonalne (bezpośredni dostęp do poszczególnych usług):

| Port | Usługa | Wymagany? | Zmienna `.env` |
|------|--------|-----------|----------------|
| 8080 | Gateway (portal + API + Keycloak) | **tak** | `APP_HOST_PORT` |
| 8081 | API (bezpośredni dostęp / Swagger) | nie | `API_HOST_PORT` |
| 8082 | Keycloak (konsola admina) | nie | `KEYCLOAK_HOST_PORT` |
| 8083 | Portal Web (bezpośredni dostęp) | nie | `PORTAL_WEB_HOST_PORT` |
| 5432 | PostgreSQL | nie | `POSTGRES_HOST_PORT` |

Porty można zmienić w pliku `.env` -- szczegóły w [Konfiguracja zaawansowana](szybki-start#konfiguracja-zaawansowana).

## Dostęp z sieci

Jeśli chcesz udostępnić OpenKSeF w sieci lokalnej lub przez internet:

1. Ustaw `APP_EXTERNAL_BASE_URL` na publiczny adres, np. `http://192.168.1.50:8080`
2. Upewnij się, że port 8080 (lub wybrany) jest dostępny z zewnątrz
3. Dla HTTPS -- użyj reverse proxy (nginx, Traefik, Caddy) przed gatewayem

:::tip Aplikacja mobilna
Aplikacja mobilna na Androidzie wymaga HTTPS do logowania (OIDC). Dla testów lokalnych użyj [ngrok](https://ngrok.com/) -- skrypt `dev-env-up.ps1` konfiguruje to automatycznie.
:::

## Następny krok

Przejdź do [Szybkiego startu](szybki-start), żeby uruchomić OpenKSeF.
