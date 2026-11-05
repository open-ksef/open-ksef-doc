# open-ksef-doc

Source of [open-ksef.pl](https://open-ksef.pl): the Polish documentation and home page of [OpenKSeF](https://github.com/open-ksef/open-ksef), a self-hosted system for invoices from Poland's National e-Invoice System (KSeF).

`Kod źródłowy jest publicznie dostępny` (the source code is publicly available) under the [Elastic License 2.0](LICENSE). `Niezależny projekt, niepowiązany z Ministerstwem Finansów` (an independent project, not affiliated with the Ministry of Finance). `Nie prowadzimy wersji hostowanej dla firm` (we run no hosted version for companies).

Site content is in Polish, and it must match the released versions of [open-ksef](https://github.com/open-ksef/open-ksef/releases) and [open-ksef-mobile](https://github.com/open-ksef/open-ksef-mobile/releases). Screenshots contain fictional data only: see [AGENTS.md](AGENTS.md).

## Develop

[Docusaurus 3](https://docusaurus.io/), Node.js 20 or newer:

```bash
npm ci
npm start       # http://localhost:3000
npm run build   # fails on a broken internal link or anchor
npm run serve   # preview the build
```

A push to `main` deploys the site to GitHub Pages: [deploy.yml](.github/workflows/deploy.yml). `/docs/` and retired page URLs are redirect pages in `static/docs`.

## License

[Elastic License 2.0](LICENSE)
