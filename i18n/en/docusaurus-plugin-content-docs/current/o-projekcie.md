---
sidebar_position: 8
title: About the project
---

# About the project

:::caution Status: Beta
OpenKSeF is in **beta**. We are actively developing the project -- new features appear regularly, but there may be changes in the API, data structure, and configuration between versions. We recommend following the [release notes on GitHub](https://github.com/open-ksef).
:::

## What is OpenKSeF?

OpenKSeF is an open-source system for synchronizing and browsing invoices from the Polish National e-Invoice System (KSeF). The project was created so that anyone can run their own instance and have full control over their invoice data.

## Built with AI

OpenKSeF was created using AI tools -- in particular [Cursor](https://cursor.com/) and Claude models (Anthropic). AI assisted with programming, test generation, documentation writing, and architecture design.

We believe in transparency: AI is a tool that accelerates software development. The code is open and anyone can verify it.

## Open Source

The project is released under the **MIT** license -- one of the most permissive open-source licenses. You can:

- Use OpenKSeF for commercial and private purposes
- Modify the source code
- Distribute modified versions
- No license fees

Full license text: [MIT License](licencja)

## Self-hosting and data responsibility

OpenKSeF is designed for **self-hosting** -- you run it on your own infrastructure (server, VPS, cloud, home computer).

**What this means:**

- **Your data stays with you** -- invoices, KSeF tokens, user data are stored in your PostgreSQL database
- **You control access** -- Keycloak runs on your instance
- **You are responsible for security** -- HTTPS configuration, backups, updates, firewall

:::info Important
OpenKSeF is a tool. Self-hosting = you are responsible for your data. You decide how to configure and secure your instance. Project authors have no access to your data and bear no responsibility for its security.
:::

## Security recommendations

If you're running OpenKSeF with internet access:

1. **Always use HTTPS** (e.g. via Traefik, Caddy, nginx + certbot)
2. **Regularly update** Docker containers
3. **Back up** the PostgreSQL database
4. **Change default passwords** for Keycloak (admin/admin)
5. **Restrict access** to ports 8081, 8082, 5432 (only gateway 8080 should be public)
6. **Monitor logs** for unauthorized access attempts

## Technologies

| Component | Technology |
|-----------|------------|
| Backend API | .NET 8, ASP.NET Core |
| Worker | .NET 8, Background Service |
| Web portal | React 19, TypeScript, Vite |
| Mobile app | .NET MAUI (Android, iOS) |
| Database | PostgreSQL |
| Authentication | Keycloak (OIDC) |
| Containerization | Docker, Docker Compose |
| Reverse proxy | nginx |
| KSeF client | CIRFMF ksef-client-csharp |

## Contact

- GitHub: [github.com/open-ksef](https://github.com/open-ksef)
- Backend + Portal: [github.com/open-ksef/open-ksef](https://github.com/open-ksef/open-ksef)
- Mobile app: [github.com/open-ksef/open-ksef-mobile](https://github.com/open-ksef/open-ksef-mobile)
- Documentation: [github.com/open-ksef/open-ksef-doc](https://github.com/open-ksef/open-ksef-doc)
- Issues: [github.com/open-ksef/open-ksef/issues](https://github.com/open-ksef/open-ksef/issues)
