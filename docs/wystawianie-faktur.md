---
sidebar_position: 6
title: Wystawianie faktur
---

# Wystawianie faktur

OpenKSeF wystawia faktury VAT i wysyła je do KSeF. Działa to w portalu: faktury znajdziesz w menu **Wystawione**, a dane firmy w menu **Firma**, na karcie **Dane do faktur**. Wystawianie jest też w [aplikacji na Androida](aplikacja-mobilna), od wersji 1.0.5.

Faktury, które otrzymujesz od dostawców, opisuje strona [Otrzymane faktury](faktury). Sprzedaż wystawioną w innym programie opisuje sekcja [Faktury spoza OpenKSeF](#faktury-spoza-openksef).

:::warning[Sprawdź środowisko]
Przy fakturze widać środowisko KSeF: **TEST**, **DEMO** albo **PRODUKCJA**. Na środowisku PRODUKCJA przyjęta faktura staje się dokumentem prawnym. Nie można jej usunąć ani edytować.
:::

## Zanim zaczniesz

1. Zapisz w **Firma** > **Token KSeF i pobieranie** [token KSeF z uprawnieniem do zapisu](#token-ksef).
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
- **Metoda kasowa**: dodaje na fakturze adnotację „metoda kasowa”. Faktura dla firmy zagranicznej nie ma tej adnotacji.
- **Rachunek do faktur zagranicznych**: opcjonalny. Zobacz [Rachunek i SWIFT](#rachunek-i-swift).

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
   - **Firma zagraniczna**: usługi dla firmy spoza Polski. Zobacz [Faktury dla firm zagranicznych](#faktury-dla-firm-zagranicznych).
3. Sprawdź daty. Data wystawienia nie może być późniejsza niż dzisiejsza, a termin płatności nie może być wcześniejszy niż data wystawienia.
4. Dodaj pozycje: nazwa, jednostka, ilość, cena netto, stawka VAT. Dostępne stawki to 23, 8, 5, 0 KR i zw. Przy stawce zw podaj podstawę zwolnienia. Dla firmy zagranicznej dostępne są tylko np I i np II.
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

Pliki są dostępne dla faktury wystawionej w OpenKSeF i **Przyjętej w KSeF**.

- **XML**: dokładnie te dane, które trafiły do KSeF.
- **UPO**: urzędowe poświadczenie odbioru. Może pojawić się chwilę po przyjęciu faktury. Do tego czasu widać „Oczekuje na UPO”.
- **PDF**: wizualizacja faktury z kodem **KOD I**, po którego zeskanowaniu można sprawdzić fakturę w KSeF. Przekaż ten PDF nabywcy, który nie korzysta z KSeF, na przykład osobie prywatnej.

Pliki pobierzesz w portalu przyciskami **Pobierz XML**, **Pobierz UPO** i **Pobierz PDF**. Faktura dla firmy zagranicznej ma [trzy przyciski PDF](#pdf-dla-nabywcy).

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
- **To inna sprzedaż:** użyj **Kopiuj jako nową**. Jeśli wcześniejsze numery nadano poza OpenKSeF, najpierw ustaw wyższy następny numer w **Firma** > **Dane do faktur**.

## Faktury dla firm zagranicznych

OpenKSeF wystawia faktury za **usługi** dla firm spoza Polski, w PLN lub w walucie obcej. Działa to tylko w portalu. Faktura trafia do KSeF jak każda inna.

:::warning[O stawce decydujesz Ty]
OpenKSeF nie sprawdzi, czy nabywca naprawdę prowadzi firmę ani czy miejsce świadczenia usługi jest poza Polską. Wybierając **Firma zagraniczna**, sam to stwierdzasz. Faktura w tej formie nie jest przeznaczona dla osoby prywatnej. Jeśli masz wątpliwość, [zapytaj księgowego](#zapytaj-księgowego). Ten opis nie jest poradą podatkową ani stanowiskiem Ministerstwa Finansów.
:::

### Kiedy np I, a kiedy np II

Obie stawki oznaczają, że miejsce świadczenia usługi jest poza Polską. Faktura nie ma kwoty VAT. Program przyjmuje stawkę zgodną z krajem nabywcy i sam proponuje ją w formularzu.

| Stawka | Nabywca | Kiedy | Numer nabywcy |
|--------|---------|-------|---------------|
| **np II** | Firma z innego kraju UE | Usługa opodatkowana w kraju nabywcy, a VAT rozlicza nabywca (art. 28b i art. 100 ust. 1 pkt 4 ustawy o VAT) | **Numer VAT UE**, wymagany, z kodem kraju lub bez niego |
| **np I** | Firma spoza UE, na przykład z Wielkiej Brytanii, USA lub Szwajcarii | Miejsce świadczenia usługi poza UE (art. 28b ustawy o VAT) | **Numer podatkowy** albo **Bez numeru podatkowego** |

Art. 28b to zasada ogólna dla usług na rzecz podatnika. Inne przepisy określają miejsce świadczenia inaczej, na przykład usług związanych z nieruchomością (art. 28e) i transportu pasażerów (art. 28f). Wtedy te stawki mogą nie pasować.

Nabywca z polskim NIP to zwykła **Firma**. Program nie przyjmie jako numeru zagranicznego polskiego NIP z przedrostkiem `PL`. Numeru VAT UE nie sprawdza w systemie VIES, więc sprawdź go sam.

### Nabywca bez numeru podatkowego

Dla nabywcy spoza UE możesz zaznaczyć **Bez numeru podatkowego**. Faktura nie będzie wtedy miała numeru nabywcy, a wydruk pominie ten wiersz. Dla nabywcy z UE ta opcja nie istnieje, bo numer VAT UE jest wymagany.

Brak numeru nie zmienia decyzji o stawce: nadal to Ty stwierdzasz, że nabywca jest firmą. Po ponownym otwarciu szkicu lub skopiowaniu faktury zaznaczenie znika. Zaznacz je jeszcze raz albo wpisz numer, inaczej wystawienie zostanie zablokowane.

### Dane nabywcy

Wpisz nazwę i adres alfabetem łacińskim, także dla kraju, który używa innego pisma. Wydruk dwujęzyczny nie pokaże niektórych pism, na przykład arabskiego i chińskiego. Polskie znaki drukują się poprawnie.

### Waluta i kurs

Wybierz walutę w sekcji **Daty i płatność**. Przy walucie innej niż PLN wymagany jest kurs, widoczny w polu **Kurs: 1 GBP w PLN**. Kurs trafia do faktury w KSeF i na wydruk. Kwoty na liście, w szczegółach i na PDF są w walucie faktury.

- **Podpowiedź:** program proponuje średni kurs NBP z tabeli A, z ostatniego dnia roboczego przed wcześniejszą z dwóch dat: wystawienia i sprzedaży. Pod polem widać datę tabeli. Po zmianie daty podpowiedź się odświeża.
- **Własny kurs:** wpisz go w polu. Zobaczysz `Kurs wpisany ręcznie.` oraz kurs NBP do porównania. Program nie sprawdza wpisanego kursu. **Użyj kursu NBP** przywraca podpowiedź.
- **Brak kursu NBP:** gdy NBP nie odpowiada albo nie podaje tej waluty, zobaczysz `Brak kursu NBP. Wpisz kurs ręcznie.` Szkic można zapisać, ale wystawienie wymaga kursu.
- **Kurs niepasujący do dat:** jeśli zapisany kurs NBP nie pasuje do dat faktury, wystawienie zostanie zablokowane. Pobierz kurs ponownie albo wpisz go ręcznie.
- **Kopiuj jako nową:** nowy szkic dostaje nową podpowiedź kursu.

:::caution[Nie czyść pola kursu przed wystawieniem]
Gdy pole jest puste, a NBP zna walutę, program sam wpisze kurs NBP. Na środowiskach TEST i DEMO faktura wyśle się od razu, więc tego kursu nie zobaczysz przed wysyłką.
:::

Podpowiedź liczy się tylko z dat na fakturze. Przy usługach ciągłych i przy obowiązku podatkowym w innym dniu ustal kurs z księgowym.

### Rachunek i SWIFT

W **Firma** > **Dane do faktur** możesz podać rachunek w karcie **Rachunek do faktur zagranicznych**: IBAN, SWIFT i nazwę banku.

- Z tym rachunkiem faktura dla firmy zagranicznej pokaże jego dane.
- Bez niego pokaże rachunek główny jako `PL` + numer rachunku, ze SWIFT i nazwą banku, jeśli wpiszesz je przy rachunku głównym.

Rachunek jest zapisywany na fakturze w chwili wystawienia. Późniejsza zmiana danych firmy nie zmienia wystawionych faktur. Faktura dla firmy zagranicznej nie ma pola mechanizmu podzielonej płatności.

### Nazwa pozycji po polsku i angielsku

Wpisz nazwę w jednym polu: najpierw po polsku, potem po angielsku, rozdzielone ukośnikiem:

```
Usługi programistyczne/Software development services
```

Na wydruku dwujęzycznym program rozdzieli te części, a ukośnik zniknie. W pliku XML i w KSeF nazwa zostaje w całości.

- Części rozdziela ukośnik ze spacjami (`Usługi doradcze / Consulting services`) albo ukośnik bez spacji, z małą literą przed nim i wielką po nim.
- Nazwy takie jak `Konsultacje 10/2026` i `Wsparcie CI/CD` nie zostaną rozdzielone. Wydrukują się raz, w całości.
- Program nie rozpoznaje języka. Nazwa zaczynająca się od angielskiego wydrukuje angielski na miejscu polskiego.

### PDF dla nabywcy

Nabywca nie dostanie tej faktury z KSeF. Gdy faktura ma status **Przyjęta w KSeF**, pobierz PDF i wyślij mu go w sposób, który z nim uzgodnisz. OpenKSeF nie wysyła go sam. Każdy PDF ma kod **KOD I** i numer KSeF, więc nabywca może sprawdzić fakturę w KSeF.

| Przycisk | Co dostajesz |
|----------|--------------|
| **Pobierz PDF (EN/PL)** | Wydruk dwujęzyczny: angielski duży, polski mały, kwoty w formacie `2,350.50 GBP` |
| **Pobierz PDF (PL/EN)** | Wydruk dwujęzyczny: polski duży, angielski mały, kwoty w formacie `2 350,50 GBP` |
| **Pobierz PDF (wzór MF)** | Wizualizacja według wzoru Ministerstwa Finansów |

Wydruk dwujęzyczny bierze wszystkie dane z pliku XML wysłanego do KSeF. Podaje kurs waluty i kwotę słownie w obu językach. Nie jest nowym dokumentem: fakturą pozostaje XML w KSeF.

Wydruk zawsze pokazuje `Paid` / `Zapłacono` 0 i całą kwotę do zapłaty. Zawiera też adnotację `Reverse charge` / `Odwrotne obciążenie` i objaśnienie `np: not subject to VAT in Poland` / `np: niepodlegające opodatkowaniu w Polsce`.

### Aplikacja mobilna a faktury zagraniczne

Faktury dla firmy zagranicznej nie wystawisz w aplikacji mobilnej. Od wersji 1.0.6 aplikacja pokazuje taką fakturę tylko do podglądu: z walutą, krajem nabywcy i stawką np. Zamiast edycji szczegóły proponują **Edytuj w portalu**.

Wersja 1.0.5 pokazuje taką fakturę błędnie. Nie edytuj w niej szkicu tej faktury: zainstaluj nowszą wersję albo popraw szkic w portalu.

### Zapytaj księgowego

Faktury dla firm zagranicznych sprawdziliśmy na środowisku testowym KSeF. KSeF je przyjmuje, ale to nie rozstrzyga skutków podatkowych. Nie jest to porada podatkowa, a księgowy nie sprawdzał jeszcze tych ustawień. Zapytaj swojego księgowego, zwłaszcza o to:

- Czy zastosować np I lub np II do Twojej usługi i tego nabywcy.
- Czy adnotacja `Odwrotne obciążenie` (`P_18 = 1` w XML) jest właściwa dla np I, a nie tylko dla np II.
- Czy objaśnienie `not subject to VAT in Poland` dobrze opisuje np I i np II.
- Czy można wysłać nabywcy sam wydruk dwujęzyczny, bez PDF według wzoru MF.
- Czy rozdzielona lub przetłumaczona nazwa pozycji, kraj i sposób zapłaty są zgodne z XML.
- Czy `Paid 0` na każdym wydruku jest do przyjęcia.
- Jak traktować usługę dla Irlandii Północnej (kod `XI`). Program uznaje ją za usługę spoza UE, ze stawką np I.
- Który kurs przyjąć przy usługach ciągłych.
- Jak ująć faktury w JPK_V7 i VAT-UE. OpenKSeF tych plików nie tworzy.
- Czy przed wystawieniem faktury np II musisz być zarejestrowany jako podatnik VAT UE.

## Faktury spoza OpenKSeF

OpenKSeF pobiera z KSeF także faktury sprzedażowe, które firma wystawiła w innym programie. Pierwsze pobranie sięga najwyżej 12 miesięcy wstecz. Później dochodzą tylko nowe faktury.

Znajdziesz je w menu **Wystawione**, pod filtrami **Wszystkie** i **Przyjęte**, ze statusem **Przyjęta w KSeF** i oznaczeniem `Spoza OpenKSeF`. Faktura wystawiona w OpenKSeF jest na liście raz i nie ma tego oznaczenia.

Te faktury są tylko do odczytu:

- Nie mają statusu płatności ani terminu płatności. Nie oznaczysz ich jako opłaconych.
- Nie mają danych do przelewu ani kodu QR.
- Nie mają plików XML, UPO i PDF.
- Pozycje [dochodzą stopniowo](faktury#uzupełnianie-pozycji-rachunku-i-terminu), po nowych i nieopłaconych fakturach otrzymanych. Do tego czasu w szczegółach zobaczysz `Pozycji tej faktury nie pobrano jeszcze z KSeF.`

Przy fakturze w walucie obcej wiersz VAT nazywa się **VAT w przeliczeniu na PLN**. Netto i brutto są w walucie faktury, więc netto plus VAT nie daje brutto.

:::caution[Po pierwszej synchronizacji lista może być pusta]
Lista może zostać pusta albo niepełna, jeśli pobranie listy sprzedaży z KSeF się nie uda. Synchronizacja nie pokazuje wtedy błędu. Brakujące faktury doda kolejna synchronizacja: automatyczna (domyślnie do 4 godzin) albo [ręczna](faktury#synchronizacja-z-ksef).
:::

Tych faktur nie obejmują powiadomienia push i nie ma ich w aplikacji mobilnej.

Usunięcie firmy usuwa te faktury tylko z OpenKSeF. W KSeF zostają.

## Aplikacja mobilna

Wystawianie faktur jest też w [aplikacji na Androida](aplikacja-mobilna), od wersji 1.0.5. Faktury dla firm zagranicznych wystawisz tylko w portalu: [szczegóły](#aplikacja-mobilna-a-faktury-zagraniczne).

## Ograniczenia

Tych rzeczy OpenKSeF jeszcze nie obsługuje:

| Czego nie ma | Co zrobić |
|--------------|-----------|
| **Faktura korygująca (korekta)** | Wystaw ją w Aplikacji Podatnika KSeF Ministerstwa Finansów |
| **Faktura zaliczkowa i rozliczeniowa** | Użyj Aplikacji Podatnika KSeF lub innego programu |
| **Proforma** | Użyj innego programu. Proforma nie jest fakturą i nie trafia do KSeF |
| **Towary za granicę**: WDT i eksport, stawki 0 WDT i 0 EX | Użyj Aplikacji Podatnika KSeF lub innego programu |
| **VAT w walucie obcej**: stawka 23, 8 lub 5 w innej walucie niż PLN | Użyj Aplikacji Podatnika KSeF lub innego programu |
| **Waluta obca dla nabywcy Firma lub Osoba prywatna** | Użyj Aplikacji Podatnika KSeF lub innego programu |
| **Osoba prywatna za granicą i OSS** | Użyj Aplikacji Podatnika KSeF lub innego programu |
| **Stawka oo** | Użyj Aplikacji Podatnika KSeF lub innego programu |
| **Faktura dla firmy zagranicznej w aplikacji mobilnej** | Wystaw ją w portalu |
| **Kilka serii numeracji i numery wpisywane ręcznie** | Jedna firma ma jeden wzorzec numeru |

Dodatkowo:

- Przyjętej faktury nie można zmienić ani usunąć pojedynczo w OpenKSeF. Z KSeF nie można jej usunąć wcale.
- Firmę usuniesz razem z jej wystawionymi fakturami, chyba że ma fakturę wystawioną w OpenKSeF w statusie **Wysyłanie** albo przyjętą na środowisku PRODUKCJA. [Faktury spoza OpenKSeF](#faktury-spoza-openksef) nie blokują usunięcia. Przy wysyłce poczekaj na jej koniec. Przy fakturze przyjętej na środowisku PRODUKCJA skontaktuj się z właścicielem instancji. Usuniętych faktur wystawionych w OpenKSeF i szkiców nie da się przywrócić.
- OpenKSeF nie ocenia skutków podatkowych faktury. W razie wątpliwości zapytaj księgowego lub doradcę podatkowego.
