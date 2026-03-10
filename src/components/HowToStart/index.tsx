import type {ReactNode} from 'react';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type StepItem = {
  number: number;
  title: string;
  description: string;
  code?: string;
};

const steps: StepItem[] = [
  {
    number: 1,
    title: 'Wklej i uruchom',
    description: 'Skopiuj docker-compose.yml z dokumentacji i uruchom stack jednym poleceniem.',
    code: 'docker compose up -d',
  },
  {
    number: 2,
    title: 'Przejdź przez kreator',
    description: 'Otwórz przeglądarkę na localhost:8080. Kreator konfiguracji przeprowadzi Cię przez wszystkie ustawienia.',
  },
  {
    number: 3,
    title: 'Gotowe!',
    description: 'Zaloguj się, dodaj dane KSeF swojej firmy i zacznij synchronizować faktury.',
  },
];

function Step({number, title, description, code}: StepItem) {
  return (
    <div className={styles.step}>
      <div className={styles.stepNumber}>{number}</div>
      <Heading as="h3" className={styles.stepTitle}>{title}</Heading>
      <p className={styles.stepDescription}>{description}</p>
      {code && <code className={styles.stepCode}>{code}</code>}
    </div>
  );
}

export default function HowToStart(): ReactNode {
  return (
    <section className={styles.section}>
      <div className="container">
        <Heading as="h2" className={styles.heading}>
          Jak zacząć?
        </Heading>
        <div className={styles.stepsRow}>
          {steps.map((step) => (
            <Step key={step.number} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}
