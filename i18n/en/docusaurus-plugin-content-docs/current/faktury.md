---
sidebar_position: 5
title: Invoices
---

# Invoices

OpenKSeF downloads from KSeF the invoices in which your company is the buyer (cost invoices). In the portal you find them under **Faktury** (Invoices); in the mobile app on the **Faktury** screen.

## Invoice list

![Invoice list](/img/screenshots/portal/invoices.png)

- The first column **Nr faktury** is the number assigned by the seller (e.g. `FV/2026/10/0042`). If the invoice has none, the KSeF number is shown.
- The **Numer KSeF** column is the identifier assigned by KSeF.
- The **Status** column shows whether the invoice is marked as paid.
- Filters: company, issue date range, invoices per page.

## Invoice details

Click an invoice in the list to see its details: numbers, seller and buyer, dates, net / VAT / gross amounts and payment status.

![Invoice details](/img/screenshots/portal/invoice-detail.png)

### Line items

Below the invoice data there is a **Pozycje faktury** (line items) table with the invoice rows (`FaWiersz`): name, unit, quantity, net and gross unit price, net / VAT / gross amounts and VAT rate.

![Line items](/img/screenshots/portal/invoice-lines.png)

- Most invoices carry only net prices and the VAT rate. In that case the line's gross price and VAT are **calculated** by OpenKSeF from the rate (net × rate). They may differ by a few grosze from the invoice, because the seller may have calculated VAT on the total rather than per line. The invoice header amounts are binding.
- For non-numeric rates (e.g. `zw`, `oo`, `np I`, `np II`) line VAT is 0 and gross = net.
- If the invoice in KSeF has no line items (e.g. some advance invoices), the table is not shown.
- Invoices downloaded before this feature have no line items. Fill them in with a [full resync](#full-resync).

### Payment status

The **Oznacz jako opłaconą** (Mark as paid) button sets the invoice status to **Opłacona** (Paid) and stores the date. **Cofnij oznaczenie** (Undo) restores **Nieopłacona** (Unpaid).

![Payment status](/img/screenshots/portal/invoice-paid.png)

:::info[Status only in OpenKSeF]
The payment status is your note in OpenKSeF. It is not sent to KSeF or to your bank, and OpenKSeF does not check whether the transfer was made. Synchronization (including a full resync) does not change the payment status.
:::

You change the payment status in the portal. The mobile app does not show it.

### Transfer details and QR code

The **Dane do przelewu** (Transfer details) section shows the recipient, NIP, the seller's bank account (from the invoice in KSeF), amount and transfer title. **Kopiuj dane przelewu** copies them to the clipboard; the **QR code** (ZBP standard) can be scanned in a banking app.

![Transfer details and QR code](/img/screenshots/portal/invoice-qr.png)

The transfer title is just the seller's invoice number, e.g. `FV/2026/10/0042`. If the invoice has no seller number, the KSeF number is used. If the invoice has no bank account, **Nr rachunku** shows `brak` (none).

## Synchronization with KSeF

The Worker downloads new invoices automatically in the background, every 4 hours by default. The first synchronization of a new company downloads invoices from the last 6 months. You can also start a synchronization manually in the portal: **Dane logowania** (Credentials) > the company row.

![Credentials -- synchronization](/img/screenshots/portal/credentials-resync.png)

| Button | What it does | When to use |
|--------|--------------|-------------|
| **Wymuś synchronizację** (Force sync) | Downloads invoices that appeared in KSeF since the last synchronization | You don't want to wait for the automatic synchronization |
| **Pełna resynchronizacja** (Full resync) | Downloads all of the company's invoices from KSeF again and overwrites their data (including line items and bank account) | Older invoices lack line items or bank account |

### Full resync

The portal asks for confirmation before it starts.

![Full resync confirmation](/img/screenshots/portal/credentials-resync-confirm.png)

- Covers the whole company history: from the oldest invoice stored in OpenKSeF, not only the initial sync window.
- Takes longer than a regular sync, because every invoice is downloaded from KSeF again.
- If it fails, existing data stays unchanged. It is safe to retry.
- Sends no push notifications for invoices it finds. The first synchronization of a new company behaves the same way.
- Invoice payment status is kept.

## Mobile app

In the mobile app (version 1.0.4 and later):

- the invoice list shows the seller's invoice number, or the KSeF number when there is none,
- invoice details show **Numer faktury**, **Numer KSeF** and a **Pozycje faktury** card (name, quantity × unit, net unit price, net / VAT / gross amounts),
- the transfer title in copied transfer details and in the QR code is just the invoice number.

More about the app: [Mobile app](aplikacja-mobilna).
