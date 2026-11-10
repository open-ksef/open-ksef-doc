---
sidebar_position: 2
title: Szybki start
---

# Szybki start

Potrzebujesz Dockera, pliku `.env` i przeglądarki. Pierwsze pobranie obrazów może potrwać kilka minut, potem przechodzisz przez kreator konfiguracji.

:::danger[Istniejąca instalacja i klucz szyfrowania]
Masz już działającą instalację? **Nie podmieniaj `docker-compose.yml` i nie dopisuj klucza od razu.** Pierwszy start z kluczem przenosi go z bazy i szyfruje dane ponownie, więc najpierw zatrzymaj API i Workera i zrób kopię zapasową. Dotyczy to także klucza, który już masz w `.env`. Wykonaj [procedurę aktualizacji](../admin-setup#aktualizacja-z-wersji-v007-lub-starszej). Nowy plik `docker-compose.yml` bez `ENCRYPTION_KEY` odmówi działania, a działające kontenery pozostaną nietknięte.
:::

## Krok 1: Pobierz `docker-compose.yml`

Utwórz nowy katalog i pobierz do niego plik `docker-compose.yml` z [najnowszego wydania](https://github.com/open-ksef/open-ksef/releases/latest) (plik jest załączony do wydania):

```bash
curl -LO https://github.com/open-ksef/open-ksef/releases/latest/download/docker-compose.yml
```

Bez `curl` otwórz w przeglądarce [ten link](https://github.com/open-ksef/open-ksef/releases/latest/download/docker-compose.yml) i zapisz plik pod nazwą `docker-compose.yml`. Plik z wydania używa obrazów tej samej wersji i publikuje na zewnątrz tylko jeden port: gateway (8080).

Wygeneruj klucz szyfrowania tokenów KSeF. Wystarczy Docker, a jeśli masz `openssl`, możesz użyć `openssl rand -base64 32`:

```bash
docker run --rm postgres:16-alpine sh -c "head -c 32 /dev/urandom | base64"
```

**Zapisz wynik w menedżerze haseł.** Bez tego klucza zapisanych tokenów KSeF nie da się odczytać, a nie ma go ani w bazie, ani w jej kopiach zapasowych.

W tym samym katalogu utwórz plik `.env` z danymi logowania (nazwy użytkowników i hasła) do PostgreSQL i konsoli admina Keycloak oraz z wygenerowanym kluczem. Bez niego `docker compose up` zakończy się błędem (np. `POSTGRES_USER is required`):

```bash
POSTGRES_USER=openksef
POSTGRES_PASSWORD=zmien_mnie
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=zmien_mnie_tez
ENCRYPTION_KEY=wklej_tu_wygenerowany_klucz
```

:::warning[Dane logowania]
Użyj własnych, silnych haseł. `docker-compose.yml` nie ma wartości domyślnych dla tych pięciu zmiennych -- to celowe zabezpieczenie.
:::

:::caution[Aktualizacja istniejącej instalacji]
Najpierw wykonaj [procedurę aktualizacji klucza](../admin-setup#aktualizacja-z-wersji-v007-lub-starszej). Jeśli nie masz `.env` ze starszego pliku, przed jej krokiem 6 wpisz do niego stare wartości z punktu 1 poniżej.

Jeśli uruchamiałeś wcześniej starszą wersję tego pliku (bez `.env`), wolumen `postgres_data` zawiera już użytkownika `openksef` z hasłem `openksef_dev_password`, a Keycloak konto admina `admin` / `admin`. PostgreSQL i Keycloak czytają te zmienne tylko przy pierwszym starcie, więc nowe hasła w `.env` niczego nie zmienią, a API nie połączy się z bazą.

1. Wpisz do `.env` stare wartości: `POSTGRES_USER=openksef`, `POSTGRES_PASSWORD=openksef_dev_password`, `KEYCLOAK_ADMIN=admin`, `KEYCLOAK_ADMIN_PASSWORD=admin` i uruchom `docker compose up -d`.
2. Zmień hasło bazy: `docker compose exec postgres psql -U openksef -c "ALTER USER openksef WITH PASSWORD 'nowe_haslo';"`, wpisz je do `POSTGRES_PASSWORD` w `.env` i ponownie uruchom `docker compose up -d`.
3. Zmień hasło admina Keycloak w konsoli (realm `master` > **Users** > `admin` > **Credentials** > **Reset password**) i wpisz je do `KEYCLOAK_ADMIN_PASSWORD` w `.env`. Gateway blokuje konsolę (`/auth/admin` zwraca 403). Jak ją otworzyć: [Aktualizacja: porty i konsola Keycloak](../admin-setup#aktualizacja-porty-i-konsola-keycloak).
:::

## Krok 2: Uruchom

Tylko nowe instalacje. Na istniejącej instalacji nie uruchamiaj tego kroku: wykonaj [procedurę aktualizacji](../admin-setup#aktualizacja-z-wersji-v007-lub-starszej).

```bash
docker compose up -d
```

Docker pobierze obrazy z GitHub Container Registry i uruchomi 6 kontenerów:

| Kontener | Opis |
|----------|------|
| **postgres** | Baza danych PostgreSQL 16 |
| **keycloak** | Uwierzytelnianie OIDC (realm tworzony przez kreator konfiguracji) |
| **api** | Backend .NET 10 |
| **worker** | Synchronizacja faktur w tle |
| **portal-web** | Interfejs React |
| **gateway** | Nginx reverse proxy (konfiguracja wbudowana w obraz) |

:::info[Pierwsze uruchomienie]
Pierwsze uruchomienie może potrwać kilka minut, bo Docker pobiera obrazy. Na dysku zajmują około 2,5 GB. Kolejne starty są szybsze.
:::

## Krok 3: Skonfiguruj

:::tip[Zaczekaj na Keycloak]
Po `docker compose up -d` odczekaj 30-60 sekund, aż Keycloak się uruchomi (`docker compose logs -f keycloak`, szukaj linii `Listening on`). Wcześniej pierwszy krok kreatora zgłasza błąd danych logowania, nawet jeśli są poprawne.
:::

Otwórz **http://localhost:8080** w przeglądarce.

System wykryje, że nie jest jeszcze skonfigurowany i automatycznie przekieruje Cię do **kreatora konfiguracji** (`/admin-setup`). Kreator przeprowadzi Cię przez:

1. Logowanie danymi admina Keycloak (`KEYCLOAK_ADMIN` / `KEYCLOAK_ADMIN_PASSWORD` z pliku `.env`)
2. **Pierwsze konto i firma**: zewnętrzny URL, środowisko KSeF, e-mail i hasło pierwszego użytkownika oraz NIP firmy
3. Politykę logowania i opcjonalnie SMTP
4. Automatyczne pobranie secretu API (klucz szyfrowania ustawiasz w `.env`, nie w kreatorze)
5. Opcjonalnie: Google OAuth, powiadomienia push
6. Kliknij "Zastosuj" -- gotowe!

Szczegółowy opis każdego kroku znajdziesz w [Kreatorze konfiguracji](../admin-setup).

:::info[Token KSeF]
Po konfiguracji dodaj do firmy token KSeF. Token musi mieć uprawnienia do **odczytu faktur** i **wystawiania faktur** (zapis). Sam odczyt nie wystarczy do [wystawiania faktur](../wystawianie-faktur#token-ksef).
:::

:::info[Klucz szyfrowania]
Klucz czytany jest ze zmiennej `ENCRYPTION_KEY` usług API i Worker. Kreator go nie generuje ani nie zapisuje, a bez prawidłowego klucza nie zastosuje konfiguracji. Po przeniesieniu klucza nie ma go w kopii zapasowej wolumenu `postgres_data`, więc do odtworzenia danych potrzebujesz i kopii, i klucza. Kopię nadal chroń jak hasło: zawiera inne sekrety z kreatora. Aktualizacja i rotacja klucza: [Klucz szyfrowania](../admin-setup#klucz-szyfrowania).
:::

## Adresy usług

| Usługa | URL |
|--------|-----|
| Portal | http://localhost:8080 |
| API | http://localhost:8080/api/ |
| Keycloak (logowanie) | http://localhost:8080/auth/ |
| Keycloak (konsola admina) | http://localhost:8080/auth/admin zwraca 403, zobacz [Aktualizacja: porty i konsola Keycloak](../admin-setup#aktualizacja-porty-i-konsola-keycloak) |

Wszystko idzie przez gateway na jednym porcie. API, Keycloak, portal i PostgreSQL nie mają własnych portów na hoście. Stan kontenerów, także test zdrowia API, pokazuje `docker compose ps`.

## Zatrzymywanie

```bash
docker compose down
```

Dane w PostgreSQL są zachowywane w wolumenie Docker. Aby usunąć również dane:

```bash
docker compose down -v
```

## Konfiguracja zaawansowana

Plik `.env` z kroku 1 wymaga danych logowania i klucza szyfrowania. Pozostałe zmienne mają wartości domyślne, a kreator konfiguracji automatycznie uzupełnia pozostałe sekrety.

Jeśli chcesz zmienić inne ustawienia **przed** uruchomieniem (np. porty, URL), dopisz je do tego samego pliku `.env`, pod danymi logowania z kroku 1:

```bash
# Publiczny URL (ustaw jeśli dostęp spoza localhost)
# APP_EXTERNAL_BASE_URL=http://192.168.1.50:8080

# Port gateway na hoście (opcjonalny, domyślnie 8080)
# APP_HOST_PORT=8080

# Adresy, z których gateway otwiera konsolę Keycloak /auth/admin (IP lub CIDR, po przecinku).
# Puste: 403 dla wszystkich
# KEYCLOAK_ADMIN_ALLOW=192.168.88.0/24

# Wersja obrazów, np. v1.2.3. Puste: wersja wydania, z którego pochodzi docker-compose.yml
# OPENKSEF_VERSION=

# Środowisko KSeF: test (domyślnie), demo albo production
# KSEF_BASE_URL=test

# Firebase push notifications (opcjonalne)
# FIREBASE_CREDENTIALS_JSON={"type":"service_account",...}
```

:::info[Priorytet konfiguracji]
Kreator konfiguracji (baza danych) > plik `.env` > wartości domyślne w `docker-compose.yml`

Dotyczy ustawień zapisywanych przez kreator (m.in. secret API, publiczny URL, środowisko KSeF). Po przejściu kreatora jego wartości mają pierwszeństwo, a `.env` działa tylko dla tych, których kreator nie ustawił. Dane logowania do PostgreSQL i Keycloak zawsze pochodzą z `.env`, a klucz szyfrowania z `.env` po jego przeniesieniu.
:::

Pełny opis wszystkich zmiennych znajdziesz w [Konfiguracja](konfiguracja).

## Następne kroki

- [Konfiguracja](konfiguracja) -- pełna lista zmiennych środowiskowych
- [Kreator konfiguracji](../admin-setup) -- szczegóły każdego kroku wizarda
- [Powiadomienia push](../powiadomienia-push) -- jak skonfigurować powiadomienia
