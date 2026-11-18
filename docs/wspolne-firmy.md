---
sidebar_position: 5
title: Wspólne firmy
---

# Wspólne firmy

Od v0.0.27 z jednej firmy w OpenKSeF może korzystać kilka osób: właściciel, wspólnik, pracownik, biuro rachunkowe. Wszyscy widzą te same faktury i ten sam status płatności. Firma ma jeden token lub certyfikat KSeF i jedną synchronizację.

Osobami z dostępem zarządzasz w portalu: **Firma** > **Osoby z dostępem**. Aplikacja mobilna nie ma zaproszeń ani listy osób.

## Role

Każda osoba ma w firmie jedną rolę. Osoba, która dodała firmę, jest jej **Właścicielem**. Firma ma zawsze co najmniej jednego właściciela, może mieć kilku.

| Uprawnienie | Właściciel | Administrator | Księgowy | Pracownik |
|-------------|:---:|:---:|:---:|:---:|
| Przeglądanie faktur, statusu synchronizacji i tokenu (typ i data, bez samego tokenu) | tak | tak | tak | tak |
| Oznaczanie faktur jako opłaconych i cofanie oznaczenia | tak | tak | tak | tak |
| **Pobierz z KSeF** (ręczna synchronizacja) | tak | tak | tak | tak |
| Własne powiadomienia o nowych fakturach tej firmy | tak | tak | tak | tak |
| Szkic faktury wystawianej | tak | tak | tak | tak |
| Wystawienie faktury i wysłanie jej do KSeF | tak | tak | tak | nie |
| **Pełna resynchronizacja** | tak | tak | nie | nie |
| Zapisanie, zmiana i usunięcie tokenu lub certyfikatu KSeF | tak | tak | nie | nie |
| Edycja **Dane firmy** (nazwa, e-mail do powiadomień) i **Dane do faktur** | tak | tak | nie | nie |
| Zapraszanie, odwoływanie zaproszeń, zmiana ról, usuwanie osób | tak | tak, bez roli Właściciel | nie | nie |
| Usunięcie firmy | tak | nie | nie | nie |

- Administrator nie może nadać roli **Właściciel**, odebrać jej ani usunąć właściciela.
- Księgowy, który trzyma token KSeF firmy, potrzebuje roli **Administrator**, aby go zapisać.
- Akcji, do której rola nie uprawnia, portal nie pokazuje albo wyłącza. Przy tokenie widać komunikat „Zmienić to może tylko właściciel lub administrator firmy.”
- Osoba bez dostępu do firmy nie widzi jej wcale.

## Zapraszanie

Wymaga roli Właściciel lub Administrator.

1. Otwórz **Firma** > **Osoby z dostępem** i kliknij **Zaproś osobę**.
2. Wpisz **Adres e-mail** i wybierz **Rola** (domyślnie **Pracownik**).
3. Kliknij **Zaproś**.

Wynik zależy od tego, czy adres należy do konta na tej instancji:

| Sytuacja | Co widzisz | Co dostaje zaproszona osoba |
|----------|------------|-----------------------------|
| Konto z tym adresem e-mail, potwierdzonym, które choć raz zalogowało się do portalu lub aplikacji | **Dostęp nadany**. Osoba ma dostęp od razu | Push „Masz dostęp do firmy” na telefony z powiadomieniami o wszystkich firmach. E-mail „Masz dostęp do firmy \<firma>”, jeśli instancja ma skonfigurowany e-mail |
| Brak konta z tym adresem albo adres konta niepotwierdzony | **Zaproszenie oczekuje** i **Link do zaproszenia** z przyciskiem **Kopiuj link** | E-mail „Zaproszenie do firmy \<firma> w OpenKSeF” z tym samym linkiem, jeśli instancja ma skonfigurowany e-mail |

Link widać tylko zaraz po wysłaniu zaproszenia i zaraz po **Wyślij ponownie**. Lista oczekujących zaproszeń go nie pokazuje. Bez e-maila na instancji skopiuj link od razu i przekaż go osobie zaproszonej dowolnym kanałem. Portal pisze wtedy „Przekaż link osobie zapraszanej (\<e-mail>) dowolnym kanałem.”

Jeśli rejestracja na instancji jest wyłączona, portal pokazuje „Rejestracja jest wyłączona - administrator musi utworzyć konto dla \<e-mail>.”

E-mail z zaproszeniem i o nadanym dostępie wysyła ten sam serwer SMTP co [e-mail o nowych fakturach](powiadomienia-push#jak-to-działa) (zmienne `EMAIL_*`). SMTP z kreatora dotyczy tylko Keycloak.

### Link do zaproszenia

- Działa raz i jest ważny 14 dni.
- Zadziała tylko dla adresu, na który wysłano zaproszenie.
- **Wyślij ponownie** tworzy nowy link ważny kolejne 14 dni i wysyła go e-mailem, jeśli instancja ma e-mail. Poprzedni link przestaje działać.
- **Odwołaj** unieważnia link.
- Wygasły, odwołany, wykorzystany albo nieznany link: „Zaproszenie jest nieprawidłowe lub wygasło.”

Dla administratora instancji: link buduje się z adresu instancji `APP_EXTERNAL_BASE_URL`. Bez niego zaproszenia nie działają.

### Oczekujące zaproszenia

Karta **Oczekujące zaproszenia** pokazuje adres, rolę, kto zaprasza i datę ważności. Zaproszenie po terminie ma oznaczenie **Wygasło**. Przy każdym są przyciski **Wyślij ponownie** i **Odwołaj**. Administrator nie zmienia zaproszeń do roli Właściciel.

### Limity

Zaproszenia, ponowne wysłania i nadane dostępy liczą się razem, w ostatnich 24 godzinach:

- najwyżej 20 na firmę: „Osiągnięto dzienny limit zaproszeń dla tej firmy (20). Spróbuj ponownie później.”
- najwyżej 50 na osobę zapraszającą, we wszystkich firmach: „Osiągnięto Twój dzienny limit zaproszeń (50). Spróbuj ponownie później.”

Odwołanie zaproszenia nie zwalnia miejsca w limicie.

Zaproszenie osoby, która ma już dostęp, albo własnego adresu: „Ta osoba ma już dostęp do tej firmy.” Nic się nie zmienia.

## Dołączanie do firmy

1. Otwórz link z zaproszenia.
2. Zaloguj się albo załóż konto na adres, na który przyszło zaproszenie.
3. Kliknij **Przyjmij zaproszenie**. Portal pokaże „Masz dostęp do firmy \<firma>. Twoja rola: \<rola>.” i przycisk **Przejdź do firmy**.

Zalogowany na inny adres zobaczysz „To zaproszenie jest dla innego adresu e-mail.” Wyloguj się i zaloguj na właściwy adres.

Bez otwierania linku:

- **Instancja z potwierdzaniem adresu e-mail:** po założeniu konta i potwierdzeniu adresu dostęp do firm, do których Cię zaproszono, pojawi się sam po zalogowaniu do portalu lub aplikacji.
- **Instancja bez potwierdzania adresu e-mail:** musisz otworzyć link. Samo konto z tym adresem nie daje dostępu, bo na takiej instancji każdy może założyć konto na dowolny adres.

Firma, do której masz dostęp, pojawia się w portalu i w aplikacji mobilnej obok Twoich firm.

## Opuszczanie firmy i usuwanie osób

- **Opuść firmę:** **Firma** > **Osoby z dostępem**, karta **Twój dostęp**. Każda rola może opuścić firmę. Wrócisz tylko przez nowe zaproszenie.
- **Usuń:** właściciel lub administrator usuwa osobę z listy **Osoby z dostępem**. Administrator nie usunie właściciela.
- **Zmiana roli:** pole roli przy osobie na tej samej liście. Zmiana własnej roli wymaga potwierdzenia, bo możesz stracić możliwość zarządzania firmą.
- Ostatni właściciel nie może opuścić firmy, oddać roli ani zostać usunięty: „Firma musi mieć co najmniej jednego właściciela.” Aby przekazać firmę, nadaj innej osobie rolę **Właściciel**, a potem opuść firmę.
- Po opuszczeniu lub usunięciu osoba traci dostęp przy następnym działaniu, a jej telefony przestają dostawać push o tej firmie. Rejestracje telefonów zostają.
- Jeśli **adres e-mail do powiadomień** firmy to adres tej osoby, OpenKSeF go usuwa. Okno potwierdzenia mówi o tym przed zapisem. Firma nie wysyła wtedy e-maili o nowych fakturach, dopóki właściciel lub administrator nie ustawi nowego adresu w **Dane firmy**. Inny adres, np. wspólna skrzynka biura, zostaje.
- Oznaczenia płatności tej osoby zostają z jej nazwiskiem.

**Usunięcie firmy** (tylko właściciel) usuwa ją wszystkim osobom z dostępem razem z oczekującymi zaproszeniami. Okno potwierdzenia pokazuje „Dostęp do firmy stracą też inne osoby (liczba: N).”

## Kto oznaczył fakturę jako opłaconą

Status płatności jest jeden dla firmy. Gdy ktoś oznaczy fakturę jako opłaconą, wszyscy widzą to w portalu jako „Opłacona dd.mm.rrrr przez \<imię i nazwisko lub e-mail>”. Faktury oznaczone przed v0.0.27 przypisano właścicielowi firmy. **Cofnij oznaczenie** czyści datę i osobę. Gdy dwie osoby zmienią status jednocześnie, zostaje ostatnia zmiana. Szczegóły: [Status płatności](faktury#status-płatności).

## Powiadomienia w każdej firmie

W karcie **Twój dostęp** przełącznik **Powiadomienia o nowych fakturach** dotyczy tej firmy i Twoich urządzeń. Każda osoba ustawia go sama. Jest włączony domyślnie, także dla zaproszonych osób.

- Push o nowej fakturze i podsumowanie dostaje każda osoba z dostępem, która ma włączony ten przełącznik i zarejestrowany telefon.
- Push „Faktura czeka na wyjaśnienie w KSeF” dostają wszystkie osoby z dostępem, niezależnie od przełącznika.
- E-mail o nowych fakturach idzie na jeden **adres e-mail do powiadomień** firmy, a nie do każdej osoby. Przełącznik go nie zmienia.

Szczegóły: [Kto dostaje powiadomienie](powiadomienia-push#kto-dostaje-powiadomienie).

## Aplikacja mobilna

- Od wersji 1.0.9 lista firm pokazuje Twoją rolę, a edycja i usunięcie firmy są ukryte, gdy rola na nie nie pozwala. **Dane do faktur** bez uprawnienia do edycji są tylko do odczytu.
- Starsze wersje pokazują te przyciski, ale serwer odmówi zapisu. Przeglądanie faktur działa w każdej wersji.
- Zaproszenia otwierasz w przeglądarce. Dostęp nadany w portalu pojawi się w aplikacji po odświeżeniu listy firm.

## Jedna firma na NIP

Od v0.0.29 na jednym serwerze OpenKSeF może być tylko jedna firma o danym NIP. Druga osoba dostaje dostęp do tej firmy tylko przez [zaproszenie](#zapraszanie) od Właściciela lub Administratora. Dotyczy to portalu, aplikacji mobilnej i kreatora pierwszej konfiguracji.

Dodanie firmy o NIP, który jest już na serwerze:

- Masz dostęp do tej firmy: „Masz już dostęp do firmy z tym NIP-em: \<nazwa>.”
- Nie masz dostępu: „Firma z tym NIP-em jest już dodana na tym serwerze OpenKSeF. Poproś osobę, która nią zarządza, o zaproszenie do firmy. Jeśli nie wiesz, kto to jest, napisz do administratora serwera.” Komunikat nie podaje nazwy firmy ani osób z dostępem.

Jeśli opuściłeś firmę, nie dodasz jej NIP ponownie. Poproś Właściciela lub Administratora o nowe zaproszenie.

NIP zwalnia się dopiero po usunięciu firmy przez Właściciela albo razem z kontem jej jedynej osoby. Firma dodana potem jest nowa i pusta: bez faktur, statusów płatności, tokenu i osób z dostępem.

Firmy o tym samym NIP dodane przed v0.0.29 działają dalej bez zmian. Każda ma własny token, synchronizację, faktury i status płatności. Nowej firmy z tym NIP nie da się już dodać.

## Historia zmian

Instancja zapisuje, kto i kiedy zaprosił, nadał dostęp, przyjął zaproszenie, zmienił rolę, usunął osobę lub opuścił firmę, odwołał lub ponownie wysłał zaproszenie, usunął adres e-mail do powiadomień, zapisał lub usunął token oraz oznaczył fakturę jako opłaconą. Historii nie widać w portalu ani w aplikacji. Może ją odczytać właściciel instancji z bazy danych. Zobacz [Polityka prywatności](polityka-prywatnosci).
