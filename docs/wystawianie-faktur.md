---
sidebar_position: 6
title: Wystawianie faktur
---

# Wystawianie faktur

OpenKSeF wystawia faktury VAT i wysyła je do KSeF. Działa to w portalu: faktury znajdziesz w menu **Wystawione**, a dane firmy w menu **Dane do faktur**. Wystawianie jest też w aplikacji na Androida, od wersji 1.0.5, ale [kończymy poprawki, zanim zalecimy jej instalację](aplikacja-mobilna).

Faktury, które otrzymujesz od dostawców, opisuje strona [Faktury](faktury).

:::warning[Sprawdź środowisko]
Przy fakturze widać środowisko KSeF: **TEST**, **DEMO** albo **PRODUKCJA**. Na środowisku PRODUKCJA przyjęta faktura staje się dokumentem prawnym. Nie można jej usunąć ani edytować.
:::

## Zanim zaczniesz

1. Zapisz w ustawieniach firmy [token KSeF z uprawnieniem do zapisu](#token-ksef).
2. Uzupełnij [dane do faktur](#dane-do-faktur).

## Token KSeF

Token musi mieć dwa uprawnienia:

- **odczyt faktur**, aby pobierać faktury z KSeF,
- **wystawianie faktur** (zapis), aby je wysyłać.

Sam odczyt wystarczy do przeglądania faktur, ale nie do ich wystawiania. Wysyłka zakończy się wtedy komunikatem:

> Token KSeF nie ma uprawnienia do wystawiania faktur. Wygeneruj token z uprawnieniem do zapisu i podmień go w ustawieniach firmy.

Jeśli firma ma token tylko do odczytu, wygeneruj nowy w Aplikacji Podatnika KSeF i podmień go w ustawieniach firmy.

:::note[Ważność tokenu]
Token nie jest wieczny. Logowanie tokenem jest dopuszczone do 31 grudnia 2026 r. (Dz.U. 2025 poz. 1815, § 13), chyba że przepisy zostaną zmienione. Sprawdź aktualny stan w [materiałach Ministerstwa Finansów](https://ksef.podatki.gov.pl/).
:::

## Dane do faktur

Te dane trafiają na każdą wystawianą fakturę. Bez nich wystawianie jest zablokowane.

- **Sprzedawca**: nazwa i adres. **Pobierz z NIP** uzupełnia je z białej listy Ministerstwa Finansów i pokazuje status VAT. Jeśli firmy nie ma na białej liście, wpisz dane ręcznie.
- **Rachunek bankowy**: wybierz rachunek z białej listy albo wpisz inny. Numer rachunku jest wymagany przy płatności przelewem. Rachunek spoza białej listy to ryzyko podatkowe nabywcy przy płatnościach powyżej 15 000 zł.
- **Metoda kasowa**: dodaje na fakturze adnotację „metoda kasowa”.

### Numeracja

Numer nadaje serwer w chwili wystawienia. Szkic nie ma numeru, więc usunięcie szkicu nie zostawia luki.

| Znacznik | Znaczenie |
|----------|-----------|
| `{nr}` | Kolejny numer |
| `{MM}` | Miesiąc z daty wystawienia |
| `{RRRR}` | Rok z daty wystawienia, wymagany we wzorcu |

- Domyślny wzorzec to `FV/{nr}/{MM}/{RRRR}`, na przykład `FV/1/11/2026`.
- Licznik zaczyna się od nowa co miesiąc, jeśli wzorzec zawiera `{MM}`. W przeciwnym razie zaczyna się od nowa co rok.
- **Jeśli wystawiałeś już faktury w innym programie, ustaw wyższy następny numer.** KSeF nie przyjmie numeru, który ta firma już wykorzystała.

Formularz pokazuje numer, który dostanie następna faktura.

## Wystawienie faktury

1. W menu **Wystawione** utwórz nową fakturę.
2. Wybierz nabywcę:
   - **Firma**: wymagany jest poprawny NIP. **Pobierz z NIP** uzupełni nazwę i adres.
   - **Osoba prywatna**: bez NIP, z nazwą i adresem. Po przyjęciu faktury przekaż nabywcy PDF z kodem KOD I.
3. Sprawdź daty. Data wystawienia nie może być późniejsza niż dzisiejsza, a termin płatności nie może być wcześniejszy niż data wystawienia.
4. Dodaj pozycje: nazwa, jednostka, ilość, cena netto, stawka VAT. Dostępne stawki to 23, 8, 5, 0 KR i zw. Przy stawce zw podaj podstawę zwolnienia.
5. Wybierz płatność: **Przelew**, **Gotówka** albo **Karta**. W razie potrzeby zaznacz mechanizm podzielonej płatności. Program przypomni o nim, ale nie rozstrzygnie, czy faktura go wymaga.
6. Kliknij **Zapisz szkic**, jeśli chcesz wrócić do faktury później. Szkic można edytować i usunąć.
7. Kliknij **Wystaw i wyślij do KSeF**. Na środowiskach TEST i DEMO faktura wysyła się od razu. W pozostałych przypadkach potwierdź w oknie z numerem, nabywcą, datą i kwotą.

VAT jest liczony od sumy netto dla każdej stawki. VAT widoczny przy pozycji jest poglądowy.

## Statusy

| Status | Co oznacza | Co możesz zrobić |
|--------|------------|------------------|
| **Szkic** | Faktura bez numeru, nie została wysłana | Edytować, usunąć, wystawić |
| **Wysyłanie** | Numer nadany, trwa wysyłka lub czekamy na odpowiedź KSeF | Poczekać. Możesz zamknąć stronę |
| **Przyjęta w KSeF** | KSeF nadał numer KSeF | Pobrać XML, UPO i PDF, skopiować |
| **Odrzucona** | KSeF nie przyjął faktury albo wysyłka nie mogła się rozpocząć | Zobacz [Odrzucona faktura](#odrzucona-faktura) |

Jeśli KSeF nie odpowiada albo wynik wysyłki jest niepewny, faktura zostaje w statusie **Wysyłanie**, a OpenKSeF ponawia sprawdzanie. **Nie wysyłaj wtedy faktury drugi raz.** Wcześniejsza próba mogła zostać przyjęta, a kopia oznaczałaby drugi dokument dla tej samej sprzedaży. Dlatego w tym statusie nie można skopiować faktury.

## XML, UPO i PDF

Pliki są dostępne dla faktury **Przyjętej w KSeF**.

- **XML**: dokładnie te dane, które trafiły do KSeF.
- **UPO**: urzędowe poświadczenie odbioru. Może pojawić się chwilę po przyjęciu faktury. Do tego czasu widać „Oczekuje na UPO”.
- **PDF**: wizualizacja faktury z kodem **KOD I**, po którego zeskanowaniu można sprawdzić fakturę w KSeF. Przekaż ten PDF nabywcy, który nie korzysta z KSeF, na przykład osobie prywatnej.

Pliki pobierzesz w portalu przyciskami **Pobierz XML**, **Pobierz UPO** i **Pobierz PDF**.

## Odrzucona faktura

Odrzucona faktura **zachowuje swój numer**. Zobaczysz kod i opis błędu z KSeF. **Popraw i wyślij ponownie** wysyła poprawioną fakturę z tym samym numerem.

### Data zostaje w okresie numeru

Numer zawiera okres, więc datę wystawienia możesz zmienić tylko w jego obrębie. Dla numeru `FV/7/11/2026` jest to listopad 2026 r. Inna data zostanie odrzucona komunikatem:

> Numer FV/7/11/2026 należy do okresu 11/2026. Zostaw datę wystawienia w tym okresie albo użyj „Kopiuj jako nową”. Nowa faktura dostanie nowy numer, a ten pozostanie niewykorzystany.

### Kopiuj jako nową

**Kopiuj jako nową** tworzy szkic z tym samym nabywcą i pozycjami, z dzisiejszą datą wystawienia i sprzedaży, terminem płatności za 14 dni i bez numeru. Numer dostanie przy wystawieniu.

Skopiowanie odrzuconej faktury nie usuwa jej ani nie zwalnia jej numeru. Odrzucona faktura zostaje na liście i pokazuje, dlaczego ten numer nie został wykorzystany. Nie można jej usunąć.

### Kod 440: numer jest już w KSeF

Kod 440 oznacza, że KSeF ma już dokument tej firmy z tym samym numerem. Ponowna wysyłka z tym numerem się nie uda, więc jest zablokowana. Zobaczysz komunikat:

> Ten numer faktury jest już użyty w KSeF. Sprawdź tę fakturę w KSeF, zanim wystawisz ją pod nowym numerem.

Jeśli numer KSeF tego dokumentu jest znany, OpenKSeF go pokaże, razem ze wskazówką:

> Sprawdź tę fakturę w KSeF. Jeśli to ta sama sprzedaż, nie wystawiaj jej ponownie.

Dokument sprawdzisz na przykład w Aplikacji Podatnika KSeF:

- **To ta sama sprzedaż:** nie wystawiaj faktury ponownie. Kopia oznaczałaby drugi dokument i drugi VAT dla jednej sprzedaży.
- **To inna sprzedaż:** użyj **Kopiuj jako nową**. Jeśli wcześniejsze numery nadano poza OpenKSeF, najpierw ustaw wyższy następny numer w **Dane do faktur**.

## Aplikacja mobilna

Wystawianie faktur jest też w aplikacji na Androida, od wersji 1.0.5. [Kończymy poprawki, zanim zalecimy jej instalację](aplikacja-mobilna).

## Ograniczenia

Tych rzeczy OpenKSeF jeszcze nie obsługuje:

| Czego nie ma | Co zrobić |
|--------------|-----------|
| **Faktura korygująca (korekta)** | Wystaw ją w Aplikacji Podatnika KSeF Ministerstwa Finansów |
| **Faktura zaliczkowa i rozliczeniowa** | Użyj Aplikacji Podatnika KSeF lub innego programu |
| **Proforma** | Użyj innego programu. Proforma nie jest fakturą i nie trafia do KSeF |
| **Waluty inne niż PLN** | Użyj Aplikacji Podatnika KSeF lub innego programu |
| **Stawki inne niż 23, 8, 5, 0 KR i zw**, na przykład 0% przy WDT lub eksporcie, „np” i „oo” | Użyj Aplikacji Podatnika KSeF lub innego programu |
| **Kilka serii numeracji i numery wpisywane ręcznie** | Jedna firma ma jeden wzorzec numeru |

Dodatkowo:

- Przyjętej faktury nie można zmienić ani usunąć pojedynczo w OpenKSeF. Z KSeF nie można jej usunąć wcale.
- Firmę usuniesz razem z jej wystawionymi fakturami, chyba że ma fakturę w statusie **Wysyłanie** albo fakturę przyjętą na środowisku PRODUKCJA. Przy wysyłce poczekaj na jej koniec. Przy fakturze przyjętej na środowisku PRODUKCJA skontaktuj się z właścicielem instancji. Usuniętych faktur nie da się przywrócić.
- OpenKSeF nie ocenia skutków podatkowych faktury. W razie wątpliwości zapytaj księgowego lub doradcę podatkowego.
