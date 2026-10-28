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
| **SignalR** | App is connected to the server; manual sync only | None -- always enabled |
| **Relay** | App in background | Select in wizard (default) |
| **Email** | Manual sync only | Configure SMTP and the company's notification e-mail |

Most installations need only **SignalR + Relay**. No Firebase setup required.

## Who gets a notification

- **Automatic sync** (Worker, every 4 hours by default) sends remote notifications only: relay or your own Firebase/APNs.
- **Manual sync** (button in the portal or in the mobile app) also sends a SignalR notification and an e-mail.
- A push notification goes to the devices of the user who owns the company. Other users of the instance do not get it.
- The e-mail goes to the notification address set on the company. It can be any address, including someone outside the instance.
- A device registered in the mobile app receives notifications for all companies of its user, unless it was bound to one company in the portal (**Devices**).
- The first synchronization of a new company and a [full resync](faktury#full-resync) send no notifications, even if they download many invoices.

## Reliability

- A temporary outage of the relay, Firebase or APNs does not remove the device registration. A device is removed from the list only when FCM/APNs explicitly rejects its token (e.g. after the app is uninstalled).
- The mobile app (Android, version 1.0.4 and later) checks after login whether its device is still registered on the server and registers it again if needed.

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
| No notifications, device missing from **Devices** | In the mobile app: **Konto** (Account) > turn **Powiadomienia push** off and on. The app registers the device again |
| No notifications after a full resync | Intended -- a full resync sends no notifications |
| SignalR won't connect | Log in again in the app |
| Relay returns 401 | Instance not registered -- go to Settings > Push notifications > Re-register |
| Relay returns 403 | Instance disabled by relay admin |
| Relay returns 429 | Rate limit exceeded |
| Relay returns 502 | Firebase/APNs issue on the relay side |
