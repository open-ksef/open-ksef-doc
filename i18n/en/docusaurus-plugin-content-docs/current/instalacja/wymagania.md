---
sidebar_position: 1
title: System requirements
---

# System requirements

## Minimum requirements

| Component | Requirement |
|-----------|-------------|
| **Operating system** | Linux, macOS, or Windows with Docker Desktop |
| **Docker** | Docker Engine 24+ or Docker Desktop 4.x |
| **Docker Compose** | v2 (included in Docker Desktop) |
| **RAM** | minimum 4 GB (8 GB recommended) |
| **Disk** | minimum 2 GB free space |
| **Port** | 8080 (gateway) -- the only required port |

:::info You don't need git, curl, or any additional tools
Docker and a browser are enough. You can copy the `docker-compose.yml` from [Quick Start](szybki-start).
:::

## Ports

The gateway listens on port **8080** and exposes all services at a single address. Other ports are optional (direct access to individual services):

| Port | Service | Required? | `.env` variable |
|------|---------|-----------|-----------------|
| 8080 | Gateway (portal + API + Keycloak) | **yes** | `APP_HOST_PORT` |
| 8081 | API (direct access / Swagger) | no | `API_HOST_PORT` |
| 8082 | Keycloak (admin console) | no | `KEYCLOAK_HOST_PORT` |
| 8083 | Web Portal (direct access) | no | `PORTAL_WEB_HOST_PORT` |
| 5432 | PostgreSQL | no | `POSTGRES_HOST_PORT` |

Ports can be changed in the `.env` file -- details in [Advanced configuration](szybki-start#advanced-configuration).

## Network access

If you want to expose OpenKSeF on a local network or the internet:

1. Set `APP_EXTERNAL_BASE_URL` to the public address, e.g. `http://192.168.1.50:8080`
2. Make sure port 8080 (or the chosen one) is accessible from outside
3. For HTTPS -- use a reverse proxy (nginx, Traefik, Caddy) in front of the gateway

:::tip Mobile app
The Android mobile app requires HTTPS for login (OIDC). For local testing, use [ngrok](https://ngrok.com/) -- the `dev-env-up.ps1` script configures this automatically.
:::

## Next step

Go to [Quick Start](szybki-start) to launch OpenKSeF.
