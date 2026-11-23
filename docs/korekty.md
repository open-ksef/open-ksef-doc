---
sidebar_position: 6
title: Faktury korygujące
---

# Faktury korygujące

Fakturę przyjętą w KSeF poprawiasz fakturą korygującą (korektą). Korekty wystawisz w portalu, w szczegółach faktury, w karcie **Korekty**. Korekta trafia do KSeF jak każda faktura, ma własny numer, UPO, XML i PDF z kodem KOD I.

Korekty faktur zaliczkowych i rozliczających opisuje strona [Zaliczki i rozliczenia](zaliczki-i-rozliczenia#korekty-zaliczek-i-rozliczeń).

:::info[Wymagana wersja]
Korekty działają od wersji serwera v0.0.37. W aplikacji mobilnej korekty są tylko do podglądu, zobacz [Aplikacja mobilna](#aplikacja-mobilna).
:::

## Kiedy korekta, a kiedy nie

- **Faktura przyjęta w KSeF**, a coś się zmieniło albo było błędne (rabat, zwrot, cena, ilość, stawka, dane nabywcy): wystaw korektę.
- **Faktura odrzucona przez KSeF** nie została wystawiona. Nie koryguj jej. Popraw ją i wyślij ponownie pod tym samym numerem, zobacz [Odrzucona faktura](wystawianie-faktur#odrzucona-faktura).
- **Faktura wystawiona w innym programie** (oznaczenie `Spoza OpenKSeF`): OpenKSeF jej nie skoryguje. Użyj programu, w którym ją wystawiłeś, albo Aplikacji Podatnika KSeF.

## Jak wystawić korektę

1. Otwórz fakturę w statusie **Przyjęta w KSeF** w menu **Wystawione**.
2. W karcie **Korekty** kliknij **Koryguj**. Inne akcje: [Koryguj do zera](#korekta-do-zera) i [Błędny NIP nabywcy](#błędny-nip-nabywcy).
3. Formularz pokazuje aktualny stan faktury. Zmień ilość, cenę netto, stawkę VAT, nazwę lub jednostkę. Możesz usunąć pozycję i dodać nową.
4. Wybierz albo wpisz **Przyczynę korekty**. Jest wymagana i trafia na fakturę.
5. Opcjonalnie wybierz **Typ korekty**, zobacz [Typ korekty](#typ-korekty).
6. Sprawdź datę wystawienia. Domyślnie to dzisiejsza data. Nie może być wcześniejsza niż data wystawienia faktury korygowanej.
7. Kliknij **Wystaw korektę i wyślij do KSeF** albo **Zapisz szkic**.

Typowe przyczyny do wyboru: **Rabat**, **Zwrot towaru**, **Błąd w cenie lub ilości**, **Błąd w stawce VAT**, **Błąd w danych nabywcy**, **Błędny NIP nabywcy**. Możesz też wpisać własną, do 256 znaków.

Nie zmienisz korektą sprzedawcy, rodzaju nabywcy, NIP-u ani numeru zagranicznego nabywcy, waluty, kursu ani adnotacji z faktury korygowanej.

### Kwoty na korekcie

Podsumowanie pokazuje różnice wobec stanu przed korektą, dla każdej stawki osobno. Kwota ze znakiem minus to zmniejszenie.

- **Nabywca dopłaca**: korekta ma sekcję płatności z terminem i rachunkiem z faktury korygowanej.
- **Do zwrotu nabywcy** albo **Kwota bez zmian**: korekta nie ma sekcji płatności.

Na korekcie są tylko zmienione pozycje: każda w dwóch wierszach, przed i po korekcie. Nowa pozycja ma tylko wiersz po korekcie. VAT liczymy od sumy netto dla stawki, tak jak na fakturze, a różnicę VAT jako VAT po korekcie minus VAT przed nią.

### Kolejna korekta

Druga i każda następna korekta też powstaje z faktury pierwotnej. **Koryguj** zawsze startuje z aktualnego stanu: faktura pierwotna plus wszystkie przyjęte korekty. Korekta korekty nie istnieje. W szczegółach korekty jest odnośnik do faktury pierwotnej.

Jedna faktura może mieć tylko jedną otwartą korektę: szkic, w trakcie wysyłki albo odrzuconą. Dokończ ją albo usuń szkic, zanim zaczniesz kolejną. Odrzuconą korektę poprawiasz i wysyłasz ponownie pod tym samym numerem, jak każdą fakturę.

Szczegóły faktury pierwotnej pokazują listę jej korekt i kartę **Stan po korektach**. Lista **Wystawione** pokazuje korektę jako `Korekta` z kwotą ze znakiem.

## Typ korekty

Pole jest opcjonalne. Puste nie trafia na fakturę. Wybierz typ, jeśli ustalisz go z księgowym:

| Typ | Znaczenie |
|-----|-----------|
| 1 | Skutek w dacie ujęcia faktury pierwotnej |
| 2 | Skutek w dacie wystawienia faktury korygującej |
| 3 | Skutek w innej dacie, w tym gdy daty dla pozycji są różne |

Typ to informacja dla nabywcy i jego księgowego. OpenKSeF nie wybiera go za Ciebie.

## Korekta do zera

**Koryguj do zera** zeruje wszystkie pozycje aktualnego stanu faktury. Kwota korekty to minus aktualna kwota brutto. Używaj jej przy anulowanej sprzedaży, pełnym zwrocie i przy [błędnym NIP-ie nabywcy](#błędny-nip-nabywcy).

Faktury skorygowanej do zera nie korygujesz dalej.

## Błędny NIP nabywcy

NIP-u nabywcy nie zmienisz korektą. Serwer odrzuci korektę, która go zmienia, z komunikatem:

> Korekta nie może zmienić rodzaju ani identyfikatora nabywcy. Przy błędnym NIP użyj „Błędny NIP nabywcy”.

Ministerstwo Finansów wskazuje inną drogę: korektę do zera z błędnym NIP-em, a potem nową fakturę z poprawnym NIP-em ([Podręcznik KSeF 2.0 cz. II](https://ksef.podatki.gov.pl/media/rronoxyt/podrecznik-ksef-20-cz-ii-wystawianie-i-otrzymywanie-faktur-w-ksef-06082026.pdf), pkt 1.6.4). W OpenKSeF:

1. Na fakturze kliknij **Błędny NIP nabywcy** i potwierdź **Utwórz korektę do zera**. Powstaje korekta do zera z przyczyną „Błędny NIP nabywcy” i z dotychczasowym NIP-em.
2. Wyślij korektę i poczekaj, aż będzie **Przyjęta w KSeF**.
3. Na fakturze pierwotnej kliknij **Wystaw poprawną fakturę**. Powstaje szkic z pozycjami sprzed korekty i z pustym polem NIP.
4. Wpisz poprawny NIP i wystaw fakturę. Dostanie nowy numer z serii faktur.

Ta sama droga dotyczy numeru VAT UE i numeru podatkowego firmy zagranicznej. **Wystaw poprawną fakturę** jest dostępne dla faktury VAT. Przy fakturze zaliczkowej lub rozliczającej z błędnym NIP-em ustal dalsze kroki z księgowym.

## Korekta danych nabywcy

Literówkę w nazwie lub adresie nabywcy poprawisz korektą bez zmiany pozycji. Kliknij **Koryguj**, popraw nazwę lub adres w sekcji **Nabywca** i wybierz przyczynę, na przykład **Błąd w danych nabywcy**.

Taka korekta nie ma pozycji, a jej kwota to 0,00. Na fakturze są nowe dane nabywcy oraz dane sprzed korekty, z tym samym NIP-em. Dla firmy zagranicznej bez numeru podatkowego poprawisz też kraj.

Korekta, która nie zmienia ani pozycji, ani danych nabywcy, zostanie zablokowana:

> Korekta nie zawiera zmian. Zmień pozycje albo dane nabywcy.

## Korekta faktury dla firmy zagranicznej

Korekta zachowuje walutę i kurs z faktury korygowanej (art. 31b ust. 1 ustawy o VAT). Pola waluty i kursu są tylko do odczytu, a kurs trafia do obu wierszy, przed i po korekcie. Stawki np I i np II oraz adnotacje zostają jak na fakturze korygowanej.

Wydruk dwujęzyczny korekty ma tytuł „Faktura korygująca / Corrective invoice”, odnośnik do faktury korygowanej, wiersze przed i po korekcie oraz różnice.

## Numeracja korekt

Korekty mają własną serię, domyślnie `KOR/{nr}/{MM}/{RRRR}`, na przykład `KOR/1/11/2026`. Ustawisz ją w **Firma** > **Dane do faktur**, w polach **Wzorzec numeru korekty** i **Następny numer korekty**. Znaczniki i zasady liczników są takie jak przy [numeracji faktur](wystawianie-faktur#numeracja).

Korekty nie przesuwają numeracji faktur. Wspólną serię KOR mają korekty faktur VAT, zaliczkowych i rozliczających.

## Aplikacja mobilna

Od wersji 1.0.13 aplikacja pokazuje korekty tylko do podglądu: rodzaj, odnośnik do faktury korygowanej, przyczynę, wiersze przed i po korekcie oraz kwoty ze znakiem. Korektę wystawisz w portalu: przycisk **Koryguj w portalu** otwiera ją tam. Szczegóły: [Aplikacja mobilna, dokumenty tylko do podglądu](aplikacja-mobilna#korekty-zaliczki-i-rozliczenia).

## Czego nie ma

- Korekty zbiorczej, czyli jednej korekty do wielu faktur, na przykład rabatu za okres.
- Korekty faktur wystawionych poza OpenKSeF.
- Korekty danych sprzedawcy.
- Wystawiania korekt w aplikacji mobilnej.
- Wysyłania korekty e-mailem do nabywcy.

OpenKSeF nie ocenia skutków podatkowych korekty, na przykład okresu, w którym ją rozliczasz. W razie wątpliwości zapytaj księgowego lub doradcę podatkowego.
