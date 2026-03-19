---
sidebar_position: 6
title: Push notifications
---

# Push notifications

Push notifications alert the mobile app about new invoices from KSeF.

## How it works

```mermaid
graph LR
  subgraph instance ["Your OpenKSeF instance"]
    API["API / Worker"]
  end

  subgraph mobile ["Mobile app"]
    App["OpenKSeF Mobile"]
  end

  SignalR["SignalR (WebSocket)"]
  Relay["push.open-ksef.pl"]
  FCM["FCM / APNs"]

  API -->|"1. local"| SignalR --> App
  API -->|"2. remote"| Relay --> FCM --> App
```

| Layer | When it works | Configuration |
|-------|---------------|---------------|
| **SignalR** | App is connected to the server | None -- always enabled |
| **Relay** | App in background | Select in wizard (default) |
| **Email** | Always | Configure SMTP |

Most installations need only **SignalR + Relay**. No Firebase setup required.

## Configuration

In the [setup wizard](admin-setup) (Step 5 -- Integrations):

- **OpenKSeF Relay** (default) -- URL `https://push.open-ksef.pl` is pre-filled. Your instance registers automatically and receives a unique API key. Done.
- **Own Firebase** -- paste the service account JSON. Details at [Firebase Console](https://console.firebase.google.com/) > Project Settings > Service Accounts > Generate new private key.
- **Local only** -- no remote push, SignalR only when the app is active.

## Security

Communication with the relay is secured by three layers:

1. **Cloudflare** -- HTTPS, rate limiting, bot protection
2. **Instance registration** -- each instance has a unique HMAC key (auto-generated during setup)
3. **Request validation** -- HMAC signature, timestamp freshness check (5 min), per-instance rate limits

No keys are stored in source code -- they are generated at registration time and stored in the instance database.

## Testing

1. Log in to the portal > **Devices**
2. Find a registered device > **Test**

## Troubleshooting

| Symptom | Solution |
|---------|----------|
| No notifications | Enable relay in the wizard |
| SignalR won't connect | Log in again in the app |
| Relay returns 401 | Instance not registered -- go to Settings > Push notifications > Re-register |
| Relay returns 403 | Instance disabled by relay admin |
| Relay returns 429 | Rate limit exceeded |
| Relay returns 502 | Firebase/APNs issue on the relay side |
