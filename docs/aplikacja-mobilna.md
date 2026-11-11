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
- Logowanie przez Keycloak (OIDC)
- Przycisk **Zapłać**: kod QR przelewu do zeskanowania w aplikacji bankowej, zobacz [Zapłać](#zapłać)
- [Wystawianie faktur](wystawianie-faktur), od wersji 1.0.5
- Skanowanie QR do szybkiego połączenia z serwerem

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
- sprzedawca oznaczył fakturę jako zapłaconą albo faktura wykazuje nadpłatę.

Gdy kod QR jest, komunikat nad nim może poprosić o wpisanie kwoty w banku (np. zaliczka, faktura opłacona w części) albo przypomnieć: `Sprawdź, czy faktura nie wymaga podzielonej płatności (MPP).` przy kwocie brutto powyżej 15 000 zł. Pełna lista sytuacji i komunikatów: [Otrzymane faktury, Zapłać tę fakturę](faktury#zapłać-tę-fakturę).

Tytuł przelewu w kodzie QR to numer faktury skrócony do 32 znaków. Gdy numer jest dłuższy, komunikat podaje pełny numer: sprawdź tytuł w banku przed wysłaniem.

Z serwerem starszym niż wymagany aplikacja nie pokazuje kodu QR, tylko komunikat `Kod QR wymaga nowszej wersji serwera. Skopiuj dane przelewu.`

## Podłączenie do self-hosted serwera

1. Pobierz plik APK z [najnowszego wydania](https://github.com/open-ksef/open-ksef-mobile/releases/latest) i zainstaluj aplikację na urządzeniu
2. Na ekranie logowania wprowadź adres serwera (np. `https://twoj-serwer.pl`)
3. Zaloguj się danymi z Keycloak

:::tip[Szybkie połączenie]
W portalu webowym przejdź do strony **Telefon** -- znajdziesz tam kod QR, który możesz zeskanować w aplikacji mobilnej, żeby automatycznie ustawić adres serwera.
:::

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
