import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import focusableTables from './src/rehype/focusableTables';

const config: Config = {
  title: 'OpenKSeF',
  tagline: 'Miej kontrolę nad fakturami z KSeF: powiadomienia, przegląd, szybkie płatności i wystawianie',
  favicon: 'img/favicon.svg',
  headTags: [
    {tagName: 'link', attributes: {rel: 'alternate icon', href: '/img/favicon.ico'}},
    {tagName: 'link', attributes: {rel: 'apple-touch-icon', href: '/img/favicon-180.png'}},
  ],

  future: {
    v4: true,
    faster: false,
  },

  url: 'https://open-ksef.pl',
  baseUrl: '/',

  organizationName: 'open-ksef',
  projectName: 'open-ksef-doc',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'pl',
    locales: ['pl'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          rehypePlugins: [focusableTables],
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
      content: 'OpenKSeF jest w fazie <strong>beta</strong>: aktywnie rozwijamy projekt. Zgłaszaj błędy i pomysły na <a href="https://github.com/open-ksef" target="_blank">GitHub</a>.',
      backgroundColor: 'var(--ifm-color-primary-lightest)',
      textColor: 'var(--ifm-color-primary-darkest)',
    },
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'OpenKSeF',
      logo: {
        src: 'img/mark.svg',
        srcDark: 'img/mark-dark.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Dokumentacja',
        },
        {
          href: 'https://github.com/open-ksef',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
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
      copyright: `Copyright © ${new Date().getFullYear()} OpenKSeF (beta). Kod źródłowy jest publicznie dostępny na licencji Elastic License 2.0. Niezależny projekt, niepowiązany z Ministerstwem Finansów. Projekt stworzony z pomocą AI.`,
    },
    prism: {
      theme: {
        ...prismThemes.github,
        styles: [
          ...prismThemes.github.styles,
          {types: ['comment', 'prolog', 'doctype', 'cdata'], style: {color: 'var(--ifm-color-emphasis-600)'}},
          {types: ['string', 'attr-value', 'function', 'deleted'], style: {color: 'var(--ifm-color-danger)'}},
          {
            types: ['entity', 'url', 'symbol', 'number', 'boolean', 'variable', 'constant', 'property', 'regex', 'inserted'],
            style: {color: 'var(--ifm-color-success)'},
          },
          {types: ['atrule', 'attr-name'], style: {color: 'var(--ifm-link-color)'}},
        ],
      },
      darkTheme: {
        ...prismThemes.dracula,
        styles: [
          ...prismThemes.dracula.styles,
          {types: ['comment', 'prolog', 'doctype', 'cdata'], style: {color: 'var(--ifm-color-emphasis-600)'}},
        ],
      },
      additionalLanguages: ['bash', 'json', 'yaml', 'csharp'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
