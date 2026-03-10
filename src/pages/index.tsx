import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import UseCases from '@site/src/components/UseCases';
import HowToStart from '@site/src/components/HowToStart';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <Heading as="h1">{siteConfig.title} <span className={styles.betaBadge}>beta</span></Heading>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className={styles.heroButtonPrimary} to="/docs/instalacja/szybki-start">
            Zainstaluj
          </Link>
          <Link className={styles.heroButtonSecondary} to="/docs/intro">
            Dokumentacja
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Miej kontrolę nad fakturami z KSeF"
      description="OpenKSeF -- darmowy, otwartoźródłowy system do powiadomień o fakturach z KSeF, szybkiego przeglądu i płatności. Self-hosted, bez opłat.">
      <HomepageHeader />
      <main>
        <UseCases />
        <HowToStart />
      </main>
    </Layout>
  );
}
