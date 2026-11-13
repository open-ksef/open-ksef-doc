---
sidebar_position: 5
title: Otrzymane faktury
---

# Otrzymane faktury

OpenKSeF pobiera z KSeF faktury, w których Twoja firma jest nabywcą (faktury kosztowe). W portalu znajdziesz je w menu **Otrzymane**, a w aplikacji mobilnej na karcie **Otrzymane**.

Faktury sprzedażowe, także [wystawione w innym programie](wystawianie-faktur#faktury-spoza-openksef), opisuje strona [Wystawianie faktur](wystawianie-faktur).

## Lista faktur

![Lista faktur](/img/screenshots/portal/invoices.png)

- Kolumna **Sprzedawca i numer** pokazuje nazwę sprzedawcy, numer nadany przez sprzedawcę (np. `FV/2026/10/0042`) i datę wystawienia. Jeśli faktura nie ma numeru sprzedawcy, wyświetlany jest numer KSeF.
- Kolumna **Termin płatności** pokazuje termin z faktury w KSeF. Jeśli termin minął, a faktura nie jest oznaczona jako opłacona, przy dacie pojawia się `po terminie`.
- Kolumna **Płatność** pokazuje, czy faktura jest oznaczona jako opłacona.
- Kolumny **Netto** i **Numer KSeF** są widoczne na szerszych ekranach.
- Filtry: **Wszystkie** lub **Nieopłacone**, nazwa lub NIP sprzedawcy, zakres dat wystawienia. Firmę wybierasz w karcie **Firma** w menu bocznym.

**Wszystkie** pokazuje faktury od najnowszej. **Nieopłacone** pokazuje faktury, których nie oznaczono jako opłacone, od najbliższego terminu. Faktury bez terminu są na końcu.

:::caution[Starsze faktury: termin dochodzi stopniowo]
Faktury pobrane przed wprowadzeniem tej funkcji mają w kolumnie **Termin płatności** kreskę (`—`), dopóki OpenKSeF nie pobierze ich pliku XML. Nieopłacone [uzupełniają się automatycznie](#uzupełnianie-pozycji-rachunku-i-terminu). Do tego czasu taka faktura nie dostanie oznaczenia `po terminie`, a na liście **Nieopłacone** będzie na końcu, więc sprawdź te faktury osobno.

Gdy termin dojdzie, stara faktura może od razu dostać `po terminie` i przejść na początek listy **Nieopłacone**. Lista zmieni się bez Twojego działania. Fakturę zapłaconą wcześniej oznacz jako opłaconą.

Kreskę zobaczysz też, gdy faktura nie ma terminu albo nie udało się pobrać jej pliku XML.
:::

## Strona Start

Na stronie **Start** karta **Nieopłacone, od najbliższego terminu** pokazuje pierwsze faktury z filtra **Nieopłacone**, a przy minionym terminie także `po terminie`. Link **Wszystkie nieopłacone** otwiera pełną listę. Faktury bez terminu dotyczy to samo ostrzeżenie co na liście.

## Szczegóły faktury

Kliknij fakturę na liście, aby zobaczyć jej szczegóły: numery, sprzedawcę i nabywcę, daty, kwoty netto / VAT / brutto oraz status płatności.

![Szczegóły faktury](/img/screenshots/portal/invoice-detail.png)

Przy fakturze w walucie obcej wiersz VAT nazywa się **VAT w przeliczeniu na PLN**. Netto i brutto są w walucie faktury, więc netto plus VAT nie daje brutto.

### Pozycje faktury

Karta **Pozycje** zawiera wiersze faktury (`FaWiersz`): nazwa, ilość z jednostką, **Cena netto**, **Stawka** i **Brutto**.

![Pozycje faktury](/img/screenshots/portal/invoice-lines.png)

- Większość faktur zawiera tylko ceny netto i stawkę VAT. Wtedy cena brutto i VAT pozycji są **wyliczane** przez OpenKSeF ze stawki (netto × stawka). Mogą się różnić o grosze od kwot na fakturze, bo sprzedawca mógł liczyć VAT od sumy, a nie od każdej pozycji. Wiążące są kwoty z nagłówka faktury.
- Dla stawek nieliczbowych (np. `zw`, `oo`, `np I`, `np II`) VAT pozycji wynosi 0, a brutto = netto.
- Jeśli faktura w KSeF nie ma pozycji (np. niektóre faktury zaliczkowe), karta pokazuje `Brak pozycji w pobranych danych.` Ten sam tekst zobaczysz, dopóki OpenKSeF nie pobierze pliku XML faktury.
- Pozycje nowych i starszych faktur [dochodzą stopniowo](#uzupełnianie-pozycji-rachunku-i-terminu).

### Status płatności

Przycisk **Oznacz jako opłaconą** zmienia status faktury na **Opłacona** i zapisuje datę oznaczenia. **Cofnij oznaczenie** przywraca status **Nieopłacona**.

![Status płatności](/img/screenshots/portal/invoice-paid.png)

:::info[Status tylko w OpenKSeF]
Status płatności to Twoja notatka w OpenKSeF. Nie jest wysyłany do KSeF ani do banku, a OpenKSeF nie sprawdza, czy przelew został wykonany. Synchronizacja (także pełna) nie zmienia statusu płatności.
:::

Status płatności zmienisz w portalu. Aplikacja mobilna go nie pokazuje.

### Zapłać tę fakturę

Karta **Zapłać tę fakturę** zawiera kwotę, termin płatności, odbiorcę, tytuł przelewu i numer rachunku sprzedawcy (z faktury w KSeF). **Kopiuj dane przelewu** kopiuje je do schowka, a **kod QR** (standard ZBP) zeskanujesz w aplikacji bankowej. Bez kodu QR karta nazywa się **Dane do przelewu**. Po oznaczeniu faktury jako opłaconej karta nazywa się **Opłacona**, a dane otworzysz przez **Pokaż dane do przelewu**.

![Zapłać tę fakturę: dane do przelewu i kod QR](/img/screenshots/portal/invoice-qr.png)

Tytuł przelewu to sam numer faktury sprzedawcy, np. `FV/2026/10/0042`. Jeśli faktura nie ma numeru sprzedawcy, tytułem jest numer KSeF. W kodzie QR tytuł ma najwyżej 32 znaki: dłuższy numer jest skracany, a komunikat podaje pełny numer. Sprawdź wtedy tytuł w banku przed wysłaniem przelewu. Gdy nie ma numeru rachunku, pole **Rachunek odbiorcy** pokazuje `brak`.

Dane do przelewu i kod QR przygotowuje serwer OpenKSeF, według tych samych zasad dla portalu i aplikacji mobilnej. Numer rachunku pochodzi z faktury. OpenKSeF nie sprawdza go na białej liście podatników VAT.

#### Kiedy nie ma kodu QR

Kod QR zawsze wypełnia przelew w złotych na konkretną kwotę albo prosi o wpisanie kwoty. Gdy taki przelew byłby błędny, karta nazywa się **Dane do przelewu** i pokazuje tylko dane do przelewu i komunikat z powodem. **Kopiuj dane przelewu** działa w każdym przypadku.

| Sytuacja | Komunikat |
|----------|-----------|
| Faktura w innej walucie niż PLN | `Faktura w walucie EUR: kod QR obsługuje tylko przelew w PLN.` |
| Faktura korygująca (korekta): jej kwota to różnica, nie kwota do zapłaty | `Faktura korygująca: kwota to różnica. Sprawdź, czy jest coś do zapłaty.` |
| Nie wiadomo, jakiego rodzaju jest faktura (faktury pobrane przez starsze wersje OpenKSeF) | `Nie można ustalić rodzaju faktury. Sprawdź kwotę na fakturze. Aby uzyskać kod QR, uruchom pełną resynchronizację (portal: Firma, zakładka Dostęp do KSeF i pobieranie).` Portal pokazuje też link **Przejdź do pobierania**. |
| Faktura VAT RR | `Faktura VAT RR: kod QR nie jest dostępny dla tego rodzaju faktury. Sprawdź dane do zapłaty na fakturze.` |
| Faktura PEF | `Faktura PEF: kod QR nie jest dostępny dla tego rodzaju faktury. Sprawdź dane do zapłaty na fakturze.` |
| Inny, nieznany rodzaj faktury | `Nieznany rodzaj faktury (...): kod QR nie jest dostępny. Sprawdź dane do zapłaty na fakturze.` |
| Faktura wykazuje nadpłatę do rozliczenia lub zwrotu | `Faktura wykazuje nadpłatę 300,00 PLN do rozliczenia lub zwrotu: nie ma kwoty do zapłaty.` |
| Kwota do zapłaty wynosi zero lub mniej | `Brak kwoty do zapłaty.` |
| Faktura z mechanizmem podzielonej płatności (MPP) | `Faktura z mechanizmem podzielonej płatności: zapłać przelewem MPP w banku. Kwota VAT: ... PLN, NIP sprzedawcy: ..., numer faktury: ....` |
| Sprzedawca oznaczył fakturę jako zapłaconą | `Sprzedawca oznaczył fakturę jako zapłaconą (05.03.2026).` Bez daty na fakturze: `Sprzedawca oznaczył fakturę jako zapłaconą.` |
| Sprzedawca oznaczył fakturę jako zapłaconą w całości, w częściach | `Sprzedawca oznaczył fakturę jako zapłaconą w całości, w częściach.` |
| OpenKSeF nie ma jeszcze pliku XML faktury, więc nie zna numeru rachunku | `Numer rachunku pobieramy jeszcze z KSeF. Sprawdź ponownie za kilka minut.` Przy dużej liczbie faktur lub po limicie KSeF potrwa to dłużej niż kilka minut, zobacz [uzupełnianie](#uzupełnianie-pozycji-rachunku-i-terminu). Opłacona faktura z pozycjami, ale bez terminu, czeka na pełną resynchronizację. |
| Pliku XML faktury nie udało się odczytać 5 razy | `Nie udało się odczytać tej faktury z KSeF, więc nie znamy numeru rachunku. Sprawdź dane do zapłaty na fakturze w KSeF. Ponowimy próbę automatycznie w ciągu 7 dni. Możesz też uruchomić pełną resynchronizację (portal: Firma, zakładka Dostęp do KSeF i pobieranie).` |
| Na fakturze nie ma poprawnego polskiego numeru rachunku | `Brak poprawnego numeru rachunku na fakturze.` |
| Płatność na rachunek faktora, ale faktura nie podaje nazwy faktora | `Płatność na rachunek faktora, ale faktura nie podaje nazwy faktora: nie można utworzyć kodu QR. Sprawdź odbiorcę przelewu na fakturze.` |
| Brak czytelnej nazwy sprzedawcy lub numeru faktury | `Nie można utworzyć kodu QR: brak czytelnej nazwy sprzedawcy lub numeru faktury.` |

Na fakturach sprzedaży wystawionych przez Twoją firmę nie ma karty płatności.

#### Kod QR bez kwoty

Czasem kod QR wypełnia odbiorcę, rachunek i tytuł, ale nie kwotę: w kodzie jest kwota `000000` (zero), więc bank nie wpisze kwoty za Ciebie. Kwotę wpisujesz wtedy w banku sam, sprawdzając ją na fakturze. Komunikat mówi dlaczego:

| Sytuacja | Komunikat |
|----------|-----------|
| Faktura zaliczkowa lub rozliczeniowa | `Zaliczka/rozliczenie: wpisz kwotę ręcznie.` |
| Faktura opłacona w części | `Faktura opłacona w części: wpisz pozostałą kwotę ręcznie, sprawdź ją na fakturze.` |
| OpenKSeF nie odczytał jeszcze rozliczeń z pliku XML faktury | `Nie odczytano jeszcze rozliczeń z tej faktury: wpisz kwotę ręcznie, sprawdź ją na fakturze. Aby uzyskać kwotę w kodzie QR, uruchom pełną resynchronizację (portal: Firma, zakładka Dostęp do KSeF i pobieranie).` |
| Faktura ma dodatkowe obciążenia lub odliczenia, a kwoty do zapłaty nie da się z nimi potwierdzić | `Faktura zawiera dodatkowe rozliczenia i nie można potwierdzić kwoty do zapłaty: wpisz kwotę ręcznie, sprawdź ją na fakturze.` |

Po aktualizacji OpenKSeF starsze nieopłacone faktury otrzymane mogą pokazywać kwotę `000000` i komunikat `Nie odczytano jeszcze rozliczeń z tej faktury...`, dopóki OpenKSeF nie odczyta ponownie ich pliku XML. Dzieje się to samo, w kolejnych synchronizacjach, zobacz [uzupełnianie](#uzupełnianie-pozycji-rachunku-i-terminu). Możesz też uruchomić **Pełną resynchronizację** w **Firma** > **Dostęp do KSeF i pobieranie** (do 15 plików na uruchomienie).

Gdy rozliczenia nie są odczytane lub potwierdzone, dane do przelewu podają `Kwota brutto z faktury: ... (sprawdź kwotę do zapłaty na fakturze)` zamiast `Kwota:`, także na fakturach bez kodu QR.

#### Inne komunikaty przy kodzie QR

- `Kwota w kodzie QR to kwota do zapłaty z faktury, po uwzględnieniu dodatkowych rozliczeń.`: kwota do zapłaty na fakturze różni się od kwoty brutto, np. po odliczeniu wcześniejszej wpłaty.
- `Płatność na rachunek faktora.`: sprzedawca przekazał należność faktorowi. Kod QR zawiera rachunek, NIP i nazwę faktora z faktury.
- `Sprawdź, czy faktura nie wymaga podzielonej płatności (MPP).`: kwota brutto przekracza 15 000 zł, a OpenKSeF nie odczytał jeszcze z pliku XML, czy faktura ma oznaczenie MPP. Po odczytaniu tego oznaczenia faktura MPP nie ma kodu QR (zobacz tabelę wyżej).
- Gdy faktura ma kilka rachunków, kod QR używa pierwszego poprawnego polskiego numeru rachunku.

## Synchronizacja z KSeF

Worker pobiera nowe faktury automatycznie w tle, domyślnie co 4 godziny. Pierwsza synchronizacja nowej firmy pobiera faktury otrzymane z ostatnich 6 miesięcy, a [sprzedaż z innych programów](wystawianie-faktur#faktury-spoza-openksef) z ostatnich 12 miesięcy. Synchronizację uruchomisz też ręcznie przyciskiem **Pobierz z KSeF** na stronach **Start**, **Otrzymane** i **Firma** > **Dostęp do KSeF i pobieranie**. Na tej ostatniej, w sekcji **Działania ryzykowne**, jest też **Pełna resynchronizacja**.

| Przycisk | Co robi | Kiedy użyć |
|----------|---------|------------|
| **Pobierz z KSeF** | Pobiera faktury, które pojawiły się w KSeF od ostatniej synchronizacji, oraz do 15 oczekujących plików XML | Nie chcesz czekać na automatyczną synchronizację |
| **Pełna resynchronizacja** | Sprawdza wszystkie otrzymane faktury firmy w KSeF i dopisuje to, czego brakuje: pozycje, numer rachunku i termin płatności. Pobiera do 15 plików XML na uruchomienie. Niczego nie usuwa | Opłacona faktura ma pozycje, ale nie ma terminu |

### Uzupełnianie pozycji, rachunku i terminu

Faktura pojawia się na liście od razu. Jej pozycje, numer rachunku i termin płatności są w pliku XML, a KSeF ogranicza pobieranie tych plików, więc dane dochodzą stopniowo:

- Automatyczna synchronizacja: do 60 plików na firmę (NIP) w jednym cyklu, domyślnie co 4 godziny.
- **Pobierz z KSeF**: do 15 plików na kliknięcie. Reszta czeka na automatyczną synchronizację.

Duża firma potrzebuje kilku cykli. Szacunkowo 300 plików to 5 cykli, czyli około 16 godzin od pierwszego cyklu.

Kolejność pobierania:

1. Nowe faktury otrzymane.
2. Nieopłacone faktury otrzymane bez terminu, od najnowszej daty wystawienia.
3. [Sprzedaż z innych programów](wystawianie-faktur#faktury-spoza-openksef) bez pozycji.
4. Nieopłacone faktury otrzymane, których rozliczeń nie odczytano, bo pobrała je starsza wersja OpenKSeF.
5. Pozostałe faktury otrzymane bez pozycji, także opłacone.

Opłacona faktura, która ma pozycje, ale nie ma terminu, nie trafia do tej kolejki. Uzupełni ją tylko [pełna resynchronizacja](#pełna-resynchronizacja).

Odczytany plik nie jest pobierany ponownie. Wyjątek to nieopłacona faktura, której rozliczeń starsza wersja nie odczytała (punkt 4). Po limicie KSeF pobieranie dla tej firmy zatrzymuje się, a reszta czeka na kolejną synchronizację. Plik, którego nie udało się pobrać lub odczytać, jest ponawiany po pozostałych z tego samego punktu kolejności. W obu przypadkach faktura zachowuje swoje dane i status płatności.

### Pełna resynchronizacja

Przed uruchomieniem portal prosi o potwierdzenie.

- Obejmuje całą historię faktur otrzymanych: od najstarszej zapisanej w OpenKSeF, a nie tylko z okresu synchronizacji początkowej. Listy sprzedaży z innych programów nie pobiera od nowa, dochodzą tylko nowe faktury. Jej brakujące pozycje są w tej samej kolejce plików XML.
- Pobiera plik XML tylko tych faktur, których plik nie został jeszcze odczytany i które nie mają pozycji albo terminu, oraz faktur, których rozliczeń nie odczytano. Do 15 plików na uruchomienie. Faktur uzupełnionych nie pobiera.
- Niczego nie usuwa. Pozycje zostają także wtedy, gdy pliku XML nie da się pobrać lub odczytać.
- Każda faktura jest zapisywana zaraz po pobraniu pliku. Kolejne uruchomienie kontynuuje od faktur, które jeszcze czekają.
- Nie wysyła powiadomień. Nowe faktury znalezione przez pełną resynchronizację nie wygenerują powiadomienia ani teraz, ani później. Tak samo działa pierwsza synchronizacja nowej firmy.
- Status płatności faktur zostaje zachowany.

:::warning[Limit KSeF: duża firma nie skończy w jednym uruchomieniu]
KSeF pozwala pobrać plik XML faktury najwyżej 8 razy na sekundę, 16 razy na minutę i 64 razy na godzinę ([limity API KSeF](https://github.com/CIRFMF/ksef-docs/blob/main/limity/limity-api.md)). Dlatego jedno uruchomienie pobiera do 15 plików. Gdy KSeF mimo to zgłosi limit, pobieranie zatrzymuje się, a reszta czeka.

- Firma, której brakuje więcej plików, nie zostanie uzupełniona w jednym uruchomieniu. Uruchom resynchronizację ponownie później. Każde kolejne uruchomienie dokańcza pracę.
- Komunikat `Pełna resynchronizacja niepełna` pojawia się, gdy w tym uruchomieniu nie udało się pobrać lub odczytać pliku XML części faktur. Nic nie przepadło. Przy `Bez szczegółów z KSeF` widać liczbę faktur z błędem, a dalej liczbę faktur w kolejce, ponad limit jednego uruchomienia. Nieopłacone uzupełni automatyczna synchronizacja, a opłacone kolejna pełna resynchronizacja. Faktura, której pliku nie da się odczytać, może zostać z błędem na stałe.
- Komunikat `Pełna resynchronizacja zakończona` znaczy, że nie było błędów. Jeśli pliki XML nadal czekają, komunikat podaje ich liczbę: `Szczegóły pozostałych faktur (liczba: ...)`. Liczba `Pobrane` to faktury z listy KSeF, a nie pobrane pliki XML.
- Faktura, której pliku nie udało się pobrać, zachowuje dotychczasowe pozycje, numer rachunku i termin.
- Częste uruchamianie może wyczerpać także limit zapytań o listę faktur. Resynchronizacja kończy się wtedy błędem, a kolejną próbę warto odłożyć na około godzinę.
:::

## Aplikacja mobilna

W aplikacji mobilnej (Android, od wersji 1.0.4):

- lista faktur pokazuje numer faktury sprzedawcy, a gdy go brak -- numer KSeF,
- szczegóły faktury zawierają **Numer faktury**, **Numer KSeF** i kartę **Pozycje faktury** (nazwa, ilość, jednostka, cena netto, kwoty netto i brutto, stawka VAT),
- tytuł przelewu przy kopiowaniu danych i w kodzie QR to sam numer faktury (w kodzie QR skrócony do 32 znaków),
- przycisk **Zapłać** pokazuje kod QR przelewu według tych samych zasad co portal, zobacz [Zapłać](aplikacja-mobilna#zapłać).

Więcej o aplikacji: [Aplikacja mobilna](aplikacja-mobilna).
