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

Kreator zapisuje secret klienta `openksef-api` tylko w bazie i nie nadaje kontu serwisowemu ról `manage-users` ani `view-realm`. Dlatego na instalacji z kreatora z włączoną rejestracją formularz zwraca `503`. Nowy użytkownik loguje się przez Google albo dostaje konto założone w konsoli Keycloak. Formularz zadziała po [konfiguracji ręcznej](#konfiguracja-ręczna).

Każde żądanie czyta realm: rejestracja wyłączona zwraca `403`, a nieudany odczyt `503`. W obu przypadkach konto nie powstaje.

### Konfiguracja ręczna

1. Otwórz konsolę Keycloak `/auth/admin` (`KEYCLOAK_ADMIN` / `KEYCLOAK_ADMIN_PASSWORD` z pliku `.env`). Gateway ją blokuje. Jak ją otworzyć: [Aktualizacja: porty i konsola Keycloak](admin-setup#aktualizacja-porty-i-konsola-keycloak)
2. Przejdź do **Clients > openksef-api > Credentials**
3. Skopiuj **Client Secret**. Nie generuj go ponownie na instalacji z kreatora
4. Tylko na instalacji bez kreatora ustaw w `.env` (secret z kreatora w bazie ma pierwszeństwo):

```bash
API_CLIENT_SECRET=<wklej-secret>
```

5. Upewnij się, że service account ma uprawnienia:
   - **Clients > openksef-api > Service accounts roles**
   - Przypisz `realm-management` > `manage-users` i `view-realm`

:::warning[manage-users]
`manage-users` pozwala każdemu, kto zna secret klienta `openksef-api`, zresetować hasło dowolnego użytkownika, także administratora. Secret leży w bazie i w jej kopiach zapasowych. Chroń je tak jak hasło administratora. Jeśli rejestracja nie jest potrzebna, wyłącz ją w **Ustawieniach** i nie nadawaj tej roli.
:::

6. Zrestartuj API:

```bash
docker compose up -d api
```

:::info
Bez `API_CLIENT_SECRET` lub tych uprawnień rejestracja zwraca `503 Service Unavailable`. Logowanie i Google sign-in działają niezależnie.
:::

## Blokada po nieudanych logowaniach

Po 10 nieudanych próbach logowania Keycloak blokuje konto na 1 do 15 minut. Im więcej kolejnych nieudanych prób, tym dłuższa blokada. Zablokowane konto nie zaloguje się, nawet poprawnym hasłem. Po upływie czasu blokada znika sama. Licznik nieudanych prób zeruje się po 12 godzinach. Blokada nigdy nie jest stała.

Instancja zainstalowana kreatorem od v0.0.7 ma blokadę od razu. Na starszej instancji włącza ją pierwszy zapis **Ustawień** przez administratora: otwórz **Ustawienia** i zapisz je raz. Jeśli ochrona była już włączona w konsoli Keycloak, zapis tylko obniża próg do 10 prób i wyłącza blokadę stałą. Pozostałe czasy zostają.
