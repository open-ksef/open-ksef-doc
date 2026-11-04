import type {ReactNode} from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import ThemedImage from '@theme/ThemedImage';

import styles from './index.module.css';

const TITLE = 'OpenKSeF: faktury z KSeF na Twoim serwerze';
const DESCRIPTION =
  'OpenKSeF pobiera faktury otrzymane z KSeF, układa nieopłacone od najbliższego terminu, daje kod QR do przelewu i wystawia faktury VAT z portalu. Uruchamiasz go na własnym serwerze. Elastic License 2.0.';
const GITHUB = 'https://github.com/open-ksef';
const SHOTS = '/img/screenshots/home/';

const ICONS = {
  inbox: (
    <>
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.5 5 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-7z" />
    </>
  ),
  qr: (
    <>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <path d="M14 14h3v3h-3zM21 14v7h-4" />
    </>
  ),
  send: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M12 18v-6M9 15l3-3 3 3" />
    </>
  ),
  bell: (
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a2 2 0 0 0 3.4 0" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  minus: <path d="M5 12h14" />,
};

function Icon({name, size}: {name: keyof typeof ICONS; size: number}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

function Shot({name, alt, width = 2560, height = 1600, lazy = true, className}: {
  name: string;
  alt: string;
  width?: number;
  height?: number;
  lazy?: boolean;
  className?: string;
}) {
  return (
    <ThemedImage
      className={className}
      alt={alt}
      width={width}
      height={height}
      loading={lazy ? 'lazy' : undefined}
      sources={{
        light: useBaseUrl(`${SHOTS}${name}-light.png`),
        dark: useBaseUrl(`${SHOTS}${name}-dark.png`),
      }}
    />
  );
}

function Yes({children}: {children: ReactNode}) {
  return (
    <li>
      <Icon name="check" size={20} />
      <span>{children}</span>
    </li>
  );
}

function No({children}: {children: ReactNode}) {
  return (
    <li>
      <Icon name="minus" size={20} />
      <span>{children}</span>
    </li>
  );
}

function Fact({term, children}: {term: string; children: ReactNode}) {
  return (
    <div>
      <dt>{term}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout description={DESCRIPTION}>
      <Head>
        <title>{TITLE}</title>
        <meta property="og:title" content={TITLE} />
      </Head>
      <main className={styles.page}>
        <section className={`${styles.section} ${styles.hero}`}>
          <div>
            <span className={styles.beta}>Beta</span>
            <h1>Faktury z KSeF na Twoim serwerze</h1>
            <p className={styles.lead}>
              OpenKSeF pobiera faktury otrzymane z KSeF, układa nieopłacone od najbliższego terminu, daje kod QR do przelewu i wystawia faktury VAT z portalu. Bez opłat za uruchomienie u siebie.
            </p>
            <div className={styles.cta}>
              <Link className={`${styles.btn} ${styles.primary}`} to="/docs/instalacja/szybki-start">Zainstaluj</Link>
              <Link className={styles.btn} to="#zakres">Co działa, a czego nie ma</Link>
            </div>
            <p className={styles.note}>
              Do instalacji potrzebny jest Docker i ktoś, kto go obsłuży. Nie prowadzimy wersji hostowanej dla firm.
            </p>
          </div>
          <figure className={styles.frame}>
            <Shot
              className={styles.wide}
              name="start"
              lazy={false}
              alt="Strona Start portalu, Co dziś do zrobienia: nieopłacone od najbliższego terminu, ostatnio otrzymane i wystawione, Twoje firmy. Dane fikcyjne."
            />
            <Shot
              className={styles.phone}
              name="start-phone"
              width={780}
              height={1560}
              alt="Strona Start portalu na telefonie, Co dziś do zrobienia: nieopłacone od najbliższego terminu. Dane fikcyjne."
            />
            <figcaption>Dane fikcyjne.</figcaption>
          </figure>
        </section>

        <section className={styles.section}>
          <h2>Co robi OpenKSeF</h2>
          <div className={styles.grid}>
            <div className={styles.card}>
              <Icon name="inbox" size={24} />
              <h3>Pobiera faktury otrzymane</h3>
              <p>W tle, domyślnie co 4 godziny, albo na żądanie. Lista i szczegóły z pozycjami, także dla kilku firm na jednym serwerze.</p>
            </div>
            <div className={styles.card}>
              <Icon name="qr" size={24} />
              <h3>Pomaga zapłacić</h3>
              <p>Dane do przelewu i kod QR w portalu, gdy faktura w PLN ma numer rachunku. Skanujesz w aplikacji banku, a fakturę oznaczasz jako opłaconą.</p>
            </div>
            <div className={styles.card}>
              <Icon name="send" size={24} />
              <h3>Wystawia faktury VAT</h3>
              <p>W portalu, z wysyłką do KSeF. Widzisz status, a po przyjęciu pobierasz XML, UPO i PDF z kodem KOD I.</p>
            </div>
            <div className={styles.card}>
              <Icon name="bell" size={24} />
              <h3>Powiadamia o nowej fakturze</h3>
              <p>Push na telefon po pobraniu nowej faktury. Aplikacja na Androida: kończymy poprawki, zanim zalecimy instalację. Google Play i iPhone jeszcze nie.</p>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.alt}`}>
          <h2>Tak wygląda portal</h2>
          <div className={styles.frames}>
            <figure className={styles.frame}>
              <Shot name="list" alt="Lista Otrzymane faktury z filtrem Wszystkie. Dane fikcyjne." />
              <figcaption>Otrzymane: wszystkie faktury od najnowszej, a jednym kliknięciem tylko nieopłacone.</figcaption>
            </figure>
            <figure className={styles.frame}>
              <Shot name="pay" alt="Faktura z kartą Zapłać tę fakturę: kod QR, kwota, rachunek i przycisk Oznacz jako opłaconą. Dane fikcyjne." />
              <figcaption>Faktura: kod QR i dane do przelewu obok pozycji.</figcaption>
            </figure>
          </div>
        </section>

        <section className={styles.section} id="zakres">
          <h2>Co działa, a czego nie ma</h2>
          <p className={styles.secLead}>
            Bez niespodzianek po instalacji. Pełną listę ograniczeń ma strona <Link to="/docs/wystawianie-faktur#ograniczenia">Wystawianie faktur</Link>.
          </p>
          <div className={styles.lists}>
            <div>
              <h3>Działa w wydanej wersji</h3>
              <ul className={styles.yes}>
                <Yes>Faktury otrzymane: pobieranie, lista, szczegóły, termin płatności, status opłacenia</Yes>
                <Yes>Dane do przelewu i kod QR w portalu</Yes>
                <Yes>Faktury VAT w PLN ze stawkami 23, 8, 5, 0 KR i zw <small>Także dla osoby prywatnej, z PDF i kodem KOD I.</small></Yes>
                <Yes>Środowiska KSeF: test i produkcja <small>Na produkcji przyjęta faktura jest dokumentem prawnym.</small></Yes>
                <Yes>Powiadomienia push na Androidzie <small>Aplikacja: kończymy poprawki, zanim zalecimy instalację.</small></Yes>
              </ul>
            </div>
            <div>
              <h3>Jeszcze nie ma</h3>
              <ul className={styles.no}>
                <No>Faktura korygująca, zaliczkowa i rozliczeniowa</No>
                <No>Wystawianie w walutach innych niż PLN</No>
                <No>Aplikacja w Google Play i na iPhone'a</No>
                <No>E-mail o nowej fakturze przy pobieraniu w tle</No>
                <No>Wersja hostowana dla firm</No>
              </ul>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.alt}`}>
          <h2>Jak zacząć</h2>
          <p className={styles.secLead}>
            Potrzebujesz komputera lub serwera z Dockerem (minimum 4 GB RAM), a do dostępu spoza sieci domowej także własnego HTTPS.
          </p>
          <ol className={styles.steps}>
            <li>
              <h3>Uruchom</h3>
              <p>Zapisz <code>docker-compose.yml</code> i <code>.env</code> z <Link to="/docs/instalacja/szybki-start">Szybkiego startu</Link>, potem <code>docker compose up -d</code>.</p>
            </li>
            <li>
              <h3>Przejdź przez kreator</h3>
              <p>Otwórz <code>http://localhost:8080</code>. Kreator założy pierwsze konto i pierwszą firmę oraz ustawi środowisko KSeF.</p>
            </li>
            <li>
              <h3>Dodaj token KSeF</h3>
              <p>Token wygenerujesz w Aplikacji Podatnika KSeF. <Link to="/docs/wystawianie-faktur#token-ksef">Token ma termin ważności w przepisach</Link>.</p>
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2>Gdzie są Twoje dane</h2>
          <dl className={styles.facts}>
            <Fact term="Faktury i dane firm">W bazie na Twoim serwerze. Autorzy OpenKSeF nie mają do nich dostępu.</Fact>
            <Fact term="Token KSeF">Zaszyfrowany w bazie. Klucz szyfrowania trzymasz poza bazą.</Fact>
            <Fact term="Powiadomienia push">Domyślnie przez relay prowadzony przez autorów oraz Firebase lub APNs. Treść to m.in. nazwa sprzedawcy i kwota. Możesz wysyłać je bezpośrednio.</Fact>
            <Fact term="Odpowiedzialność">HTTPS, kopie zapasowe i aktualizacje są po Twojej stronie. <Link to="/docs/o-projekcie">Zalecenia bezpieczeństwa</Link>.</Fact>
          </dl>
        </section>

        <section className={`${styles.section} ${styles.alt}`}>
          <h2>Kod, licencja i status</h2>
          <dl className={styles.facts}>
            <Fact term="Kod">Kod źródłowy jest publicznie dostępny na <Link href={GITHUB}>GitHubie</Link>.</Fact>
            <Fact term="Licencja">Elastic License 2.0. Możesz używać i modyfikować u siebie. Oferowanie jako usługi dla innych wymaga zgody autora. <Link to="/docs/licencja">Szczegóły</Link>.</Fact>
            <Fact term="Status">Beta. Między wersjami mogą zmieniać się API, dane i konfiguracja.</Fact>
            <Fact term="Ministerstwo Finansów">OpenKSeF to niezależny projekt, niepowiązany z Ministerstwem Finansów. Z KSeF łączy się przez jego publiczne API.</Fact>
          </dl>
        </section>
      </main>
    </Layout>
  );
}
