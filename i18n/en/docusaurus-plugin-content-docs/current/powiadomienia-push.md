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

- **OpenKSeF Relay** (default) -- URL `https://push.open-ksef.pl` is pre-filled. Done.
- **Own Firebase** -- paste the service account JSON. Details at [Firebase Console](https://console.firebase.google.com/) > Project Settings > Service Accounts > Generate new private key.
- **Local only** -- no remote push, SignalR only when the app is active.

## Testing

1. Log in to the portal > **Devices**
2. Find a registered device > **Test**

## Troubleshooting

| Symptom | Solution |
|---------|----------|
| No notifications | Enable relay in the wizard |
| SignalR won't connect | Log in again in the app |
| Relay returns 401 | Check the relay API key |
| Relay returns 502 | Check relay logs / Firebase credentials |
