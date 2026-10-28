---
sidebar_position: 10
title: Polityka prywatności
---

# Polityka prywatności

*Ostatnia aktualizacja: 28 października 2026 r.*

OpenKSeF to oprogramowanie open-source do synchronizacji i przeglądania faktur z Krajowego Systemu e-Faktur (KSeF). Niniejsza polityka prywatności opisuje, jakie dane przetwarzamy i w jaki sposób je chronimy.

---

## 1. Administrator danych

Administratorem danych osobowych jest operator instancji OpenKSeF, na której założyłeś konto. OpenKSeF jest oprogramowaniem self-hosted — każda instancja jest niezależna i zarządzana przez swojego operatora.

W przypadku oficjalnej instancji demo lub aplikacji mobilnej połączonej z relay OpenKSeF, administratorem jest:

**OpenKSeF**
Kontakt: [krystian@mikrut.dev](mailto:krystian@mikrut.dev)

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

### Dane faktur

- Dane faktur pobrane z KSeF: nagłówek (numer, kwoty, daty, dane kontrahentów, numer rachunku sprzedawcy) i pozycje faktury (nazwa towaru lub usługi, ilość, ceny, stawka VAT)
- Status płatności faktury ustawiony przez użytkownika
- Faktury są przechowywane w bazie danych instancji

### Dane techniczne

- Token urządzenia (FCM/APNs) — wyłącznie do dostarczania powiadomień push
- Identyfikator instancji — do rejestracji w usłudze relay push

---

## 3. Cel przetwarzania danych

| Dane | Cel | Podstawa prawna |
|------|-----|-----------------|
| E-mail, identyfikator OIDC | Uwierzytelnianie i obsługa konta | Umowa (art. 6 ust. 1 lit. b RODO) |
| NIP, nazwa firmy, token lub certyfikat KSeF | Synchronizacja faktur z KSeF | Umowa (art. 6 ust. 1 lit. b RODO) |
| Dane faktur, status płatności | Wyświetlanie i przeszukiwanie faktur, dane do przelewu | Umowa (art. 6 ust. 1 lit. b RODO) |
| Token urządzenia (FCM/APNs) | Dostarczanie powiadomień push | Zgoda (art. 6 ust. 1 lit. a RODO) |
| Adres e-mail do powiadomień (per firma) | Wysyłanie powiadomień e-mail o nowych fakturach | Umowa (art. 6 ust. 1 lit. b RODO) |

---

## 4. Powiadomienia push i usługa relay

Aplikacja mobilna OpenKSeF obsługuje powiadomienia push w modelu warstwowym:

1. **SignalR (lokalne)** — bezpośrednie połączenie WebSocket z Twoją instancją. Żadne dane nie opuszczają serwera.
2. **Relay OpenKSeF** — Twoja instancja wysyła powiadomienie do serwera relay (`push.open-ksef.pl`), który przekazuje je do urządzenia przez Firebase Cloud Messaging (Android) lub Apple Push Notification service (iOS). Relay przetwarza wyłącznie: identyfikator instancji, token urządzenia i treść powiadomienia, czyli nazwę sprzedawcy, kwotę i walutę faktury oraz identyfikatory firmy i faktury w OpenKSeF.
3. **Bezpośrednie FCM/APNs** — jeśli operator instancji skonfigurował własny projekt Firebase, powiadomienia są wysyłane bezpośrednio, bez udziału relay.

Możesz wyłączyć powiadomienia push w ustawieniach aplikacji mobilnej.

---

## 5. Udostępnianie danych

- **Nie sprzedajemy** danych osobowych.
- **Nie udostępniamy** danych reklamodawcom ani firmom analitycznym.
- Dane mogą być przekazywane do:
  - **Firebase Cloud Messaging (Google)** — wyłącznie token urządzenia i treść powiadomienia (nazwa sprzedawcy, kwota, identyfikatory firmy i faktury), w celu dostarczenia powiadomień push na Androida.
  - **Apple Push Notification service (Apple)** — te same dane, w celu dostarczenia powiadomień push na iOS.
  - **Serwer SMTP wybrany przez operatora instancji** — adres e-mail do powiadomień i treść powiadomienia o nowej fakturze, jeśli operator skonfigurował SMTP.
  - **Relay OpenKSeF** (`push.open-ksef.pl`) — jeśli włączona jest warstwa relay (domyślnie).

---

## 6. Przechowywanie danych

- Dane są przechowywane na serwerze operatora instancji (self-hosted).
- Aplikacja mobilna przechowuje lokalną kopię faktur w bazie SQLite w prywatnym katalogu aplikacji na urządzeniu, bez dodatkowego szyfrowania.
- Tokeny i certyfikaty KSeF (z kluczem prywatnym) są szyfrowane w bazie danych (AES-256-GCM).

---

## 7. Twoje prawa

Zgodnie z RODO przysługują Ci następujące prawa:

- **Dostęp** — możesz sprawdzić, jakie dane przechowujemy
- **Sprostowanie** — możesz poprawić nieprawidłowe dane
- **Usunięcie** — możesz zażądać usunięcia konta i danych
- **Przenoszenie** — możesz pobrać swoje dane w formacie elektronicznym
- **Cofnięcie zgody** — możesz wyłączyć powiadomienia push w dowolnym momencie

Aby skorzystać z tych praw, skontaktuj się z operatorem swojej instancji OpenKSeF lub napisz na [krystian@mikrut.dev](mailto:krystian@mikrut.dev).

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

W sprawach związanych z prywatnością i ochroną danych:

- E-mail: [krystian@mikrut.dev](mailto:krystian@mikrut.dev)
- GitHub: [github.com/open-ksef](https://github.com/open-ksef)
