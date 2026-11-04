---
sidebar_position: 1
slug: /intro
title: Wprowadzenie
---

# Czym jest OpenKSeF?

:::caution[Beta]
OpenKSeF jest w fazie **beta**. Projekt jest aktywnie rozwijany -- mogą wystąpić zmiany w API, strukturze bazy danych i konfiguracji. Używaj w środowiskach testowych lub z pełną świadomością aktualnego stanu projektu.
:::

**OpenKSeF** to system do synchronizacji i przeglądania faktur z polskiego **Krajowego Systemu e-Faktur (KSeF)**. Umożliwia automatyczne pobieranie faktur, ich przeglądanie przez portal webowy lub aplikację mobilną, oraz zarządzanie wieloma firmami z jednego miejsca.

Kod źródłowy jest publicznie dostępny ([Elastic License 2.0](licencja)). To niezależny projekt, niepowiązany z Ministerstwem Finansów.

## Dla kogo?

OpenKSeF jest przeznaczony dla:

- **Programistów i administratorów** -- którzy chcą postawić własną instancję i mieć pełną kontrolę nad danymi fakturowymi
- **Księgowych i właścicieli firm** -- którzy szukają prostego narzędzia do przeglądania faktur z KSeF bez opłat za uruchomienie u siebie
- **Zespołów IT w firmach** -- które potrzebują rozwiązania self-hosted, z danymi fakturowymi na własnej infrastrukturze

## Co potrafi OpenKSeF?

| Funkcja | Opis |
|---------|------|
| **Synchronizacja faktur** | Automatyczne pobieranie faktur otrzymanych i sprzedażowych z KSeF w tle, ręczna i pełna resynchronizacja |
| **Otrzymane faktury** | Termin płatności, filtr Nieopłacone, szczegóły z pozycjami, status płatności, dane do przelewu i kod QR -- zobacz [Otrzymane faktury](faktury) |
| **Wystawianie faktur** | Faktury VAT wysyłane do KSeF z portalu, XML, UPO i PDF z kodem KOD I. Zobacz [Wystawianie faktur](wystawianie-faktur) |
| **Portal webowy** | React SPA ze stroną Start, listami otrzymanych i wystawionych faktur, zarządzaniem firmami |
| **Aplikacja mobilna** | .NET MAUI z powiadomieniami push. Android: plik APK na GitHubie, Google Play i iPhone jeszcze nie |
| **Multi-tenant** | Wiele firm na jednej instancji, izolacja danych per użytkownik |
| **Powiadomienia push** | SignalR (lokalne) + relay/Firebase (zdalne) |
| **Bezpieczeństwo** | Keycloak (OIDC). Tokeny KSeF szyfrowane w bazie (AES-256-GCM), klucz poza bazą, w `ENCRYPTION_KEY`: [szczegóły](admin-setup#klucz-szyfrowania). HTTPS zapewnia właściciel instancji |
| **Self-hosting** | Docker Compose: `docker-compose.yml`, plik `.env` z hasłami i `docker compose up -d` |

## Architektura

```
┌─────────────────────────────────────────────────┐
│                  Docker Compose                 │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │   API    │  │  Worker  │  │ Portal (React)│  │
│  │(.NET 10) │  │(.NET 10) │  │               │  │
│  └────┬─────┘  └────┬─────┘  └───────────────┘  │
│       │             │                           │
│  ┌────┴─────────────┴─────┐  ┌───────────────┐  │
│  │     PostgreSQL         │  │   Keycloak    │  │
│  │                        │  │   (OIDC)      │  │
│  └────────────────────────┘  └───────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐   │
│  │          nginx Gateway (:8080)           │   │
│  │    / portal  /api/ API  /auth/ Keycloak  │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
          │
          ▼
  ┌───────────────┐         ┌──────────────┐
  │ Aplikacja     │         │    KSeF      │
  │ mobilna MAUI  │         │  (MF API)    │
  └───────────────┘         └──────────────┘
```

## Portal webowy

![Strona startowa portalu](/img/screenshots/portal/dashboard.png)

![Lista faktur](/img/screenshots/portal/invoices.png)

![Podgląd faktury](/img/screenshots/portal/invoice-detail.png)

![Dane przelewu i QR](/img/screenshots/portal/invoice-qr.png)

## Aplikacja mobilna

Lista faktur, szczegóły z pozycjami, kod QR przelewu i powiadomienia push na telefonie -- zobacz [Aplikacja mobilna](aplikacja-mobilna).

## Następne kroki

- [Wymagania systemowe](instalacja/wymagania) -- co potrzebujesz przed instalacją
- [Szybki start](instalacja/szybki-start) -- instalacja krok po kroku
- [Kreator konfiguracji](admin-setup) -- krok po kroku przez wizard
- [Otrzymane faktury](faktury) -- lista, szczegóły, status płatności, synchronizacja
