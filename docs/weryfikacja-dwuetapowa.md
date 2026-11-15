---
sidebar_position: 5
title: Weryfikacja dwuetapowa
---

# Weryfikacja dwuetapowa

Kto loguje się e-mailem i hasłem, po haśle wpisuje 6-cyfrowy kod z aplikacji uwierzytelniającej na telefonie. Samo skradzione hasło nie wystarczy wtedy do wejścia na konto.

| Logowanie | Kod z aplikacji |
|-----------|-----------------|
| E-mail i hasło | Wymagany, dla każdego konta, także administratora |
| Przez Google | Nie. Weryfikację dwuetapową ustawiasz na swoim koncie Google |
| Konto z hasłem i połączonym Google | Tylko przy logowaniu hasłem |

Wyłączyć weryfikacji nie można. Dodatkowej opłaty ani konfiguracji nie ma: działa po zapisaniu **Ustawień** przez administratora, zobacz [Aktualizacja: nowe strony logowania i weryfikacja dwuetapowa](admin-setup#aktualizacja-nowe-strony-logowania-i-weryfikacja-dwuetapowa).

## Pierwsze logowanie: włącz weryfikację

Konto z hasłem bez weryfikacji (nowe albo założone wcześniej) przy najbliższym logowaniu hasłem trafia na stronę **Włącz weryfikację dwuetapową**. Do OpenKSeF wejdziesz dopiero po jej ustawieniu. To zajmuje około minuty.

1. Zainstaluj na telefonie aplikację uwierzytelniającą, np. Google Authenticator, Microsoft Authenticator albo Aegis.
2. Zeskanuj kod QR w tej aplikacji. Nie możesz zeskanować, bo strona jest otwarta na tym samym telefonie? Naciśnij **Kopiuj** i wpisz klucz w aplikacji ręcznie albo naciśnij **Otwórz w aplikacji na tym telefonie**.
3. Wpisz 6-cyfrowy kod, który pokazuje aplikacja, i naciśnij **Włącz weryfikację**.

![Strona Włącz weryfikację dwuetapową: kod QR, klucz do wpisania ręcznie, pole na kod](/img/screenshots/portal/2fa-setup.png)

Kod jest zły, gdy telefon ma źle ustawiony czas. Włącz w telefonie automatyczną datę i godzinę.

## Kody zapasowe

Zaraz po włączeniu weryfikacji strona pokazuje 12 kodów zapasowych. Każdy kod działa raz. Użyjesz ich, gdy nie masz telefonu z aplikacją.

- Strona pokazuje kody tylko teraz. Zapisz je poza telefonem: **Kopiuj**, **Pobierz** (plik tekstowy) albo **Drukuj**.
- Zaznacz **Zapisałem kody w bezpiecznym miejscu** i naciśnij **Dalej**.

![Strona Zapisz kody zapasowe: 12 kodów, przyciski Kopiuj, Pobierz, Drukuj](/img/screenshots/portal/2fa-recovery-codes.png)

## Logowanie z kodem

Po haśle strona **Weryfikacja dwuetapowa** prosi o kod z aplikacji. Przy złym kodzie pokazuje `Nieprawidłowy kod. Sprawdź, czy telefon ma automatyczny czas, i wpisz nowy kod.`

![Strona Weryfikacja dwuetapowa: pole Kod z aplikacji, link do kodu zapasowego](/img/screenshots/portal/2fa-code.png)

Nie masz telefonu? Naciśnij **Nie masz telefonu? Użyj kodu zapasowego**, wybierz **Kod zapasowy** i wpisz kod o numerze, który poda strona. Wpisany kod przestaje działać.

Zalogowany telefon z aplikacją OpenKSeF nie prosi o kod: działa dalej także po włączeniu weryfikacji. Włączenie weryfikacji nie wylogowuje innych urządzeń. Jeśli podejrzewasz, że ktoś zna Twoje hasło, użyj **Wyloguj wszystkie urządzenia** (niżej).

## Ustawienia > Bezpieczeństwo

W portalu otwórz **Ustawienia** > **Bezpieczeństwo**.

![Ustawienia, zakładka Bezpieczeństwo: hasło, weryfikacja dwuetapowa, aktywne sesje](/img/screenshots/portal/settings-security.png)

| Karta | Co zobaczysz i co zrobisz |
|-------|---------------------------|
| **Hasło** | Datę ostatniej zmiany. **Zmień hasło** otwiera stronę zmiany hasła i wraca do portalu |
| **Weryfikacja dwuetapowa** | Status **Włączona**, datę włączenia i liczbę niewykorzystanych kodów zapasowych |
| | **Wygeneruj nowe kody**: dotychczasowe kody przestają działać, nowe zobaczysz raz. Przy 3 kodach lub mniej portal przypomina o nowych |
| | **Zmień aplikację**, np. przy nowym telefonie: ustawiasz nową aplikację, stara przestaje działać, dostajesz nowe kody zapasowe |
| | Status **Nieustawiona** (np. po resecie przez administratora): **Ustaw teraz** albo ustawisz ją przy następnym logowaniu hasłem |
| | Konto tylko z Google: **Przez Google**, bez przycisków |
| **Aktywne sesje i urządzenia** | Przeglądarki i telefony zalogowane na Twoje konto. **Wyloguj wszystkie urządzenia** wylogowuje wszystkie naraz, także tę przeglądarkę. Pojedynczej sesji nie wylogujesz |

## Zgubiony telefon i kody: reset przez administratora

Nie masz ani telefonu z aplikacją, ani kodów zapasowych? Poproś administratora OpenKSeF o reset weryfikacji. Po resecie przy następnym logowaniu hasłem ustawisz weryfikację od nowa, ze starym hasłem.

Administrator (rola `openksef-admin`):

1. Otwórz **Ustawienia** > **Administracja**, kartę **Weryfikacja dwuetapowa użytkownika**.
2. Wpisz e-mail użytkownika i naciśnij **Znajdź**.
3. Naciśnij **Resetuj weryfikację dwuetapową** i potwierdź. Portal usuwa aplikację uwierzytelniającą i kody zapasowe użytkownika i zapisuje, kto wykonał reset.

![Ustawienia, zakładka Administracja: karta Weryfikacja dwuetapowa użytkownika](/img/screenshots/portal/admin-2fa-reset.png)

Reset w portalu wymaga roli `manage-users` dla konta serwisowego `openksef-api`. Kreator jej nie nadaje, bo pozwala też ustawić hasło każdemu użytkownikowi. Bez niej karta pokazuje kroki w konsoli Keycloak zamiast przycisku. Jak nadać rolę: [Konfiguracja ręczna](logowanie#konfiguracja-ręczna), krok 5.

### Jedyny administrator bez telefonu i kodów

Reset zrobisz w konsoli Keycloak. Logujesz się do niej kontem `KEYCLOAK_ADMIN` z pliku `.env`, bez kodu z aplikacji.

1. Otwórz konsolę `/auth/admin`. Gateway ją blokuje, jak ją otworzyć: [Aktualizacja: porty i konsola Keycloak](admin-setup#aktualizacja-porty-i-konsola-keycloak).
2. Wybierz realm `openksef` > **Users** > swoje konto > **Credentials**.
3. Usuń wpisy `otp` i `recovery-authn-codes`.
4. Zaloguj się do portalu hasłem i ustaw weryfikację od nowa.

## Aplikacja mobilna

Aplikacja w wersji 1.0.8 loguje e-mailem i hasłem we własnym formularzu, bez pola na kod. Po włączeniu weryfikacji to konto nie zaloguje się w niej hasłem: aplikacja pokaże `Nieprawidłowy email lub hasło.` Co działa:

- Telefon zalogowany wcześniej zostaje zalogowany. Zaloguj się w aplikacji, zanim pierwszy raz zalogujesz się do portalu po aktualizacji serwera.
- **Zaloguj przez Google** w aplikacji, jeśli administrator skonfigurował Google.
