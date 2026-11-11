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
- Wolny port 8080 albo inny ustawiony w `APP_HOST_PORT` w `.env`: `docker-compose.yml` publikuje tylko gateway

Tylko nowe instalacje. Na istniejącej instalacji nie uruchamiaj `docker compose up -d`: wykonaj [procedurę aktualizacji](#aktualizacja-z-wersji-v007-lub-starszej).

## Kroki wizarda

### Krok 1: Uwierzytelnienie administratora Keycloak

![Krok 1 - logowanie Keycloak](/img/screenshots/portal/admin-setup-step1.png)

Wprowadź dane logowania admina Keycloak (`KEYCLOAK_ADMIN` i `KEYCLOAK_ADMIN_PASSWORD` z pliku `.env`). Wizard uwierzytelnia się w realm `master` i zapisuje dane logowania w tymczasowym tokenie sesji (ważnym 10 minut), który jest używany do konfiguracji Keycloak w kolejnych krokach.

### Krok 2: Pierwsze konto i firma

![Krok 2 - pierwsze konto i firma](/img/screenshots/portal/admin-setup-step2.png)

| Pole | Opis | Domyślnie |
|------|------|-----------|
| Zewnętrzny URL | Publiczny adres systemu | Bieżący adres przeglądarki |
| Środowisko KSeF | Test lub Produkcja | Test (`https://api-test.ksef.mf.gov.pl/v2`) |
| Email admina | Email pierwszego użytkownika | *(wymagany)* |
| Hasło admina | Hasło pierwszego użytkownika | *(wymagane, min. 8 znaków)* |
| Imię / Nazwisko | Opcjonalne dane użytkownika | Admin |
| NIP | NIP pierwszej firmy | *(wymagany)* |
| Nazwa firmy | Opcjonalna nazwa firmy | *(brak)* |

### Krok 3: Autoryzacja i e-mail

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

**Klucz szyfrowania AES-256** nie jest częścią wizarda. Ustaw `ENCRYPTION_KEY` dla API i Workera przed uruchomieniem stacku i przechowuj kopię poza bazą danych. Od wersji 0.0.15 bez prawidłowego klucza wizard zatrzymuje się na kroku 1, po zalogowaniu do Keycloak, i nie zmienia niczego. Szczegóły w sekcji [Klucz szyfrowania](#klucz-szyfrowania).

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

Ten opis dotyczy wersji `v0.0.8` i nowszych.

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

Nowe obrazy dostajesz przy zwykłym `docker compose pull`. Do wersji v0.0.7 włącznie klucz leży w bazie obok zaszyfrowanych danych, więc każdy zrzut bazy pozwala je odszyfrować. Od wersji 0.0.15 API i Worker nigdy nie używają klucza z bazy. Odczytują wiersz tylko po to, żeby przenieść klucz, a to wymaga klucza w `ENCRYPTION_KEY`:

| Stan po aktualizacji | Efekt |
|---|---|
| Nowe obrazy, klucz w bazie, `ENCRYPTION_KEY` pusty | API i Worker odmawiają startu (kod wyjścia 1, [pętla restartów](#błędy-startu-i-pętle-restartów)). Nic się nie zmienia. Log Critical `no longer reads the key from the database` podaje rozwiązanie: wykonaj [procedurę aktualizacji](#aktualizacja-z-wersji-v007-lub-starszej) albo do tego czasu [wróć do v0.0.14](#wycofanie-aktualizacji) |
| Nowe obrazy, klucz w bazie, `ENCRYPTION_KEY` nieprawidłowy (np. zły format lub długość) | Tak samo: API i Worker odmawiają startu, nic się nie zmienia |
| Nowe obrazy, klucz w bazie, `ENCRYPTION_KEY` prawidłowy | Klucz jest przenoszony od razu przy pierwszym starcie, właśnie na tę wartość. Upewnij się, że masz ją zapisaną poza bazą, i wykonaj procedurę poniżej **przed** pobraniem obrazów |
| Nowy `docker-compose.yml` bez `ENCRYPTION_KEY` | `docker compose` odmawia działania. Komunikat kieruje istniejącą instalację do tej strony, a dla nowej podaje polecenie generujące klucz. `stop`, `exec`, `ps`, `logs` odmawiają, chyba że ustawiono nazwę projektu. `up`, `pull`, `run` odmawiają zawsze. Działające kontenery pozostają nietknięte |
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
   - Jedna ręczna synchronizacja kończy się sukcesem: **Firma** > **Token KSeF i pobieranie** > **Pobierz z KSeF**.

Zrzut z kroku 3 to teraz jedyna kopia starego klucza. Zachowaj go co najmniej do udanej synchronizacji. Zrzuty sprzed przeniesienia klucza pozwalają odszyfrować tokeny, dopóki ich nie usuniesz.

Log Critical `Moving the encryption key out of the database failed`, a w następnym wierszu `Credential <id> cannot be decrypted`, oznacza, że tych danych logowania nie da się odszyfrować i nic się nie zmieniło. Usuń je lub wprowadź ponownie w portalu i uruchom usługi ponownie. Jeśli log mówi `does not decrypt`, przywróć klucz i niczego nie usuwaj. Ten sam Critical bez wiersza z danymi logowania oznacza, że nic się nie zmieniło: uruchom usługi ponownie. W obu przypadkach API i Worker dalej działają na `ENCRYPTION_KEY`, a dane logowania zaszyfrowane starym kluczem pozostają bezużyteczne, dopóki kolejny start nie przeniesie klucza. Dla `cannot be used` zobacz [Rozwiązywanie problemów](#rozwiązywanie-problemów).

### Blokada przy przenoszeniu klucza

Log Critical `Another database client holds the encryption_key row` oznacza, że podczas przenoszenia klucza inny klient bazy trzymał blokadę na `SystemConfigs`. Nic się nie zmieniło. Dane logowania pozostają bezużyteczne, dopóki klucz nie zostanie przeniesiony. Znajdź tego klienta:

```bash
docker exec -i openksef-postgres sh -c 'psql -U "$POSTGRES_USER" -d openksef' <<'SQL'
SELECT a.pid, a.application_name, a.client_addr, a.state, a.xact_start, a.query
FROM pg_locks l JOIN pg_stat_activity a USING (pid)
WHERE l.relation = '"SystemConfigs"'::regclass AND l.granted AND a.pid <> pg_backend_pid();
SQL
```

Zamknij tego klienta, np. narzędzie bazodanowe z otwartą transakcją. `pg_terminate_backend(pid)` używaj tylko na własnej sesji. Potem uruchom ponownie API i Workera: `docker compose restart api worker`. Sprawdź logi jak w kroku 7.

### Wycofanie aktualizacji

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

## Środowisko KSeF: aktualizacja

`KSEF_BASE_URL` przyjmuje `test`, `demo` albo `production`. Jest czytany tylko do przejścia kreatora: potem wygrywa wiersz `ksef_environment` w tabeli `SystemConfigs`.

Stare adresy test i demo (`ksef-test.mf.gov.pl`, `ksef-demo.mf.gov.pl`, `api-test.ksef.mf.gov.pl`, `api-demo.ksef.mf.gov.pl`) oraz stare adresy produkcji (`ksef.podatki.gov.pl`, `api.ksef.mf.gov.pl`) nadal działają. Nic nie musisz robić.

Przy każdej innej wartości API lub Worker zatrzymuje się przy starcie z błędem `Unknown KSeF environment`, więc nic nie trafia do KSeF na zgadniętym środowisku. Dotyczy to też `https://ksef.mf.gov.pl/api`, który we wcześniejszych wersjach działał jako TEST.

Jeśli kreator nie był uruchamiany, popraw `KSEF_BASE_URL` w `.env` i uruchom `docker compose up -d`. W przeciwnym razie uruchom poniższe SQL ze środowiskiem, na którym działała instalacja: `production`, jeśli stara wartość zawiera `ksef.podatki.gov.pl` lub `api.ksef.mf.gov.pl`, w przeciwnym razie `demo`, jeśli zawiera `demo`, a w pozostałych przypadkach `test`. Wybór `production` wymaga produkcyjnego tokenu KSeF.

```bash
docker exec -i openksef-postgres sh -c 'psql -U "$POSTGRES_USER" -d openksef' <<'SQL'
INSERT INTO "SystemConfigs" ("Key", "Value", "UpdatedAt")
VALUES ('ksef_environment', 'test', now())
ON CONFLICT ("Key") DO UPDATE SET "Value" = EXCLUDED."Value", "UpdatedAt" = EXCLUDED."UpdatedAt";
SQL
docker compose restart api worker
```

Wiersz, który zepsuje się w trakcie pracy, nie zatrzymuje działających usług. Worker działa dalej, ale nic nie wysyła do KSeF: każdy cykl synchronizacji loguje błąd i pomija firmy, a pętla wysyłki loguje ten sam błąd najwyżej co 15 minut. API trzyma zapamiętaną wartość do zapisu ustawień. Obie usługi zatrzymają się z `Unknown KSeF environment` przy następnym restarcie. Popraw wiersz powyższym SQL.

API zatrzymuje się przy starcie także wtedy, gdy po 5 próbach nie może odczytać `SystemConfigs`, zamiast działać na `KSEF_BASE_URL`. Sprawdź PostgreSQL i uruchom API ponownie.

## Aktualizacja: porty i konsola Keycloak

Przeczytaj to przed pobraniem wydania, którego `docker-compose.yml` publikuje tylko gateway. Nic nie jest usuwane: wolumen bazy i wszystkie dane zostają. Zmienia się sposób, w jaki docierasz do usług spoza Dockera.

| Wcześniej | Teraz |
|---|---|
| Gateway na `APP_HOST_PORT` (8080) | Bez zmian |
| API na 8081, Keycloak na 8082, portal na 8083, PostgreSQL na 5432 (`API_HOST_PORT`, `KEYCLOAK_HOST_PORT`, `PORTAL_WEB_HOST_PORT`, `POSTGRES_HOST_PORT`) | Nie są publikowane. Zmienne są ignorowane |
| `/auth/admin` otwarty przez gateway | 403, chyba że `KEYCLOAK_ADMIN_ALLOW` zawiera adres klienta |
| Obrazy `:latest` | Obrazy `:${OPENKSEF_VERSION}`. `docker-compose.yml` z wydania domyślnie używa wersji tego wydania |
| Brak polityki restartu | `restart: unless-stopped` dla każdej usługi. Worker startuje, gdy API jest zdrowe |

Portal, API i logowanie działają dalej przez gateway, tak samo kreator konfiguracji: łączy się z Keycloak wewnątrz sieci Docker. Przed aktualizacją sprawdź, co korzystało z pozostałych portów: skrypt kopii zapasowej łączący się z `localhost:5432`, monitoring wywołujący `:8081/health`, zakładka do `:8082/auth/admin`.

**PostgreSQL.** Używaj `docker exec`, jak we wszystkich procedurach na tej stronie: `docker exec -it openksef-postgres sh -c 'psql -U "$POSTGRES_USER" -d openksef'`, a do kopii zapasowej `docker exec openksef-postgres sh -c 'pg_dump -U "$POSTGRES_USER" -d openksef' > openksef.sql`. Narzędzie, które potrzebuje portu TCP, dostanie go tylko na adresie loopback hosta (`127.0.0.1`), przez plik `docker-compose.override.yml` obok `docker-compose.yml` (`docker compose` czyta go sam):

```yaml
services:
  postgres:
    ports:
      - "127.0.0.1:5432:5432"
  keycloak:
    ports:
      - "127.0.0.1:8082:8080"
```

Potem uruchom `docker compose up -d`.

**Konsola admina Keycloak, tunel SSH (zalecane).** Z wpisem `keycloak` z powyższego pliku uruchom na swoim komputerze `ssh -L 8082:127.0.0.1:8082 user@twoj-serwer` i otwórz [http://localhost:8082/auth/admin](http://localhost:8082/auth/admin). Konsola nie jest dostępna z żadnej sieci, a gateway nadal zwraca 403.

**Konsola admina Keycloak, lista dozwolonych adresów.** Ustaw w `.env` `KEYCLOAK_ADMIN_ALLOW` na adresy, które mogą otworzyć `/auth/admin` przez gateway, po przecinku, IP lub CIDR, np. `KEYCLOAK_ADMIN_ALLOW=192.168.88.0/24,10.8.0.5`. Potem uruchom `docker compose up -d`. Puste lub nieustawione oznacza 403 dla wszystkich.

:::warning[Reverse proxy lub Cloudflare]
Gateway sprawdza adres połączenia, które do niego przychodzi. Za reverse proxy lub Cloudflare to adres proxy, a nie przeglądarki. Wpisanie go otwiera konsolę każdemu odwiedzającemu, więc w takiej instalacji użyj tunelu SSH. To samo dotyczy portu przekazywanego przez userland proxy Dockera: w Docker Desktop (Windows, macOS) dla każdego klienta, a w Linuksie dla połączeń na `localhost` i dla wszystkich klientów, gdy w `daemon.json` jest `"iptables": false`. Gateway widzi wtedy adres bramy sieci Docker, np. `172.18.0.1`, a wpisanie go otwiera konsolę każdemu, kto dotrze do portu. Adres widziany przez gateway pokaże `docker compose logs gateway`. Nieprawidłowy wpis gateway pomija, zapisuje w logu `KEYCLOAK_ADMIN_ALLOW entry '<wpis>' is not a valid nginx allow address, skipped` i zachowuje pozostałe wpisy.
:::

**Wersja obrazów.** `OPENKSEF_VERSION` w `.env` wybiera wersję `api`, `worker`, `portal-web` i `gateway`, np. `OPENKSEF_VERSION=v1.2.3`. Bez tej zmiennej używana jest wersja wydania, z którego pochodzi `docker-compose.yml`. Aktualizacja: zmień ją (albo pobierz nowy plik compose), potem `docker compose pull && docker compose up -d`. Powrót do poprzedniej wersji: ustaw poprzednią wersję i uruchom te same polecenia. Migracje bazy nie są cofane, więc najpierw przeczytaj informacje o wydaniu. `docker-compose.yml` z wersji v0.0.11 lub starszej używa `:latest`, czyli najnowszego wydania. Powrót do tego pliku przywraca stare porty, ale nie stare obrazy.

## Aktualizacja do v0.0.12

Z wersji v0.0.11, przed pobraniem obrazów:

1. **Zrób kopię zapasową bazy:** `docker exec openksef-postgres sh -c 'pg_dump -U "$POSTGRES_USER" -Fc openksef' > before-v0.0.12.dump`. Przy starcie API wykonuje cztery migracje. Jedna usuwa zduplikowane tokeny urządzeń i nie da się jej cofnąć.
2. **Rola `openksef-admin`.** Bez niej **Ustawienia** zwracają 403 dla wszystkich. Endpointy ustawień przyjmują tylko użytkowników z rolą realmu `openksef-admin`, sprawdzaną przed hasłem admina Keycloak. Nowe instalacje dostają ją z kreatora.
   1. Otwórz konsolę admina Keycloak (zobacz [Aktualizacja: porty i konsola Keycloak](#aktualizacja-porty-i-konsola-keycloak)), realm `openksef`.
   2. **Realm roles** > **Create role**, nazwa `openksef-admin`.
   3. **Users** > twój użytkownik admin > **Role mapping** > **Assign role** > `openksef-admin`.
   4. Wyloguj się z portalu i zaloguj ponownie, żeby token zawierał rolę.
3. **Za reverse proxy** ustaw `FORWARD_LIMIT` w tym samym wdrożeniu, zobacz [Adres klienta za proxy](#adres-klienta-za-proxy).
4. Pobierz `docker-compose.yml` z wydania v0.0.12 i zastąp nim stary plik (najpierw przeczytaj [Aktualizacja: porty i konsola Keycloak](#aktualizacja-porty-i-konsola-keycloak)). Plik z v0.0.11 nie przekazuje `FORWARD_LIMIT`, `TRUSTED_PROXY_NETWORKS` ani `EMAIL_*` i nie czyta `OPENKSEF_VERSION`. Potem `docker compose pull && docker compose up -d`.
5. **Flaga rejestracji.** Otwórz **Ustawienia** i zapisz je raz. To zapisuje flagę rejestracji w `SystemConfigs` (`registration_allowed`). Do tego czasu strona logowania pokazuje link rejestracji, a rejestracja bez sekretu konta serwisowego zwraca 503. Rejestrację włączasz i wyłączasz tylko w **Ustawieniach**: API nie widzi zmian zrobionych w konsoli Keycloak.

Endpointy ustawień przyjmują 10 zapytań na 15 minut z jednego adresu klienta. Powyżej limitu zwracają 429. Nieznana wartość `KSEF_BASE_URL` zatrzymuje API i Workera przy starcie, zobacz [Środowisko KSeF: aktualizacja](#środowisko-ksef-aktualizacja).

Po aktualizacji nieopłacone faktury zakupowe pokazują kod QR przelewu z kwotą `000000` i informacją, że faktura nie jest jeszcze odczytana, dopóki OpenKSeF nie pobierze ponownie ich XML (do 60 na firmę w cyklu synchronizacji).

**Powrót do v0.0.11.** Tylko przez wersję obrazów: ustaw `OPENKSEF_VERSION=v0.0.11` w `.env` (zostaw `docker-compose.yml` z v0.0.12) i uruchom `docker compose pull && docker compose up -d`. Nie uruchamiaj `Down` migracji. Na v0.0.11 ponowna rejestracja tego samego urządzenia przez innego użytkownika zwraca błąd 500. Jeśli dane są uszkodzone, zatrzymaj API i Workera i przywróć `before-v0.0.12.dump`: `docker exec -i openksef-postgres sh -c 'pg_restore -U "$POSTGRES_USER" -d openksef --clean --if-exists' < before-v0.0.12.dump`.

**Faktury wystawione: powrót do v0.0.8 lub starszej.** Synchronizacja faktur wystawionych działa od v0.0.9. Starszy obraz nie odróżnia kierunku i pokazałby faktury wystawione jako nieopłacone zakupowe. Zatrzymaj API i Workera, uruchom poniższe SQL, potem uruchom starszą wersję:

```bash
docker exec -i openksef-postgres sh -c 'psql -U "$POSTGRES_USER" -d openksef' <<'SQL'
BEGIN;
DELETE FROM "InvoiceHeaders" WHERE "Direction" = 'Issued';
UPDATE "SyncStates" SET "IssuedContinuationAt" = NULL;
COMMIT;
SQL
```

Skrypt usuwa tylko faktury wystawione i ich pozycje. Nie ma w nich danych użytkownika, a synchronizacja pobierze je ponownie po następnej aktualizacji.

## Reverse proxy i publiczny adres

Keycloak buduje wystawcę tokenu (`iss`) i każdy bezwzględny link (przekierowania logowania, weryfikacja e-maila, reset hasła) z tego, co wysyła mu gateway. Gateway bierze host i port z nagłówka `Host`. Schemat (`http` lub `https`) bierze z `APP_EXTERNAL_BASE_URL`, jeśli jest ustawiony w `.env`, w przeciwnym razie z `X-Forwarded-Proto`. Ignoruje `X-Forwarded-Host` i `X-Forwarded-Port` od klienta. `Host`, a gdy `APP_EXTERNAL_BASE_URL` nie jest ustawiony także `X-Forwarded-Proto`, musi przychodzić od proxy, które je nadpisuje. Przy dostępie bezpośrednim albo przez proxy, które przekazuje wartość klienta, żądanie nadal może zmienić host lub port we własnych linkach, a bez `APP_EXTERNAL_BASE_URL` także schemat. Wystawca musi być równy `APP_EXTERNAL_BASE_URL/auth/realms/openksef` (albo adresowi zapisanemu przez kreator), inaczej API odpowiada 401.

| Konfiguracja | Czego potrzebuje gateway | Wystawca |
|---|---|---|
| Bezpośrednio, `APP_HOST_PORT=18480` | Nic | `http://<host>:18480/auth/realms/openksef` |
| Nginx Proxy Manager, HTTPS na 443 | `APP_EXTERNAL_BASE_URL=https://<domena>`. NPM przekazuje dalej `X-Forwarded-Proto` od klienta, zobacz niżej | `https://<domena>/auth/realms/openksef` |
| ngrok, Cloudflare Tunnel, Caddy, Traefik | Nic: zachowują publiczny `Host` i wysyłają `X-Forwarded-Proto` | `https://<publiczny host>/auth/realms/openksef` |
| nginx z własnym `location` | `proxy_set_header Host $host:$server_port;` i `proxy_set_header X-Forwarded-Proto $scheme;` | publiczny host i port |
| Apache | `ProxyPreserveHost On`, `RequestHeader set Host "<domena>"` i `RequestHeader set X-Forwarded-Proto https` | publiczny host |
| Publiczny HTTPS na porcie innym niż 443 | Proxy musi wysłać ten port w `Host`, np. `Host: example.com:8443` (nginx `$host:$server_port`) | `https://example.com:8443/auth/realms/openksef` |

Proxy, które jako `Host` wysyła nazwę upstreamu (np. `gateway:8080`), a publiczną nazwę tylko w `X-Forwarded-Host`, już nie działa: ustaw `Host` jak wyżej. Proxy musi nadpisywać `X-Forwarded-Proto`. Nginx Proxy Manager przekazuje wartość klienta, więc bez `APP_EXTERNAL_BASE_URL` żądanie może dostać linki `http://`. Gdy `APP_EXTERNAL_BASE_URL` jest ustawiony, każdy dostęp przez gateway dostaje jego schemat, także tunel taki jak ngrok, więc zwykła wartość `http://` daje linki `http://` na tunelu HTTPS. Gateway czyta `APP_EXTERNAL_BASE_URL` tylko z `docker-compose.yml`, który przekazuje go usłudze `gateway`. Starszy plik pobiera nowy obraz bez tej zmiennej i schemat nadal pochodzi z `X-Forwarded-Proto`. Wynik sprawdzisz poleceniem `curl -s https://<domena>/auth/realms/openksef/.well-known/openid-configuration`: porównaj `issuer` z `APP_EXTERNAL_BASE_URL`.

### Adres klienta za proxy

API bierze adres klienta z `X-Forwarded-For` do limitów zapytań i logów. `FORWARD_LIMIT` to liczba proxy, które dopisują się do tego nagłówka, łącznie z gateway: sam gateway `1` (domyślnie), Nginx Proxy Manager przed nim `2`, Cloudflare i Nginx Proxy Manager `3`. Wartość wyższa niż rzeczywista liczba proxy pozwala klientowi wybrać własny adres. Niższa wrzuca wszystkich klientów za proxy do jednego limitu.

API przyjmuje nagłówek tylko od adresów z `TRUSTED_PROXY_NETWORKS` (CIDR po przecinku). Puste oznacza loopback i sieci prywatne (`127.0.0.0/8, ::1/128, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16`). Każde proxy musi być na liście i nic poza nimi: API czyta nagłówek od prawej i zatrzymuje się na pierwszym adresie spoza listy, ten adres jest klientem. Nigdy nie ustawiaj `0.0.0.0/0` ani `::/0`. Przy `FORWARD_LIMIT` powyżej 1 klient, który dotrze bezpośrednio do portu gateway, mógłby wtedy wysłać własny `X-Forwarded-For` i ominąć każdy limit na adres IP. Za Cloudflare wpisz [zakresy Cloudflare](https://www.cloudflare.com/ips/) i powyższe zakresy prywatne, np. `TRUSTED_PROXY_NETWORKS=127.0.0.0/8,::1/128,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,173.245.48.0/20,...`, i aktualizuj listę, gdy Cloudflare ją zmieni. Klient z zaufanej sieci prywatnej nadal może podrobić nagłówek, więc przypisz gateway do adresu, którego używa proxy (`APP_HOST_PORT=127.0.0.1:8080` albo adres LAN), i zablokuj port w firewallu dla wszystkich poza proxy.

Ustaw `FORWARD_LIMIT` w tym samym wdrożeniu co v0.0.12, nie później: limit działa przed logowaniem, więc przy złej wartości wszyscy klienci dzielą jeden limit, a 10 zapytań od kogokolwiek blokuje **Ustawienia** na 15 minut. `X-Forwarded-Host` nie jest używany. Liczbę proxy sprawdzisz poleceniem `docker compose logs --tail 50 gateway`: ostatnie pole każdej linii to `X-Forwarded-For`, który dotarł do gateway, a liczba proxy to liczba jego wpisów plus jeden.

## Błędy startu i pętle restartów

Każda usługa ma `restart: unless-stopped`. Gdy API lub Worker kończy pracę przy starcie, Docker uruchamia go ponownie po krótkiej, rosnącej przerwie, bez końca. Widzisz pętlę, a nie zatrzymany kontener. Przyczyny zatrzymania przy starcie:

- nieprawidłowy wiersz `ksef_environment` lub `KSEF_BASE_URL` (`Unknown KSeF environment`), zobacz [Środowisko KSeF: aktualizacja](#środowisko-ksef-aktualizacja)
- `KSeF:ForbidProduction` ustawione w instalacji, której środowisko to produkcja
- `SystemConfigs` nieczytelne po 5 próbach (PostgreSQL nie działa lub jest uszkodzony)
- od wersji 0.0.15: klucz nadal w bazie, a `ENCRYPTION_KEY` pusty lub nieprawidłowy (`no longer reads the key from the database`), zobacz [Co się stanie, jeśli tylko pobierzesz nowe obrazy](#co-się-stanie-jeśli-tylko-pobierzesz-nowe-obrazy)

API i Worker zapisują w logu jedną linię `FTL` z przyczyną albo jedną linię `CRT` przy odmowie z powodu klucza. Odmowa z powodu środowiska KSeF i klucza kończy proces kodem 1. Jak zobaczyć pętlę i przyczynę:

```bash
docker compose ps                     # STATUS "Restarting (1) ..." przy usłudze w pętli
docker inspect -f '{{.RestartCount}} {{.State.ExitCode}}' openksef-api
docker compose logs --tail 50 api     # przyczyna; dla Workera użyj worker
```

`docker compose up -d` czeka na test zdrowia API, zanim uruchomi Workera. Jeśli API jest w pętli, `up -d` kończy się komunikatem `dependency failed to start: container openksef-api is unhealthy`, a Worker nie startuje. To oczekiwane.

Usuń przyczynę. Po poprawieniu wiersza w bazie działający kontener nie wymaga nic więcej: następny automatyczny restart uruchomi go normalnie. Potem uruchom raz `docker compose up -d`, żeby wystartował także Worker, którego nieudane `up -d` nie uruchomiło. Poprawiona wartość w `.env` wymaga `docker compose up -d`, bo restart zachowuje stare zmienne. Pętlę zatrzymasz na czas naprawy poleceniem `docker compose stop api worker`.

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

:::danger[Klucz w bazie a usuwanie wierszy]
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
| Wizard zgłasza brak prawidłowego klucza szyfrowania | Od wersji 0.0.15 wizard zatrzymuje się na kroku 1, po zalogowaniu do Keycloak. Wygeneruj klucz (`openssl rand -base64 32`), ustaw `ENCRYPTION_KEY` usług API i Worker, zapisz kopię poza bazą i uruchom `docker compose up -d`. Następnie zaloguj się ponownie w kroku 1. |
| `docker compose` zgłasza brak `ENCRYPTION_KEY`, `POSTGRES_USER` lub innej wymaganej zmiennej | Nowy `docker-compose.yml` wymaga klucza. Na istniejącej instalacji najpierw uruchom zapytanie o wiersz klucza w wersji `docker exec` z [aktualizacji](#aktualizacja-z-wersji-v007-lub-starszej). Wynik 1: wykonaj aktualizację, bo sam wpis klucza pomija zatrzymanie usług i kopię zapasową. Wynik 0: klucz jest już przeniesiony, więc przywróć poprzednią wartość `ENCRYPTION_KEY` i nie generuj nowej, bo nowy klucz nie odszyfruje zapisanych danych. Jeśli nie masz kopii, nadal trzymają ją kontenery: `docker inspect openksef-api \| grep '"ENCRYPTION_KEY='`. To polecenie wypisuje sekret w terminalu. Brak wartości: zobacz krok 1 aktualizacji. Nie uruchamiaj wcześniej `docker compose up -d`. Inne zmienne: przed `up -d` przywróć je ze starego `.env`. `docker inspect openksef-postgres \| grep POSTGRES_` i `docker inspect openksef-keycloak \| grep -E 'KEYCLOAK_ADMIN\|KC_DB_'` wypisują je, także sekrety. Tak samo postąp z wartościami opcjonalnymi, bo `up -d` usuwa tę kopię: `docker inspect openksef-api --format '{{range .Config.Env}}{{println .}}{{end}}' \| grep -E 'Auth__PublicAuthority\|KSeF__BaseUrl\|Auth__ServiceAccount__ClientSecret\|Firebase__CredentialsJson'`. To polecenie też wypisuje sekrety. W `.env` to `APP_EXTERNAL_BASE_URL` (`Auth__PublicAuthority` bez `/auth/realms/openksef`), `KSEF_BASE_URL`, `API_CLIENT_SECRET` i `FIREBASE_CREDENTIALS_JSON`. `docker ps` pokazuje własne porty hosta. Czytany jest już tylko `APP_HOST_PORT`, pozostałe opisuje [Aktualizacja: porty i konsola Keycloak](#aktualizacja-porty-i-konsola-keycloak). |
| Kontener ma stan `Restarting` | Zobacz [Błędy startu i pętle restartów](#błędy-startu-i-pętle-restartów). |
| Critical: `The configured encryption key does not decrypt` | Ustawiony klucz nie pasuje do danych w bazie. Przywróć klucz, którym je zaszyfrowano. |
| Critical: `The configured encryption key cannot be used` | Klucza nie ma już w bazie, a `ENCRYPTION_KEY` jest pusty lub nieprawidłowy. Logowanie i odczyt faktur działają. Dodawanie danych logowania, synchronizacja i wysyłka nie. Przywróć klucz. |
| Portal lub aplikacja: `Serwer nie ma prawidłowego klucza szyfrowania` | API nie ma użytecznego `ENCRYPTION_KEY`. Przywróć klucz, którym zaszyfrowano dane logowania, i uruchom ponownie API i Workera. |
| Od wersji 0.0.15 API i Worker kończą pracę przy starcie z Critical: `This version no longer reads the key from the database` | Klucz jest nadal w bazie, a `ENCRYPTION_KEY` jest pusty lub nieprawidłowy. Nic się nie zmieniło. Wykonaj [procedurę aktualizacji](#aktualizacja-z-wersji-v007-lub-starszej) albo do tego czasu [wróć do v0.0.14](#wycofanie-aktualizacji). |
