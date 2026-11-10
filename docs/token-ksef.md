---
title: Token KSeF
---

# Token KSeF

OpenKSeF łączy się z KSeF tokenem KSeF. Token generuje podatnik w narzędziu Ministerstwa Finansów, a potem wkleja go w OpenKSeF. Bez tokenu firma nie pobiera ani nie wystawia faktur.

W OpenKSeF nie dodasz certyfikatu KSeF. Firmy z certyfikatem z wcześniejszych wersji: [Firma z certyfikatem](#firma-z-certyfikatem).

## Wygeneruj token

1. Otwórz Aplikację Podatnika KSeF 2.0 w tym samym środowisku, w którym działa Twoja instancja ([Środowiska KSeF](instalacja/konfiguracja#środowiska-ksef)):
   - produkcja: [ap.ksef.mf.gov.pl](https://ap.ksef.mf.gov.pl),
   - test: [ap-test.ksef.mf.gov.pl](https://ap-test.ksef.mf.gov.pl).
2. Zaloguj się pieczęcią kwalifikowaną firmy albo jako osoba z uprawnieniami do firmy w KSeF: podpisem kwalifikowanym lub Profilem Zaufanym. To logowanie jest potrzebne tylko do wygenerowania tokenu. OpenKSeF go nie wykonuje.
3. Wygeneruj token z dwoma uprawnieniami:
   - **odczyt faktur** (w API KSeF `InvoiceRead`), aby pobierać faktury,
   - **wystawianie faktur** (`InvoiceWrite`), aby je wysyłać.
4. Skopiuj token od razu. Aplikacja Podatnika pokazuje go tylko raz.

Uprawnień tokenu nie da się zmienić. Jeśli brakuje uprawnienia, wygeneruj nowy token i podmień go w OpenKSeF.

Sam odczyt wystarczy do przeglądania faktur, ale nie do ich [wystawiania](wystawianie-faktur#token-ksef).

## Wklej token w OpenKSeF

- **Portal, nowa firma:** krok **Połącz z KSeF** w pierwszej konfiguracji.
- **Portal, istniejąca firma:** **Firma** > **Token KSeF i pobieranie**, przycisk **Dodaj token** albo **Zapisz token**. Nowy token zastępuje poprzedni.
- **Aplikacja mobilna:** krok z tokenem w pierwszej konfiguracji firmy. Token zmienisz później w portalu.

Firma ma jeden token. OpenKSeF przechowuje go zaszyfrowany i nie pokazuje go ponownie: portal wyświetla tylko datę ostatniej aktualizacji.

Po zapisaniu uruchom **Pobierz z KSeF**, aby sprawdzić, czy token działa.

## Firma z certyfikatem

Jeśli firma ma zapisany certyfikat z wcześniejszych wersji, pobieranie faktur działa dalej, ale wysyłka faktur do KSeF wymaga tokenu. Wklej token w **Firma** > **Token KSeF i pobieranie**. Token zastąpi certyfikat na stałe.

## Ważność

Token ma termin ważności w przepisach: [Ważność tokenu](wystawianie-faktur#token-ksef).

Token przestaje działać, gdy unieważnisz go w Aplikacji Podatnika. Wtedy wygeneruj nowy i podmień go w OpenKSeF.

## Źródła

- [Aplikacja Podatnika KSeF 2.0](https://ksef.podatki.gov.pl/aplikacja-podatnika-ksef-20/) i [wersja testowa](https://ksef.podatki.gov.pl/aplikacja-podatnika-ksef-20/aplikacja-podatnika-ksef-20-wersja-testowa/) (Ministerstwo Finansów)
- [Zarządzanie tokenami KSeF](https://github.com/CIRFMF/ksef-api/blob/main/tokeny-ksef.md) (dokumentacja API KSeF 2.0)
- [Środowiska KSeF API 2.0](https://github.com/CIRFMF/ksef-api/blob/main/srodowiska.md)
- [Uwierzytelnianie](https://github.com/CIRFMF/ksef-api/blob/main/uwierzytelnianie.md) (dokumentacja API KSeF 2.0)
