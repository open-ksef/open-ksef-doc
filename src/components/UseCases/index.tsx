import type {ReactNode} from 'react';
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
    title: 'Nigdy więcej zaskoczeń',
    problem:
      'Od kiedy działa KSeF, kontrahenci przestają wysyłać powiadomienia e-mail o wystawionych fakturach. O nowym zobowiązaniu dowiadujesz się dopiero z wezwania do zapłaty albo wpisu w ewidencji.',
    solution:
      'OpenKSeF automatycznie synchronizuje faktury z KSeF i natychmiast powiadamia Cię o każdej nowej fakturze — push na telefon, e-mail lub oba naraz.',
    bullets: [
      'Powiadomienia push na telefon (Android / iOS)',
      'Fallback e-mail, gdy telefon jest offline',
      'Synchronizacja w tle — bez ręcznego sprawdzania',
    ],
  },
  {
    icon: '📲',
    title: 'Szybki przegląd i płatności',
    problem:
      'Przeglądanie faktur w portalu KSeF jest uciążliwe, a ręczne przepisywanie danych do przelewu zabiera czas i generuje błędy.',
    solution:
      'W OpenKSeF przeglądasz faktury zakupowe w jednym miejscu. Chcesz zapłacić? Zeskanuj QR code wygenerowany z danych faktury (kwota, konto, tytuł) aplikacją mobilną swojego banku.',
    bullets: [
      'Lista faktur z filtrami i wyszukiwaniem',
      'QR code do natychmiastowego przelewu w banku',
      'Aplikacja mobilna i portal webowy',
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
          Dwa realne problemy, jedno rozwiązanie — darmowe i open source.
        </p>

        {useCases.map((uc, idx) => (
          <UseCase key={idx} {...uc} />
        ))}

        <div className={styles.planned}>
          <span className={styles.plannedBadge}>wkrótce</span>
          <Heading as="h3" className={styles.plannedTitle}>
            ✏️ Wystawianie faktur
          </Heading>
          <p className={styles.plannedDescription}>
            W przyszłości OpenKSeF umożliwi podstawowe wystawianie faktur sprzedażowych
            bezpośrednio z portalu i aplikacji mobilnej — bez potrzeby korzystania z dodatkowego programu.
          </p>
        </div>
      </div>
    </section>
  );
}
