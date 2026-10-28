---
sidebar_position: 1
slug: /intro
title: Introduction
---

# What is OpenKSeF?

:::caution[Beta]
OpenKSeF is in **beta**. The project is actively developed -- there may be changes in the API, database structure, and configuration. Use in test environments or with full awareness of the current state of the project.
:::

**OpenKSeF** is an open-source system for synchronizing and browsing invoices from the Polish **National e-Invoice System (KSeF)**. It enables automatic invoice downloading, browsing through a web portal or mobile app, and managing multiple companies from a single instance.

## Who is it for?

OpenKSeF is designed for:

- **Developers and administrators** -- who want to run their own instance and have full control over invoice data
- **Accountants and business owners** -- looking for a simple, free tool to browse invoices from KSeF
- **IT teams in companies** -- that need a self-hosted solution compliant with Polish regulations

## What can OpenKSeF do?

| Feature | Description |
|---------|-------------|
| **Invoice synchronization** | Automatic background downloading of invoices from KSeF, manual and full resync |
| **Invoices** | Details with line items, payment status, transfer details and QR code -- see [Invoices](faktury) |
| **Web portal** | React SPA with dashboard, invoice list, company management |
| **Mobile app** | .NET MAUI for Android and iOS with push notifications |
| **Multi-tenant** | Multiple companies on a single instance, per-user data isolation |
| **Push notifications** | SignalR (local) + relay/Firebase (remote) + email |
| **Security** | Keycloak (OIDC), KSeF token encryption (AES-256), HTTPS |
| **Self-hosting** | Docker Compose -- one command and you're ready |

## Architecture

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
  │ Mobile app    │         │    KSeF      │
  │ (MAUI)        │         │  (MF API)    │
  └───────────────┘         └──────────────┘
```

## Web portal

![Portal dashboard](/img/screenshots/portal/dashboard.png)

![Invoice list](/img/screenshots/portal/invoices.png)

![Invoice detail](/img/screenshots/portal/invoice-detail.png)

![Payment data and QR](/img/screenshots/portal/invoice-qr.png)

## Mobile app

Invoice list, details with line items, payment QR code and push notifications on your phone -- see [Mobile app](aplikacja-mobilna).

## Next steps

- [System requirements](instalacja/wymagania) -- what you need before installation
- [Quick start](instalacja/szybki-start) -- up and running in 5 minutes
- [Setup wizard](admin-setup) -- step-by-step configuration
- [Invoices](faktury) -- list, details, payment status, synchronization
