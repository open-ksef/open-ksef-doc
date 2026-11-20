import {useState} from 'react';
import {randomTestNip} from './randomTestNip';

export default function TestNip({label}: {label: string}) {
  const [nip, setNip] = useState('');
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(nip);
    setCopied(true);
  };

  return (
    <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', marginBottom: 'var(--ifm-paragraph-margin-bottom)'}}>
      <button type="button" className="button button--primary" onClick={() => { setNip(randomTestNip()); setCopied(false); }}>
        Wylosuj {label}
      </button>
      <output aria-live="polite" aria-label={label}>
        {nip ? <code>{nip}</code> : 'Kliknij, aby wylosować'}
      </output>
      {nip && (
        <button type="button" className="button button--secondary button--sm" onClick={copy}>
          {copied ? 'Skopiowano' : 'Kopiuj'}
        </button>
      )}
    </div>
  );
}
