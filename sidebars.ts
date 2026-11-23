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
        'instalacja/wyprobuj-na-ksef-test',
        'instalacja/konfiguracja',
      ],
    },
    'admin-setup',
    'logowanie',
    'weryfikacja-dwuetapowa',
    'token-ksef',
    'certyfikat-ksef',
    'wspolne-firmy',
    'faktury',
    'wystawianie-faktur',
    'korekty',
    'zaliczki-i-rozliczenia',
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
