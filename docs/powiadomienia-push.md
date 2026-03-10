---
sidebar_position: 6
title: Powiadomienia push
---

# Powiadomienia push

Powiadomienia push pozwalają aplikacji mobilnej otrzymywać alerty w czasie rzeczywistym, np. o nowych fakturach pobranych z KSeF. OpenKSeF używa **wielowarstwowej architektury dostarczania**, inspirowanej modelem Home Assistant Companion App.

## Warstwy dostarczania

| Warstwa | Metoda | Kiedy działa | Co konfigurować |
|---------|--------|--------------|-----------------|
| **1. SignalR (lokalne)** | WebSocket | Aplikacja jest połączona z API | Nic (zawsze włączone) |
| **2. Relay (serwer zespołu)** | HTTP POST do relay | Aplikacja w tle, dowolna sieć | Włącz w kreatorze (domyślnie) |
| **3. Direct FCM/APNs** | Firebase / Apple push | Aplikacja w tle, własny Firebase | Zaawansowane: wklej JSON Firebase |
| **4. Email fallback** | SMTP | Zawsze | Skonfiguruj SMTP w kreatorze |

Większość administratorów self-hosted potrzebuje tylko **Warstwy 1 + Warstwy 2**, które nie wymagają konfiguracji Firebase.

## Jak to działa

```
Nowa faktura zsynchronizowana z KSeF
    │
    ├─ 1. SignalR: wyślij do połączonych klientów mobilnych via WebSocket
    │
    ├─ 2. Relay: POST do push.open-ksef.pl → przekazanie do FCM/APNs
    │      (relay zarządza danymi Firebase/APNs)
    │
    ├─ 3. Direct FCM/APNs: jeśli skonfigurowany własny Firebase
    │
    └─ 4. Email: wyślij powiadomienie email
```

### Warstwa 1: SignalR (lokalne push)

Aplikacja mobilna utrzymuje połączenie SignalR (WebSocket) z API pod adresem `/hubs/notifications`. Gdy pojawi się nowa faktura, API wysyła wiadomość do wszystkich połączonych klientów użytkownika.

- Działa na Android i iOS
- Bez usług chmurowych, bez limitów
- Wymaga aktywnego połączenia aplikacji z serwerem
- Połączenie nawiązywane po logowaniu z automatycznym reconnectem

### Warstwa 2: Relay (zalecane dla zdalnych push)

Zespół OpenKSeF utrzymuje lekki serwer relay pod adresem `https://push.open-ksef.pl`. Self-hostowane instancje wysyłają powiadomienia do tego relay, który przekazuje je na urządzenie przez FCM (Android) lub APNs (iOS).

**Dlaczego to działa:** Oficjalna aplikacja mobilna OpenKSeF jest zbudowana z projektem Firebase zespołu. Relay posiada odpowiednie dane serwera Firebase. Administratorzy self-hosted nie muszą konfigurować Firebase.

**Konfiguracja:** W [kreatorze konfiguracji](admin-setup) (Krok 5 - Integracje), wybierz "Relay OpenKSeF" (jest domyślny). URL relay jest wypełniony automatycznie.

**Bezpieczeństwo:** Żądania do relay są podpisywane HMAC (kluczem API relay), co zapobiega nieautoryzowanym nadawcom.

### Warstwa 3: Direct Firebase / APNs (zaawansowane)

Dla administratorów, którzy chcą pełnej kontroli nad dostarczaniem push. Wymaga stworzenia własnego projektu Firebase.

### Warstwa 4: Email fallback

Jeśli tenant ma skonfigurowany email powiadomień, system zawsze wysyła email niezależnie od powodzenia dostarczania push.

---

## Konfiguracja w kreatorze

W [kreatorze konfiguracji](admin-setup), Krok 5 (Integracje) oferuje trzy tryby:

### Opcja A: Relay (domyślna, zalecana)

- Wybierz "Relay OpenKSeF"
- URL `https://push.open-ksef.pl` jest uzupełniony
- Opcjonalnie wprowadź klucz API
- Gotowe -- bez konfiguracji Firebase

### Opcja B: Własny projekt Firebase (zaawansowane)

- Wybierz "Własny projekt Firebase"
- Wklej JSON service account Firebase
- Szczegóły konfiguracji Firebase poniżej

### Opcja C: Tylko lokalne (SignalR)

- Wybierz "Tylko lokalne (SignalR)"
- Brak zdalnych powiadomień push
- Użytkownicy otrzymują powiadomienia tylko gdy aplikacja jest aktywnie połączona

---

## Konfiguracja Firebase (tylko dla Opcji B)

### Krok 1: Utwórz projekt Firebase

1. Otwórz [Firebase Console](https://console.firebase.google.com/)
2. Kliknij **Add project**
3. Przejdź przez wizard -- Google Analytics możesz wyłączyć

### Krok 2: Zarejestruj aplikację Android

1. W projekcie Firebase, kliknij **Add app > Android**
2. Wpisz package name: `com.openksef.mobile`
3. Opcjonalnie: nickname i SHA-1 certyfikatu
4. Kliknij **Register app**
5. Pobierz `google-services.json`

### Krok 3: Dodaj `google-services.json` do projektu mobilnego

Umieść pobrany plik w:

```
src/OpenKSeF.Mobile/Platforms/Android/google-services.json
```

Plik `.csproj` automatycznie wykrywa ten plik i włącza `FIREBASE_ENABLED`.

:::warning
Nie commituj `google-services.json` do repozytorium. Zawiera klucze API specyficzne dla Twojego projektu Firebase.
:::

### Krok 4: Wygeneruj klucz service account

1. W Firebase Console: **Project Settings > Service Accounts**
2. Wybierz **Firebase Admin SDK** > **Generate new private key**
3. Pobierz JSON

### Krok 5: Skonfiguruj w kreatorze lub `.env`

**Przez kreator:** Wklej JSON w Kroku 5 kreatora pod "Własny projekt Firebase".

**Przez `.env`:** Spłaszcz JSON do jednej linii:

```bash
FIREBASE_CREDENTIALS_JSON={"type":"service_account","project_id":"twoj-projekt",...}
```

---

## Weryfikacja

### SignalR (lokalne push)

1. Zaloguj się w aplikacji mobilnej -- połączenie SignalR nawiąże się automatycznie
2. Na stronie Konta status powinien pokazywać "SignalR połączony"
3. Uruchom synchronizację KSeF -- powiadomienie powinno przyjść natychmiast

### Zdalne push (relay lub direct)

1. Zaloguj się do portalu (http://localhost:8080)
2. Przejdź do **Urządzenia**
3. Znajdź zarejestrowane urządzenie
4. Kliknij **Testuj** -- API wyśle testowy push i pokaże wynik

---

## Rozwiązywanie problemów

| Objaw | Przyczyna | Rozwiązanie |
|-------|-----------|-------------|
| Brak powiadomień | Nie skonfigurowano providerów push | Włącz relay w kreatorze lub skonfiguruj Firebase |
| SignalR nie łączy | Token autoryzacji wygasł lub zły URL | Zaloguj się ponownie w aplikacji |
| Relay zwraca 401 | Nieprawidłowy podpis HMAC | Sprawdź, czy klucz API zgadza się między instancją a relay |
| Relay zwraca 502 | Nieprawidłowe dane Firebase/APNs na relay | Sprawdź logi relay, zweryfikuj JSON Firebase |
| Token FCM nieprawidłowy | Token urządzenia wygasł lub zły projekt Firebase | Ponownie zarejestruj urządzenie; sprawdź `google-services.json` |
| iOS push zwraca 403 | Brak JWT auth APNs | Użyj relay (zarządza auth APNs) |

---

## Zmienne środowiskowe

| Zmienna | Wymagana | Domyślnie | Opis |
|---------|----------|-----------|------|
| `FIREBASE_CREDENTIALS_JSON` | Dla direct FCM | *(brak -- używa relay)* | Firebase service account JSON |
| `APNS_BUNDLE_ID` | Dla direct iOS | `com.openksef.mobile` | Bundle identifier iOS |
| `APNS_BASE_URL` | Dla direct iOS | `https://api.push.apple.com` | Endpoint APNs |
| `APNS_KEY_ID` | Dla direct iOS | *(brak)* | APNs Auth Key ID |
| `APNS_TEAM_ID` | Dla direct iOS | *(brak)* | Apple Developer Team ID |
| `APNS_AUTH_KEY_P8` | Dla direct iOS | *(brak)* | Zawartość pliku `.p8` |
