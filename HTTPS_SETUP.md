# 🔐 HTTPS Local Development Setup

## ✅ What's Configured

Your Next.js app now runs with HTTPS on localhost, which is **required** for Stripe's embedded checkout to work properly.

---

## 🚀 How to Run

### **Option 1: HTTPS Development (Use this for Stripe testing)**

```bash
npm run dev:https
```

This will:

1. Start Next.js on port **3001** (HTTP)
2. Start SSL proxy on port **3000** (HTTPS)
3. Access your app at: **https://localhost:3000**

### **Option 2: Regular Development (HTTP)**

```bash
npm run dev
```

Use this when you don't need Stripe embedded checkout.

---

## 🔧 How It Works

```
Browser (HTTPS)  →  localhost:3000 (SSL Proxy)  →  localhost:3001 (Next.js HTTP)
    ↓                        ↓                             ↓
  Secure            Converts to HTTPS                 Your app
```

**Components:**

- `local-ssl-proxy`: Creates HTTPS tunnel
- `concurrently`: Runs both servers simultaneously
- Next.js: Runs on port 3001 (HTTP internally)
- SSL Proxy: Exposes port 3000 (HTTPS externally)

---

## ⚠️ Browser Certificate Warning

### **First Time Setup:**

When you first visit `https://localhost:3000`, you'll see a security warning:

**Chrome/Edge:**

1. Click "Advanced"
2. Click "Proceed to localhost (unsafe)"

**Firefox:**

1. Click "Advanced"
2. Click "Accept the Risk and Continue"

**Why?** The SSL certificate is self-signed (not from a trusted authority). This is **normal and safe for local development**.

---

## 🧪 Testing Stripe Embedded Checkout

1. **Start HTTPS server:**

   ```bash
   npm run dev:https
   ```

2. **Open browser:**

   ```
   https://localhost:3000
   ```

3. **Accept the certificate warning** (one time)

4. **Go to checkout:**

   ```
   https://localhost:3000/checkout/summary
   ```

5. **Verify Stripe loads:**
   - You should see the embedded Stripe form
   - No "blocked:other" errors in Network tab

---

## 🎯 Environment Variables

Your `.env.local` is now configured for HTTPS:

```bash
NEXT_PUBLIC_URL=https://localhost:3000
```

**Important:** This is used for:

- Stripe return URLs
- Webhook URLs (when testing locally)
- Any absolute URLs in your app

---

## 🔄 Switching Between HTTP and HTTPS

### **For Stripe Development:**

```bash
npm run dev:https
# Visit: https://localhost:3000
```

### **For Regular Development:**

```bash
npm run dev
# Visit: http://localhost:3000
```

Don't forget to update `NEXT_PUBLIC_URL` in `.env.local` when switching!

---

## 📦 Installed Packages

```json
{
  "devDependencies": {
    "local-ssl-proxy": "^2.0.5",
    "concurrently": "^8.0.0"
  }
}
```

---

## 🐛 Troubleshooting

### **"Port 3000 already in use"**

```bash
# Kill the process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### **"Port 3001 already in use"**

```bash
# Kill the process using port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### **Stripe still shows "blocked:other"**

1. ✅ Check you're using `https://localhost:3000` (not http)
2. ✅ Accept the certificate warning in browser
3. ✅ Clear browser cache and reload
4. ✅ Check Network tab for actual error details

### **Certificate warnings keep appearing**

This is normal for self-signed certificates. You need to accept it each time you restart the browser.

---

## 🎉 You're Ready!

Your development environment now supports:

- ✅ HTTPS on localhost
- ✅ Stripe embedded checkout
- ✅ Secure payment testing
- ✅ Production-like environment

**Start developing:**

```bash
npm run dev:https
```

Then visit: **https://localhost:3000**
