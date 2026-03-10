---
sidebar_position: 6
title: Push notifications
---

# Push notifications

Push notifications allow the mobile app to receive real-time alerts, e.g. about new invoices downloaded from KSeF. OpenKSeF uses a **multi-layered delivery architecture** inspired by the Home Assistant Companion App model.

## Delivery layers

| Layer | Method | When it works | What to configure |
|-------|--------|---------------|-------------------|
| **1. SignalR (local)** | WebSocket | App is connected to the API | Nothing (always enabled) |
| **2. Relay (team server)** | HTTP POST to relay | App in background, any network | Enable in wizard (default) |
| **3. Direct FCM/APNs** | Firebase / Apple push | App in background, own Firebase | Advanced: paste Firebase JSON |
| **4. Email fallback** | SMTP | Always | Configure SMTP in wizard |

Most self-hosted administrators need only **Layer 1 + Layer 2**, which don't require Firebase configuration.

## How it works

```
New invoice synchronized from KSeF
    │
    ├─ 1. SignalR: send to connected mobile clients via WebSocket
    │
    ├─ 2. Relay: POST to push.open-ksef.pl → forward to FCM/APNs
    │      (relay manages Firebase/APNs credentials)
    │
    ├─ 3. Direct FCM/APNs: if own Firebase is configured
    │
    └─ 4. Email: send email notification
```

### Layer 1: SignalR (local push)

The mobile app maintains a SignalR (WebSocket) connection to the API at `/hubs/notifications`. When a new invoice appears, the API sends a message to all connected clients of the user.

- Works on Android and iOS
- No cloud services, no limits
- Requires an active app connection to the server
- Connection established after login with automatic reconnect

### Layer 2: Relay (recommended for remote push)

The OpenKSeF team maintains a lightweight relay server at `https://push.open-ksef.pl`. Self-hosted instances send notifications to this relay, which forwards them to the device via FCM (Android) or APNs (iOS).

**Why this works:** The official OpenKSeF mobile app is built with the team's Firebase project. The relay has the appropriate Firebase server credentials. Self-hosted administrators don't need to configure Firebase.

**Configuration:** In the [setup wizard](admin-setup) (Step 5 - Integrations), select "OpenKSeF Relay" (it's the default). The relay URL is filled in automatically.

**Security:** Requests to the relay are signed with HMAC (using the relay API key), preventing unauthorized senders.

### Layer 3: Direct Firebase / APNs (advanced)

For administrators who want full control over push delivery. Requires creating your own Firebase project.

### Layer 4: Email fallback

If the tenant has a notification email configured, the system always sends an email regardless of push delivery success.

---

## Configuration in the wizard

In the [setup wizard](admin-setup), Step 5 (Integrations) offers three modes:

### Option A: Relay (default, recommended)

- Select "OpenKSeF Relay"
- URL `https://push.open-ksef.pl` is pre-filled
- Optionally enter the API key
- Done -- no Firebase configuration needed

### Option B: Own Firebase project (advanced)

- Select "Own Firebase project"
- Paste the Firebase service account JSON
- Firebase configuration details below

### Option C: Local only (SignalR)

- Select "Local only (SignalR)"
- No remote push notifications
- Users receive notifications only when the app is actively connected

---

## Firebase configuration (Option B only)

### Step 1: Create a Firebase project

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project**
3. Go through the wizard -- you can disable Google Analytics

### Step 2: Register the Android app

1. In the Firebase project, click **Add app > Android**
2. Enter package name: `com.openksef.mobile`
3. Optionally: nickname and SHA-1 certificate fingerprint
4. Click **Register app**
5. Download `google-services.json`

### Step 3: Add `google-services.json` to the mobile project

Place the downloaded file in:

```
src/OpenKSeF.Mobile/Platforms/Android/google-services.json
```

The `.csproj` file automatically detects this file and enables `FIREBASE_ENABLED`.

:::warning
Do not commit `google-services.json` to the repository. It contains API keys specific to your Firebase project.
:::

### Step 4: Generate a service account key

1. In Firebase Console: **Project Settings > Service Accounts**
2. Select **Firebase Admin SDK** > **Generate new private key**
3. Download the JSON

### Step 5: Configure in the wizard or `.env`

**Via wizard:** Paste the JSON in Step 5 of the wizard under "Own Firebase project".

**Via `.env`:** Flatten the JSON to a single line:

```bash
FIREBASE_CREDENTIALS_JSON={"type":"service_account","project_id":"your-project",...}
```

---

## Verification

### SignalR (local push)

1. Log in to the mobile app -- the SignalR connection will be established automatically
2. On the Account page, the status should show "SignalR connected"
3. Trigger a KSeF sync -- the notification should arrive immediately

### Remote push (relay or direct)

1. Log in to the portal (http://localhost:8080)
2. Go to **Devices**
3. Find the registered device
4. Click **Test** -- the API will send a test push and show the result

---

## Troubleshooting

| Symptom | Cause | Solution |
|---------|-------|----------|
| No notifications | Push providers not configured | Enable relay in the wizard or configure Firebase |
| SignalR doesn't connect | Auth token expired or wrong URL | Log in again in the app |
| Relay returns 401 | Invalid HMAC signature | Check that the API key matches between the instance and relay |
| Relay returns 502 | Invalid Firebase/APNs data on relay | Check relay logs, verify Firebase JSON |
| Invalid FCM token | Device token expired or wrong Firebase project | Re-register the device; check `google-services.json` |
| iOS push returns 403 | Missing APNs JWT auth | Use relay (manages APNs auth) |

---

## Environment variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `FIREBASE_CREDENTIALS_JSON` | For direct FCM | *(none -- uses relay)* | Firebase service account JSON |
| `APNS_BUNDLE_ID` | For direct iOS | `com.openksef.mobile` | iOS bundle identifier |
| `APNS_BASE_URL` | For direct iOS | `https://api.push.apple.com` | APNs endpoint |
| `APNS_KEY_ID` | For direct iOS | *(none)* | APNs Auth Key ID |
| `APNS_TEAM_ID` | For direct iOS | *(none)* | Apple Developer Team ID |
| `APNS_AUTH_KEY_P8` | For direct iOS | *(none)* | Contents of the `.p8` file |
