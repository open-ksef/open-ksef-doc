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

:::caution[Starsze faktury bez terminu]
Faktury pobrane przed wprowadzeniem tej funkcji mają w kolumnie **Termin płatności** kreskę (`—`), dopóki termin nie zostanie uzupełniony. Automatyczne uzupełnianie jeszcze nie działa. Taka faktura nie dostanie oznaczenia `po terminie`, a na liście **Nieopłacone** będzie na końcu, więc sprawdź te faktury osobno. Kreskę zobaczysz też, gdy faktura nie ma terminu albo nie udało się pobrać jej pliku XML.
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
- Jeśli faktura w KSeF nie ma pozycji (np. niektóre faktury zaliczkowe), karta pokazuje `Brak pozycji w pobranych danych.`
- Faktury pobrane przed wprowadzeniem tej funkcji nie mają pozycji. Może je uzupełnić [pełna resynchronizacja](#pełna-resynchronizacja), w granicach limitu KSeF.

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

Tytuł przelewu to sam numer faktury sprzedawcy, np. `FV/2026/10/0042`; w kodzie QR jest skrócony do 32 znaków. Jeśli faktura nie ma numeru sprzedawcy, tytułem jest numer KSeF. Gdy faktura nie zawiera numeru rachunku, pole **Rachunek odbiorcy** pokazuje `brak`.

## Synchronizacja z KSeF

Worker pobiera nowe faktury automatycznie w tle, domyślnie co 4 godziny. Pierwsza synchronizacja nowej firmy pobiera faktury otrzymane z ostatnich 6 miesięcy, a [sprzedaż z innych programów](wystawianie-faktur#faktury-spoza-openksef) z ostatnich 12 miesięcy. Synchronizację uruchomisz też ręcznie przyciskiem **Pobierz z KSeF** na stronach **Start**, **Otrzymane** i **Firma** > **Token KSeF i pobieranie**. Na tej ostatniej, w sekcji **Działania ryzykowne**, jest też **Pełna resynchronizacja**.

![Synchronizacja z KSeF](/img/screenshots/portal/credentials-resync.png)

| Przycisk | Co robi | Kiedy użyć |
|----------|---------|------------|
| **Pobierz z KSeF** | Pobiera faktury, które pojawiły się w KSeF od ostatniej synchronizacji | Nie chcesz czekać na automatyczną synchronizację |
| **Pełna resynchronizacja** | Sprawdza wszystkie otrzymane faktury firmy w KSeF i nadpisuje ich dane (w tym pozycje, numer rachunku i termin płatności) dla plików XML, które zmieszczą się w limicie KSeF | Brakuje pozycji, numeru rachunku lub terminu płatności na starszych fakturach |

### Pełna resynchronizacja

Przed uruchomieniem portal prosi o potwierdzenie.

![Potwierdzenie pełnej resynchronizacji](/img/screenshots/portal/credentials-resync-confirm.png)

- Obejmuje całą historię faktur otrzymanych: od najstarszej zapisanej w OpenKSeF, a nie tylko z okresu synchronizacji początkowej. Sprzedaży z innych programów nie pobiera od nowa, dochodzą tylko nowe faktury.
- Trwa dłużej niż zwykła synchronizacja, bo OpenKSeF próbuje pobrać plik XML każdej faktury od nowa.
- Faktury są zapisywane partiami. Jeśli resynchronizacja przerwie się w trakcie, część faktur może być już zaktualizowana, a część nie.
- Jeśli OpenKSeF nie odczyta pliku XML którejś faktury, jej pozycje mogą zniknąć. Kolejna pełna resynchronizacja może je przywrócić, jeśli plik da się odczytać i zmieści się w limicie KSeF.
- Nie wysyła powiadomień. Nowe faktury znalezione przez pełną resynchronizację nie wygenerują powiadomienia ani teraz, ani później. Tak samo działa pierwsza synchronizacja nowej firmy.
- Status płatności faktur zostaje zachowany.

:::warning[Limit KSeF: duża firma nie skończy w jednym uruchomieniu]
KSeF pozwala pobrać plik XML faktury najwyżej 8 razy na sekundę, 16 razy na minutę i 64 razy na godzinę ([limity API KSeF](https://github.com/CIRFMF/ksef-docs/blob/main/limity/limity-api.md)). Pełna resynchronizacja nie czeka na odblokowanie limitu: pliku ponad limit nie pobiera i przechodzi dalej.

- Firma, która ma więcej faktur, niż mieści się w limicie, nie zostanie uzupełniona w jednym uruchomieniu. W teście na środowisku TEST pierwsze uruchomienie uzupełniło termin w 10 z 25 faktur.
- Ponowne uruchomienie nie dokańcza pracy. Każde zaczyna od początku, pobiera także faktury już uzupełnione i znów trafia na limit. W tym samym teście po dwóch kolejnych uruchomieniach termin miało 11 z 25 faktur.
- Komunikat `Pełna resynchronizacja zakończona` nie znaczy, że pobrano wszystkie pliki. Liczba `Pobrane` to faktury z listy KSeF, a nie pobrane pliki XML.
- Faktura, której pliku nie udało się pobrać, zachowuje dotychczasowe pozycje, numer rachunku i termin.
- Częste uruchamianie może wyczerpać także limit zapytań o listę faktur. Resynchronizacja kończy się wtedy błędem, a kolejną próbę warto odłożyć na około godzinę.
:::

## Aplikacja mobilna

W aplikacji mobilnej (Android, od wersji 1.0.4):

- lista faktur pokazuje numer faktury sprzedawcy, a gdy go brak -- numer KSeF,
- szczegóły faktury zawierają **Numer faktury**, **Numer KSeF** i kartę **Pozycje faktury** (nazwa, ilość × jednostka, cena netto, kwoty netto / VAT / brutto),
- tytuł przelewu przy kopiowaniu danych i w kodzie QR to sam numer faktury (w kodzie QR skrócony do 32 znaków).

Więcej o aplikacji: [Aplikacja mobilna](aplikacja-mobilna).
