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
- Logowanie na stronie logowania OpenKSeF w przeglądarce telefonu albo [parowanie kodem z portalem](#sparuj-z-portalem) bez hasła na telefonie (od wersji 1.0.9)
- Przycisk **Zapłać**: kod QR przelewu do zeskanowania w aplikacji bankowej, zobacz [Zapłać](#zapłać)
- [Wystawianie faktur](wystawianie-faktur), od wersji 1.0.5. Korekty, zaliczki i rozliczenia tylko do podglądu, zobacz [niżej](#korekty-zaliczki-i-rozliczenia)
- Skanowanie kodu QR z portalu, które ustawia adres serwera
- Motyw jak w telefonie: jasny albo ciemny. Zmienisz go w **Konto** > **Motyw**: **System**, **Jasny** albo **Ciemny**

## Zapłać

Szczegóły otrzymanej faktury mają dwa przyciski:

- **Zapłać** otwiera stronę **Kod QR przelewu** z kodem QR w standardzie ZBP. Nad kodem jest odbiorca i kwota.
- **Kopiuj dane przelewu** kopiuje do schowka odbiorcę, NIP, numer rachunku, kwotę i tytuł.

Oba przyciski pobierają dane z serwera OpenKSeF, więc wymagają połączenia z internetem. Kod QR i komunikaty są takie same jak w portalu.

<img src="/img/screenshots/mobile/pay-details.png" alt="Szczegóły faktury: pozycje i przyciski Zapłać oraz Kopiuj dane przelewu" width="320" /> <img src="/img/screenshots/mobile/pay-qr.png" alt="Strona Kod QR przelewu: odbiorca i kwota nad kodem QR, przycisk Udostępnij / zapisz kod QR" width="320" />

### Płatność na tym samym telefonie

Kod QR zeskanujesz aparatem w aplikacji bankowej na innym telefonie. Jeśli bank masz na tym samym telefonie:

1. Na stronie **Kod QR przelewu** naciśnij **Udostępnij / zapisz kod QR** i zapisz obraz, np. w galerii lub plikach.
2. W aplikacji bankowej otwórz płatność kodem QR i wczytaj kod z galerii zamiast skanować aparatem.
3. Po zapłacie usuń obraz z galerii.

Od wersji 1.0.11 aplikacji zapisany obraz ma pod kodem numer faktury, kwotę i odbiorcę, a nazwa pliku to `QR <numer faktury>.png`. Dzięki temu w galerii odróżnisz kody różnych faktur. Kod QR na ekranie się nie zmienia. Strona pokazuje podpowiedź:

> Zeskanuj kod w aplikacji banku, aby wypełnić przelew. Na tym telefonie: udostępnij i zapisz obraz, a w banku wczytaj kod z galerii. Obraz ma numer faktury i kwotę. Po zapłacie usuń go z galerii.

OpenKSeF nie otwiera aplikacji bankowej bezpośrednio: banki nie udostępniają takiej możliwości.

### Kiedy nie ma kodu QR

Gdy kod QR byłby błędny, strona pokazuje komunikat z powodem, dane do przelewu i przycisk **Kopiuj dane przelewu**. Najczęstsze powody:

- faktura w innej walucie niż PLN,
- faktura korygująca (korekta), bo jej kwota to różnica,
- brak poprawnego numeru rachunku na fakturze albo numer jeszcze nie został pobrany z KSeF,
- faktura z mechanizmem podzielonej płatności (MPP): zapłać przelewem MPP w banku, komunikat podaje kwotę VAT, NIP sprzedawcy i numer faktury,
- sprzedawca oznaczył fakturę jako zapłaconą (także w częściach) albo faktura wykazuje nadpłatę,
- płatność na rachunek faktora, ale faktura nie podaje nazwy faktora.

<img src="/img/screenshots/mobile/pay-no-qr.png" alt="Strona Kod QR przelewu bez kodu: komunikat Brak poprawnego numeru rachunku na fakturze, dane do przelewu i przycisk Kopiuj dane przelewu" width="320" />

Gdy kod QR jest, komunikat nad nim może poprosić o wpisanie kwoty w banku (np. zaliczka, rozliczenie, faktura opłacona w części). Kod ma wtedy kwotę `000000` i kwotę wpisujesz sam. Po aktualizacji serwera starsze nieopłacone faktury mogą tak wyglądać z komunikatem `Nie odczytano jeszcze rozliczeń z tej faktury...`, dopóki serwer nie odczyta ponownie ich pliku XML. Komunikat może też przypomnieć: `Sprawdź, czy faktura nie wymaga podzielonej płatności (MPP).` przy kwocie brutto powyżej 15 000 zł, gdy OpenKSeF nie odczytał jeszcze oznaczenia MPP z faktury. Pełna lista sytuacji i komunikatów: [Otrzymane faktury, Zapłać tę fakturę](faktury#zapłać-tę-fakturę).

Tytuł przelewu w kodzie QR to numer faktury skrócony do 32 znaków. Gdy numer jest dłuższy, komunikat podaje pełny numer: sprawdź tytuł w banku przed wysłaniem.

Z serwerem OpenKSeF starszym niż 0.0.8 aplikacja (od wersji 1.0.6) nie pokazuje kodu QR, tylko komunikat `Kod QR wymaga nowszej wersji serwera. Skopiuj dane przelewu.`

## Korekty, zaliczki i rozliczenia

Faktury korygujące, zaliczkowe, rozliczające i ich korekty wystawisz tylko w portalu: [Faktury korygujące](korekty), [Zaliczki i rozliczenia](zaliczki-i-rozliczenia).

Od wersji 1.0.13 aplikacja pokazuje je w zakładce **Wystawione** tylko do podglądu:

- Lista: rodzaj dokumentu przy numerze i kwota, przy korekcie ze znakiem.
- Szczegóły: rodzaj, kwota z podpisem **Kwota korekty**, **Kwota zaliczki** albo **Do zapłaty**, odnośnik do faktury korygowanej i przyczyna korekty, wiersze przed i po korekcie, rozliczone zaliczki oraz zamówienie albo lista korekt.
- Nie ma przycisków **Wystaw i wyślij**, **Edytuj**, **Usuń szkic** ani kopiowania. **Koryguj w portalu** albo **Edytuj w portalu** otwiera dokument w portalu.

Starsze wersje pokazują te dokumenty jak zwykłe faktury VAT: bez rodzaju dokumentu, bez wierszy przed i po korekcie i bez rozliczonych zaliczek. Zaktualizuj aplikację. Szkicu takiego dokumentu nie zapiszesz ani nie wyślesz ze starszej wersji: serwer odrzuci zmianę.

## Podłączenie do serwera

1. Pobierz plik APK z [najnowszego wydania](https://github.com/open-ksef/open-ksef-mobile/releases/latest) i zainstaluj aplikację na urządzeniu.
2. Ustaw adres serwera. Na ekranie logowania naciśnij **Zmień serwer**, wpisz adres (np. `https://twoj-serwer.pl`) i naciśnij **Zapisz**. Możesz też nacisnąć **QR** i zeskanować kod ze strony **Telefon** w portalu. Kod QR ustawia tylko adres serwera, nie loguje.
3. Zaloguj się jednym z przycisków.

<img src="/img/screenshots/mobile/login.png" alt="Ekran logowania aplikacji: Zaloguj się, Załóż konto, Sparuj z portalem, Zaloguj przez Google" width="320" />

Ekran logowania w wersji 1.0.9:

| Przycisk | Co robi |
|----------|---------|
| **Zaloguj się** | Otwiera w przeglądarce telefonu stronę logowania OpenKSeF. Login i hasło te same co w portalu. Konto z [weryfikacją dwuetapową](weryfikacja-dwuetapowa) wpisuje tam kod z aplikacji uwierzytelniającej albo kod zapasowy. Konto bez weryfikacji ustawia ją na tej stronie, jak w portalu |
| **Załóż konto** | Rejestracja na tej samej stronie. Widoczny, gdy serwer pozwala na rejestrację |
| **Sparuj z portalem** | Logowanie kodem zatwierdzonym w portalu, bez wpisywania hasła na telefonie, zobacz [Sparuj z portalem](#sparuj-z-portalem) |
| **Zaloguj przez Google** | Działa, gdy administrator skonfigurował [logowanie Google](logowanie#logowanie-google-oauth-opcjonalne), a serwer ma adres https:// |

Po zalogowaniu aplikacja pyta, czy chcesz dostawać powiadomienia, zobacz [Powiadomienia](#powiadomienia).

### Aplikacja 1.0.8 i starsza

Te wersje mają na ekranie logowania własny formularz e-maila i hasła, bez pola na kod z aplikacji uwierzytelniającej i bez przycisku **Sparuj z portalem**. Zaktualizuj aplikację do 1.0.9.

:::warning[Weryfikacja dwuetapowa w aplikacji 1.0.8]
Od serwera v0.0.27 konto z hasłem włącza [weryfikację dwuetapową](weryfikacja-dwuetapowa) przy najbliższym logowaniu do portalu. Potem to konto nie zaloguje się hasłem w aplikacji 1.0.8: aplikacja pokaże `Nieprawidłowy email lub hasło.` Każda taka próba liczy się do [blokady po nieudanych logowaniach](logowanie#blokada-po-nieudanych-logowaniach), więc kolejne próby czasowo zablokują konto, także w portalu. Nie ponawiaj prób. Zaktualizuj aplikację do 1.0.9 albo zaloguj się przez Google, jeśli administrator go skonfigurował, a serwer ma adres https://. Telefon zalogowany wcześniej zostaje zalogowany.
:::

Karta **Zaloguj telefon kodem** na stronie **Telefon** w portalu nie działa z aplikacją 1.0.8.

## Sparuj z portalem

Wymaga aplikacji w wersji 1.0.9 lub nowszej i serwera OpenKSeF v0.0.27 lub nowszego, na którym administrator po aktualizacji zapisał **Ustawienia**.

1. W aplikacji naciśnij **Sparuj z portalem**. Aplikacja pokazuje kod z 8 liter, np. `ABCD-EFGH`, i czas jego ważności: 5 minut.

<img src="/img/screenshots/mobile/pairing-code.png" alt="Aplikacja, ekran Sparuj z portalem: kod z 8 liter i czas ważności" width="320" />
2. Na komputerze zaloguj się do portalu i otwórz stronę **Telefon**. W karcie **Zaloguj telefon kodem** wpisz kod i naciśnij **Dalej**. Wielkość liter i myślnik nie mają znaczenia.
3. Portal otwiera stronę logowania OpenKSeF. Jeśli zapyta o hasło i kod, zaloguj się.
4. Strona pyta **Zalogować telefon?**. Wybierz **Tak** tylko wtedy, gdy ten kod widzisz teraz na swoim telefonie.
5. Strona pokazuje **Telefon zalogowany**. Aplikacja sama przechodzi dalej: do listy faktur albo, gdy konto nie ma jeszcze firmy, do dodania firmy.

![Strona Zalogować telefon? z przyciskami Tak, zaloguj telefon i Nie](/img/screenshots/portal/pairing-consent.png)

![Strona Telefon zalogowany: wróć do telefonu](/img/screenshots/portal/pairing-done.png)

![Portal, strona Telefon: karta Zaloguj telefon kodem z ostrzeżeniem](/img/screenshots/portal/mobile-setup.png)

:::danger[Wpisuj tylko kod z własnego telefonu]
Kod od innej osoby albo link do strony z kodem to próba przejęcia konta. Po zatwierdzeniu ta osoba dostaje na swoim telefonie dostęp do wszystkich Twoich firm i faktur, także do wystawiania faktur w KSeF, bez Twojego hasła, nawet na rok. Aplikacja nie wysyła kodu ani linku, tylko pokazuje kod na ekranie. Jeśli zatwierdziłeś obcy kod, od razu użyj **Wyloguj wszystkie urządzenia** na stronie **Telefon** w portalu.
:::

Parowanie łączy telefon z Twoim kontem, nie z firmą. Telefon widzi wszystkie firmy, do których masz dostęp w portalu.

### Adres serwera i adres portalu

Serwer wydaje logowanie telefonu dla adresu, pod którym zatwierdzono kod, i przyjmuje je tylko pod tym adresem. Jeśli serwer jest dostępny pod kilkoma adresami, np. `http://192.168.1.50:8080` w sieci lokalnej i `https://ksef.twoja-firma.pl` z internetu, otwórz portal pod tym samym adresem, który aplikacja ma ustawiony jako serwer. Aplikacja pokazuje go jako **Serwer** na ekranie logowania, a portal pod polem kodu pokazuje adres, którego oczekuje. Kod zatwierdzony pod innym adresem kończy się komunikatem `Sesja wygasła. Zaloguj się ponownie.`

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
| Strona logowania: `Nieprawidłowy kod. Sprawdź litery i spróbuj ponownie.` | Literówka albo kod już użyty | Sprawdź kod na telefonie |
| Aplikacja: `Ten serwer nie obsługuje parowania kodem. Wróć i zaloguj się przyciskiem Zaloguj się.` | Serwer starszy niż v0.0.27 albo administrator po aktualizacji nie zapisał **Ustawień** | Zaloguj się przyciskiem **Zaloguj się**. Administrator: [Aktualizacja do v0.0.27](admin-setup#aktualizacja-do-v0027-nowe-strony-logowania-i-weryfikacja-dwuetapowa) |
| Aplikacja po parowaniu: `Sesja wygasła. Zaloguj się ponownie.` | Portal był otwarty pod innym adresem niż adres serwera w aplikacji, zobacz [Adres serwera i adres portalu](#adres-serwera-i-adres-portalu) | Otwórz portal pod adresem serwera z aplikacji i sparuj ponownie |

## Powiadomienia

Od wersji 1.0.9 aplikacja nie rejestruje telefonu do powiadomień, dopóki konto się nie zgodzi:

- Po zalogowaniu (konto bez firmy: po dodaniu pierwszej firmy) aplikacja raz pyta: „Czy chcesz dostawać powiadomienia o nowych fakturach? Telefon pokaże sprzedawcę i kwotę, gdy faktura trafi do KSeF. Zmienisz to w zakładce Konto.” Przyciski: **Tak** i **Nie teraz**.
- Dopiero po **Tak** Android pyta o zgodę na powiadomienia, a aplikacja rejestruje telefon na serwerze.
- Wybór dotyczy konta na tym telefonie. Inne konto zalogowane na tym telefonie dostanie własne pytanie. Zmienisz go w **Konto** > **Powiadomienia push**.
- Wylogowanie usuwa telefon z serwera. Po ponownym zalogowaniu tym samym kontem aplikacja nie pyta drugi raz i stosuje zapamiętany wybór.
- Aktualizacja z 1.0.8 zachowuje dotychczasowe ustawienie: przypisuje je pierwszemu kontu zalogowanemu po aktualizacji. Telefon z wyłączonymi powiadomieniami zostaje bez nich, a zarejestrowany zostaje zarejestrowany.

Więcej: [Powiadomienia push](powiadomienia-push#zgoda-na-powiadomienia-w-aplikacji).

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
