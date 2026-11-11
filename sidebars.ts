import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Instalacja',
      items: [
        'instalacja/wymagania',
        'instalacja/szybki-start',
        'instalacja/konfiguracja',
      ],
    },
    'admin-setup',
    'logowanie',
    'token-ksef',
    'certyfikat-ksef',
    'faktury',
    'wystawianie-faktur',
    'powiadomienia-push',
    'aplikacja-mobilna',
    {
      type: 'category',
      label: 'Informacje',
      items: [
        'o-projekcie',
        'licencja',
        'polityka-prywatnosci',
      ],
    },
  ],
};

export default sidebars;
