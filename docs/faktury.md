---
sidebar_position: 5
title: Faktury
---

# Faktury

OpenKSeF pobiera z KSeF faktury, w których Twoja firma jest nabywcą (faktury kosztowe). W portalu znajdziesz je w menu **Faktury**, a w aplikacji mobilnej na ekranie **Faktury**.

## Lista faktur

![Lista faktur](/img/screenshots/portal/invoices.png)

- Pierwsza kolumna **Nr faktury** to numer nadany przez sprzedawcę (np. `FV/2026/10/0042`). Jeśli faktura go nie ma, wyświetlany jest numer KSeF.
- Kolumna **Numer KSeF** to identyfikator nadany przez KSeF.
- Kolumna **Status** pokazuje, czy faktura jest oznaczona jako opłacona.
- Filtry: firma, zakres dat wystawienia, liczba faktur na stronie.

## Szczegóły faktury

Kliknij fakturę na liście, aby zobaczyć jej szczegóły: numery, sprzedawcę i nabywcę, daty, kwoty netto / VAT / brutto oraz status płatności.

![Szczegóły faktury](/img/screenshots/portal/invoice-detail.png)

### Pozycje faktury

Pod danymi faktury jest tabela **Pozycje faktury** z wierszami faktury (`FaWiersz`): nazwa, jednostka miary, ilość, cena netto i brutto, wartości netto / VAT / brutto oraz stawka VAT.

![Pozycje faktury](/img/screenshots/portal/invoice-lines.png)

- Większość faktur zawiera tylko ceny netto i stawkę VAT. Wtedy cena brutto i VAT pozycji są **wyliczane** przez OpenKSeF ze stawki (netto × stawka). Mogą się różnić o grosze od kwot na fakturze, bo sprzedawca mógł liczyć VAT od sumy, a nie od każdej pozycji. Wiążące są kwoty z nagłówka faktury.
- Dla stawek nieliczbowych (np. `zw`, `oo`, `np I`, `np II`) VAT pozycji wynosi 0, a brutto = netto.
- Jeśli faktura w KSeF nie ma pozycji (np. niektóre faktury zaliczkowe), tabela nie jest wyświetlana.
- Faktury pobrane przed wprowadzeniem tej funkcji nie mają pozycji. Uzupełnisz je [pełną resynchronizacją](#pełna-resynchronizacja).

### Status płatności

Przycisk **Oznacz jako opłaconą** zmienia status faktury na **Opłacona** i zapisuje datę oznaczenia. **Cofnij oznaczenie** przywraca status **Nieopłacona**.

![Status płatności](/img/screenshots/portal/invoice-paid.png)

:::info[Status tylko w OpenKSeF]
Status płatności to Twoja notatka w OpenKSeF. Nie jest wysyłany do KSeF ani do banku, a OpenKSeF nie sprawdza, czy przelew został wykonany. Synchronizacja (także pełna) nie zmienia statusu płatności.
:::

Status płatności zmienisz w portalu. Aplikacja mobilna go nie pokazuje.

### Dane do przelewu i kod QR

Sekcja **Dane do przelewu** zawiera odbiorcę, NIP, numer rachunku sprzedawcy (z faktury w KSeF), kwotę i tytuł przelewu. **Kopiuj dane przelewu** kopiuje je do schowka, a **kod QR** (standard ZBP) zeskanujesz w aplikacji bankowej.

![Dane do przelewu i kod QR](/img/screenshots/portal/invoice-qr.png)

Tytuł przelewu to sam numer faktury sprzedawcy, np. `FV/2026/10/0042`. Jeśli faktura nie ma numeru sprzedawcy, tytułem jest numer KSeF. Gdy faktura nie zawiera numeru rachunku, pole **Nr rachunku** pokazuje `brak`.

## Synchronizacja z KSeF

Worker pobiera nowe faktury automatycznie w tle, domyślnie co 4 godziny. Pierwsza synchronizacja nowej firmy pobiera faktury z ostatnich 6 miesięcy. Synchronizację uruchomisz też ręcznie w portalu: **Dane logowania** > wiersz firmy.

![Dane logowania -- synchronizacja](/img/screenshots/portal/credentials-resync.png)

| Przycisk | Co robi | Kiedy użyć |
|----------|---------|------------|
| **Wymuś synchronizację** | Pobiera faktury, które pojawiły się w KSeF od ostatniej synchronizacji | Nie chcesz czekać na automatyczną synchronizację |
| **Pełna resynchronizacja** | Pobiera ponownie wszystkie faktury firmy z KSeF i nadpisuje ich dane (w tym pozycje i numer rachunku) | Brakuje pozycji lub numeru rachunku na starszych fakturach |

### Pełna resynchronizacja

Przed uruchomieniem portal prosi o potwierdzenie.

![Potwierdzenie pełnej resynchronizacji](/img/screenshots/portal/credentials-resync-confirm.png)

- Obejmuje całą historię firmy: od najstarszej faktury zapisanej w OpenKSeF, a nie tylko z okresu synchronizacji początkowej.
- Trwa dłużej niż zwykła synchronizacja, bo każda faktura jest pobierana z KSeF od nowa.
- Jeśli się nie powiedzie, dotychczasowe dane zostają bez zmian. Możesz ją bezpiecznie powtórzyć.
- Nie wysyła powiadomień push o fakturach, które się pojawią. Tak samo działa pierwsza synchronizacja nowej firmy.
- Status płatności faktur zostaje zachowany.

## Aplikacja mobilna

W aplikacji mobilnej (od wersji 1.0.4):

- lista faktur pokazuje numer faktury sprzedawcy, a gdy go brak -- numer KSeF,
- szczegóły faktury zawierają **Numer faktury**, **Numer KSeF** i kartę **Pozycje faktury** (nazwa, ilość × jednostka, cena netto, kwoty netto / VAT / brutto),
- tytuł przelewu przy kopiowaniu danych i w kodzie QR to sam numer faktury.

Więcej o aplikacji: [Aplikacja mobilna](aplikacja-mobilna).
