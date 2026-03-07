import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HowToStart from '@site/src/components/HowToStart';
import TechStack from '@site/src/components/TechStack';

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
      title="Otwartoźródłowy system do KSeF"
      description="OpenKSeF -- otwartoźródłowy system do synchronizacji i przeglądania faktur z Krajowego Systemu e-Faktur (KSeF). Self-hosted, Docker, React portal, MAUI mobile.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <HowToStart />
        <TechStack />
      </main>
    </Layout>
  );
}
