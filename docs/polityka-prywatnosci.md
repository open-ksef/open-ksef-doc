---
sidebar_position: 10
title: Polityka prywatności
---

# Polityka prywatności

*Ostatnia aktualizacja: 18 listopada 2026 r.*

OpenKSeF to oprogramowanie z publicznie dostępnym kodem źródłowym do synchronizacji i przeglądania faktur z Krajowego Systemu e-Faktur (KSeF) oraz do wystawiania faktur. Ta polityka opisuje, jakie dane są przetwarzane w instancji OpenKSeF i jak są chronione.

---

## 1. Administrator danych

Administratorem danych osobowych jest właściciel instancji OpenKSeF, z której korzystasz. Każda wdrożona instancja ma swojego właściciela i działa niezależnie od innych.

Właściciel instancji podaje swoim użytkownikom swoją nazwę i dane kontaktowe. W portalu instancji znajdziesz je na stronie **Prywatność** pod adresem `/privacy`, np. `https://faktury.firma.pl/privacy` (link w stopce portalu). Jeśli ich nie znasz, zapytaj osobę, która dała Ci dostęp. Autorzy OpenKSeF nie mają dostępu do instancji, których sami nie prowadzą.

W sklepie Google Play aplikację OpenKSeF publikuje **Krystian Mikrut**. Wydawca aplikacji nie staje się przez to administratorem danych w instancjach, których nie prowadzi.

Jeśli jesteś nabywcą i Twoje dane znalazły się na fakturze wystawionej w OpenKSeF lub pobranej z KSeF, w sprawie tych danych skontaktuj się ze sprzedawcą.

---

## 2. Jakie dane zbieramy

### Dane konta użytkownika

- Adres e-mail (do logowania i powiadomień)
- Imię i nazwisko (opcjonalne przy rejestracji e-mailem; przy logowaniu przez Google pochodzą z konta Google)
- Identyfikator użytkownika w systemie Keycloak (OIDC)
- Kopia adresu e-mail, imienia i nazwiska oraz informacji, czy adres e-mail jest potwierdzony. Instancja zapisuje ją z danych logowania i odświeża przy korzystaniu z portalu i aplikacji, aby osoby z dostępem do tej samej firmy widziały Twoje imię i nazwisko zamiast identyfikatora
- Firmy, do których masz dostęp, Twoja rola w każdej z nich i ustawienie powiadomień o nowych fakturach dla każdej firmy

### Dane firmowe

- NIP (Numer Identyfikacji Podatkowej)
- Nazwa firmy (nazwa wyświetlana)
- Token autoryzacyjny KSeF lub certyfikat KSeF z kluczem prywatnym (zaszyfrowane)
- Adres e-mail do powiadomień o nowych fakturach (opcjonalny, ustawiany osobno dla każdej firmy; może należeć do innej osoby, np. księgowej)

### Dane faktur otrzymanych

- Dane faktur pobrane z KSeF: nagłówek (numer, kwoty, daty, dane kontrahentów, numer rachunku sprzedawcy) i pozycje faktury (nazwa towaru lub usługi, ilość, ceny, stawka VAT)
- Dane faktora (NIP, nazwa, numer rachunku), oznaczenia płatności z faktury (MPP, zapłata)
- Status płatności faktury, data jego ustawienia i identyfikator osoby, która go ustawiła
- Faktury są przechowywane w bazie danych instancji

### Dane faktur sprzedaży

- Dane faktur sprzedaży pobrane z KSeF, także wystawionych w innym programie: numer, kwoty, daty i dane nabywcy oraz pozycje faktury.

### Dane faktur wystawionych

- Dane sprzedawcy: NIP, nazwa, adres, numer rachunku
- Dane nabywcy. Firma: NIP, nazwa, adres. Osoba prywatna: imię i nazwisko lub nazwa oraz adres, bez NIP
- Nabywca zagraniczny: kraj, numer VAT UE lub numer podatkowy. Waluta i kurs. Rachunek zagraniczny sprzedawcy: IBAN, SWIFT, nazwa banku
- Numer faktury, daty, kwoty i pozycje faktury
- Po wysłaniu: plik XML, numer KSeF, UPO lub powód odrzucenia

### Historia zmian w firmie

- Kto (identyfikator, adres e-mail oraz imię i nazwisko z chwili zdarzenia), kiedy i co zrobił: oznaczenie faktury jako opłaconej lub nieopłaconej, zapisanie lub usunięcie tokenu albo certyfikatu KSeF, zaproszenie, ponowne wysłanie, odwołanie i przyjęcie zaproszenia, nadanie dostępu, zmiana roli, usunięcie z firmy lub jej opuszczenie, usunięcie adresu e-mail do powiadomień, wraz z osobą, której to dotyczy (identyfikator, adres e-mail albo oba)
- Reset weryfikacji dwuetapowej przez administratora instancji: kto go wykonał i czyje konto dotyczył (identyfikatory i adresy e-mail)
- Historia nie jest widoczna w portalu ani aplikacji. Może ją odczytać właściciel instancji z bazy danych

### Zaproszenia do firmy

- Adres e-mail osoby zaproszonej, wpisany przez zapraszającego, rola, kto zaprosił, kto przyjął zaproszenie, daty utworzenia, wygaśnięcia i przyjęcia
- Link z zaproszeniem jest ważny 14 dni i działa raz. Instancja przechowuje tylko skrót (hash) kodu z linku, nie sam link
- Jeśli instancja ma skonfigurowaną pocztę, zaproszona osoba dostaje e-mail z linkiem albo z informacją o nadanym dostępie

### Dane techniczne

- Token urządzenia (FCM/APNs) albo identyfikator urządzenia wygenerowany przez aplikację, gdy tokenu nie ma — do dostarczania powiadomień push
- Identyfikator instalacji Firebase, wersja aplikacji i identyfikator klienta (user agent) — zbiera je biblioteka Firebase w aplikacji na Androida
- Identyfikator i adres instancji — do rejestracji w usłudze relay push

---

## 3. Cel przetwarzania danych

| Dane | Cel | Podstawa prawna |
|------|-----|-----------------|
| E-mail, imię i nazwisko (jeśli podane), identyfikator OIDC | Uwierzytelnianie i obsługa konta | Umowa (art. 6 ust. 1 lit. b RODO) |
| NIP, nazwa firmy, token lub certyfikat KSeF | Synchronizacja faktur z KSeF | Umowa (art. 6 ust. 1 lit. b RODO) |
| Dane faktur, status płatności | Wyświetlanie i przeszukiwanie faktur, dane do przelewu | Umowa (art. 6 ust. 1 lit. b RODO) |
| Dane wystawionej faktury, w tym nabywcy będącego osobą prywatną | Wystawienie faktury i wysłanie jej do KSeF | Obowiązek prawny (art. 6 ust. 1 lit. c RODO, art. 106e ustawy o VAT) |
| Kopia wystawionej faktury w instancji | Podgląd faktury, pobieranie plików, wyjaśnienie numeracji | Prawnie uzasadniony interes sprzedawcy (art. 6 ust. 1 lit. f RODO) |
| Token i identyfikator urządzenia, identyfikator instalacji Firebase, wersja aplikacji, identyfikator klienta | Dostarczanie powiadomień push | Zgoda (art. 6 ust. 1 lit. a RODO) |
| Adres e-mail do powiadomień (per firma) | Wysyłanie powiadomień e-mail o nowych fakturach | Umowa (art. 6 ust. 1 lit. b RODO) |
| Kopia e-maila, imienia i nazwiska, role i dostęp do firm | Pokazanie, kto ma dostęp do firmy i kto oznaczył fakturę jako opłaconą; kontrola uprawnień | Umowa (art. 6 ust. 1 lit. b RODO) |
| Historia zmian w firmie | Ustalenie, kto i kiedy zmienił status płatności, token KSeF lub dostęp do firmy, oraz bezpieczeństwo konta | Prawnie uzasadniony interes właściciela firmy i instancji (art. 6 ust. 1 lit. f RODO) |
| Zaproszenia do firmy | Nadanie dostępu do firmy osobie wskazanej przez zapraszającego; ochrona przed nadużyciem (limit zaproszeń) | Prawnie uzasadniony interes właściciela firmy (art. 6 ust. 1 lit. f RODO) |

---

## 4. Powiadomienia push i usługa relay

Aplikacja mobilna OpenKSeF obsługuje powiadomienia push w modelu warstwowym:

1. **SignalR (lokalne)** — bezpośrednie połączenie WebSocket z Twoją instancją. Żadne dane nie opuszczają serwera.
2. **Relay OpenKSeF** — Twoja instancja wysyła powiadomienie do serwera relay (`push.open-ksef.pl`), który przekazuje je do urządzenia przez Firebase Cloud Messaging (Android) lub Apple Push Notification service (iOS). Relay przetwarza wyłącznie: identyfikator i adres instancji, token urządzenia i treść powiadomienia. Przy nowej fakturze treść to nazwa sprzedawcy, kwota i waluta faktury oraz identyfikatory firmy i faktury w OpenKSeF. Gdy nowych faktur jest więcej, podsumowanie zawiera nazwę firmy i liczbę nowych faktur. Gdy wystawiona faktura czeka na wyjaśnienie w KSeF, treść zawiera jej numer oraz identyfikatory firmy i faktury. Gdy ktoś nada Ci dostęp do firmy, treść zawiera nazwę i identyfikator tej firmy.
3. **Bezpośrednie FCM/APNs** — jeśli właściciel instancji skonfigurował własny projekt Firebase, powiadomienia są wysyłane bezpośrednio, bez udziału relay.

Relay `push.open-ksef.pl` prowadzą autorzy OpenKSeF. Administratorem danych w powiadomieniu jest właściciel instancji, z której ono pochodzi.

Od wersji 1.0.6 aplikacji push wyłączysz na ekranie **Konto** przełącznikiem **Powiadomienia push**. Aplikacja usuwa wtedy to urządzenie z serwera i instancja przestaje wysyłać na nie push. Ustawienie dotyczy tego telefonu i zostaje po wylogowaniu. Szczegóły: [Wyłączanie powiadomień w aplikacji](powiadomienia-push#wyłączanie-powiadomień-w-aplikacji).

W wersjach do 1.0.5 przełącznik nie wyłącza powiadomień, a aplikacja rejestruje urządzenie po każdym zalogowaniu. Aby przestać je otrzymywać, zaktualizuj aplikację albo wybierz jeden ze sposobów:

- Wyloguj się z aplikacji i usuń urządzenie w portalu: **Telefon** > **Moje urządzenia**. Przy następnym logowaniu urządzenie zarejestruje się ponownie.
- Wyłącz powiadomienia dla aplikacji OpenKSeF w ustawieniach telefonu. Telefon przestanie je pokazywać, ale instancja może je nadal wysyłać.

---

## 5. Udostępnianie danych

- OpenKSeF **nie przekazuje** danych reklamodawcom ani firmom analitycznym.
- Dane mogą być przekazywane do:
  - **Ministerstwo Finansów, KSeF** — NIP i token lub certyfikat KSeF, w celu pobierania faktur, oraz wystawione faktury z danymi nabywcy, w celu wystawienia faktury w KSeF.
  - **Ministerstwo Finansów, wykaz podatników VAT (biała lista)** — NIP wpisany przy użyciu przycisku **Pobierz z NIP**.
  - **Firebase Cloud Messaging (Google)** — token urządzenia i treść powiadomienia (nazwa sprzedawcy, kwota, identyfikatory firmy i faktury, a przy wystawionej fakturze czekającej na wyjaśnienie w KSeF jej numer i identyfikatory; przy nadaniu dostępu nazwa i identyfikator firmy; gdy nowych faktur jest więcej, podsumowanie zawiera nazwę firmy i liczbę nowych faktur), w celu dostarczenia powiadomień push na Androida. Biblioteka Firebase w aplikacji przekazuje też Google identyfikator instalacji Firebase, wersję aplikacji i identyfikator klienta (user agent).
  - **Apple Push Notification service (Apple)** — token urządzenia i treść powiadomienia, jak wyżej, w celu dostarczenia powiadomień push na iOS.
  - **Serwer SMTP wybrany przez właściciela instancji** — adres e-mail do powiadomień i treść powiadomienia o nowej fakturze (gdy nowych faktur jest więcej, podsumowanie zawiera nazwę firmy i liczbę nowych faktur), a przy zaproszeniu do firmy adres osoby zaproszonej, nazwę i NIP firmy, rolę, nazwę zapraszającego i link, jeśli właściciel skonfigurował SMTP.
  - **Relay OpenKSeF** (`push.open-ksef.pl`) — jeśli włączona jest warstwa relay (domyślnie).
- Osoby z dostępem do tej samej firmy widzą, kto oznaczył fakturę jako opłaconą (imię i nazwisko lub adres e-mail). Właściciel i administrator firmy widzą też imiona i nazwiska, adresy e-mail i role osób z dostępem oraz adresy z oczekujących zaproszeń.

---

## 6. Przechowywanie danych

- Dane są przechowywane na serwerze właściciela instancji.
- OpenKSeF nie usuwa automatycznie danych firm ani faktur. Dane te zostają do czasu, gdy użytkownik usunie firmę albo właściciel instancji usunie je na żądanie lub z własnej decyzji.
- Firmę można usunąć razem z jej wystawionymi fakturami, chyba że ma fakturę w statusie **Wysyłanie** albo fakturę przyjętą na środowisku PRODUKCJA. O usunięcie danych takiej firmy poproś właściciela instancji.
- Faktura przyjęta na środowisku PRODUKCJA jest przechowywana w KSeF przez 10 lat, licząc od końca roku, w którym ją wystawiono ([art. 112aa ust. 1 ustawy o VAT, Dz.U. 2026 poz. 1263](https://api.sejm.gov.pl/eli/acts/DU/2026/1263/text.pdf)). Usunięcie firmy w OpenKSeF nie usuwa niczego z KSeF.
- Usunięcie firmy nie obejmuje kopii zapasowych właściciela instancji ani lokalnej kopii faktur w aplikacji mobilnej.
- Aplikacja mobilna przechowuje lokalną kopię faktur w bazie SQLite w prywatnym katalogu aplikacji na urządzeniu, bez dodatkowego szyfrowania.
- Tokeny i certyfikaty KSeF (z kluczem prywatnym) są szyfrowane w bazie danych (AES-256-GCM).
- Kopia e-maila, imienia i nazwiska jest przechowywana, dopóki nie usuniemy konta (sekcja 8). Dostęp do firmy znika po jej opuszczeniu, usunięciu z firmy albo usunięciu firmy.
- Zaproszenia, także wygasłe, odwołane i przyjęte, są przechowywane, dopóki istnieje firma. Usunięcie firmy usuwa jej zaproszenia.
- Logi techniczne serwera mają ograniczony rozmiar i nadpisują się same. Szczegóły w sekcji 8.
- Historia zmian w firmie zostaje, dopóki istnieje firma. Nie ma ustalonego terminu jej usunięcia. Po usunięciu firmy jej historia zostaje już bez powiązania z nią, razem z identyfikatorami, imionami i nazwiskami oraz adresami e-mail osób, które w niej występują. Wpisy bez powiązania z firmą, czyli historia usuniętych firm i historia resetów weryfikacji dwuetapowej, są usuwane automatycznie po 12 miesiącach od zdarzenia, nie od usunięcia firmy. Wpisy starsze niż 12 miesięcy znikają więc wkrótce po usunięciu firmy. Wcześniej historię usuwa właściciel instancji na żądanie (sekcja 8) albo z własnej decyzji.

---

## 7. Twoje prawa

Zgodnie z RODO przysługują Ci następujące prawa:

- **Dostęp** — możesz sprawdzić, jakie dane są przechowywane
- **Sprostowanie** — możesz poprawić nieprawidłowe dane
- **Usunięcie** — możesz zażądać usunięcia konta i danych, zobacz <a href="#usuwanie-konta">Usuwanie konta i danych</a>
- **Przenoszenie** — przy każdej wystawionej fakturze przyjętej w KSeF możesz pobrać XML, UPO i PDF. OpenKSeF nie ma eksportu zbiorczego ani pobierania plików faktur otrzymanych. O pozostałe dane poproś właściciela instancji
- **Sprzeciw** — możesz sprzeciwić się przetwarzaniu opartemu na prawnie uzasadnionym interesie
- **Cofnięcie zgody** — możesz w dowolnym momencie przestać otrzymywać powiadomienia push: od wersji 1.0.6 aplikacji przełącznikiem **Powiadomienia push** na ekranie **Konto**, w starszych wersjach w sposób opisany w sekcji 4
- **Skarga** — możesz wnieść skargę do Prezesa Urzędu Ochrony Danych Osobowych

Skargę wnosisz bezpośrednio do Prezesa UODO. W pozostałych sprawach skontaktuj się z właścicielem swojej instancji OpenKSeF.

---

<a id="usuwanie-konta" style={{scrollMarginTop: '5rem'}}></a>

## 8. Usuwanie konta i danych

Aby usunąć konto w OpenKSeF i powiązane z nim dane, wyślij prośbę e-mailem. Nie potrzebujesz do tego aplikacji.

1. Jeśli dostęp do OpenKSeF dała Ci firma lub osoba prowadząca własną instancję, napisz do niej. Autorzy OpenKSeF nie mogą usunąć konta w instancji, której sami nie prowadzą.
2. Jeśli korzystasz z instancji prowadzonej przez autorów OpenKSeF albo nie wiesz, czyja to instancja, napisz na [krystian@mikrut.dev](mailto:krystian@mikrut.dev) z adresu e-mail konta, w temacie „Usunięcie konta OpenKSeF”.

Prośby realizujemy ręcznie. Odpowiadamy w ciągu miesiąca.

**Co usuwamy:** konto (e-mail, imię i nazwisko, identyfikator) i jego kopię w instancji, dostęp do firm innych osób, zarejestrowane urządzenia oraz firmy dodane z tego konta z tokenem lub certyfikatem KSeF, fakturami otrzymanymi, danymi do faktur, fakturami wystawionymi i zaproszeniami, z wyjątkami poniżej. Jeśli z takiej firmy korzystają też inne osoby albo jesteś jedynym właścicielem firmy, z której korzystają inni, przed usunięciem skontaktujemy się z Tobą: usunięcie firmy odebrałoby ją także im. Usuwamy też firmy dodane z innego konta, do których nikt poza Tobą nie ma dostępu, z tymi samymi danymi i wyjątkami. Przed usunięciem wymienimy je w osobnej wiadomości i usuniemy je dopiero po Twoim potwierdzeniu.

**Zaproszenie bez konta:** jeśli ktoś zaprosił Twój adres e-mail, a nie masz konta, możesz poprosić o usunięcie zaproszenia i Twojego adresu z historii zmian firmy, tak samo jak o usunięcie konta.

**Co może zostać:**

- Faktura przyjęta na środowisku PRODUKCJA zostaje w KSeF przez okres podany w sekcji 6. Nikt nie może jej stamtąd usunąć. Jej kopię w instancji możemy zachować razem z danymi firmy, do której należy (NIP, nazwa, dane sprzedawcy), i napiszemy o tym w odpowiedzi.
- W historii zmian (sekcja 2), także firm usuniętych razem z kontem, zostają czynność, data i jej przedmiot (np. rola, identyfikator faktury), bez Twojego identyfikatora, imienia i nazwiska oraz adresu e-mail, także jako osoby zaproszonej lub usuniętej z firmy. Faktura oznaczona przez Ciebie jako opłacona zostaje opłacona, bez informacji, kto ją oznaczył.
- Dane w kopiach zapasowych właściciela instancji, do czasu usunięcia tych kopii.
- Logi techniczne serwera. Mogą zawierać Twój identyfikator, adres e-mail, NIP firmy, adres IP i adresy otwieranych stron. Nie usuwamy z nich pojedynczych wpisów. W instancji prowadzonej przez autorów OpenKSeF każda usługa OpenKSeF trzyma najwyżej 30 MB logów, a nowe wpisy zastępują najstarsze. W usługach, które zapisują najwięcej (API i synchronizacja faktur), wpisy znikają po kilku godzinach do kilku dni. Usługi, które zapisują mało, np. logowanie, mogą je trzymać dłużej, najdłużej do aktualizacji tej usługi. Limit nie obejmuje serwera pośredniczącego, który kieruje ruch do instancji. W innych instancjach o okres przechowywania logów zapytaj ich właściciela.
- Korespondencja w sprawie usunięcia konta. Prośbę, potwierdzenie i naszą odpowiedź przechowujemy przez 1 rok od wysłania odpowiedzi, aby móc wykazać, że prośbę zrealizowaliśmy. Potem ją usuwamy.
- Lokalna kopia faktur na telefonie. Usuniesz ją, odinstalowując aplikację. Może ją też zawierać kopia zapasowa Androida na Twoim koncie Google i wrócić po ponownej instalacji.

---

## 9. Bezpieczeństwo

- Komunikacja między aplikacją a serwerem odbywa się przez HTTPS.
- Tokeny autoryzacyjne i certyfikaty KSeF (z kluczem prywatnym) są szyfrowane w bazie danych.
- Uwierzytelnianie oparte na OpenID Connect (Keycloak).
- Kod źródłowy jest publicznie dostępny i można go sprawdzić na [GitHubie](https://github.com/open-ksef).

---

## 10. Zmiany w polityce prywatności

O istotnych zmianach w polityce prywatności poinformujemy przez aktualizację tej strony. Data ostatniej aktualizacji znajduje się na górze dokumentu.

---

## 11. Kontakt

W sprawach tej strony i usługi relay:

- E-mail: [krystian@mikrut.dev](mailto:krystian@mikrut.dev)
- GitHub: [github.com/open-ksef](https://github.com/open-ksef)
