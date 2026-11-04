---
sidebar_position: 10
title: Polityka prywatności
---

# Polityka prywatności

*Ostatnia aktualizacja: 4 listopada 2026 r.*

OpenKSeF to oprogramowanie z publicznie dostępnym kodem źródłowym do synchronizacji i przeglądania faktur z Krajowego Systemu e-Faktur (KSeF) oraz do wystawiania faktur. Ta polityka opisuje, jakie dane są przetwarzane w instancji OpenKSeF i jak są chronione.

---

## 1. Administrator danych

Administratorem danych osobowych jest właściciel instancji OpenKSeF, z której korzystasz. Każda wdrożona instancja ma swojego właściciela i działa niezależnie od innych.

Właściciel instancji podaje swoim użytkownikom swoją nazwę i dane kontaktowe. Jeśli ich nie znasz, zapytaj osobę, która dała Ci dostęp. Autorzy OpenKSeF nie mają dostępu do instancji, których sami nie prowadzą.

W sklepie Google Play aplikację OpenKSeF publikuje **Krystian Mikrut**. Wydawca aplikacji nie staje się przez to administratorem danych w instancjach, których nie prowadzi.

Jeśli jesteś nabywcą i Twoje dane znalazły się na fakturze wystawionej w OpenKSeF lub pobranej z KSeF, w sprawie tych danych skontaktuj się ze sprzedawcą.

---

## 2. Jakie dane zbieramy

### Dane konta użytkownika

- Adres e-mail (do logowania i powiadomień)
- Imię i nazwisko (opcjonalne przy rejestracji e-mailem; przy logowaniu przez Google pochodzą z konta Google)
- Identyfikator użytkownika w systemie Keycloak (OIDC)

### Dane firmowe

- NIP (Numer Identyfikacji Podatkowej)
- Nazwa firmy (nazwa wyświetlana)
- Token autoryzacyjny KSeF lub certyfikat KSeF z kluczem prywatnym (zaszyfrowane)
- Adres e-mail do powiadomień o nowych fakturach (opcjonalny, ustawiany osobno dla każdej firmy; może należeć do innej osoby, np. księgowej)

### Dane faktur otrzymanych

- Dane faktur pobrane z KSeF: nagłówek (numer, kwoty, daty, dane kontrahentów, numer rachunku sprzedawcy) i pozycje faktury (nazwa towaru lub usługi, ilość, ceny, stawka VAT)
- Status płatności faktury ustawiony przez użytkownika
- Faktury są przechowywane w bazie danych instancji

### Dane faktur sprzedaży

- Dane faktur sprzedaży pobrane z KSeF, także wystawionych w innym programie: numer, kwoty, daty i dane nabywcy.

### Dane faktur wystawionych

- Dane sprzedawcy: NIP, nazwa, adres, numer rachunku
- Dane nabywcy. Firma: NIP, nazwa, adres. Osoba prywatna: imię i nazwisko lub nazwa oraz adres, bez NIP
- Numer faktury, daty, kwoty i pozycje faktury
- Po wysłaniu: plik XML, numer KSeF, UPO lub powód odrzucenia

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

---

## 4. Powiadomienia push i usługa relay

Aplikacja mobilna OpenKSeF obsługuje powiadomienia push w modelu warstwowym:

1. **SignalR (lokalne)** — bezpośrednie połączenie WebSocket z Twoją instancją. Żadne dane nie opuszczają serwera.
2. **Relay OpenKSeF** — Twoja instancja wysyła powiadomienie do serwera relay (`push.open-ksef.pl`), który przekazuje je do urządzenia przez Firebase Cloud Messaging (Android) lub Apple Push Notification service (iOS). Relay przetwarza wyłącznie: identyfikator i adres instancji, token urządzenia i treść powiadomienia. Przy nowej fakturze treść to nazwa sprzedawcy, kwota i waluta faktury oraz identyfikatory firmy i faktury w OpenKSeF. Gdy wystawiona faktura czeka na wyjaśnienie w KSeF, treść zawiera jej numer oraz identyfikatory firmy i faktury.
3. **Bezpośrednie FCM/APNs** — jeśli właściciel instancji skonfigurował własny projekt Firebase, powiadomienia są wysyłane bezpośrednio, bez udziału relay.

Relay `push.open-ksef.pl` prowadzą autorzy OpenKSeF. Administratorem danych w powiadomieniu jest właściciel instancji, z której ono pochodzi.

Aplikacja rejestruje urządzenie do powiadomień po każdym zalogowaniu. W wydanych wersjach aplikacji (do 1.0.5) przełącznik **Powiadomienia push** na ekranie **Konto** nie wyłącza powiadomień. Aby przestać je otrzymywać, wybierz jeden ze sposobów:

- Wyloguj się z aplikacji i usuń urządzenie w portalu: **Telefon** > **Moje urządzenia**. Przy następnym logowaniu urządzenie zarejestruje się ponownie.
- Wyłącz powiadomienia dla aplikacji OpenKSeF w ustawieniach telefonu. Telefon przestanie je pokazywać, ale instancja może je nadal wysyłać.

---

## 5. Udostępnianie danych

- OpenKSeF **nie przekazuje** danych reklamodawcom ani firmom analitycznym.
- Dane mogą być przekazywane do:
  - **Ministerstwo Finansów, KSeF** — wystawione faktury z danymi nabywcy, w celu wystawienia faktury w KSeF.
  - **Ministerstwo Finansów, wykaz podatników VAT (biała lista)** — NIP wpisany przy użyciu przycisku **Pobierz z NIP**.
  - **Firebase Cloud Messaging (Google)** — token urządzenia i treść powiadomienia (nazwa sprzedawcy, kwota, identyfikatory firmy i faktury, a przy wystawionej fakturze czekającej na wyjaśnienie w KSeF jej numer i identyfikatory), w celu dostarczenia powiadomień push na Androida. Biblioteka Firebase w aplikacji przekazuje też Google identyfikator instalacji Firebase, wersję aplikacji i identyfikator klienta (user agent).
  - **Apple Push Notification service (Apple)** — token urządzenia i treść powiadomienia, jak wyżej, w celu dostarczenia powiadomień push na iOS.
  - **Serwer SMTP wybrany przez właściciela instancji** — adres e-mail do powiadomień i treść powiadomienia o nowej fakturze, jeśli właściciel skonfigurował SMTP.
  - **Relay OpenKSeF** (`push.open-ksef.pl`) — jeśli włączona jest warstwa relay (domyślnie).

---

## 6. Przechowywanie danych

- Dane są przechowywane na serwerze właściciela instancji.
- OpenKSeF nie usuwa automatycznie danych firm ani faktur. Dane te zostają do czasu, gdy użytkownik usunie firmę albo właściciel instancji usunie je na żądanie lub z własnej decyzji.
- Firmę można usunąć razem z jej wystawionymi fakturami, chyba że ma fakturę w statusie **Wysyłanie** albo fakturę przyjętą na środowisku PRODUKCJA. O usunięcie danych takiej firmy poproś właściciela instancji.
- Faktura przyjęta na środowisku PRODUKCJA jest przechowywana w KSeF przez 10 lat, licząc od końca roku, w którym ją wystawiono ([art. 112aa ust. 1 ustawy o VAT, Dz.U. 2026 poz. 1263](https://api.sejm.gov.pl/eli/acts/DU/2026/1263/text.pdf)). Usunięcie firmy w OpenKSeF nie usuwa niczego z KSeF.
- Usunięcie firmy nie obejmuje kopii zapasowych właściciela instancji ani lokalnej kopii faktur w aplikacji mobilnej.
- Aplikacja mobilna przechowuje lokalną kopię faktur w bazie SQLite w prywatnym katalogu aplikacji na urządzeniu, bez dodatkowego szyfrowania.
- Tokeny i certyfikaty KSeF (z kluczem prywatnym) są szyfrowane w bazie danych (AES-256-GCM).

---

## 7. Twoje prawa

Zgodnie z RODO przysługują Ci następujące prawa:

- **Dostęp** — możesz sprawdzić, jakie dane są przechowywane
- **Sprostowanie** — możesz poprawić nieprawidłowe dane
- **Usunięcie** — możesz zażądać usunięcia konta i danych, zobacz <a href="#usuwanie-konta">Usuwanie konta i danych</a>
- **Przenoszenie** — przy każdej wystawionej fakturze przyjętej w KSeF możesz pobrać XML, UPO i PDF. OpenKSeF nie ma eksportu zbiorczego ani pobierania plików faktur otrzymanych. O pozostałe dane poproś właściciela instancji
- **Sprzeciw** — możesz sprzeciwić się przetwarzaniu opartemu na prawnie uzasadnionym interesie
- **Cofnięcie zgody** — możesz w dowolnym momencie przestać otrzymywać powiadomienia push, w sposób opisany w sekcji 4
- **Skarga** — możesz wnieść skargę do Prezesa Urzędu Ochrony Danych Osobowych

Skargę wnosisz bezpośrednio do Prezesa UODO. W pozostałych sprawach skontaktuj się z właścicielem swojej instancji OpenKSeF.

---

<a id="usuwanie-konta" style={{scrollMarginTop: '5rem'}}></a>

## 8. Usuwanie konta i danych

Aby usunąć konto w OpenKSeF i powiązane z nim dane, wyślij prośbę e-mailem. Nie potrzebujesz do tego aplikacji.

1. Jeśli dostęp do OpenKSeF dała Ci firma lub osoba prowadząca własną instancję, napisz do niej. Autorzy OpenKSeF nie mogą usunąć konta w instancji, której sami nie prowadzą.
2. Jeśli korzystasz z instancji prowadzonej przez autorów OpenKSeF albo nie wiesz, czyja to instancja, napisz na [krystian@mikrut.dev](mailto:krystian@mikrut.dev) z adresu e-mail konta, w temacie „Usunięcie konta OpenKSeF”.

Prośby realizujemy ręcznie. Odpowiadamy w ciągu miesiąca.

**Co usuwamy:** konto (e-mail, imię i nazwisko, identyfikator), zarejestrowane urządzenia oraz firmy tego konta z tokenem lub certyfikatem KSeF, fakturami otrzymanymi, danymi do faktur i fakturami wystawionymi, z wyjątkami poniżej.

**Co może zostać:**

- Faktura przyjęta na środowisku PRODUKCJA zostaje w KSeF przez okres podany w sekcji 6. Nikt nie może jej stamtąd usunąć. Jej kopię w instancji możemy zachować razem z danymi firmy, do której należy (NIP, nazwa, dane sprzedawcy), i napiszemy o tym w odpowiedzi.
- Dane w kopiach zapasowych właściciela instancji, do czasu usunięcia tych kopii.
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
