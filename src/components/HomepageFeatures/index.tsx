import type {ReactNode} from 'react';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  icon: string;
  title: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    icon: '🔄',
    title: 'Synchronizacja z KSeF',
    description: (
      <>
        Automatyczne pobieranie faktur z Krajowego Systemu e-Faktur w tle.
        Przeglądanie, filtrowanie i wyszukiwanie faktur. Obsługa środowiska
        testowego i produkcyjnego.
      </>
    ),
  },
  {
    icon: '🖥️',
    title: 'Portal webowy',
    description: (
      <>
        Nowoczesny portal React z dashboardem, listą faktur, zarządzaniem
        firmami i uprawnieniami. Responsywny design, logowanie przez Keycloak
        lub Google.
      </>
    ),
  },
  {
    icon: '📱',
    title: 'Aplikacja mobilna',
    description: (
      <>
        Natywna aplikacja .NET MAUI na Android i iOS. Powiadomienia push
        o nowych fakturach, skanowanie QR do szybkiego połączenia z serwerem.
      </>
    ),
  },
  {
    icon: '🏠',
    title: 'Self-hosting',
    description: (
      <>
        Jedno polecenie Docker i gotowe. Twoje dane zostają u Ciebie -- pełna
        kontrola nad infrastrukturą, bez opłat abonamentowych, bez zależności
        od zewnętrznych usług.
      </>
    ),
  },
  {
    icon: '🏢',
    title: 'Multi-tenant',
    description: (
      <>
        Wiele firm na jednej instancji z pełną izolacją danych. Każdy
        użytkownik widzi tylko swoje firmy i faktury. Zarządzanie tokenami
        KSeF per firma.
      </>
    ),
  },
  {
    icon: '🔔',
    title: 'Powiadomienia push',
    description: (
      <>
        Wielowarstwowe dostarczanie: SignalR (lokalne), relay serwer
        (bez konfiguracji Firebase), direct FCM/APNs, email fallback.
        Działa nawet gdy aplikacja jest w tle.
      </>
    ),
  },
];

function Feature({icon, title, description}: FeatureItem) {
  return (
    <div className="col col--4" style={{marginBottom: '1.5rem'}}>
      <div className={styles.featureCard}>
        <span className={styles.featureIcon}>{icon}</span>
        <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
        <p className={styles.featureDescription}>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <Heading as="h2" className={styles.featuresHeading}>
          Dlaczego OpenKSeF?
        </Heading>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
