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

Formularz rejestracji działa dopiero po poniższych krokach. Kreator ich nie wykonuje, celowo: `manage-users` pozwala temu, kto ma secret klienta `openksef-api`, zresetować hasło każdego użytkownika, a kreator trzyma ten secret w bazie i jej kopiach. Na instalacji z kreatora z włączoną rejestracją formularz zwraca `503`. Użyj logowania Google albo utwórz konto w konsoli Keycloak.

Każde żądanie czyta realm: rejestracja wyłączona zwraca `403`, a nieudany odczyt `503`. W obu przypadkach konto nie powstaje.

### Konfiguracja ręczna

1. Otwórz konsolę Keycloak `/auth/admin` (`KEYCLOAK_ADMIN` / `KEYCLOAK_ADMIN_PASSWORD` z pliku `.env`). Gateway ją blokuje. Jak ją otworzyć: [Aktualizacja: porty i konsola Keycloak](admin-setup#aktualizacja-porty-i-konsola-keycloak)
2. Przejdź do **Clients > openksef-api > Credentials**
3. Skopiuj **Client Secret**. Nie generuj go ponownie na instalacji z kreatora
4. Ustaw w `.env`:

```bash
API_CLIENT_SECRET=<wklej-secret>
```

5. Upewnij się, że service account ma uprawnienia:
   - **Clients > openksef-api > Service accounts roles**
   - Przypisz `realm-management` > `manage-users` i `view-realm`

6. Zrestartuj API:

```bash
docker compose up -d api
```

:::info
Bez `API_CLIENT_SECRET` lub tych uprawnień rejestracja zwraca `503 Service Unavailable`. Logowanie i Google sign-in działają niezależnie.
:::
