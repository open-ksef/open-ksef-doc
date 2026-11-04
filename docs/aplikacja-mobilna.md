---
sidebar_position: 7
title: Aplikacja mobilna
---

# Aplikacja mobilna

OpenKSeF Mobile to aplikacja .NET MAUI na Androida. Umożliwia przeglądanie faktur, zarządzanie firmami i otrzymywanie powiadomień push o nowych fakturach z KSeF.

:::note[Dostępność]
Aplikacja na Androida: kończymy poprawki, zanim zalecimy instalację. Google Play i iPhone jeszcze nie.
:::

## Funkcje

- Przeglądanie faktur z KSeF (lista, szczegóły, filtrowanie)
- Numer faktury sprzedawcy i pozycje faktury w szczegółach (zobacz [Faktury](faktury#aplikacja-mobilna))
- Zarządzanie firmami (tenantami)
- Powiadomienia push (SignalR + relay/Firebase)
- Logowanie przez Keycloak (OIDC)
- Kod QR do przelewu z aplikacji bankowej; w wersji 1.0.5 bez numeru rachunku. W portalu kod QR zawiera numer rachunku, jeśli jest na fakturze
- [Wystawianie faktur](wystawianie-faktur), od wersji 1.0.5
- Skanowanie QR do szybkiego połączenia z serwerem

## Podłączenie do self-hosted serwera

1. Zainstaluj aplikację OpenKSeF na urządzeniu
2. Na ekranie logowania wprowadź adres serwera (np. `https://twoj-serwer.pl`)
3. Zaloguj się danymi z Keycloak

:::tip[Szybkie połączenie]
W portalu webowym przejdź do strony **Aplikacja mobilna** -- znajdziesz tam kod QR, który możesz zeskanować w aplikacji mobilnej, żeby automatycznie ustawić adres serwera.
:::

## Wymagania dla Android

Android wymaga **HTTPS** do uwierzytelniania OIDC (WebAuthenticator). Dla testów lokalnych:

1. Użyj [ngrok](https://ngrok.com/) do stworzenia tunelu HTTPS
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
