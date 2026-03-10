import type {ReactNode} from 'react';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type TechItem = {
  icon: string;
  name: string;
  role: string;
};

const techList: TechItem[] = [
  {icon: '🟣', name: '.NET 8', role: 'Backend'},
  {icon: '⚛️', name: 'React 19', role: 'Portal'},
  {icon: '📱', name: '.NET MAUI', role: 'Mobile'},
  {icon: '🐘', name: 'PostgreSQL', role: 'Baza danych'},
  {icon: '🔐', name: 'Keycloak', role: 'Autoryzacja'},
  {icon: '🐳', name: 'Docker', role: 'Konteneryzacja'},
  {icon: '🔀', name: 'nginx', role: 'Gateway'},
];

function Tech({icon, name, role}: TechItem) {
  return (
    <div className={styles.techItem}>
      <span className={styles.techIcon}>{icon}</span>
      <span className={styles.techName}>{name}</span>
      <span className={styles.techRole}>{role}</span>
    </div>
  );
}

export default function TechStack(): ReactNode {
  return (
    <section className={styles.section}>
      <div className="container">
        <Heading as="h2" className={styles.heading}>
          Technologie
        </Heading>
        <div className={styles.grid}>
          {techList.map((tech) => (
            <Tech key={tech.name} {...tech} />
          ))}
        </div>
      </div>
    </section>
  );
}
