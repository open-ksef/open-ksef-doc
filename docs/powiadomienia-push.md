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
| **SignalR** | Aplikacja jest uruchomiona i połączona z serwerem; tylko ręczna synchronizacja. Telefon pokazuje je tylko wtedy, gdy nie dostaje push zdalnie ([który kanał](#który-kanał-pokazuje-powiadomienie)) | Brak |
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

## Który kanał pokazuje powiadomienie

Dotyczy aplikacji mobilnej od wersji 1.0.7. Telefon pokazuje jedno powiadomienie o fakturze, nie dwa.

| Sytuacja | Co pokazuje telefon |
|----------|---------------------|
| Push włączony, instancja ma relay albo własny Firebase | Powiadomienie zdalne (FCM), także gdy aplikacja jest w tle albo zamknięta. Powiadomienia SignalR aplikacja nie pokazuje |
| Push włączony, instancja bez relay i bez Firebase (**Tylko lokalne**) | Tylko SignalR: po ręcznej synchronizacji, gdy aplikacja jest uruchomiona i połączona z serwerem. Po automatycznej synchronizacji telefon nie dostaje nic |
| Push włączony, telefon bez tokenu FCM | Tylko SignalR, jak wyżej |
| Push wyłączony w aplikacji | Nic z instancji, gdy serwer wie już o wyłączeniu (zobacz niżej). Aplikacja nie pokazuje też powiadomień SignalR |

E-mail działa w każdej z tych sytuacji, jeśli jest skonfigurowany.

## Zgoda na powiadomienia w aplikacji

Od wersji 1.0.9 aplikacja mobilna nie rejestruje telefonu na serwerze, dopóki konto nie odpowie **Tak**. Bez rejestracji instancja nie wysyła na ten telefon push.

1. Po zalogowaniu (konto bez firmy: po dodaniu pierwszej firmy) aplikacja raz pyta: „Czy chcesz dostawać powiadomienia o nowych fakturach? Telefon pokaże sprzedawcę i kwotę, gdy faktura trafi do KSeF. Zmienisz to w zakładce Konto.”
2. **Tak**: dopiero teraz Android pyta o zgodę na powiadomienia. Po zgodzie aplikacja rejestruje telefon i urządzenie pojawia się w portalu na liście **Telefon** > **Moje urządzenia**.
3. **Nie teraz**: telefon nie jest rejestrowany. Aplikacja nie pyta ponownie. Włączysz powiadomienia w **Konto** > **Powiadomienia push**.

Wybór jest zapamiętany dla konta na tym telefonie. Inne konto zalogowane na tym samym telefonie dostaje własne pytanie. Wylogowanie usuwa telefon z serwera. Po ponownym zalogowaniu tym samym kontem aplikacja stosuje zapamiętany wybór bez pytania.

Aktualizacja z 1.0.8 nie pyta ponownie: dotychczasowe ustawienie telefonu przechodzi na pierwsze konto zalogowane po aktualizacji. Telefon z wyłączonymi powiadomieniami zostaje bez nich, zarejestrowany zostaje zarejestrowany.

E-mail nie zależy od tej zgody.

## Wyłączanie powiadomień w aplikacji

W aplikacji mobilnej (od wersji 1.0.6): **Konto** > **Powiadomienia push**. Po wyłączeniu aplikacja usuwa to urządzenie z serwera i instancja przestaje wysyłać na nie push.

- Inne telefony tego samego użytkownika dostają powiadomienia dalej.
- Od wersji 1.0.9 ustawienie dotyczy konta na tym telefonie. W wersji 1.0.8 i starszej dotyczy telefonu: zostaje po wylogowaniu i obowiązuje każde konto zalogowane na tym telefonie.
- Odinstalowanie aplikacji kasuje ustawienie. Wersja 1.0.9 po ponownej instalacji znów pyta o zgodę.
- Bez dostępu do sieci aplikacja zapamięta wyłączenie, ale serwer jeszcze o nim nie wie. Aplikacja pokazuje wtedy komunikat „Powiadomienia wyłączone, ale serwer jeszcze o tym nie wie. Powiadomienie może dotrzeć, dopóki nie uruchomisz aplikacji ponownie z dostępem do sieci.” Serwer dowie się, gdy uruchomisz aplikację od nowa (nie tylko wrócisz do niej z tła) z dostępem do sieci.
- Przełącznik nie zmienia e-maili. E-maile zatrzymasz, usuwając adres do powiadomień w danych firmy.
- Ponowne włączenie wymaga połączenia z serwerem.

## Niezawodność

- Chwilowa niedostępność relay, Firebase lub APNs nie usuwa rejestracji urządzenia. Urządzenie jest usuwane z listy tylko wtedy, gdy FCM/APNs jednoznacznie odrzuci jego token (np. po odinstalowaniu aplikacji).
- Push o nowej fakturze, który nie dotarł (np. chwilowa awaria relay, Firebase lub APNs), Worker ponawia na początku kolejnych cykli automatycznej synchronizacji, przez 24 godziny od pobrania faktury. Dotyczy to także push z ręcznej synchronizacji. Po 24 godzinach push o tej fakturze nie zostanie wysłany, a Worker zapisze to w logu.
- Ponowienie wysyła tylko push. E-mail poszedł przy pierwszej próbie, drugiego nie ma.
- Push uznaje się za doręczony, gdy dotarł na co najmniej jedno urządzenie, także innej osoby z dostępem do firmy. Urządzenie, na które wtedy nie dotarł, nie dostanie ponowienia.
- Ponowienia dotyczą tylko faktur otrzymanych. Faktury z pierwszej synchronizacji i pełnej resynchronizacji nie dostają push także przy ponowieniu.
- Aplikacja mobilna (Android, od wersji 1.0.4) sprawdza po zalogowaniu, czy jej urządzenie jest nadal zarejestrowane na serwerze, i w razie potrzeby rejestruje je ponownie. Od wersji 1.0.9 tylko wtedy, gdy konto zgodziło się na powiadomienia.

## Faktura wystawiona czeka na KSeF

Faktura [wystawiona w OpenKSeF](wystawianie-faktur), która 24 godziny po wystawieniu nadal jest w statusie **Wysyłanie** albo jest przyjęta w KSeF bez UPO, dostaje oznaczenie **Wymaga uwagi**. Wtedy instancja:

- wysyła jeden push „Faktura czeka na wyjaśnienie w KSeF” na zarejestrowane urządzenia osób z dostępem do firmy,
- od v0.0.27 wysyła jeden e-mail o tym samym temacie na adres do powiadomień firmy, jeśli jest ustawiony, a e-mail jest skonfigurowany (`EMAIL_*`). Dzięki temu dowie się także właściciel bez telefonu,
- pokazuje **Wymaga uwagi** na liście faktur wystawionych i na stronie **Start** w portalu.

Push i e-mail nie powtarzają się przy kolejnych próbach. Status faktury się nie zmienia, a OpenKSeF dalej sprawdza ją w KSeF. **Nie wystawiaj faktury ponownie bez sprawdzenia**: wcześniejsza próba mogła zostać przyjęta. Szczegóły: [Statusy](wystawianie-faktur#statusy).

Dla administratora instancji (od v0.0.27): Worker zapisuje w logu błąd `Issued invoice <id> of tenant <id> needs attention` z numerem, statusem i ostatnim błędem, a `/health` API zwraca `Degraded`, dopóki faktura nie dostanie UPO albo nie zostanie odrzucona. Jak to monitorować i co zrobić: [issuing-stuck-runbook.md](https://github.com/open-ksef/open-ksef/blob/main/docs/issuing-stuck-runbook.md) w repozytorium open-ksef. Próg 24 godzin jest stały, plik `docker-compose.yml` go nie przekazuje.

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
| Powiadomienie przychodzi tylko po ręcznej synchronizacji, gdy aplikacja jest otwarta | Instancja nie ma relay ani własnego Firebase (**Tylko lokalne**). Wtedy powiadomienia dostarcza tylko SignalR. Wybierz **Relay OpenKSeF** w **Ustawienia** > **Administracja instancji** > **Powiadomienia push** |
| Powiadomienie przyszło po wyłączeniu push | Serwer nie wiedział jeszcze o wyłączeniu. Zamknij aplikację całkowicie i uruchom ją ponownie z dostępem do sieci |
| Brak powiadomień, urządzenia nie ma w portalu na liście **Telefon** > **Moje urządzenia** | W aplikacji mobilnej: **Konto** > wyłącz i włącz **Powiadomienia push**. Aplikacja zarejestruje urządzenie ponownie |
| Brak e-maili o nowych fakturach | Sprawdź `EMAIL_ENABLED=true` i pozostałe `EMAIL_*` w `.env` ([Konfiguracja](instalacja/konfiguracja#e-mail-o-nowych-fakturach)), `docker compose up -d api worker` oraz adres do powiadomień w danych firmy. Błędy SMTP są w logach `api` i `worker` |
| Push przyszedł kilka godzin po fakturze, bez drugiego e-maila | Pierwsza próba nie dotarła, Worker [ponowił push](#niezawodność) w kolejnym cyklu |
| Brak powiadomień po pełnej resynchronizacji | Zamierzone -- pełna resynchronizacja nie wysyła powiadomień |
| SignalR nie łączy | Zaloguj się ponownie w aplikacji |
| Relay zwraca 401 | Instancja niezarejestrowana -- przejdź do **Ustawienia** > **Administracja instancji** > **Powiadomienia push** > **Zarejestruj ponownie** |
| Relay zwraca 403 | Instancja wyłączona przez administratora relay |
| Relay zwraca 429 | Przekroczono limit żądań |
| Własny Firebase: w logu `Firebase credentials cannot be used` | JSON jest nieprawidłowy. Wklej poprawny w **Ustawieniach** i uruchom `docker compose restart api worker` |
| Relay zwraca 502 | Problem z Firebase/APNs po stronie relay |
