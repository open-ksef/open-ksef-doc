---
sidebar_position: 5
title: Strona logowania
---

# Konfiguracja strony logowania

![Strona logowania](/img/screenshots/portal/login.png)

Portal `/login` uwierzytelnia bezpośrednio przez Keycloak (bez przekierowania). Obsługuje trzy metody:

- **Login i hasło** -- ROPC grant via `oidc-client-ts`
- **Logowanie przez Google** -- Keycloak IdP brokering (`kc_idp_hint=google`)
- **Rejestracja** -- `POST /api/account/register` (Keycloak Admin API), potem auto-login via ROPC

## Logowanie Google OAuth (opcjonalne)

Pomiń tę sekcję, jeśli nie potrzebujesz logowania przez Google -- przycisk wyświetli błąd, jeśli nie jest skonfigurowany.

### Konfiguracja krok po kroku

1. Otwórz [Google Cloud Console > Credentials](https://console.cloud.google.com/apis/credentials)
2. Utwórz **OAuth 2.0 Client ID** (typ: Web application)
3. Dodaj autoryzowany URI przekierowania:

```
{APP_EXTERNAL_BASE_URL}/auth/realms/openksef/broker/google/endpoint
```

Przykłady:
- Z ngrok: `https://abc123.ngrok-free.app/auth/realms/openksef/broker/google/endpoint`
- Lokalnie: `http://localhost:8080/auth/realms/openksef/broker/google/endpoint`

4. Wprowadź dane w [kreatorze konfiguracji](admin-setup) (Krok 5: Integracje > Google OAuth)

## Rejestracja użytkowników

Endpoint rejestracji wymaga service account Keycloak z uprawnieniem `manage-users`.

Jeśli użyłeś [kreatora konfiguracji](admin-setup), jest to skonfigurowane automatycznie.

### Konfiguracja ręczna

1. Otwórz konsolę Keycloak: http://localhost:8082/auth/admin (admin / admin)
2. Przejdź do **Clients > openksef-api > Credentials**
3. Skopiuj **Client Secret**
4. Ustaw w `.env`:

```bash
API_CLIENT_SECRET=<wklej-secret>
```

5. Upewnij się, że service account ma uprawnienie `manage-users`:
   - **Clients > openksef-api > Service Account Roles**
   - Przypisz `realm-management` > `manage-users`

6. Zrestartuj API:

```bash
docker compose restart api
```

:::info
Bez `API_CLIENT_SECRET` rejestracja zwraca `503 Service Unavailable`. Logowanie i Google sign-in działają niezależnie.
:::
