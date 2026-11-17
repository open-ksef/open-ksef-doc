---
sidebar_position: 5
title: Strona logowania
---

# Konfiguracja strony logowania

![Strona logowania: Email, Hasło, Nie pamiętasz hasła?, Zaloguj przez Google](/img/screenshots/portal/login.png)

Portal `/login` przekierowuje na stronę logowania OpenKSeF. Wyświetla ją Keycloak (Authorization Code + PKCE) w motywie `openksef`, który wygląda jak portal. Po zalogowaniu wracasz na stronę portalu, którą otwierałeś. Na stronie logowania są:

- **Email i hasło**, potem kod z aplikacji uwierzytelniającej, zobacz [Weryfikacja dwuetapowa](weryfikacja-dwuetapowa)
- **Zaloguj przez Google** -- gdy skonfigurowano [Google OAuth](#logowanie-google-oauth-opcjonalne). Bez kodu z aplikacji
- **Zarejestruj się** -- gdy rejestracja jest włączona w **Ustawieniach**. Nowe konto od razu ustawia weryfikację dwuetapową
- **Nie pamiętasz hasła?** -- gdy w **Ustawieniach** skonfigurowano SMTP i włączono reset hasła, zobacz [Nie pamiętasz hasła](#nie-pamiętasz-hasła)

Wszystkie strony logowania (rejestracja, nowe hasło, potwierdzenie e-maila, weryfikacja dwuetapowa, komunikaty o błędach) są po polsku, w tym samym wyglądzie. Wylogowanie nie pyta o potwierdzenie i wraca na stronę logowania.

Zmianę hasła, weryfikację dwuetapową i listę zalogowanych urządzeń znajdziesz w portalu: **Ustawienia** > **Bezpieczeństwo**. Adres `/auth/realms/openksef/account` też tam prowadzi. **Wyloguj wszystkie urządzenia** (na tej zakładce i na stronie **Telefon**) wylogowuje aplikację mobilną na każdym telefonie i portal we wszystkich przeglądarkach, także w tej. Telefony przestają dostawać powiadomienia. Użyj tego po utracie telefonu.

Bez obrazu `openksef-keycloak`, na oficjalnym obrazie Keycloak, logowanie działa tak samo, ale strony mają wbudowany wygląd Keycloak.

## Nie pamiętasz hasła

1. Na stronie logowania naciśnij **Nie pamiętasz hasła?**, wpisz e-mail i naciśnij **Wyślij link**. Strona nie mówi, czy konto istnieje.
2. Otwórz link z e-maila.
3. Ustaw nowe hasło. Konto z weryfikacją dwuetapową najpierw wpisuje kod z aplikacji albo kod zapasowy. Konto bez weryfikacji ustawia ją po drodze.

Nowe hasło nie wyłącza weryfikacji dwuetapowej. Zgubiłeś telefon i kody zapasowe: [reset przez administratora](weryfikacja-dwuetapowa#zgubiony-telefon-i-kody-reset-przez-administratora).

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

Portal zakłada konto na stronie logowania: **Zarejestruj się** jest widoczne, gdy rejestracja jest włączona w **Ustawieniach**. To działa bez dodatkowej konfiguracji.

Aplikacja mobilna 1.0.9: **Załóż konto** otwiera tę samą stronę rejestracji w przeglądarce telefonu.

Dalej tylko o formularzu **Załóż konto** w aplikacji mobilnej (1.0.8 i starsze). Formularz używa `POST /api/account/register` (Keycloak Admin API). Kreator zapisuje secret klienta `openksef-api` tylko w bazie i nie nadaje kontu serwisowemu ról `manage-users` ani `view-realm`. Dlatego na instalacji z kreatora z włączoną rejestracją ten formularz zwraca `503`. Użytkownik takiej aplikacji zakłada konto w portalu albo loguje się przez Google (jeśli skonfigurowano). Formularz zadziała po [konfiguracji ręcznej](#konfiguracja-ręczna).

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
