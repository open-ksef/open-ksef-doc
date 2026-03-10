---
sidebar_position: 8
title: O projekcie
---

# O projekcie

:::caution Status: Beta
OpenKSeF jest w fazie **beta**. Aktywnie rozwijamy projekt -- nowe funkcjonalności pojawiają się regularnie, ale mogą wystąpić zmiany w API, strukturze danych i konfiguracji między wersjami. Zalecamy śledzenie [release notes na GitHub](https://github.com/open-ksef).
:::

## Czym jest OpenKSeF?

OpenKSeF to otwartoźródłowy system do synchronizacji i przeglądania faktur z polskiego Krajowego Systemu e-Faktur (KSeF). Projekt został stworzony, aby każdy mógł postawić własną instancję i mieć pełną kontrolę nad swoimi danymi fakturowymi.

## Stworzony z pomocą AI

OpenKSeF powstał z wykorzystaniem narzędzi AI -- w szczególności [Cursor](https://cursor.com/) i modeli Claude (Anthropic). AI wspierało programowanie, generowanie testów, pisanie dokumentacji i projektowanie architektury.

Wierzymy w transparentność: AI to narzędzie, które przyspiesza rozwój oprogramowania. Kod jest otwarty i każdy może go zweryfikować.

## Open Source

Projekt jest udostępniony na licencji **Elastic License 2.0 (ELv2)**. Możesz:

- Używać OpenKSeF do celów wewnętrznych (firmowych i prywatnych)
- Modyfikować kod źródłowy
- Rozpowszechniać zmodyfikowane wersje
- Self-hostować bez opłat

**Ograniczenie:** nie możesz oferować OpenKSeF jako usługi hostowanej (SaaS) bez zgody autora. Szczegóły: [COMMERCIAL.md](https://github.com/open-ksef/open-ksef/blob/main/COMMERCIAL.md).

Pełny tekst licencji: [Elastic License 2.0](licencja)

## Self-hosting i odpowiedzialność za dane

OpenKSeF jest zaprojektowany do **self-hostingu** -- uruchamiasz go na własnej infrastrukturze (serwerze, VPS, chmurze, komputerze domowym).

**Co to oznacza:**

- **Twoje dane zostają u Ciebie** -- faktury, tokeny KSeF, dane użytkowników są przechowywane w Twojej bazie PostgreSQL
- **Ty kontrolujesz dostęp** -- Keycloak działa na Twojej instancji
- **Ty odpowiadasz za bezpieczeństwo** -- konfigurację HTTPS, backupy, aktualizacje, firewall

:::info Ważne
OpenKSeF to narzędzie. Hostujesz u siebie = Ty odpowiadasz za swoje dane. To Ty decydujesz, jak skonfigurujesz i zabezpieczysz swoją instancję. Autorzy projektu nie mają dostępu do Twoich danych i nie ponoszą odpowiedzialności za ich bezpieczeństwo.
:::

## Zalecenia bezpieczeństwa

Jeśli uruchamiasz OpenKSeF z dostępem z internetu:

1. **Zawsze używaj HTTPS** (np. przez Traefik, Caddy, nginx + certbot)
2. **Regularnie aktualizuj** kontenery Docker
3. **Rób backupy** bazy PostgreSQL
4. **Zmień domyślne hasła** Keycloak (admin/admin)
5. **Ogranicz dostęp** do portów 8081, 8082, 5432 (tylko gateway 8080 powinien być publiczny)
6. **Monitoruj logi** pod kątem nieautoryzowanych prób dostępu

## Technologie

| Komponent | Technologia |
|-----------|-------------|
| Backend API | .NET 8, ASP.NET Core |
| Worker | .NET 8, Background Service |
| Portal webowy | React 19, TypeScript, Vite |
| Aplikacja mobilna | .NET MAUI (Android, iOS) |
| Baza danych | PostgreSQL |
| Uwierzytelnianie | Keycloak (OIDC) |
| Konteneryzacja | Docker, Docker Compose |
| Reverse proxy | nginx |
| Klient KSeF | CIRFMF ksef-client-csharp |

## Kontakt

- GitHub: [github.com/open-ksef](https://github.com/open-ksef)
- Backend + Portal: [github.com/open-ksef/open-ksef](https://github.com/open-ksef/open-ksef)
- Aplikacja mobilna: [github.com/open-ksef/open-ksef-mobile](https://github.com/open-ksef/open-ksef-mobile)
- Dokumentacja: [github.com/open-ksef/open-ksef-doc](https://github.com/open-ksef/open-ksef-doc)
- Issues: [github.com/open-ksef/open-ksef/issues](https://github.com/open-ksef/open-ksef/issues)
