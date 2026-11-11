---
title: Certyfikat KSeF
---

# Certyfikat KSeF

:::info[Dostępność]
Logowanie certyfikatem KSeF działa od następnego wydania po v0.0.12. W v0.0.12 i starszych firma łączy się z KSeF tylko [tokenem KSeF](token-ksef).
:::

OpenKSeF może logować się do KSeF certyfikatem KSeF zamiast tokenem. Token zostaje domyślnym sposobem. Certyfikat to zapasowa droga, gdy nie masz tokenu albo token przestanie działać.

Dlaczego teraz: według Ministerstwa Finansów Aplikacja Podatnika KSeF 2.0 obsługuje „generowanie i obsługę tokenów (do 31 grudnia 2026 r.)”. Obowiązujące rozporządzenie dopuszcza logowanie tokenem do 31 grudnia 2026 r. Certyfikat KSeF jest stałą metodą logowania i nie zależy od tej zmiany. Możesz go przygotować już teraz, póki token działa.

## Wygeneruj certyfikat

1. Otwórz Aplikację Podatnika KSeF 2.0 w tym samym środowisku, w którym działa Twoja instancja ([Środowiska KSeF](instalacja/konfiguracja#środowiska-ksef)):
   - produkcja: [ap.ksef.mf.gov.pl](https://ap.ksef.mf.gov.pl),
   - demo: [ap-demo.ksef.mf.gov.pl](https://ap-demo.ksef.mf.gov.pl),
   - test: [ap-test.ksef.mf.gov.pl](https://ap-test.ksef.mf.gov.pl).
2. Zaloguj się Węzłem krajowym (Profil Zaufany, e-dowód, mObywatel), podpisem kwalifikowanym albo pieczęcią kwalifikowaną firmy. Tokenem nie złożysz wniosku o certyfikat.
3. Złóż wniosek o certyfikat typu **Uwierzytelnianie** (w dokumentacji MF: typ 1, w API: `Authentication`). Nie wybieraj typu **Offline**: nie pozwala się zalogować.
4. Podczas wniosku Aplikacja Podatnika wygeneruje klucz prywatny i zapisze go na Twoim komputerze. Zachowaj plik klucza i jego hasło: bez nich certyfikatu nie użyjesz.
5. Po wydaniu certyfikatu pobierz go w Aplikacji Podatnika.

Wniosek o certyfikat składasz tylko we własnym imieniu: certyfikat zawiera dane osoby albo firmy, która się zalogowała. Certyfikatu wydanego na osobę fizyczną nie wolno przekazywać innej osobie.

Certyfikat nie niesie uprawnień. Po zalogowaniu KSeF sprawdza uprawnienia identyfikatora z certyfikatu (NIP albo PESEL) w kontekście NIP firmy:
- właściciel firmy ma pełne uprawnienia,
- pracownik albo księgowy potrzebuje w KSeF uprawnień do tej firmy: do **odczytu faktur**, aby pobierać faktury, i do **wystawiania faktur**, aby je wysyłać.

## Pliki

Do OpenKSeF wgrywasz jedno z dwóch:

- parę `.crt` + `.key` z Aplikacji Podatnika i hasło do klucza,
- plik `.pfx` albo `.p12`, który zawiera certyfikat z kluczem prywatnym, i jego hasło.

Plik `.crt` bez klucza prywatnego nie wystarczy. Łączny rozmiar plików to maksymalnie 64 KB. Plik certyfikatu ma zwykle kilka KB.

## Wgraj certyfikat w OpenKSeF

Certyfikat dodasz tylko w portalu. Aplikacja mobilna nie obsługuje certyfikatów.

1. Otwórz **Firma** > **Dostęp do KSeF i pobieranie**.
2. W karcie **Dostęp do KSeF**, w polu **Sposób logowania do KSeF**, wybierz **Certyfikat KSeF**.
3. W polu **Plik certyfikatu (.pfx, .p12 lub .crt)** wybierz plik. Dla pliku `.crt` pojawi się pole **Klucz prywatny (.key)**: wybierz w nim plik klucza.
4. Wpisz **Hasło**.
5. Kliknij **Dodaj certyfikat** (albo **Zapisz certyfikat**, jeśli firma ma już token lub certyfikat).

Po zapisaniu zobaczysz komunikat „Certyfikat KSeF zapisany pomyślnie” oraz datę ważności. Uruchom **Pobierz z KSeF**, aby sprawdzić, czy certyfikat działa.

Firma ma jeden sposób logowania. Zapisany certyfikat zastępuje token, a nowy token zastępuje certyfikat.

### Hasło

Hasło służy tylko do odczytu pliku. OpenKSeF go nie zapisuje. Certyfikat z kluczem prywatnym przechowuje zaszyfrowany i nigdy go nie pokazuje: portal wyświetla tylko rodzaj, datę ostatniej aktualizacji i datę ważności.

### Błędy przy wgrywaniu

Przy błędzie nic się nie zapisuje, a poprzedni token lub certyfikat działa dalej.

| Komunikat | Co zrobić |
|-----------|-----------|
| Nie udało się odczytać certyfikatu. Sprawdź hasło i czy wybrany plik jest właściwy. | Wpisz hasło jeszcze raz. Sprawdź, czy plik `.key` pasuje do pliku `.crt`. |
| Plik nie zawiera klucza prywatnego. Wgraj plik .pfx/.p12 z kluczem albo parę .crt + .key. | Dodaj plik `.key` albo wgraj `.pfx`/`.p12` z kluczem. |
| Certyfikat wygasł. Wygeneruj nowy w Aplikacji Podatnika KSeF i wgraj go. | Wygeneruj nowy certyfikat. |
| Nie można odczytać klucza prywatnego (.key): plik jest zaszyfrowany w nieobsługiwany sposób. Wgraj certyfikat jako plik .pfx/.p12. | Wgraj certyfikat z kluczem jako `.pfx`/`.p12`. |
| Plik jest za duży. Maksymalny rozmiar to 64 KB. | Sprawdź, czy wybrałeś właściwy plik. |
| Do pliku .crt dodaj klucz prywatny (.key) | Wybierz plik `.key`. |
| Hasło jest wymagane | Wpisz hasło. |

Certyfikat typu Offline albo certyfikat bez uprawnień do firmy portal przyjmie, ale KSeF odrzuci go przy pierwszym logowaniu. Pobieranie pokaże błąd, a wysyłka faktury komunikat: „KSeF odrzucił certyfikat (nieprawidłowy, wygasły lub unieważniony). Wgraj nowy certyfikat KSeF w ustawieniach firmy.”

## Ważność i odnowienie

Certyfikat KSeF jest ważny nie dłużej niż 2 lata od daty podanej we wniosku albo, gdy jej nie podano, od daty wydania. Kolejny certyfikat możesz wygenerować w dowolnym momencie, w ramach limitu aktywnych certyfikatów. Gdy limit jest wyczerpany, nowy certyfikat dostaniesz na miesiąc przed upływem ważności najstarszego aktywnego certyfikatu.

Portal pokazuje ważność w karcie **Dostęp do KSeF**:

- „Certyfikat ważny do [data]” – wszystko działa.
- Mniej niż 30 dni do końca: „Certyfikat wygasa [data]. Wygeneruj nowy w Aplikacji Podatnika KSeF i wgraj go tutaj, zanim pobieranie i wysyłka przestaną działać.”
- Po terminie: „Certyfikat wygasł [data]. Pobieranie i wysyłka faktur nie działają. Wgraj nowy certyfikat albo token.”

Odnowienie: wygeneruj nowy certyfikat w Aplikacji Podatnika i wgraj go w OpenKSeF tak jak pierwszy. Nowy zastąpi stary.

Jeśli klucz prywatny wyciekł albo serwer został przejęty, unieważnij certyfikat w Aplikacji Podatnika. Unieważnionego certyfikatu nie da się przywrócić, potrzebny jest nowy.

## Certyfikat z wcześniejszych wersji

Certyfikatu `.pfx` zapisanego przed wydaniem z logowaniem certyfikatem nie da się odczytać. Portal pokaże „Nie można odczytać zapisanego certyfikatu. Wgraj go ponownie.” Wgraj certyfikat jeszcze raz w **Firma** > **Dostęp do KSeF i pobieranie**.

## Źródła

- [Certyfikaty KSeF](https://ksef.podatki.gov.pl/informacje-ogolne-ksef-20/certyfikaty-ksef/) (Ministerstwo Finansów)
- [Podręcznik KSeF 2.0, cz. I](https://ksef.podatki.gov.pl/media/dmrfdixs/podrecznik-ksef-20-cz-i-rozpoczecie-korzystania-z-ksef-06082026.pdf), rozdz. 2.5 (Ministerstwo Finansów, sierpień 2026)
- [Aplikacja Podatnika KSeF 2.0](https://ksef.podatki.gov.pl/aplikacja-podatnika-ksef-20/) (Ministerstwo Finansów)
- [Certyfikaty KSeF](https://github.com/CIRFMF/ksef-docs/blob/main/certyfikaty-KSeF.md) i [Uwierzytelnianie](https://github.com/CIRFMF/ksef-docs/blob/main/uwierzytelnianie.md) (dokumentacja API KSeF 2.0)
- [Dz.U. 2025 poz. 1815](https://api.sejm.gov.pl/eli/acts/DU/2025/1815/text.pdf), § 13 ust. 1 pkt 1 (termin logowania tokenem)
