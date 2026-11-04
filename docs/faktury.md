---
sidebar_position: 5
title: Otrzymane faktury
---

# Otrzymane faktury

OpenKSeF pobiera z KSeF faktury, w których Twoja firma jest nabywcą (faktury kosztowe). W portalu znajdziesz je w menu **Otrzymane**, a w aplikacji mobilnej na ekranie **Faktury**.

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

Tytuł przelewu to sam numer faktury sprzedawcy, np. `FV/2026/10/0042`; w kodzie QR jest skrócony do 32 znaków. Jeśli faktura nie ma numeru sprzedawcy, tytułem jest numer KSeF. Gdy nie ma numeru rachunku, pole **Rachunek odbiorcy** pokazuje `brak`, a powód podaje komunikat:

- `Numer rachunku pobieramy jeszcze z KSeF. Sprawdź ponownie za kilka minut.`: OpenKSeF nie ma jeszcze pliku XML tej faktury. Przy dużej liczbie faktur lub po limicie KSeF potrwa to dłużej niż kilka minut, zobacz [uzupełnianie](#uzupełnianie-pozycji-rachunku-i-terminu). Opłacona faktura z pozycjami, ale bez terminu, czeka na pełną resynchronizację. Komunikat nie zniknie, jeśli pliku nie da się odczytać.
- `Brak poprawnego numeru rachunku na fakturze.`: OpenKSeF odczytał fakturę, a poprawnego numeru rachunku na niej nie ma.

## Synchronizacja z KSeF

Worker pobiera nowe faktury automatycznie w tle, domyślnie co 4 godziny. Pierwsza synchronizacja nowej firmy pobiera faktury otrzymane z ostatnich 6 miesięcy, a [sprzedaż z innych programów](wystawianie-faktur#faktury-spoza-openksef) z ostatnich 12 miesięcy. Synchronizację uruchomisz też ręcznie przyciskiem **Pobierz z KSeF** na stronach **Start**, **Otrzymane** i **Firma** > **Token KSeF i pobieranie**. Na tej ostatniej, w sekcji **Działania ryzykowne**, jest też **Pełna resynchronizacja**.

| Przycisk | Co robi | Kiedy użyć |
|----------|---------|------------|
| **Pobierz z KSeF** | Pobiera faktury, które pojawiły się w KSeF od ostatniej synchronizacji, oraz do 15 oczekujących plików XML | Nie chcesz czekać na automatyczną synchronizację |
| **Pełna resynchronizacja** | Sprawdza wszystkie otrzymane faktury firmy w KSeF i dopisuje to, czego brakuje: pozycje, numer rachunku i termin płatności. Pobiera do 15 plików XML na uruchomienie. Niczego nie usuwa | Opłacona faktura ma pozycje, ale nie ma terminu |

### Uzupełnianie pozycji, rachunku i terminu

Faktura pojawia się na liście od razu. Jej pozycje, numer rachunku i termin płatności są w pliku XML, a KSeF ogranicza pobieranie tych plików, więc dane dochodzą stopniowo:

- Automatyczna synchronizacja: do 60 plików na firmę (NIP) w jednym cyklu, domyślnie co 4 godziny.
- **Pobierz z KSeF**: do 15 plików na kliknięcie. Reszta czeka na automatyczną synchronizację.

Duża firma potrzebuje kilku cykli. Na przykład 300 plików to 5 cykli, czyli około 16 godzin.

Kolejność pobierania:

1. Nowe faktury otrzymane.
2. Nieopłacone faktury otrzymane bez terminu, od najnowszej daty wystawienia.
3. [Sprzedaż z innych programów](wystawianie-faktur#faktury-spoza-openksef) bez pozycji.
4. Pozostałe faktury otrzymane bez pozycji, także opłacone.

Opłacona faktura, która ma pozycje, ale nie ma terminu, nie trafia do tej kolejki. Uzupełni ją tylko [pełna resynchronizacja](#pełna-resynchronizacja).

Odczytany plik nie jest pobierany ponownie. Po limicie KSeF pobieranie dla tej firmy zatrzymuje się, a reszta czeka na kolejną synchronizację. Plik, którego nie udało się pobrać lub odczytać, jest ponawiany po pozostałych. W obu przypadkach faktura zachowuje swoje dane i status płatności.

### Pełna resynchronizacja

Przed uruchomieniem portal prosi o potwierdzenie.

- Obejmuje całą historię faktur otrzymanych: od najstarszej zapisanej w OpenKSeF, a nie tylko z okresu synchronizacji początkowej. Listy sprzedaży z innych programów nie pobiera od nowa, dochodzą tylko nowe faktury. Jej brakujące pozycje są w tej samej kolejce plików XML.
- Pobiera plik XML tylko tych faktur, których plik nie został jeszcze odczytany i które nie mają pozycji albo terminu, do 15 plików na uruchomienie. Faktur uzupełnionych nie pobiera.
- Niczego nie usuwa. Pozycje zostają także wtedy, gdy pliku XML nie da się pobrać lub odczytać.
- Każda faktura jest zapisywana zaraz po pobraniu pliku. Kolejne uruchomienie kontynuuje od faktur, które jeszcze czekają.
- Nie wysyła powiadomień. Nowe faktury znalezione przez pełną resynchronizację nie wygenerują powiadomienia ani teraz, ani później. Tak samo działa pierwsza synchronizacja nowej firmy.
- Status płatności faktur zostaje zachowany.

:::warning[Limit KSeF: duża firma nie skończy w jednym uruchomieniu]
KSeF pozwala pobrać plik XML faktury najwyżej 8 razy na sekundę, 16 razy na minutę i 64 razy na godzinę ([limity API KSeF](https://github.com/CIRFMF/ksef-docs/blob/main/limity/limity-api.md)). Dlatego jedno uruchomienie pobiera do 15 plików. Gdy KSeF mimo to zgłosi limit, pobieranie zatrzymuje się, a reszta czeka.

- Firma, której brakuje więcej plików, nie zostanie uzupełniona w jednym uruchomieniu. Uruchom resynchronizację ponownie później. Każde kolejne uruchomienie dokańcza pracę.
- Komunikat `Pełna resynchronizacja niepełna` to nie błąd i nic nie przepadło. Liczba przy `Bez szczegółów z KSeF` to faktury, których plik XML wciąż czeka, także te ponad limit jednego uruchomienia. Nieopłacone uzupełni automatyczna synchronizacja, a opłacone z pozycjami kolejna pełna resynchronizacja. Faktura, której pliku nie da się odczytać, może zostać w tej liczbie na stałe.
- Komunikat `Pełna resynchronizacja zakończona` znaczy, że nie czeka już żaden plik. Liczba `Pobrane` to faktury z listy KSeF, a nie pobrane pliki XML.
- Faktura, której pliku nie udało się pobrać, zachowuje dotychczasowe pozycje, numer rachunku i termin.
- Częste uruchamianie może wyczerpać także limit zapytań o listę faktur. Resynchronizacja kończy się wtedy błędem, a kolejną próbę warto odłożyć na około godzinę.
:::

## Aplikacja mobilna

W aplikacji mobilnej (Android, od wersji 1.0.4):

- lista faktur pokazuje numer faktury sprzedawcy, a gdy go brak -- numer KSeF,
- szczegóły faktury zawierają **Numer faktury**, **Numer KSeF** i kartę **Pozycje faktury** (nazwa, ilość × jednostka, cena netto, kwoty netto / VAT / brutto),
- tytuł przelewu przy kopiowaniu danych i w kodzie QR to sam numer faktury (w kodzie QR skrócony do 32 znaków).

Więcej o aplikacji: [Aplikacja mobilna](aplikacja-mobilna).
