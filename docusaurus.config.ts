import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'OpenKSeF',
  tagline: 'Miej kontrolę nad fakturami z KSeF — powiadomienia, przegląd i szybkie płatności',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  url: 'https://open-ksef.pl',
  baseUrl: '/',

  organizationName: 'open-ksef',
  projectName: 'open-ksef-doc',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'pl',
    locales: ['pl', 'en'],
    localeConfigs: {
      pl: { label: 'Polski' },
      en: { label: 'English' },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/open-ksef/open-ksef-doc/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/og-image.png',
    announcementBar: {
      id: 'beta',
      content: 'OpenKSeF jest w fazie <strong>beta</strong> — aktywnie rozwijamy projekt. Zgłaszaj błędy i pomysły na <a href="https://github.com/open-ksef" target="_blank">GitHub</a>.',
      backgroundColor: '#eef2ff',
      textColor: '#312e81',
    },
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'OpenKSeF',
      logo: {
        alt: 'OpenKSeF Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Dokumentacja',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/open-ksef',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Dokumentacja',
          items: [
            {label: 'Wprowadzenie', to: '/docs/intro'},
            {label: 'Szybki start', to: '/docs/instalacja/szybki-start'},
            {label: 'Kreator konfiguracji', to: '/docs/admin-setup'},
          ],
        },
        {
          title: 'Projekt',
          items: [
            {label: 'GitHub', href: 'https://github.com/open-ksef'},
            {label: 'O projekcie', to: '/docs/o-projekcie'},
            {label: 'Licencja ELv2', to: '/docs/licencja'},
            {label: 'Polityka prywatności', to: '/docs/polityka-prywatnosci'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} OpenKSeF (beta). Elastic License 2.0. Projekt stworzony z pomocą AI.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'yaml', 'csharp'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
