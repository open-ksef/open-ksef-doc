---
sidebar_position: 1
slug: /intro
title: Wprowadzenie
---

# Czym jest OpenKSeF?

:::caution[Beta]
OpenKSeF jest w fazie **beta**. Projekt jest aktywnie rozwijany -- mogą wystąpić zmiany w API, strukturze bazy danych i konfiguracji. Używaj w środowiskach testowych lub z pełną świadomością aktualnego stanu projektu.
:::

**OpenKSeF** to otwartoźródłowy system do synchronizacji i przeglądania faktur z polskiego **Krajowego Systemu e-Faktur (KSeF)**. Umożliwia automatyczne pobieranie faktur, ich przeglądanie przez portal webowy lub aplikację mobilną, oraz zarządzanie wieloma firmami z jednego miejsca.

## Dla kogo?

OpenKSeF jest przeznaczony dla:

- **Programistów i administratorów** -- którzy chcą postawić własną instancję i mieć pełną kontrolę nad danymi fakturowymi
- **Księgowych i właścicieli firm** -- którzy szukają prostego narzędzia do przeglądania faktur z KSeF bez opłat abonamentowych
- **Zespołów IT w firmach** -- które potrzebują self-hosted rozwiązania zgodnego z polskimi przepisami

## Co potrafi OpenKSeF?

| Funkcja | Opis |
|---------|------|
| **Synchronizacja faktur** | Automatyczne pobieranie faktur z KSeF w tle, ręczna i pełna resynchronizacja |
| **Faktury** | Szczegóły z pozycjami, status płatności, dane do przelewu i kod QR -- zobacz [Faktury](faktury) |
| **Portal webowy** | React SPA z dashboardem, listą faktur, zarządzaniem firmami |
| **Aplikacja mobilna** | .NET MAUI na Android i iOS z powiadomieniami push |
| **Multi-tenant** | Wiele firm na jednej instancji, izolacja danych per użytkownik |
| **Powiadomienia push** | SignalR (lokalne) + relay/Firebase (zdalne) + email |
| **Bezpieczeństwo** | Keycloak (OIDC), szyfrowanie tokenów KSeF (AES-256), HTTPS |
| **Self-hosting** | Docker Compose -- jedno polecenie i gotowe |

## Architektura

```
┌─────────────────────────────────────────────────┐
│                  Docker Compose                  │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐ │
│  │   API    │  │  Worker  │  │ Portal (React)│ │
│  │(.NET 10) │  │(.NET 10) │  │               │ │
│  └────┬─────┘  └────┬─────┘  └───────────────┘ │
│       │              │                           │
│  ┌────┴──────────────┴────┐  ┌───────────────┐ │
│  │     PostgreSQL         │  │   Keycloak    │ │
│  │                        │  │   (OIDC)      │ │
│  └────────────────────────┘  └───────────────┘ │
│                                                  │
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

![Dashboard portalu](/img/screenshots/portal/dashboard.png)

![Lista faktur](/img/screenshots/portal/invoices.png)

![Podgląd faktury](/img/screenshots/portal/invoice-detail.png)

![Dane przelewu i QR](/img/screenshots/portal/invoice-qr.png)

## Aplikacja mobilna

Lista faktur, szczegóły z pozycjami, kod QR przelewu i powiadomienia push na telefonie -- zobacz [Aplikacja mobilna](aplikacja-mobilna).

## Następne kroki

- [Wymagania systemowe](instalacja/wymagania) -- co potrzebujesz przed instalacją
- [Szybki start](instalacja/szybki-start) -- uruchomienie w 5 minut
- [Kreator konfiguracji](admin-setup) -- krok po kroku przez wizard
- [Faktury](faktury) -- lista, szczegóły, status płatności, synchronizacja
