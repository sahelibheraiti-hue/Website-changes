# Saheli Bherayti Store & Ladies Corner — Netlify

This is a Netlify-ready full-stack starter using Netlify Functions + Netlify Blobs.

## Important
A pure drag-and-drop static HTML site cannot securely implement shared admin login, shared loyalty points, orders and customer data. This project includes a serverless backend so the data is shared across customers/devices.

## Before first live use
The ZIP now has a first-login fallback so you can deploy quickly without setting variables:
- **Admin ID:** `saheliadmin`
- **Admin Password:** `Saheli@845107#2026`

For a real production site, after login change the password immediately. You should also set these Netlify environment variables for stronger security:
- `ADMIN_ID` = your chosen admin ID
- `ADMIN_EMAIL` = `sahelibheraiti@gmail.com`
- `ADMIN_PASSWORD` = your chosen strong password (10+ characters)
- `SESSION_SECRET` = a long random secret string (at least 32 characters)

Do NOT publish these secrets in screenshots or social media.

The first server request seeds the categories and sample products. Replace sample products from the Admin panel.

## Deploy
1. Open Netlify Drop.
2. Drag the entire `saheli-bherayti-store` folder.
3. After deployment, add the three environment variables above.
4. Open `/admin.html` and log in with the default credentials above.
5. Immediately use **Security → Change Admin Password**.
6. If you add Netlify environment variables, redeploy once after setting them. Note: the initial admin record is created on the first backend request.

Netlify Functions are deployed from `netlify/functions` and use Netlify Blobs for shared storage.

## Online orders
Only PIN `845107` is accepted.

## Loyalty rules
- ₹200–₹999: 1 point
- ₹1000+: 2 points
- Less than ₹200: 0 points
- Maximum one points award per customer per calendar day (India time)
- At 10 points, 10 points are converted into one random ₹1–₹100 scratch-card voucher.

## Razorpay setup
This build uses Razorpay Standard Checkout. The frontend receives only `RAZORPAY_KEY_ID`; the secret stays server-side.

Set these Netlify environment variables before testing:
- `RAZORPAY_KEY_ID` = your current Razorpay Test Key ID
- `RAZORPAY_KEY_SECRET` = your newly regenerated Razorpay Test Key Secret
- `SESSION_SECRET` = a long random secret

After deployment, test an order of at least ₹500 with PIN `845107`. Payment is verified server-side. Loyalty points are **not** awarded at payment time; the admin must open Admin → Orders and click **Confirm Order** after the payment is verified.

Do not put `RAZORPAY_KEY_SECRET` in frontend code or send it in chat.
