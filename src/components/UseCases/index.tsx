import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type UseCaseItem = {
  icon: string;
  title: string;
  problem: string;
  solution: string;
  bullets: string[];
  reversed?: boolean;
};

const useCases: UseCaseItem[] = [
  {
    icon: '🔔',
    title: 'Powiadomienia o nowych fakturach',
    problem:
      'Faktura od dostawcy trafia do KSeF i możesz nie dostać o niej osobnej wiadomości. Bez sprawdzania KSeF o nowym zobowiązaniu możesz dowiedzieć się dopiero z wezwania do zapłaty.',
    solution:
      'OpenKSeF automatycznie pobiera faktury z KSeF, domyślnie co 4 godziny, i wysyła powiadomienie push o nowej fakturze na telefon z aplikacją OpenKSeF.',
    bullets: [
      'Powiadomienia push w aplikacji na Androida',
      'Aplikacja na Androida: kończymy poprawki, zanim zalecimy instalację. Google Play i iPhone jeszcze nie',
      'Synchronizacja w tle, bez ręcznego sprawdzania',
    ],
  },
  {
    icon: '📲',
    title: 'Szybki przegląd i płatności',
    problem:
      'Przeglądanie faktur w portalu KSeF jest uciążliwe, a ręczne przepisywanie danych do przelewu zabiera czas i generuje błędy.',
    solution:
      'W OpenKSeF przeglądasz faktury zakupowe w jednym miejscu. Chcesz zapłacić? Zeskanuj kod QR z portalu aplikacją mobilną swojego banku. Kod zawiera kwotę, tytuł i numer konta, jeśli jest na fakturze.',
    bullets: [
      'Lista faktur z filtrami i wyszukiwaniem',
      'Kod QR do przelewu w aplikacji banku',
      'Działa w portalu webowym',
    ],
    reversed: true,
  },
];

function UseCase({icon, title, problem, solution, bullets, reversed}: UseCaseItem) {
  return (
    <div className={`${styles.useCase} ${reversed ? styles.reversed : ''}`}>
      <div className={styles.useCaseIcon}>{icon}</div>
      <div className={styles.useCaseContent}>
        <Heading as="h2" className={styles.useCaseTitle}>{title}</Heading>
        <p className={styles.useCaseProblem}>{problem}</p>
        <p className={styles.useCaseSolution}>{solution}</p>
        <ul className={styles.useCaseBullets}>
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function UseCases(): ReactNode {
  return (
    <section className={styles.section}>
      <div className="container">
        <Heading as="h2" className={styles.sectionHeading}>
          Po co Ci OpenKSeF?
        </Heading>
        <p className={styles.sectionSubtitle}>
          Kod źródłowy jest publicznie dostępny (Elastic License 2.0). Bez opłat za uruchomienie u siebie. Nie prowadzimy wersji hostowanej dla firm.
        </p>

        {useCases.map((uc, idx) => (
          <UseCase key={idx} {...uc} />
        ))}

        <div className={styles.planned}>
          <span className={styles.plannedBadge}>w portalu</span>
          <Heading as="h3" className={styles.plannedTitle}>
            ✏️ Wystawianie faktur
          </Heading>
          <p className={styles.plannedDescription}>
            OpenKSeF wystawia faktury VAT w portalu i wysyła je do KSeF. Pobierzesz XML, UPO i PDF z kodem KOD I.
            Korekt, faktur zaliczkowych i walut innych niż PLN jeszcze nie obsługuje.{' '}
            <Link to="/docs/wystawianie-faktur">Zakres i ograniczenia</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
