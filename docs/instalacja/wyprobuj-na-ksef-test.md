---
sidebar_position: 3
title: Wypróbuj na KSeF TEST
---

import TestNip from '@site/src/components/TestNip';

# Wypróbuj na KSeF TEST

Zanim podłączysz prawdziwą firmę, sprawdź OpenKSeF na testowym środowisku KSeF Ministerstwa Finansów. Do KSeF TEST logujesz się dowolnym, losowym NIP-em, bez Profilu Zaufanego i bez podpisu kwalifikowanego.

Na tej stronie zainstalujesz OpenKSeF, pobierzesz faktury fikcyjnej firmy A, wystawisz fakturę z firmy A do fikcyjnej firmy B i zobaczysz ją u firmy B w fakturach otrzymanych. Wszystko działa na Twoim komputerze.

:::danger[KSeF TEST jest otwarty i wspólny]
- KSeF TEST jest otwarty dla wszystkich. Dane nie są odizolowane: każdy, kto zaloguje się tym samym NIP-em, widzi te same faktury.
- **Nigdy nie wpisuj prawdziwego NIP-u, nazwy firmy, adresu ani numeru rachunku.** Używaj tylko zmyślonych danych.
- Faktury na KSeF TEST nie mają skutków prawnych ani podatkowych.
- W godzinach 16:00-18:00 Ministerstwo Finansów prowadzi na środowiskach testowych prace serwisowe. Logowanie, pobieranie i wysyłka mogą wtedy nie działać.
:::

## Krok 1: Wylosuj NIP-y

Potrzebujesz dwóch fikcyjnych NIP-ów: firmy A (sprzedawca) i firmy B (nabywca). OpenKSeF sprawdza cyfrę kontrolną NIP-u, więc zwykły ciąg 10 cyfr nie wystarczy. Przycisk losuje NIP z poprawną cyfrą kontrolną. Losowanie działa w przeglądarce, nic nie jest wysyłane.

<TestNip label="NIP firmy A" />

<TestNip label="NIP firmy B" />

Zapisz oba numery. Nie używaj NIP-ów z przykładów w internecie: popularne NIP-y testowe mają tysiące faktur obcych osób.

## Krok 2: Zainstaluj OpenKSeF

Zainstaluj OpenKSeF w nowym katalogu według [Szybkiego startu](szybki-start). W kreatorze konfiguracji:

- **Środowisko KSeF**: zostaw **Test**. To wartość domyślna.
- **NIP**: wpisz NIP firmy A z kroku 1.
- **Nazwa firmy**, **Nazwa administratora danych** i **Kontakt do administratora danych**: wpisz zmyślone dane.
- **Powiadomienia push**: wybierz **Tylko lokalne (SignalR)**. Do próby nie są potrzebne.

Pierwsze logowanie do portalu poprosi o [weryfikację dwuetapową](../weryfikacja-dwuetapowa#pierwsze-logowanie-włącz-weryfikację). Przygotuj aplikację uwierzytelniającą w telefonie.

## Krok 3: Wygeneruj token dla firmy A

1. Otwórz testową Aplikację Podatnika: [ap-test.ksef.mf.gov.pl](https://ap-test.ksef.mf.gov.pl).
2. Wybierz **Uwierzytelnij się w Krajowym Systemie e-Faktur**, a potem **Zaloguj uwierzytelnieniem testowym**.
3. W polu **Identyfikator** zostaw **NIP firmy** i wpisz NIP firmy A.
4. W sekcji **Podpisz testowe żądanie autoryzacyjne** zostaw typ **Pieczęć NIP**, wpisz ten sam NIP firmy A i kliknij **Uwierzytelnij do aplikacji testowej**.
5. Wygeneruj token z uprawnieniami **Przeglądanie faktur** i **Wystawianie faktur**.
6. Skopiuj token od razu. Aplikacja Podatnika pokazuje go tylko raz.

## Krok 4: Wklej token i pobierz faktury

1. W portalu otwórz **Firma** > **Dostęp do KSeF i pobieranie** i wklej token przyciskiem **Dodaj token**.
2. Kliknij **Pobierz z KSeF**. Pobieranie powinno zakończyć się bez błędu. Nowa firma zwykle nie ma jeszcze faktur.

Szczegóły: [Token KSeF](../token-ksef#wklej-token-w-openksef).

## Krok 5: Wystaw fakturę do firmy B

1. Otwórz **Firma** > **Dane do faktur**. Fikcyjnego NIP-u nie ma na białej liście, więc **Pobierz z NIP** nic nie znajdzie. Wpisz ręcznie zmyśloną nazwę i adres sprzedawcy. Rachunku bankowego nie wpisuj.
2. Otwórz **Wystawione** > **Nowa faktura**.
3. Wybierz nabywcę **Firma** i wpisz NIP firmy B. Nazwę i adres nabywcy wpisz ręcznie, zmyślone.
4. Dodaj pozycję, np. „Usługa testowa”, ilość 1, cena 100, stawka 23.
5. Jako płatność wybierz **Gotówka**. Wtedy faktura nie potrzebuje numeru rachunku.
6. Kliknij **Wystaw i wyślij do KSeF**. Na KSeF TEST faktura wysyła się bez okna potwierdzenia.

Po chwili faktura ma status **Przyjęta w KSeF**, numer KSeF, a potem UPO. Pobierzesz je przyciskami **Pobierz XML**, **Pobierz UPO** i **Pobierz PDF**. Wszystkie statusy: [Wystawianie faktur](../wystawianie-faktur#statusy).

## Krok 6: Zobacz fakturę u firmy B

1. W Aplikacji Podatnika wyloguj się i zaloguj jak w kroku 3, tym razem NIP-em firmy B. Wygeneruj token z tymi samymi uprawnieniami.
2. W portalu dodaj firmę B: przełącznik firm na górze menu bocznego > **Dodaj firmę**, NIP firmy B, token firmy B.
3. Przy wybranej firmie B kliknij **Pobierz z KSeF**.
4. Otwórz **Otrzymane**. Na liście jest faktura od firmy A.

## Token na KSeF TEST po 2026 roku

Testowa Aplikacja Podatnika generuje tokeny „do 31 grudnia 2026 r.” ([strona wersji testowej](https://ksef.podatki.gov.pl/aplikacja-podatnika-ksef-20/aplikacja-podatnika-ksef-20-wersja-testowa/)). Ministerstwo Finansów zapowiedziało, że tokeny zostaną utrzymane bezterminowo, a rozporządzenie zostanie znowelizowane ([Certyfikaty KSeF](https://ksef.podatki.gov.pl/informacje-ogolne-ksef-20/certyfikaty-ksef/), sekcja „Certyfikaty KSeF a tokeny”). Do czasu zmiany strony testowej termin 31 grudnia 2026 r. obowiązuje.

Ta strona opisuje tylko logowanie tokenem. Jeśli po 31 grudnia 2026 r. testowa Aplikacja Podatnika przestanie generować tokeny, ta ścieżka przestanie działać.

## Przejście na prawdziwe faktury

Nie przełączaj na produkcję instalacji, w której są firmy testowe. Faktury i firmy z KSeF TEST zostałyby w bazie obok prawdziwych.

1. Zacznij od nowej instalacji w nowym katalogu albo usuń dane próbnej: `docker compose down -v`. To polecenie usuwa bazę i wszystko, co w niej jest.
2. Przejdź [Szybki start](szybki-start) jeszcze raz i w kreatorze wybierz środowisko **Produkcja**.
3. Wygeneruj prawdziwy token w produkcyjnej Aplikacji Podatnika: [Token KSeF](../token-ksef).

## Źródła

- [Aplikacja Podatnika KSeF 2.0, wersja testowa](https://ksef.podatki.gov.pl/aplikacja-podatnika-ksef-20/aplikacja-podatnika-ksef-20-wersja-testowa/) (Ministerstwo Finansów)
- [Instrukcja uwierzytelnienia w Aplikacji Podatnika KSeF, wersja testowa](https://ksef.podatki.gov.pl/media/jxgjepcn/instrukcja-uwierzytelnienia-w-aplikacji-podatnika-ksef-20-wersja-testowa.pdf), rozdz. 1.1 (Ministerstwo Finansów, listopad 2025)
- [Certyfikaty KSeF](https://ksef.podatki.gov.pl/informacje-ogolne-ksef-20/certyfikaty-ksef/) (Ministerstwo Finansów)
- [Środowiska KSeF API 2.0](https://github.com/CIRFMF/ksef-docs/blob/main/srodowiska.md)
