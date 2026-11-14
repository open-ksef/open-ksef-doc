---
sidebar_position: 7
title: Aplikacja mobilna
---

# Aplikacja mobilna

OpenKSeF Mobile to aplikacja .NET MAUI na Androida. Umożliwia przeglądanie faktur, zarządzanie firmami i otrzymywanie powiadomień push o nowych fakturach z KSeF.

:::note[Dostępność]
Android: [plik APK na GitHubie](https://github.com/open-ksef/open-ksef-mobile/releases/latest), Google Play i iPhone jeszcze nie.
:::

## Funkcje

- Przeglądanie faktur z KSeF (lista, szczegóły, filtrowanie)
- Numer faktury sprzedawcy i pozycje faktury w szczegółach (zobacz [Otrzymane faktury](faktury#aplikacja-mobilna))
- Zarządzanie firmami (tenantami)
- Powiadomienia push (SignalR + relay/Firebase)
- Logowanie na stronie logowania OpenKSeF albo [parowanie kodem z portalem](#sparuj-z-portalem), bez hasła na telefonie
- Przycisk **Zapłać**: kod QR przelewu do zeskanowania w aplikacji bankowej, zobacz [Zapłać](#zapłać)
- [Wystawianie faktur](wystawianie-faktur), od wersji 1.0.5
- Skanowanie kodu QR z portalu, które ustawia adres serwera

## Zapłać

Szczegóły otrzymanej faktury mają dwa przyciski:

- **Zapłać** otwiera stronę **Kod QR przelewu** z kodem QR w standardzie ZBP. Nad kodem jest odbiorca i kwota.
- **Kopiuj dane przelewu** kopiuje do schowka odbiorcę, NIP, numer rachunku, kwotę i tytuł.

Oba przyciski pobierają dane z serwera OpenKSeF, więc wymagają połączenia z internetem. Kod QR i komunikaty są takie same jak w portalu.

### Płatność na tym samym telefonie

Kod QR zeskanujesz aparatem w aplikacji bankowej na innym telefonie. Jeśli bank masz na tym samym telefonie:

1. Na stronie **Kod QR przelewu** naciśnij **Udostępnij / zapisz kod QR** i zapisz obraz, np. w galerii lub plikach.
2. W aplikacji bankowej otwórz płatność kodem QR i wczytaj kod z galerii zamiast skanować aparatem.

OpenKSeF nie otwiera aplikacji bankowej bezpośrednio: banki nie udostępniają takiej możliwości.

### Kiedy nie ma kodu QR

Gdy kod QR byłby błędny, strona pokazuje komunikat z powodem, dane do przelewu i przycisk **Kopiuj dane przelewu**. Najczęstsze powody:

- faktura w innej walucie niż PLN,
- faktura korygująca (korekta), bo jej kwota to różnica,
- brak poprawnego numeru rachunku na fakturze albo numer jeszcze nie został pobrany z KSeF,
- faktura z mechanizmem podzielonej płatności (MPP): zapłać przelewem MPP w banku, komunikat podaje kwotę VAT, NIP sprzedawcy i numer faktury,
- sprzedawca oznaczył fakturę jako zapłaconą (także w częściach) albo faktura wykazuje nadpłatę,
- płatność na rachunek faktora, ale faktura nie podaje nazwy faktora.

Gdy kod QR jest, komunikat nad nim może poprosić o wpisanie kwoty w banku (np. zaliczka, rozliczenie, faktura opłacona w części). Kod ma wtedy kwotę `000000` i kwotę wpisujesz sam. Po aktualizacji serwera starsze nieopłacone faktury mogą tak wyglądać z komunikatem `Nie odczytano jeszcze rozliczeń z tej faktury...`, dopóki serwer nie odczyta ponownie ich pliku XML. Komunikat może też przypomnieć: `Sprawdź, czy faktura nie wymaga podzielonej płatności (MPP).` przy kwocie brutto powyżej 15 000 zł, gdy OpenKSeF nie odczytał jeszcze oznaczenia MPP z faktury. Pełna lista sytuacji i komunikatów: [Otrzymane faktury, Zapłać tę fakturę](faktury#zapłać-tę-fakturę).

Tytuł przelewu w kodzie QR to numer faktury skrócony do 32 znaków. Gdy numer jest dłuższy, komunikat podaje pełny numer: sprawdź tytuł w banku przed wysłaniem.

Z serwerem OpenKSeF starszym niż 0.0.8 aplikacja (od wersji 1.0.6) nie pokazuje kodu QR, tylko komunikat `Kod QR wymaga nowszej wersji serwera. Skopiuj dane przelewu.`

## Podłączenie do serwera

1. Pobierz plik APK z [najnowszego wydania](https://github.com/open-ksef/open-ksef-mobile/releases/latest) i zainstaluj aplikację na urządzeniu.
2. Ustaw adres serwera. Na ekranie logowania naciśnij **Zmień serwer**, wpisz adres (np. `https://twoj-serwer.pl`) i naciśnij **Zapisz**. Możesz też nacisnąć **QR** i zeskanować kod ze strony **Telefon** w portalu. Kod QR ustawia tylko adres serwera, nie loguje.
3. Zaloguj się jednym z przycisków.

<img src="/img/screenshots/mobile/login.png" alt="Ekran logowania aplikacji: Zaloguj się, Załóż konto, Sparuj z portalem, Zaloguj przez Google" width="320" />

| Przycisk | Co robi |
|----------|---------|
| **Zaloguj się** | Otwiera w przeglądarce telefonu stronę logowania OpenKSeF. Login i hasło te same co w portalu |
| **Załóż konto** | Rejestracja na tej samej stronie. Widoczny, gdy serwer pozwala na rejestrację |
| **Sparuj z portalem** | Logowanie kodem zatwierdzonym w portalu, bez wpisywania hasła na telefonie, zobacz [Sparuj z portalem](#sparuj-z-portalem) |
| **Zaloguj przez Google** | Działa, gdy administrator skonfigurował [logowanie Google](logowanie#logowanie-google-oauth-opcjonalne) |

Aplikacja w wersji 1.0.8 i starszej ma formularz loginu i hasła na ekranie logowania. Nadal działa z nowym serwerem.

## Sparuj z portalem

Wymaga aplikacji w wersji 1.0.9 lub nowszej i serwera OpenKSeF v0.0.24 lub nowszego.

1. W aplikacji naciśnij **Sparuj z portalem**. Aplikacja pokazuje kod z 8 liter, np. `ABCD-EFGH`, i czas jego ważności: 5 minut.
2. Na komputerze zaloguj się do portalu i otwórz stronę **Telefon**. W karcie **Zaloguj telefon kodem** wpisz kod i naciśnij **Dalej**. Wielkość liter i myślnik nie mają znaczenia.
3. Portal otwiera stronę logowania OpenKSeF. Jeśli zapyta o hasło, zaloguj się.
4. Strona pyta **Zezwolić na logowanie: Aplikacja mobilna OpenKSeF?**. Wybierz **Tak** tylko wtedy, gdy ten kod widzisz teraz na swoim telefonie.
5. Strona pokazuje **Telefon zalogowany**. Aplikacja sama przechodzi dalej: do listy faktur albo, gdy konto nie ma jeszcze firmy, do dodania firmy.

<img src="/img/screenshots/mobile/pairing-code.png" alt="Aplikacja: kod do wpisania w portalu i czas ważności" width="320" />

![Portal, strona Telefon: karta Zaloguj telefon kodem z ostrzeżeniem](/img/screenshots/portal/mobile-setup.png)

![Strona zatwierdzenia: Zezwolić na logowanie: Aplikacja mobilna OpenKSeF?](/img/screenshots/portal/pairing-consent.png)

![Strona po zatwierdzeniu: Telefon zalogowany](/img/screenshots/portal/pairing-done.png)

:::danger[Wpisuj tylko kod z własnego telefonu]
Kod od innej osoby albo link do strony z kodem to próba przejęcia konta. Po zatwierdzeniu ta osoba dostaje na swoim telefonie dostęp do wszystkich Twoich firm i faktur, także do wystawiania faktur w KSeF, bez Twojego hasła, nawet na rok. Aplikacja nie wysyła kodu ani linku, tylko pokazuje kod na ekranie. Jeśli zatwierdziłeś obcy kod, od razu użyj **Wyloguj wszystkie urządzenia** na stronie **Telefon** w portalu.
:::

Parowanie łączy telefon z Twoim kontem, nie z firmą. Telefon widzi wszystkie firmy, do których masz dostęp w portalu.

### Jak długo telefon jest zalogowany

- Aplikacja zostaje zalogowana po zamknięciu i ponownym uruchomieniu, także po restarcie serwera.
- Logowanie w aplikacji wygasa po 30 dniach bez użycia aplikacji i najpóźniej 365 dni po zalogowaniu. Potem zaloguj się lub sparuj ponownie.
- **Konto** > **Wyloguj się** w aplikacji kończy sesję tego telefonu na serwerze.
- **Wyloguj wszystkie urządzenia** na stronie **Telefon** w portalu wylogowuje aplikację na każdym telefonie i portal we wszystkich przeglądarkach. Aplikacja pokaże `Sesja wygasła` i wróci do ekranu logowania.

### Gdy parowanie się nie udaje

| Komunikat | Przyczyna | Co zrobić |
|-----------|-----------|-----------|
| Aplikacja: `Kod wygasł. Poproś o nowy kod.` | Minęło 5 minut | Naciśnij **Nowy kod** |
| Aplikacja: `Odrzucono parowanie w portalu.` | Na stronie zatwierdzenia wybrano **Nie** | Naciśnij **Nowy kod** |
| Strona logowania: `Nieprawidłowy kod. Spróbuj ponownie.` | Literówka albo kod już użyty | Sprawdź kod na telefonie |
| Aplikacja: `Ten serwer nie obsługuje parowania kodem.` | Serwer starszy niż v0.0.24 albo administrator po aktualizacji nie zapisał **Ustawień** | Zaloguj się przyciskiem **Zaloguj się**. Administrator: [Aktualizacja do v0.0.24](admin-setup#aktualizacja-do-v0024) |
| Aplikacja po parowaniu: `Sesja wygasła. Zaloguj się ponownie.` | Portal był otwarty pod innym adresem niż adres serwera w aplikacji, np. portal pod `http://192.168.1.50:8080`, a aplikacja ustawiona na `https://ksef.twoja-firma.pl`. Serwer przyjmuje tylko logowanie zatwierdzone pod adresem, który ma aplikacja | Otwórz portal pod adresem serwera z aplikacji (aplikacja pokazuje go jako **Serwer** na ekranie logowania, portal pod polem kodu pokazuje swój adres) i sparuj ponownie |

## Wymagania dla Android

Android wymaga **HTTPS** do uwierzytelniania OIDC (WebAuthenticator). Dla programistów, do testów lokalnych, w repozytorium [open-ksef](https://github.com/open-ksef/open-ksef):

1. Użyj [ngrok](https://ngrok.com/) do stworzenia tunelu HTTPS. Tunel udostępnia Twój stack publicznie
2. Skrypt `dev-env-up.ps1` konfiguruje to automatycznie
3. Adres ngrok zmienia się przy każdym uruchomieniu (darmowy plan)

```bash
# Uruchomienie z ngrok (automatycznie)
./scripts/dev-env-up.ps1

# Adres ngrok zostanie wypisany -- użyj go w aplikacji mobilnej
```

## Budowanie z kodu źródłowego

### Wymagania

- .NET 10 SDK
- Workload .NET MAUI (`dotnet workload install maui-android`)
- Android SDK z platformą API 36 (`net10.0-android`); aplikacja działa od Androida 7.0 (API 24)
- Visual Studio 2026 lub VS Code z rozszerzeniem .NET MAUI

### Build

```bash
# Android
dotnet build src/OpenKSeF.Mobile/OpenKSeF.Mobile.csproj -f net10.0-android
```

### Konfiguracja Firebase (opcjonalnie)

Jeśli chcesz własne powiadomienia push na Androidzie:

1. Utwórz projekt Firebase i pobierz `google-services.json`
2. Umieść plik w `src/OpenKSeF.Mobile/Platforms/Android/google-services.json`
3. Build automatycznie włączy Firebase

Bez `google-services.json` aplikacja działa normalnie, ale nie otrzymuje zdalnych push z Firebase. Push przez relay i SignalR działają bez Firebase.

Szczegóły konfiguracji push w [Powiadomienia push](powiadomienia-push).
