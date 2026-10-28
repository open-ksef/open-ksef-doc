---
sidebar_position: 6
title: Powiadomienia push
---

# Powiadomienia push

Powiadomienia push informują aplikację mobilną o nowych fakturach z KSeF.

## Jak to działa

```mermaid
graph LR
  subgraph instance ["Twoja instancja OpenKSeF"]
    API["API / Worker"]
  end

  subgraph mobile ["Aplikacja mobilna"]
    App["OpenKSeF Mobile"]
  end

  SignalR["SignalR (WebSocket)"]
  Relay["push.open-ksef.pl"]
  FCM["FCM / APNs"]

  API -->|"1. lokalne"| SignalR --> App
  API -->|"2. zdalne"| Relay --> FCM --> App
```

| Warstwa | Kiedy działa | Konfiguracja |
|---------|--------------|--------------|
| **SignalR** | Aplikacja jest połączona z serwerem | Brak -- zawsze włączone |
| **Relay** | Aplikacja w tle | Wybierz w kreatorze (domyślnie) |
| **Email** | Zawsze | Skonfiguruj SMTP |

Większość instalacji potrzebuje tylko **SignalR + Relay**. Nie wymaga to konfiguracji Firebase.

## Kto dostaje powiadomienie

- Powiadomienie o nowej fakturze trafia na urządzenia użytkownika, do którego należy firma. Inni użytkownicy instancji go nie dostają.
- Urządzenie zarejestrowane w aplikacji mobilnej otrzymuje powiadomienia o wszystkich firmach swojego użytkownika.
- Pierwsza synchronizacja nowej firmy i [pełna resynchronizacja](faktury#pełna-resynchronizacja) nie wysyłają powiadomień, nawet jeśli pobiorą wiele faktur.

## Niezawodność

- Chwilowa niedostępność relay, Firebase lub APNs nie usuwa rejestracji urządzenia. Urządzenie jest usuwane z listy tylko wtedy, gdy FCM/APNs jednoznacznie odrzuci jego token (np. po odinstalowaniu aplikacji).
- Aplikacja mobilna (od wersji 1.0.4) sprawdza po zalogowaniu, czy jej urządzenie jest nadal zarejestrowane na serwerze, i w razie potrzeby rejestruje je ponownie.

## Konfiguracja

W [kreatorze konfiguracji](admin-setup) (Krok 5 -- Integracje):

- **Relay OpenKSeF** (domyślna) -- URL `https://push.open-ksef.pl` jest uzupełniony automatycznie. Instancja rejestruje się automatycznie i otrzymuje unikalny klucz API. Gotowe.
- **Własny Firebase** -- wklej JSON service account. Szczegóły w [Firebase Console](https://console.firebase.google.com/) > Project Settings > Service Accounts > Generate new private key.
- **Tylko lokalne** -- brak zdalnych push, tylko SignalR gdy aplikacja jest aktywna.

## Bezpieczeństwo

Komunikacja z relay jest zabezpieczona trzema warstwami:

1. **Cloudflare** -- HTTPS, rate limiting, ochrona przed botami
2. **Rejestracja instancji** -- każda instancja ma unikalny klucz HMAC (generowany automatycznie przy konfiguracji)
3. **Walidacja żądań** -- podpis HMAC, sprawdzenie aktualności timestamp (5 min), limit żądań per instancja

Żadne klucze nie są zapisane w kodzie źródłowym -- generowane przy rejestracji i przechowywane w bazie danych instancji.

## Testowanie

1. Zaloguj się do portalu > **Urządzenia**
2. Znajdź zarejestrowane urządzenie > **Testuj**

## Rozwiązywanie problemów

| Objaw | Rozwiązanie |
|-------|-------------|
| Brak powiadomień | Włącz relay w kreatorze |
| Brak powiadomień, urządzenie nie widnieje w **Urządzenia** | W aplikacji mobilnej: **Konto** > wyłącz i włącz **Powiadomienia push**. Aplikacja zarejestruje urządzenie ponownie |
| Brak powiadomień po pełnej resynchronizacji | Zamierzone -- pełna resynchronizacja nie wysyła powiadomień |
| SignalR nie łączy | Zaloguj się ponownie w aplikacji |
| Relay zwraca 401 | Instancja niezarejestrowana -- przejdź do Ustawienia > Powiadomienia push > Zarejestruj ponownie |
| Relay zwraca 403 | Instancja wyłączona przez administratora relay |
| Relay zwraca 429 | Przekroczono limit żądań |
| Relay zwraca 502 | Problem z Firebase/APNs po stronie relay |
