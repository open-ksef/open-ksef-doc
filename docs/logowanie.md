---
sidebar_position: 5
title: Strona logowania
---

# Konfiguracja strony logowania

![Strona logowania](/img/screenshots/portal/login.png)

Od v0.0.24 portal `/login` przekierowuje na polską stronę logowania OpenKSeF, którą wyświetla Keycloak (Authorization Code + PKCE, motyw `openksef`). Po zalogowaniu wracasz na stronę portalu, którą otwierałeś. Strona logowania obsługuje:

- **Login i hasło**
- **Logowanie przez Google** -- Keycloak IdP brokering, gdy skonfigurowano [Google OAuth](#logowanie-google-oauth-opcjonalne)
- **Rejestrację** -- link **Zarejestruj się**, gdy rejestracja jest włączona w **Ustawieniach**
- Reset hasła, gdy w **Ustawieniach** skonfigurowano SMTP i włączono reset hasła

Ta sama strona loguje aplikację mobilną od wersji 1.0.9. Telefon możesz też zalogować kodem zatwierdzonym w portalu, bez hasła na telefonie: [Sparuj z portalem](aplikacja-mobilna#sparuj-z-portalem).

**Wyloguj wszystkie urządzenia** na stronie **Telefon** (od v0.0.23) wylogowuje aplikację mobilną na każdym telefonie i portal we wszystkich przeglądarkach, także w tej. Telefony przestają dostawać powiadomienia. Użyj tego po utracie telefonu albo gdy zatwierdziłeś kod, który nie pochodził z Twojego telefonu.

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

Portal od v0.0.24 i aplikacja od wersji 1.0.9 zakładają konto na stronie logowania Keycloak. To działa bez dodatkowej konfiguracji.

Ta sekcja dotyczy tylko formularza **Załóż konto** w aplikacji mobilnej 1.0.8 i starszej. Formularz używa `POST /api/account/register` (Keycloak Admin API). Kreator zapisuje secret klienta `openksef-api` tylko w bazie i nie nadaje kontu serwisowemu ról `manage-users` ani `view-realm`. Dlatego na instalacji z kreatora z włączoną rejestracją ten formularz zwraca `503`. Użytkownik takiej aplikacji zakłada konto w portalu albo loguje się przez Google (jeśli skonfigurowano). Formularz zadziała po [konfiguracji ręcznej](#konfiguracja-ręczna).

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
Bez secretu klienta `openksef-api` (z kreatora w bazie albo `API_CLIENT_SECRET`) lub tych uprawnień rejestracja zwraca `503 Service Unavailable`. Logowanie i Google sign-in działają niezależnie.
:::

## Blokada po nieudanych logowaniach

Po 10 nieudanych próbach logowania Keycloak blokuje konto na 1 do 15 minut. Im więcej kolejnych nieudanych prób, tym dłuższa blokada. Zablokowane konto nie zaloguje się, nawet poprawnym hasłem. Po upływie czasu blokada znika sama. Licznik nieudanych prób zeruje się po udanym logowaniu albo po 12 godzinach bez nieudanej próby. Blokada nigdy nie jest stała.

Instancja zainstalowana kreatorem od v0.0.7 ma blokadę od razu. Na starszej instancji włącza ją pierwszy zapis **Ustawień** przez administratora: otwórz **Ustawienia** i zapisz je raz. Jeśli ochrona była już włączona w konsoli Keycloak, zapis tylko obniża próg do 10 prób i wyłącza blokadę stałą. Pozostałe czasy zostają.
