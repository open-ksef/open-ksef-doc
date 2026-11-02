---
sidebar_position: 10
title: Polityka prywatności
---

# Polityka prywatności

*Ostatnia aktualizacja: 2 listopada 2026 r.*

OpenKSeF to oprogramowanie open-source do synchronizacji i przeglądania faktur z Krajowego Systemu e-Faktur (KSeF) oraz do wystawiania faktur. Ta polityka opisuje, jakie dane są przetwarzane w instancji OpenKSeF i jak są chronione.

---

## 1. Administrator danych

Administratorem danych osobowych jest właściciel instancji OpenKSeF, z której korzystasz. Każda wdrożona instancja ma swojego właściciela i działa niezależnie od innych.

Właściciel instancji podaje swoim użytkownikom swoją nazwę i dane kontaktowe. Jeśli ich nie znasz, zapytaj osobę, która dała Ci dostęp. Autorzy OpenKSeF nie mają dostępu do instancji, których sami nie prowadzą.

Jeśli jesteś nabywcą i Twoje dane znalazły się na fakturze wystawionej w OpenKSeF, w sprawie tych danych skontaktuj się ze sprzedawcą.

---

## 2. Jakie dane zbieramy

### Dane konta użytkownika

- Adres e-mail (do logowania i powiadomień)
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

### Dane faktur wystawionych

- Dane sprzedawcy: NIP, nazwa, adres, numer rachunku
- Dane nabywcy. Firma: NIP, nazwa, adres. Osoba prywatna: imię i nazwisko lub nazwa oraz adres, bez NIP
- Numer faktury, daty, kwoty i pozycje faktury
- Po wysłaniu: plik XML, numer KSeF, UPO lub powód odrzucenia

### Dane techniczne

- Token urządzenia (FCM/APNs) — wyłącznie do dostarczania powiadomień push
- Identyfikator i adres instancji — do rejestracji w usłudze relay push

---

## 3. Cel przetwarzania danych

| Dane | Cel | Podstawa prawna |
|------|-----|-----------------|
| E-mail, identyfikator OIDC | Uwierzytelnianie i obsługa konta | Umowa (art. 6 ust. 1 lit. b RODO) |
| NIP, nazwa firmy, token lub certyfikat KSeF | Synchronizacja faktur z KSeF | Umowa (art. 6 ust. 1 lit. b RODO) |
| Dane faktur, status płatności | Wyświetlanie i przeszukiwanie faktur, dane do przelewu | Umowa (art. 6 ust. 1 lit. b RODO) |
| Dane wystawionej faktury, w tym nabywcy będącego osobą prywatną | Wystawienie faktury i wysłanie jej do KSeF | Obowiązek prawny (art. 6 ust. 1 lit. c RODO, art. 106e ustawy o VAT) |
| Kopia wystawionej faktury w instancji | Podgląd faktury, pobieranie plików, wyjaśnienie numeracji | Prawnie uzasadniony interes sprzedawcy (art. 6 ust. 1 lit. f RODO) |
| Token urządzenia (FCM/APNs) | Dostarczanie powiadomień push | Zgoda (art. 6 ust. 1 lit. a RODO) |
| Adres e-mail do powiadomień (per firma) | Wysyłanie powiadomień e-mail o nowych fakturach | Umowa (art. 6 ust. 1 lit. b RODO) |

---

## 4. Powiadomienia push i usługa relay

Aplikacja mobilna OpenKSeF obsługuje powiadomienia push w modelu warstwowym:

1. **SignalR (lokalne)** — bezpośrednie połączenie WebSocket z Twoją instancją. Żadne dane nie opuszczają serwera.
2. **Relay OpenKSeF** — Twoja instancja wysyła powiadomienie do serwera relay (`push.open-ksef.pl`), który przekazuje je do urządzenia przez Firebase Cloud Messaging (Android) lub Apple Push Notification service (iOS). Relay przetwarza wyłącznie: identyfikator i adres instancji, token urządzenia i treść powiadomienia, czyli nazwę sprzedawcy, kwotę i walutę faktury oraz identyfikatory firmy i faktury w OpenKSeF.
3. **Bezpośrednie FCM/APNs** — jeśli właściciel instancji skonfigurował własny projekt Firebase, powiadomienia są wysyłane bezpośrednio, bez udziału relay.

Relay `push.open-ksef.pl` prowadzą autorzy OpenKSeF. Administratorem danych w powiadomieniu jest właściciel instancji, z której ono pochodzi.

Możesz wyłączyć powiadomienia push w ustawieniach aplikacji mobilnej.

---

## 5. Udostępnianie danych

- OpenKSeF **nie przekazuje** danych reklamodawcom ani firmom analitycznym.
- Dane mogą być przekazywane do:
  - **Ministerstwo Finansów, KSeF** — wystawione faktury z danymi nabywcy, w celu wystawienia faktury w KSeF.
  - **Ministerstwo Finansów, wykaz podatników VAT (biała lista)** — NIP wpisany przy użyciu przycisku **Pobierz z NIP**.
  - **Firebase Cloud Messaging (Google)** — wyłącznie token urządzenia i treść powiadomienia (nazwa sprzedawcy, kwota, identyfikatory firmy i faktury), w celu dostarczenia powiadomień push na Androida.
  - **Apple Push Notification service (Apple)** — te same dane, w celu dostarczenia powiadomień push na iOS.
  - **Serwer SMTP wybrany przez właściciela instancji** — adres e-mail do powiadomień i treść powiadomienia o nowej fakturze, jeśli właściciel skonfigurował SMTP.
  - **Relay OpenKSeF** (`push.open-ksef.pl`) — jeśli włączona jest warstwa relay (domyślnie).

---

## 6. Przechowywanie danych

- Dane są przechowywane na serwerze właściciela instancji.
- OpenKSeF nie usuwa danych automatycznie. Dane zostają do czasu, gdy użytkownik usunie firmę albo właściciel instancji usunie je na żądanie lub z własnej decyzji.
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
- **Usunięcie** — możesz zażądać od właściciela instancji usunięcia konta i danych
- **Przenoszenie** — przy każdej wystawionej fakturze przyjętej w KSeF możesz pobrać XML, UPO i PDF. OpenKSeF nie ma eksportu zbiorczego ani pobierania plików faktur otrzymanych. O pozostałe dane poproś właściciela instancji
- **Sprzeciw** — możesz sprzeciwić się przetwarzaniu opartemu na prawnie uzasadnionym interesie
- **Cofnięcie zgody** — możesz wyłączyć powiadomienia push w dowolnym momencie

Aby skorzystać z tych praw, skontaktuj się z właścicielem swojej instancji OpenKSeF.

---

## 8. Bezpieczeństwo

- Komunikacja między aplikacją a serwerem odbywa się przez HTTPS.
- Tokeny autoryzacyjne i certyfikaty KSeF (z kluczem prywatnym) są szyfrowane w bazie danych.
- Uwierzytelnianie oparte na OpenID Connect (Keycloak).
- Kod źródłowy jest otwarty i dostępny do audytu na [GitHub](https://github.com/open-ksef).

---

## 9. Zmiany w polityce prywatności

O istotnych zmianach w polityce prywatności poinformujemy przez aktualizację tej strony. Data ostatniej aktualizacji znajduje się na górze dokumentu.

---

## 10. Kontakt

W sprawach tej strony i usługi relay:

- E-mail: [krystian@mikrut.dev](mailto:krystian@mikrut.dev)
- GitHub: [github.com/open-ksef](https://github.com/open-ksef)
