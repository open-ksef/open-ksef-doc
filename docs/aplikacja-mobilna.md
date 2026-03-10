---
sidebar_position: 7
title: Aplikacja mobilna
---

# Aplikacja mobilna

OpenKSeF Mobile to aplikacja .NET MAUI na Android i iOS. Umożliwia przeglądanie faktur, zarządzanie firmami i otrzymywanie powiadomień push o nowych fakturach z KSeF.

## Funkcje

- Przeglądanie faktur z KSeF (lista, szczegóły, filtrowanie)
- Zarządzanie firmami (tenantami)
- Powiadomienia push (SignalR + relay/Firebase)
- Logowanie przez Keycloak (OIDC)
- Kod QR do przelewu z aplikacji bankowej
- Skanowanie QR do szybkiego połączenia z serwerem

| Logowanie | Lista faktur | Podgląd faktury | Kod QR przelewu |
|:---:|:---:|:---:|:---:|
| ![Logowanie](/img/screenshots/mobile/login.png) | ![Faktury](/img/screenshots/mobile/invoices.png) | ![Szczegóły](/img/screenshots/mobile/invoice-detail.png) | ![QR](/img/screenshots/mobile/invoice-qr.png) |

## Podłączenie do self-hosted serwera

1. Zainstaluj aplikację OpenKSeF na urządzeniu
2. Na ekranie logowania wprowadź adres serwera (np. `https://twoj-serwer.pl`)
3. Zaloguj się danymi z Keycloak

:::tip Szybkie połączenie
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

- .NET 8 SDK
- Android SDK (API 34+)
- Visual Studio 2022 lub VS Code z MAUI workload

### Build

```bash
# Android
dotnet build src/OpenKSeF.Mobile/OpenKSeF.Mobile.csproj -f net8.0-android

# iOS (wymaga macOS)
dotnet build src/OpenKSeF.Mobile/OpenKSeF.Mobile.csproj -f net8.0-ios
```

### Konfiguracja Firebase (opcjonalnie)

Jeśli chcesz własne powiadomienia push na Androidzie:

1. Utwórz projekt Firebase i pobierz `google-services.json`
2. Umieść plik w `src/OpenKSeF.Mobile/Platforms/Android/google-services.json`
3. Build automatycznie włączy Firebase

Bez `google-services.json` aplikacja działa normalnie, ale nie otrzymuje zdalnych push z Firebase. Push przez relay i SignalR działają bez Firebase.

Szczegóły konfiguracji push w [Powiadomienia push](powiadomienia-push).
