---
sidebar_position: 1
title: Wymagania systemowe
---

# Wymagania systemowe

## Minimalne wymagania

| Komponent | Wymaganie |
|-----------|-----------|
| **Docker** | Docker Engine lub Docker Desktop. Obrazy są dostępne dla `linux/amd64` |
| **Docker Compose** | v2 (wbudowany w Docker Desktop) |
| **RAM** | Sześć kontenerów bez ruchu zajmuje około 1,1 GB. Zaplanuj zapas na synchronizację i system |
| **Dysk** | Obrazy zajmują około 2,5 GB. Do tego rośnie baza faktur |
| **Porty** | Jeden: 8080 (gateway), patrz niżej |

:::info[Nie potrzebujesz git, curl ani żadnych dodatkowych narzędzi]
Wystarczy Docker i przeglądarka. Plik `docker-compose.yml` pobierzesz z wydania, link jest w [Szybkim starcie](szybki-start).
:::

## Porty

Gateway nasłuchuje na porcie **8080** i udostępnia wszystkie usługi pod jednym adresem: portal pod `/`, API pod `/api/`, Keycloak pod `/auth/`. `docker-compose.yml` publikuje na hoście tylko ten port. Jeśli 8080 jest zajęty, ustaw inny w `.env`:

| Port | Usługa | Zmienna `.env` |
|------|--------|----------------|
| 8080 | Gateway (portal + API + Keycloak) | `APP_HOST_PORT` |

API, Keycloak, portal i PostgreSQL działają tylko w sieci Docker. Konsola admina Keycloak (`/auth/admin`) jest przez gateway zablokowana. Dostęp do bazy i do konsoli: [Aktualizacja: porty i konsola Keycloak](../admin-setup#aktualizacja-porty-i-konsola-keycloak).

## Dostęp z sieci

Jeśli chcesz udostępnić OpenKSeF w sieci lokalnej lub przez internet:

1. Ustaw `APP_EXTERNAL_BASE_URL` na publiczny adres, np. `http://192.168.1.50:8080`
2. Upewnij się, że port 8080 (lub wybrany) jest dostępny z zewnątrz. Z internetu udostępniaj tylko gateway
3. Dla HTTPS -- użyj reverse proxy (nginx, Traefik, Caddy) przed gatewayem

:::tip[Aplikacja mobilna]
Aplikacja mobilna na Androidzie wymaga HTTPS do logowania (OIDC). Programiści do testów lokalnych mogą użyć [ngrok](https://ngrok.com/): [szczegóły](../aplikacja-mobilna#wymagania-dla-android).
:::

## Następny krok

Przejdź do [Szybkiego startu](szybki-start), żeby uruchomić OpenKSeF.
