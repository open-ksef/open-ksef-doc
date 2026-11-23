---
sidebar_position: 6
title: Zaliczki i rozliczenia
---

# Zaliczki i rozliczenia

Gdy klient płaci przed wykonaniem usługi lub dostawą, każdą wpłatę dokumentujesz fakturą zaliczkową. Resztę rozliczasz fakturą rozliczającą. OpenKSeF wystawia obie w portalu i wysyła je do KSeF jak każdą fakturę: z numerem KSeF, UPO, XML i PDF z kodem KOD I.

:::info[Wymagana wersja]
Faktury zaliczkowe i rozliczające działają od wersji serwera v0.0.38. W aplikacji mobilnej są tylko do podglądu, zobacz [Aplikacja mobilna](#aplikacja-mobilna).
:::

## Zamówienie i jego dokumenty

Pierwsza faktura zaliczkowa zaczyna zamówienie. Do zamówienia należą jego faktury zaliczkowe, najwyżej jedna faktura rozliczająca i korekty tych dokumentów.

- Nabywcę i walutę ustala pierwsza faktura zaliczkowa. Na kolejnych dokumentach zamówienia są tylko do odczytu.
- Zamówienie może mieć tylko jeden otwarty dokument: szkic, w trakcie wysyłki albo odrzucony. Dokończ go albo usuń szkic, zanim zaczniesz kolejny.
- Każdy dokument zamówienia ma kartę **Zamówienie i zaliczki**: wartość zamówienia, kwotę pozostałą po zaliczkach i listę dokumentów ze statusem i kwotą.
- Do zamówienia należą tylko dokumenty wystawione w OpenKSeF. Zaliczek wystawionych w innym programie nie rozliczysz w OpenKSeF.

## Faktura zaliczkowa

1. W menu **Wystawione** kliknij **Nowa zaliczka**.
2. Wybierz nabywcę: **Firma**, **Osoba prywatna** albo **Firma zagraniczna**, jak przy [zwykłej fakturze](wystawianie-faktur#wystawienie-faktury).
3. W sekcji **Zamówienie** wpisz pozycje całego zamówienia: nazwa, jednostka, ilość, cena netto, stawka VAT. Pod tabelą widać wartość zamówienia brutto.
4. W sekcji **Zaliczka** wpisz **Datę otrzymania zapłaty** i **Otrzymaną kwotę brutto**.
5. Wybierz formę płatności i kliknij **Wystaw i wyślij do KSeF** albo **Zapisz szkic**.

Zasady:

- Data otrzymania zapłaty nie może być późniejsza niż data wystawienia. Jeśli jest inna niż data wystawienia, trafia na fakturę.
- Kwota musi być większa od zera i nie większa niż wartość zamówienia minus wcześniejsze zaliczki. Większą kwotę serwer odrzuci komunikatem `Kwota zaliczki przekracza pozostałą wartość zamówienia (...)`.
- Fakturę zaliczkową wystawia się do 15. dnia miesiąca po miesiącu otrzymania zapłaty (art. 106i ust. 2 ustawy o VAT). Późniejsza data wystawienia daje ostrzeżenie, ale nie blokuje wystawienia.
- Faktura jest oznaczona jako zapłacona, z datą zapłaty i bez terminu płatności. Program nabywcy, który odczytuje to oznaczenie, nie zaproponuje jej zapłaty.

### Kwoty na fakturze zaliczkowej

VAT zawarty w zaliczce liczymy od kwoty brutto: kwota × stawka / (100 + stawka) (art. 106f ust. 1 pkt 3 ustawy o VAT). Netto to kwota brutto minus VAT.

Wartość zamówienia liczymy jak na fakturze: VAT od sumy netto dla każdej stawki. VAT przy pozycji zamówienia jest liczony osobno dla pozycji, więc suma VAT pozycji może różnić się od VAT zamówienia o kilka groszy.

Gdy zamówienie ma kilka stawek, OpenKSeF dzieli zaliczkę na stawki proporcjonalnie do wartości brutto zamówienia w każdej stawce. Grosz z zaokrąglenia trafia do stawki z największym udziałem. Takiego podziału nie opisują przepisy ani wyjaśnienia Ministerstwa Finansów. To przyjęta praktyka, więc sprawdź ją z księgowym.

Przykład: zamówienie 100,00 zł netto ze stawką 23% i 100,00 zł netto ze stawką 8%, razem 231,00 zł brutto. Zaliczka 115,50 zł daje 50,00 zł netto i 11,50 zł VAT w stawce 23% oraz 50,00 zł netto i 4,00 zł VAT w stawce 8%.

### Kolejna zaliczka

Na przyjętej fakturze zaliczkowej kliknij **Kolejna zaliczka**. Powstaje szkic z pozycjami zamówienia, które możesz zmienić. Formularz pokazuje sumę wcześniejszych zaliczek i kwotę do zapłaty przed tą zaliczką.

Gdy zaliczki pokryją całe zamówienie, zobaczysz:

> To ostatnia zaliczka. Faktura wymieni wszystkie wcześniejsze faktury zaliczkowe zamówienia, a faktura rozliczająca będzie opcjonalna.

### Waluta obca

Fakturę zaliczkową w walucie obcej wystawisz dla nabywcy **Firma zagraniczna**, jak zwykłą fakturę ([Faktury dla firm zagranicznych](wystawianie-faktur#faktury-dla-firm-zagranicznych)). Program proponuje średni kurs NBP z tabeli A z ostatniego dnia roboczego przed datą otrzymania zapłaty (art. 31a ust. 1 ustawy o VAT). Kurs możesz zmienić. Każda zaliczka ma własny kurs.

## Faktura rozliczająca

1. Na dowolnej przyjętej fakturze zaliczkowej zamówienia kliknij **Wystaw fakturę rozliczającą**.
2. Pozycje są przepisane z ostatniego zamówienia, z pełnymi wartościami. Zmień je, jeśli sprzedaż różni się od zamówienia.
3. Podsumowanie odejmuje zaliczki od wartości sprzedaży, dla każdej stawki osobno (art. 106f ust. 3 ustawy o VAT). Faktura wymienia numery KSeF wszystkich rozliczonych faktur zaliczkowych.
4. Kliknij **Wystaw i wyślij do KSeF**.

Zasady:

- Faktura rozliczająca dostaje numer z serii faktur, na przykład `FV/12/11/2026`. To faktura sprzedaży.
- Przy pozostałej kwocie do zapłaty faktura ma sekcję płatności z terminem i rachunkiem, jak zwykła faktura.
- Odejmowane zaliczki uwzględniają przyjęte [korekty zaliczek](#korekty-zaliczek-i-rozliczeń).
- Po przyjęciu faktury rozliczającej nie wystawisz kolejnej zaliczki w tym zamówieniu.
- Przy walucie obcej kurs faktury rozliczającej program proponuje jak przy zwykłej fakturze, z daty sprzedaży.

### Rozliczenie na 0,00

Gdy zaliczki pokryły całe zamówienie, faktura rozliczająca nie jest wymagana. Możesz ją jednak wystawić. Ma wtedy pełne pozycje, kwotę do zapłaty 0,00 i nie ma sekcji płatności (Podręcznik KSeF 2.0 cz. II, pkt 2.8).

### Zaliczki większe niż sprzedaż

Jeśli pozycje faktury rozliczającej są warte mniej niż zaliczki, w sumie albo w którejkolwiek stawce, wystawienie zostanie zablokowane:

> Zaliczki przekraczają wartość rozliczenia. Najpierw skoryguj fakturę zaliczkową.

Wystaw [korektę faktury zaliczkowej](#korekta-faktury-zaliczkowej), a potem fakturę rozliczającą. Rozliczenia nadpłaty na fakturze rozliczającej OpenKSeF nie obsługuje.

## Korekty zaliczek i rozliczeń

Korekty działają jak [korekty faktur VAT](korekty): przycisk **Koryguj** w karcie **Korekty**, wymagana przyczyna, opcjonalny typ korekty, [korekta do zera](korekty#korekta-do-zera), [korekta danych nabywcy](korekty#korekta-danych-nabywcy) i numer z serii korekt. Rodzaj korekty wynika z korygowanego dokumentu.

| Korygujesz | Rodzaj | Kiedy |
|------------|--------|-------|
| Fakturę zaliczkową | Korekta faktury zaliczkowej (`KOR_ZAL`) | Dopóki zamówienie nie ma faktury rozliczającej |
| Fakturę rozliczającą | Korekta faktury rozliczającej (`KOR_ROZ`) | Po przyjęciu faktury rozliczającej |

### Korekta faktury zaliczkowej

- Zmienisz **Kwotę zaliczki**, pozycje zamówienia albo jedno i drugie. Formularz pokazuje **Zamówienie po korekcie**.
- Różnice kwot liczymy tak jak podział zaliczki: podział kwoty po korekcie minus podział kwoty przed nią. Faktura podaje też kwotę zaliczki przed korektą.
- Korekta faktury zaliczkowej nie ma sekcji płatności, także gdy kwota zaliczki rośnie. Zaliczka jest już zapłacona.
- Zwrot zaliczki to **Koryguj do zera** (art. 106j ust. 1 pkt 4 ustawy o VAT).
- Waluta i kurs zostają z faktury zaliczkowej (art. 31b ust. 1 ustawy o VAT).
- Gdy zamówienie ma już fakturę rozliczającą, korekta zaliczki zostanie zablokowana, a komunikat wskaże korektę faktury rozliczającej.

### Korekta faktury rozliczającej

Poprawiasz pozycje faktury rozliczającej, tak jak przy korekcie faktury VAT. Zaliczki się nie zmieniają, więc różnice dotyczą tylko pozycji. Faktura podaje kwotę do zapłaty przed korektą.

## Numeracja

| Dokument | Seria | Domyślny wzorzec | Gdzie ustawisz |
|----------|-------|------------------|----------------|
| Faktura zaliczkowa | Zaliczki | `ZAL/{nr}/{MM}/{RRRR}` | **Wzorzec numeru faktury zaliczkowej**, **Następny numer zaliczki** |
| Faktura rozliczająca | Faktury | jak faktura VAT, np. `FV/{nr}/{MM}/{RRRR}` | Numeracja faktur |
| Korekty zaliczek i rozliczeń | Korekty | `KOR/{nr}/{MM}/{RRRR}` | **Wzorzec numeru korekty**, **Następny numer korekty** |

Wszystkie pola są w **Firma** > **Dane do faktur**. Szczegóły: [Numeracja](wystawianie-faktur#numeracja).

## Lista i wydruk

- Lista **Wystawione** pokazuje rodzaj: `Zaliczka`, `Rozliczenie` albo `Korekta`, i kwotę. Korekty mają kwotę ze znakiem.
- Wydruk dwujęzyczny dla firmy zagranicznej: „Advance invoice / Faktura zaliczkowa” z zamówieniem, wartością zamówienia, otrzymaną kwotą, datą zapłaty i kursem; „Final invoice / Faktura rozliczająca” z numerami KSeF zaliczek, pozostałą kwotą dla stawek, odliczonymi zaliczkami i kwotą do zapłaty.

## Aplikacja mobilna

Od wersji 1.0.13 aplikacja pokazuje faktury zaliczkowe, rozliczające i ich korekty tylko do podglądu. Wystawisz je i poprawisz w portalu. Szczegóły: [Aplikacja mobilna, dokumenty tylko do podglądu](aplikacja-mobilna#korekty-zaliczki-i-rozliczenia).

## Czego nie ma

- Kilku wpłat na jednej fakturze zaliczkowej. Każdą wpłatę dokumentuje osobna faktura.
- Faktury sprzedaży, która dokumentuje też zaliczkę otrzymaną w tym samym miesiącu.
- Rozliczania zaliczek wystawionych w innym programie.
- Ręcznego podziału zaliczki na stawki.
- Rozliczenia nadpłaty na fakturze rozliczającej.
- Faktury rozliczającej bez faktury zaliczkowej.
- Wystawiania w aplikacji mobilnej.

OpenKSeF nie ocenia skutków podatkowych. Zapytaj księgowego, zwłaszcza o podział zaliczki na stawki i o zaliczki na usługi dla firm zagranicznych (np I, np II).
