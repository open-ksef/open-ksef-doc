---
sidebar_position: 4
title: Kreator konfiguracji
---

# Kreator konfiguracji (Admin Setup)

Kreator konfiguracji automatyzuje pierwszą konfigurację systemu. Zamiast ręcznie edytować pliki `.env`, kopiować sekrety z Keycloak i restartować kontenery -- wystarczy uruchomić `docker compose up` i przejść przez webowy wizard pod adresem `http://localhost:8080/admin-setup`.

:::tip[Nie masz jeszcze uruchomionego stacku?]
Przejdź do [Szybki start](instalacja/szybki-start).
:::

## Wymagania wstępne

- Stack Docker uruchomiony (`docker compose up -d`) z ustawionym `ENCRYPTION_KEY`, patrz [Klucz szyfrowania](#klucz-szyfrowania)
- Port 8080 dostępny (gateway)

Tylko nowe instalacje. Na istniejącej instalacji nie uruchamiaj `docker compose up -d`: wykonaj [procedurę aktualizacji](#aktualizacja-z-wersji-v007-lub-starszej).

## Kroki wizarda

### Krok 1: Uwierzytelnienie administratora Keycloak

![Krok 1 - logowanie Keycloak](/img/screenshots/portal/admin-setup-step1.png)

Wprowadź dane logowania admina Keycloak (`KEYCLOAK_ADMIN` i `KEYCLOAK_ADMIN_PASSWORD` z pliku `.env`). Wizard uwierzytelnia się w realm `master` i zapisuje dane logowania w tymczasowym tokenie sesji (ważnym 10 minut), który jest używany do konfiguracji Keycloak w kolejnych krokach.

### Krok 2: Konfiguracja podstawowa

![Krok 2 - konfiguracja podstawowa](/img/screenshots/portal/admin-setup-step2.png)

| Pole | Opis | Domyślnie |
|------|------|-----------|
| Zewnętrzny URL | Publiczny adres systemu | Bieżący adres przeglądarki |
| Środowisko KSeF | Test lub Produkcja | Test (`ksef-test.mf.gov.pl`) |
| Email admina | Email pierwszego użytkownika | *(wymagany)* |
| Hasło admina | Hasło pierwszego użytkownika | *(wymagane, min. 8 znaków)* |
| Imię / Nazwisko | Opcjonalne dane użytkownika | Admin |

### Krok 3: Uwierzytelnianie i email

![Krok 3 - autoryzacja i email](/img/screenshots/portal/admin-setup-step3.png)

**Polityka logowania:**
- Rejestracja użytkowników (domyślnie: WŁĄCZONA)
- Weryfikacja email (domyślnie: WYŁĄCZONA, wymaga SMTP)
- Logowanie emailem (domyślnie: WŁĄCZONE)
- Reset hasła (domyślnie: WŁĄCZONY, wymaga SMTP)

**Polityka haseł:**
- Podstawowa: minimum 8 znaków
- Silna: 12 znaków, znaki specjalne, wielkie litery, cyfry

**SMTP (opcjonalnie):**

Jeśli włączysz weryfikację email lub reset hasła, potrzebujesz SMTP:

| Dostawca | Host | Port | TLS |
|----------|------|------|-----|
| Gmail | smtp.gmail.com | 587 | StartTLS |
| Outlook/O365 | smtp.office365.com | 587 | StartTLS |
| Własny | (ręcznie) | (ręcznie) | (ręcznie) |

:::tip[Gmail]
Gmail wymaga **Hasła aplikacji** (nie zwykłego hasła). Wygeneruj je w ustawieniach konta Google: Bezpieczeństwo > Weryfikacja dwuetapowa > Hasła aplikacji.
:::

### Krok 4: Bezpieczeństwo

Wizard pobiera **secret klienta API** z klienta Keycloak `openksef-api` i zapisuje go w bazie.

**Klucz szyfrowania AES-256** nie jest częścią wizarda. Ustaw `ENCRYPTION_KEY` dla API i Workera przed uruchomieniem stacku i przechowuj kopię poza bazą danych. Bez prawidłowego klucza wizard nie zastosuje konfiguracji i nie zmieni niczego w Keycloak. Szczegóły w sekcji [Klucz szyfrowania](#klucz-szyfrowania).

### Krok 5: Integracje (opcjonalne)

![Krok 5 - integracje](/img/screenshots/portal/admin-setup-step5.png)

**Google OAuth:** Jeśli chcesz logowanie przez Google, utwórz Google Cloud OAuth 2.0 Client ID i wprowadź dane. URI przekierowania jest uzupełniony automatycznie.

**Powiadomienia push:** Trzy tryby:

- **Relay OpenKSeF (domyślny, zalecany)** -- Używa serwera relay do dostarczania push via FCM/APNs. Nie wymaga konfiguracji Firebase. URL relay (`https://push.open-ksef.pl`) jest wypełniony automatycznie.
- **Własny projekt Firebase (zaawansowane)** -- Wklej JSON service account Firebase. Szczegóły w [Powiadomienia push](powiadomienia-push).
- **Tylko lokalne (SignalR)** -- Brak zdalnych powiadomień. Użytkownicy otrzymują powiadomienia tylko gdy aplikacja mobilna jest aktywnie połączona z serwerem.

SignalR działa zawsze, niezależnie od wybranego trybu. Tryb wpływa tylko na zdalne (background) dostarczanie.

### Krok 6: Podsumowanie i zastosowanie

![Krok 6 - podsumowanie](/img/screenshots/portal/admin-setup-step6.png)

Przejrzyj wszystkie ustawienia i kliknij "Zastosuj". Wizard:

1. Tworzy realm `openksef` w Keycloak (jeśli nie istnieje)
2. Tworzy klienty OAuth: `openksef-api`, `openksef-mobile`, `openksef-portal-web`
3. Pobiera secret klienta API z Keycloak
4. Włącza token-exchange dla service account
5. Aktualizuje URI przekierowań z zewnętrznym URL
6. Konfiguruje realm Keycloak (polityka logowania, haseł, SMTP)
7. Tworzy konto admina w Keycloak
8. Konfiguruje Google IdP (jeśli podano)
9. Zapisuje całą konfigurację w bazie danych
10. Przekierowuje na stronę logowania

## Klucz szyfrowania

Ten opis dotyczy wersji `WERSJA-T-026` i nowszych.

:::danger[Sprawdź ENCRYPTION_KEY przed aktualizacją]
Przed każdym `docker compose pull`, `docker compose up -d`, aktualizacją stacku lub uruchomieniem automatycznego aktualizatora sprawdź `ENCRYPTION_KEY` w `.env` lub w zmiennych stacku. Jeśli ma prawidłową wartość, pierwszy start nowych obrazów przenosi klucz na tę wartość, bez zatrzymania usług i bez kopii zapasowej. Najpierw wykonaj [procedurę aktualizacji](#aktualizacja-z-wersji-v007-lub-starszej).

Klucz już się przeniósł (zapytanie z jej kroku 1 zwraca 0)? Zachowaj tę wartość, bo to jedyna kopia klucza, a [rotację](#rotacja-klucza) wykonaj tylko wtedy, gdy chcesz nowy klucz. Wartość jest pusta? Nie generuj klucza i nie uruchamiaj `docker compose up -d`. Krok 1 procedury podaje, skąd ją odzyskać.
:::

Klucz szyfruje zapisane tokeny i certyfikaty KSeF. Jego utrata oznacza utratę tych danych: trzeba je wprowadzić ponownie.

Prawidłowy klucz to 32 bajty w base64, czyli 44 znaki. Wygeneruj go jednym z poleceń:

```bash
openssl rand -base64 32
# albo, bez openssl, samym Dockerem:
docker run --rm postgres:16-alpine sh -c "head -c 32 /dev/urandom | base64"
```

Polecenia w procedurach poniżej są napisane dla powłoki bash. Na Windows użyj WSL lub Git Bash. PowerShell uszkadza zrzut bazy przy przekierowaniu `>`.

### Co się stanie, jeśli tylko pobierzesz nowe obrazy

Obrazy `:latest` dostajesz przy zwykłym `docker compose pull`. Do wersji v0.0.7 włącznie klucz leży w bazie obok zaszyfrowanych danych, więc każdy zrzut bazy pozwala je odszyfrować. Nowa wersja to zmienia, ale tylko gdy podasz klucz:

| Stan po aktualizacji | Efekt |
|---|---|
| Nowe obrazy, klucz w bazie, `ENCRYPTION_KEY` pusty | **Tryb przejściowy.** System działa bez zmian, nic nie ginie. Klucz zostaje w bazie, bezpieczeństwo jest takie jak dotąd. Każdy start loguje Error |
| Nowe obrazy, klucz w bazie, `ENCRYPTION_KEY` nieprawidłowy (np. zły format lub długość) | Tak samo: tryb przejściowy i Error przy każdym starcie |
| Nowe obrazy, klucz w bazie, `ENCRYPTION_KEY` prawidłowy | Klucz jest przenoszony od razu przy pierwszym starcie, właśnie na tę wartość. Upewnij się, że masz ją zapisaną poza bazą, i wykonaj procedurę poniżej **przed** pobraniem obrazów |
| Nowy `docker-compose.yml` bez `ENCRYPTION_KEY` | `docker compose` odmawia działania. Komunikat kieruje istniejącą instalację do tej strony, a dla nowej podaje polecenie generujące klucz. `stop`, `exec`, `ps`, `logs` odmawiają, chyba że ustawiono nazwę projektu. `up`, `pull`, `run` odmawiają zawsze. Działające kontenery pozostają nietknięte |

Tryb przejściowy to rozwiązanie tymczasowe: planujemy, że kolejne wydania przestaną czytać klucz z bazy. Przenieś klucz, gdy tylko możesz.

### Aktualizacja z wersji v0.0.7 lub starszej

Pierwszy start z prawidłowym kluczem w konfiguracji szyfruje ponownie wszystkie dane logowania i usuwa wiersz klucza z bazy, w jednej transakcji.

Kroki 1 do 3 wykonaj plikiem compose, którego używasz teraz. Nowy `docker-compose.yml` podmienisz dopiero w kroku 6.

`docker compose` odmawia działania (stary plik nadpisany albo utracony `.env`)? Nie dopisuj klucza, żeby to obejść: jedno `up` przeniesie klucz bez kopii zapasowej. Wykonaj kroki 1 do 3 samym Dockerem, a od kroku 4 kontynuuj zgodnie z procedurą. Uruchamiaj po jednym poleceniu. Pierwsze to krok 1: przy wyniku `0` przerwij, tak jak w tym kroku. Utracony `.env`: odtwórz go tak, jak podaje wiersz [`docker compose` zgłasza brak](#rozwiązywanie-problemów). Nazwy kontenerów są stałe:

```bash
echo "SELECT count(*) FROM \"SystemConfigs\" WHERE \"Key\"='encryption_key';" | docker exec -i openksef-postgres sh -c 'psql -U "$POSTGRES_USER" -d openksef -tA'
```

`is not running`? Uruchom `docker start openksef-postgres`, odczekaj kilka sekund, potem uruchom zapytanie.

`No such container`? Przejdź do katalogu z `docker-compose.yml` i `.env` tego stacku: compose nadaje projektowi nazwę od katalogu, a inny katalog to nowy, pusty wolumen. Uruchom `docker volume ls --filter name=postgres_data` i zanotuj swój wolumen: `<projekt>_postgres_data`, gdzie `<projekt>` to nazwa katalogu albo stacku w Portainerze. Pusta lista oznacza, że bazy już nie ma: przerwij i przywróć kopię zapasową. Uruchom samego Postgresa. To polecenie nie uruchamia API ani Workera i nie przenosi klucza: `ENCRYPTION_KEY=unused docker compose up -d --no-deps postgres`. Wymaga to `POSTGRES_USER`, `POSTGRES_PASSWORD`, `KEYCLOAK_ADMIN` i `KEYCLOAK_ADMIN_PASSWORD` w `.env`. Sprawdź wolumen: `docker inspect openksef-postgres --format '{{range .Mounts}}{{.Name}}{{end}}'` musi wypisać zanotowaną nazwę. Inna nazwa oznacza pustą bazę, która nie jest Twoja: uruchom `docker rm -f openksef-postgres`, co zachowuje wolumeny, i powtórz z właściwego katalogu. Nie ma takiego katalogu, jak przy stacku w Portainerze: dopisz `COMPOSE_PROJECT_NAME=<projekt>` przed poleceniem. Odczekaj kilka sekund, potem uruchom zapytanie. Każdy błąd, np. `relation "SystemConfigs" does not exist`, to nie wynik `0`: nie idź dalej i nie generuj klucza. Sprawdź wolumen i `POSTGRES_USER`, potem spróbuj ponownie. Bez API i Workera `docker stop` poniżej zgłasza `No such container`: kontynuuj.

Dalej tylko przy wyniku `1`:

```bash
docker stop openksef-api openksef-worker
docker exec openksef-postgres sh -c 'pg_dump -U "$POSTGRES_USER" -Fc openksef' > before-key-move.dump
docker exec -i openksef-postgres pg_restore -l < before-key-move.dump > /dev/null; echo "exit=$?"
```

1. **Sprawdź, czy klucz jest nadal w bazie:**
   ```bash
   echo "SELECT count(*) FROM \"SystemConfigs\" WHERE \"Key\"='encryption_key';" | docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d openksef -tA'
   ```
   `service "postgres" is not running`? Nie uruchamiaj `docker compose up -d`. Uruchom `docker start openksef-postgres`, odczekaj kilka sekund, potem spróbuj ponownie. Ten sam błąd? To nie jest katalog stacku. Przejdź do niego albo użyj poleceń z samym Dockerem powyżej, potem kontynuuj od kroku 4. `No such container`? Postępuj według akapitu `No such container` powyżej. Kontynuuj tylko przy wyniku `1`. Wynik `0` oznacza, że klucz jest już przeniesiony, a `ENCRYPTION_KEY` to jego jedyna kopia. **Przerwij tę procedurę, nie zmieniaj `ENCRYPTION_KEY`.** Jeśli `ENCRYPTION_KEY` jest pusty, **nie generuj klucza i nie uruchamiaj `docker compose up -d`**. Przywróć poprzednią wartość. Jeśli nie masz kopii, nadal trzymają ją kontenery: `docker inspect openksef-api | grep '"ENCRYPTION_KEY='`. To polecenie wypisuje sekret w terminalu. Jeśli polecenie nie pokazuje wartości (`"ENCRYPTION_KEY="` lub `No such object`), uruchom je dla `openksef-worker`. Jeśli i tam jej nie ma, kopii już nie ma. Dopiero wtedy wygeneruj klucz, ustaw go, uruchom `docker compose up -d` i postępuj według wiersza `Nowy klucz utracony` w tabeli wycofania zmian poniżej. `does not decrypt` zostaje w logach, dopóki wszystkie dane logowania nie zostaną wprowadzone ponownie. Gdy klucz wróci do `ENCRYPTION_KEY`, uruchom `docker compose up -d` i sprawdź, czy jedna ręczna synchronizacja kończy się sukcesem. [Rotację klucza](#rotacja-klucza) wykonaj tylko wtedy, gdy chcesz nowy klucz.
2. **Zatrzymaj API i Workera:** `docker compose stop api worker`. Zatrzymaj obie usługi, bo compose uruchamia je w dowolnej kolejności. Stare API, które działa w trakcie przenoszenia klucza, zapisze dane pod starym kluczem i te dane przepadną.
3. **Zrób kopię zapasową:** `docker compose exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" -Fc openksef' > before-key-move.dump`. Ten zrzut zawiera stary klucz razem z zaszyfrowanymi danymi, więc go chroń. Sprawdź go: `docker compose exec -T postgres pg_restore -l < before-key-move.dump > /dev/null; echo "exit=$?"` musi wypisać `exit=0`.
4. **Wygeneruj klucz:** `openssl rand -base64 32` albo poleceniem Dockera podanym wyżej. Musi mieć 44 znaki. **Zapisz go w menedżerze haseł przed następnym krokiem**, poza bazą i jej kopiami. Nie używaj ponownie starszej wartości `ENCRYPTION_KEY`.
5. **Ustaw klucz:** skopiuj obecną wartość `ENCRYPTION_KEY`, jeśli jest ustawiona, do menedżera haseł, zanim ją nadpiszesz. Potem wpisz nową wartość do `ENCRYPTION_KEY` w `.env` lub w zmiennych stacku.
6. **Uruchom nowe obrazy:** podmień `docker-compose.yml` na nowy plik z [Szybkiego startu](instalacja/szybki-start) lub z załącznika na [stronie wydania](https://github.com/open-ksef/open-ksef/releases), potem `docker compose pull api worker portal-web gateway` i `docker compose up -d`.
7. **Sprawdź:**
   - W `docker compose logs api worker` jedna usługa loguje `Encryption key moved out of the database`. Druga nic o tym nie loguje. Żadna nie loguje Critical.
   - Zapytanie z kroku 1 zwraca 0.
   - Jedna ręczna synchronizacja kończy się sukcesem: **Dane logowania** > wiersz firmy > **Wymuś synchronizację**.

Zrzut z kroku 3 to teraz jedyna kopia starego klucza. Zachowaj go co najmniej do udanej synchronizacji. Zrzuty sprzed przeniesienia klucza pozwalają odszyfrować tokeny, dopóki ich nie usuniesz.

Log Critical `Moving the encryption key out of the database failed`, a w następnym wierszu `Credential <id> cannot be decrypted`, oznacza, że tych danych logowania nie da się odszyfrować i nic się nie zmieniło. Usuń je lub wprowadź ponownie w portalu i uruchom usługi ponownie. Jeśli log mówi `does not decrypt`, przywróć klucz i niczego nie usuwaj. Ten sam Critical bez wiersza z danymi logowania oznacza, że nic się nie zmieniło: uruchom usługi ponownie. Dla `cannot be used` zobacz [Rozwiązywanie problemów](#rozwiązywanie-problemów).

**Wycofanie zmian**

Poprzednie obrazy mają tag wydania, np. `:v0.0.7`. Ustaw go w czterech liniach `image:` z `ghcr.io/open-ksef/openksef-*` w `docker-compose.yml`, potem uruchom `docker compose up -d`.

| Sytuacja | Efekt |
|---|---|
| Wiersz klucza nadal w bazie, powrót do poprzednich obrazów | Działa, nic się nie zmieniło |
| Wiersza już nie ma, poprzednie obrazy, `ENCRYPTION_KEY` zachowany | Działa: poprzednie obrazy czytają klucz ze zmiennej, gdy nie ma wiersza |
| Wiersza już nie ma, poprzednie obrazy, klucz tylko w `ENCRYPTION_KEY_FILE` | Użycie danych logowania nie działa: poprzednie obrazy nie czytają tego pliku. Ustaw `ENCRYPTION_KEY` na tę samą wartość |
| Wiersza już nie ma, poprzednie obrazy, `ENCRYPTION_KEY` cofnięty lub pusty | Usługi działają, użycie danych logowania kończy się błędem w logach, dane się nie zmieniają. Przywróć nowy klucz. **Nie cofaj klucza** |
| Nowy klucz utracony | Obecnych danych nie da się odzyskać. Firmy wprowadzają tokeny ponownie albo przywracasz zrzut sprzed przeniesienia klucza i tracisz późniejsze zmiany |
| Przywrócony zrzut z kroku 3 | Wraca wiersz i stare dane. Następny start znowu przeniesie klucz |

Aby przywrócić zrzut, najpierw zatrzymaj obie usługi, potem uruchom `docker compose exec -T postgres sh -c 'pg_restore -U "$POSTGRES_USER" -d openksef --clean --if-exists' < before-key-move.dump`.

### Rotacja klucza

Wykonaj ją na stacku z aktualnymi obrazami i z kluczem już przeniesionym: zapytanie z kroku 1 procedury aktualizacji zwraca 0.

1. Wygeneruj nowy klucz: `openssl rand -base64 32` albo poleceniem Dockera podanym wyżej. **Zapisz go w menedżerze haseł, zanim cokolwiek uruchomisz.** Stary klucz zachowaj do udanego kroku 6.
2. Zatrzymaj API i Workera: `docker compose stop api worker`.
3. Zrób kopię zapasową i sprawdź zrzut, jak w procedurze aktualizacji, ale do pliku `before-rotation.dump`. Nie nadpisuj `before-key-move.dump`.
4. Zaszyfruj dane ponownie, z `ENCRYPTION_KEY` nadal ustawionym na stary klucz. Nowy klucz jest czytany ze zmiennej środowiskowej i nigdy nie jest argumentem polecenia:
   ```bash
   read -rsp 'New key: ' ENCRYPTION_KEY_NEW && echo && export ENCRYPTION_KEY_NEW
   docker compose run --rm -e ENCRYPTION_KEY_NEW api rotate-encryption-key
   unset ENCRYPTION_KEY_NEW
   ```
   Polecenie wypisuje `Re-encrypted N credentials.` i kończy się kodem 0. Ponowne uruchomienie jest bezpieczne i zgłasza 0.
5. Wpisz nową wartość do `ENCRYPTION_KEY` w `.env` lub w zmiennych stacku, potem `docker compose up -d`.
6. Sprawdź: brak Critical w logach i jedna ręczna synchronizacja zakończona sukcesem. Dopiero wtedy pozbądź się starego klucza.

Polecenie kończy się kodem 1 i niczego nie zapisuje, gdy:

- `ENCRYPTION_KEY_NEW` jest pusty, nieprawidłowy lub równy obecnemu kluczowi albo obecny klucz jest pusty lub nieprawidłowy.
- Z bazą są połączeni inni klienci bez nazwy aplikacji. Tak wykrywany jest działający Worker i aktywne API. API bezczynne od kilku minut nie trzyma połączenia i nie zostanie wykryte, więc zawsze wykonaj krok 2. Narzędzia z nazwą (`psql`, `pg_dump`, pgAdmin) i autovacuum się nie liczą. Zamknij klientów, których liczbę podaje komunikat. Znajdziesz ich zapytaniem: `SELECT pid, usename, client_addr, backend_start FROM pg_stat_activity WHERE datname = current_database() AND backend_type = 'client backend' AND application_name = '';`
- Baza nie jest w wersji tego obrazu albo klucz nadal jest w bazie. Uruchom aplikację raz, zatrzymaj ją i spróbuj ponownie.
- Danych logowania nie da się odszyfrować. Komunikat podaje, których.

**Wycofanie zmian**

| Sytuacja | Działanie |
|---|---|
| Polecenie odmówiło | Nic się nie zmieniło. Usuń przyczynę i spróbuj ponownie |
| Po kroku 4, problem przed krokiem 6 | Zatrzymaj API i Workera. Potem wykonaj rotację w drugą stronę (`ENCRYPTION_KEY` = nowy klucz, `ENCRYPTION_KEY_NEW` = stary klucz), następnie ustaw `ENCRYPTION_KEY` na stary klucz i uruchom `docker compose up -d`, albo przywróć `before-rotation.dump` i zachowaj stary klucz |
| Nowy klucz utracony po kroku 4 | Przywróć `before-rotation.dump` ze starym kluczem i strać późniejsze zmiany. Bez starego klucza firmy wprowadzają tokeny ponownie |

Rotację wycofuje `before-rotation.dump`. Przywróć go tym samym poleceniem co w procedurze aktualizacji, po zatrzymaniu obu usług. `before-key-move.dump` wraca do stanu sprzed przeniesienia klucza i nie służy do wycofania rotacji.

## Architektura

### Przechowywanie konfiguracji

Konfiguracja jest przechowywana w tabeli `SystemConfigs` (klucz-wartość). Serwis `ISystemConfigService` czyta z tej tabeli z cache'em w pamięci, z fallbackiem na zmienne środowiskowe.

**Priorytet:** Kreator (baza danych) > plik `.env` > wartości domyślne w `docker-compose.yml`

Oznacza to, że po przejściu kreatora jego ustawienia mają najwyższy priorytet. Plik `.env` nadpisuje tylko te wartości, których kreator nie ustawił. Wyjątek to [klucz szyfrowania](#klucz-szyfrowania): kreator go nie zapisuje.

### Endpointy API

| Endpoint | Autoryzacja | Cel |
|----------|-------------|-----|
| `GET /api/system/setup-status` | Anonimowy | Zwraca `{isInitialized: bool}` |
| `POST /api/system/setup/authenticate` | Anonimowy | Waliduje dane admina KC, zwraca token |
| `POST /api/system/setup/apply` | Token setup (X-Setup-Token) | Wykonuje pełną konfigurację |

Wszystkie endpointy setup są blokowane po inicjalizacji (zwracają 403).

### Routing portalu

Portal sprawdza `/api/system/setup-status` przy każdym ładowaniu chronionej strony. Jeśli `isInitialized` jest `false`, wszystkie ścieżki przekierowują na `/admin-setup`.

## Rozwiązywanie problemów

:::danger[Tryb przejściowy a usuwanie wierszy]
Dopóki klucz jest w bazie, wiersz `encryption_key` to jedyna jego kopia. Jeśli usuniesz wiersze z `SystemConfigs` przed [przeniesieniem klucza](#aktualizacja-z-wersji-v007-lub-starszej), stracisz zapisane tokeny i certyfikaty KSeF. Po przeniesieniu klucza kreator musi działać z tym samym `ENCRYPTION_KEY`, inaczej danych logowania nie da się odszyfrować.
:::

| Problem | Rozwiązanie |
|---------|-------------|
| Wizard się nie pojawia | Tylko jeśli zapytanie z [kroku 1 aktualizacji](#aktualizacja-z-wersji-v007-lub-starszej) zwraca 0: sprawdź, czy tabela `SystemConfigs` jest pusta. Usuń wiersze i zrestartuj API. |
| Logowanie Keycloak nie działa | Sprawdź, czy Keycloak działa (`docker compose logs keycloak`). Dane logowania: `KEYCLOAK_ADMIN` / `KEYCLOAK_ADMIN_PASSWORD` z pliku `.env`. |
| Apply zwraca 500 | Sprawdź logi API (`docker compose logs api`). Częsta przyczyna: Keycloak nie jest jeszcze gotowy. |
| Test email SMTP nie działa | Zweryfikuj dane SMTP. Gmail wymaga Hasła aplikacji. |
| Pętla przekierowań po setup | Wyczyść cache/cookies przeglądarki. Portal cachuje status setup na 60 sekund. |
| Chcę uruchomić wizard ponownie | Tylko jeśli zapytanie z [kroku 1 aktualizacji](#aktualizacja-z-wersji-v007-lub-starszej) zwraca 0: usuń wszystkie wiersze z tabeli `SystemConfigs` i zrestartuj kontener API. |
| Wizard zgłasza brak prawidłowego klucza szyfrowania | Wygeneruj klucz, ustaw `ENCRYPTION_KEY`, zapisz kopię poza bazą i uruchom `docker compose up -d`. Potem kliknij **Dalej** i przejdź wizard jeszcze raz. Wprowadzone dane zostają zachowane. |
| `docker compose` zgłasza brak `ENCRYPTION_KEY`, `POSTGRES_USER` lub innej wymaganej zmiennej | Nowy `docker-compose.yml` wymaga klucza. Na istniejącej instalacji najpierw uruchom zapytanie o wiersz klucza w wersji `docker exec` z [aktualizacji](#aktualizacja-z-wersji-v007-lub-starszej). Wynik 1: wykonaj aktualizację, bo sam wpis klucza pomija zatrzymanie usług i kopię zapasową. Wynik 0: klucz jest już przeniesiony, więc przywróć poprzednią wartość `ENCRYPTION_KEY` i nie generuj nowej, bo nowy klucz nie odszyfruje zapisanych danych. Jeśli nie masz kopii, nadal trzymają ją kontenery: `docker inspect openksef-api \| grep '"ENCRYPTION_KEY='`. To polecenie wypisuje sekret w terminalu. Brak wartości: zobacz krok 1 aktualizacji. Nie uruchamiaj wcześniej `docker compose up -d`. Inne zmienne: przed `up -d` przywróć je ze starego `.env`. `docker inspect openksef-postgres \| grep POSTGRES_` i `docker inspect openksef-keycloak \| grep -E 'KEYCLOAK_ADMIN\|KC_DB_'` wypisują je, także sekrety. Tak samo postąp z wartościami opcjonalnymi, bo `up -d` usuwa tę kopię: `docker inspect openksef-api --format '{{range .Config.Env}}{{println .}}{{end}}' \| grep -E 'Auth__PublicAuthority\|KSeF__BaseUrl\|Auth__ServiceAccount__ClientSecret\|Firebase__CredentialsJson'`. To polecenie też wypisuje sekrety. W `.env` to `APP_EXTERNAL_BASE_URL` (`Auth__PublicAuthority` bez `/auth/realms/openksef`), `KSEF_BASE_URL`, `API_CLIENT_SECRET` i `FIREBASE_CREDENTIALS_JSON`. `docker ps` pokazuje własne porty hosta. W `.env` to `APP_HOST_PORT`, `API_HOST_PORT`, `KEYCLOAK_HOST_PORT`, `PORTAL_WEB_HOST_PORT` i `POSTGRES_HOST_PORT`. |
| Critical: `The configured encryption key does not decrypt` | Ustawiony klucz nie pasuje do danych w bazie. Przywróć klucz, którym je zaszyfrowano. |
| Critical: `The configured encryption key cannot be used` | Klucza nie ma już w bazie, a `ENCRYPTION_KEY` jest pusty lub nieprawidłowy. Logowanie i odczyt faktur działają. Dodawanie danych logowania, synchronizacja i wysyłka nie. Przywróć klucz. |
