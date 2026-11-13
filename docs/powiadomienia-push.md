---
sidebar_position: 6
title: Powiadomienia push
---

# Powiadomienia push

Powiadomienia push informują aplikację mobilną o nowych fakturach z KSeF. Dodatkowo instancja może wysłać e-mail o nowych fakturach zakupowych.

## Jak to działa

Instancja wysyła powiadomienie dwiema drogami: lokalnie przez SignalR (WebSocket) i zdalnie przez `push.open-ksef.pl`, który przekazuje je do FCM lub APNs.

| Warstwa | Kiedy działa | Konfiguracja |
|---------|--------------|--------------|
| **SignalR** | Aplikacja jest połączona z serwerem; tylko ręczna synchronizacja | Brak -- zawsze włączone |
| **Relay** | Aplikacja w tle | Wybierz w kreatorze (domyślnie) |
| **Email** | Każda nowa faktura zakupowa, automatyczna i ręczna synchronizacja | Domyślnie wyłączony. Ustaw zmienne `EMAIL_*` ([Konfiguracja](instalacja/konfiguracja#e-mail-o-nowych-fakturach)) i adres e-mail do powiadomień w firmie. SMTP z kreatora dotyczy tylko Keycloak |

Większość instalacji potrzebuje tylko **SignalR + Relay**. Nie wymaga to konfiguracji Firebase.

## Kto dostaje powiadomienie

- **Automatyczna synchronizacja** (Worker, domyślnie co 4 godziny) wysyła powiadomienia zdalne (relay albo własny Firebase/APNs) i e-mail.
- **Ręczna synchronizacja** (przycisk w portalu lub w aplikacji mobilnej) wysyła dodatkowo powiadomienie SignalR.
- Powiadomienie push trafia na urządzenia użytkownika, do którego należy firma. Inni użytkownicy instancji go nie dostają.
- E-mail trafia na adres do powiadomień ustawiony w danych firmy. Może to być dowolny adres, także osoby spoza instancji.
- E-mail idzie obok push, nie zamiast niego. Instancja wysyła go także wtedy, gdy żadne urządzenie nie jest zarejestrowane albo gdy w aplikacji wyłączysz **Powiadomienia push**. Wyłączenie push na urządzeniu zatrzymuje tylko push na tym urządzeniu. E-maile zatrzymasz, usuwając adres do powiadomień w danych firmy.
- Urządzenie zarejestrowane w aplikacji mobilnej otrzymuje powiadomienia o wszystkich firmach swojego użytkownika, chyba że przypisano je do jednej firmy. Przypisanie widać w portalu: **Telefon** > **Moje urządzenia**, kolumna **Powiadomienia**.
- Jedna synchronizacja wysyła na firmę najwyżej 10 powiadomień push i 10 e-maili, o 10 najnowszych fakturach (według daty przyjęcia w KSeF). O pozostałych fakturach przychodzi jedno podsumowanie push i jeden e-mail z ich liczbą. Wszystkie faktury są zapisywane.
- Limit nie zależy od czasu. Po dłuższej przerwie w synchronizacji (np. awaria Workera albo wygasły token KSeF) faktury z przerwy też dostają powiadomienia, w ramach tego samego limitu 10 i podsumowania.
- Pierwsza synchronizacja nowej firmy i [pełna resynchronizacja](faktury#pełna-resynchronizacja) nie wysyłają powiadomień, nawet jeśli pobiorą wiele faktur.
- Powiadomienie może przyjść kilka sekund przed pozycjami i numerem rachunku, bo OpenKSeF pobiera je z KSeF [po zapisaniu faktury](faktury#uzupełnianie-pozycji-rachunku-i-terminu). Gdy czeka dużo starszych faktur, może to potrwać kilka minut, a po limicie KSeF do kolejnej automatycznej synchronizacji. Otwórz fakturę ponownie.

## Niezawodność

- Chwilowa niedostępność relay, Firebase lub APNs nie usuwa rejestracji urządzenia. Urządzenie jest usuwane z listy tylko wtedy, gdy FCM/APNs jednoznacznie odrzuci jego token (np. po odinstalowaniu aplikacji).
- Aplikacja mobilna (Android, od wersji 1.0.4) sprawdza po zalogowaniu, czy jej urządzenie jest nadal zarejestrowane na serwerze, i w razie potrzeby rejestruje je ponownie.

## Konfiguracja

W [kreatorze konfiguracji](admin-setup) (Krok 5 -- Integracje):

- **Relay OpenKSeF** (domyślna) -- URL `https://push.open-ksef.pl` jest uzupełniony automatycznie. Instancja rejestruje się automatycznie i otrzymuje unikalny klucz API. Gotowe.
- **Własny Firebase** -- wklej JSON service account. Szczegóły w [Firebase Console](https://console.firebase.google.com/) > Project Settings > Service Accounts > Generate new private key. JSON z kreatora lub **Ustawień** ma pierwszeństwo przed `FIREBASE_CREDENTIALS_JSON` z `.env`. API i Worker wczytują go przy pierwszym powiadomieniu na Androida, bez restartu. Zmieniony JSON działa dopiero po restarcie obu: `docker compose restart api worker`.
- **Tylko lokalne** -- brak zdalnych push, tylko SignalR gdy aplikacja jest aktywna.

## Bezpieczeństwo

Komunikacja z relay jest zabezpieczona trzema warstwami:

1. **Cloudflare** -- HTTPS, rate limiting, ochrona przed botami
2. **Rejestracja instancji** -- każda instancja ma unikalny klucz HMAC (generowany automatycznie przy konfiguracji)
3. **Walidacja żądań** -- podpis HMAC, sprawdzenie aktualności timestamp (5 min), limit żądań per instancja

Żadne klucze nie są zapisane w kodzie źródłowym -- generowane przy rejestracji i przechowywane w bazie danych instancji.

## Testowanie

1. Zaloguj się do portalu > **Telefon**
2. Znajdź urządzenie na liście **Moje urządzenia** > **Wyślij test**

## Rozwiązywanie problemów

| Objaw | Rozwiązanie |
|-------|-------------|
| Brak powiadomień | Włącz relay w kreatorze |
| Brak powiadomień, urządzenia nie ma w portalu na liście **Telefon** > **Moje urządzenia** | W aplikacji mobilnej: **Konto** > wyłącz i włącz **Powiadomienia push**. Aplikacja zarejestruje urządzenie ponownie |
| Brak e-maili o nowych fakturach | Sprawdź `EMAIL_ENABLED=true` i pozostałe `EMAIL_*` w `.env` ([Konfiguracja](instalacja/konfiguracja#e-mail-o-nowych-fakturach)), `docker compose up -d api worker` oraz adres do powiadomień w danych firmy. Błędy SMTP są w logach `api` i `worker` |
| Brak powiadomień po pełnej resynchronizacji | Zamierzone -- pełna resynchronizacja nie wysyła powiadomień |
| SignalR nie łączy | Zaloguj się ponownie w aplikacji |
| Relay zwraca 401 | Instancja niezarejestrowana -- przejdź do **Ustawienia** > **Administracja instancji** > **Powiadomienia push** > **Zarejestruj ponownie** |
| Relay zwraca 403 | Instancja wyłączona przez administratora relay |
| Relay zwraca 429 | Przekroczono limit żądań |
| Własny Firebase: w logu `Firebase credentials cannot be used` | JSON jest nieprawidłowy. Wklej poprawny w **Ustawieniach** i uruchom `docker compose restart api worker` |
| Relay zwraca 502 | Problem z Firebase/APNs po stronie relay |
