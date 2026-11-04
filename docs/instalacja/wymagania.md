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
| **Porty** | 8080 (gateway), a także 8081, 8082, 8083 i 5432, patrz niżej |

:::info[Nie potrzebujesz git, curl ani żadnych dodatkowych narzędzi]
Wystarczy Docker i przeglądarka. Plik `docker-compose.yml` skopiujesz z [Szybkiego startu](szybki-start).
:::

## Porty

Gateway nasłuchuje na porcie **8080** i udostępnia wszystkie usługi pod jednym adresem. Pozostałe porty dają bezpośredni dostęp do poszczególnych usług. `docker-compose.yml` publikuje je wszystkie, na wszystkich interfejsach, więc każdy musi być wolny. Zajęty port zmień w `.env`:

| Port | Usługa | Zmienna `.env` |
|------|--------|----------------|
| 8080 | Gateway (portal + API + Keycloak) | `APP_HOST_PORT` |
| 8081 | API (bezpośredni dostęp, health check `/health`) | `API_HOST_PORT` |
| 8082 | Keycloak (konsola admina) | `KEYCLOAK_HOST_PORT` |
| 8083 | Portal Web (bezpośredni dostęp) | `PORTAL_WEB_HOST_PORT` |
| 5432 | PostgreSQL | `POSTGRES_HOST_PORT` |

Porty można zmienić w pliku `.env` -- szczegóły w [Konfiguracja zaawansowana](szybki-start#konfiguracja-zaawansowana).

## Dostęp z sieci

Jeśli chcesz udostępnić OpenKSeF w sieci lokalnej lub przez internet:

1. Ustaw `APP_EXTERNAL_BASE_URL` na publiczny adres, np. `http://192.168.1.50:8080`
2. Upewnij się, że port 8080 (lub wybrany) jest dostępny z zewnątrz
3. Dla HTTPS -- użyj reverse proxy (nginx, Traefik, Caddy) przed gatewayem

:::tip[Aplikacja mobilna]
Aplikacja mobilna na Androidzie wymaga HTTPS do logowania (OIDC). Programiści do testów lokalnych mogą użyć [ngrok](https://ngrok.com/): [szczegóły](../aplikacja-mobilna#wymagania-dla-android).
:::

## Następny krok

Przejdź do [Szybkiego startu](szybki-start), żeby uruchomić OpenKSeF.
