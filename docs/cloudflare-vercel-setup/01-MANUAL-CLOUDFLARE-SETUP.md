# Manual Cloudflare Setup Guide for meauxbility.org

This guide provides step-by-step instructions for configuring Cloudflare manually through the web dashboard.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Add Domain to Cloudflare](#step-1-add-domain-to-cloudflare)
3. [Step 2: Configure DNS Records](#step-2-configure-dns-records)
4. [Step 3: Configure SSL/TLS Settings](#step-3-configure-ssltls-settings)
5. [Step 4: Configure Security Settings](#step-4-configure-security-settings)
6. [Step 5: Configure Performance Settings](#step-5-configure-performance-settings)
7. [Step 6: Create Page Rules](#step-6-create-page-rules)
8. [Step 7: Enable Web Analytics](#step-7-enable-web-analytics)
9. [Step 8: Update Nameservers](#step-8-update-nameservers)
10. [Verification](#verification)

---

## Prerequisites

- ✅ Cloudflare account (free tier is sufficient)
- ✅ Access to your domain registrar
- ✅ Domain: meauxbility.org
- ✅ Vercel project deployed

---

## Step 1: Add Domain to Cloudflare

### 1.1 Login to Cloudflare

1. Go to **https://dash.cloudflare.com/**
2. Login with your Cloudflare account
3. If you don't have an account, click "Sign Up" and create one (free)

### 1.2 Add Your Site

1. Click **"Add a Site"** button (blue button on the dashboard)
2. Enter your domain: `meauxbility.org`
3. Click **"Add site"**

### 1.3 Select Plan

1. Choose **"Free"** plan (or higher if preferred)
2. Click **"Continue"**

### 1.4 DNS Record Scan

1. Cloudflare will scan your existing DNS records
2. This may take a few minutes
3. Review the scanned records
4. Click **"Continue"**

**Note**: We'll configure the correct DNS records in the next step, so don't worry if the scan doesn't find the right records.

### 1.5 Get Nameservers

1. Cloudflare will assign you two nameservers
2. **IMPORTANT**: Copy these nameservers - you'll need them later
3. Example format:
   ```
   ava.ns.cloudflare.com
   ben.ns.cloudflare.com
   ```
4. Save these in a safe place
5. Click **"Continue"** (don't update nameservers yet)

---

## Step 2: Configure DNS Records

### 2.1 Navigate to DNS

1. In your Cloudflare dashboard, select **meauxbility.org**
2. Click **"DNS"** in the left sidebar
3. Click **"Records"** tab

### 2.2 Remove Incorrect Records (if any)

If the DNS scan imported incorrect records:

1. Find any existing A or CNAME records for `@` or `www`
2. Click the **three dots** (⋯) next to each record
3. Click **"Delete"**
4. Confirm deletion

### 2.3 Add A Record for Apex Domain

1. Click **"Add record"**
2. Configure as follows:
   - **Type**: `A`
   - **Name**: `@` (represents apex domain)
   - **IPv4 address**: `76.76.21.21` (Vercel's IP)
   - **Proxy status**: ☁️ **Proxied** (orange cloud, not gray)
   - **TTL**: Auto
3. Click **"Save"**

### 2.4 Add CNAME Record for WWW Subdomain

1. Click **"Add record"** again
2. Configure as follows:
   - **Type**: `CNAME`
   - **Name**: `www`
   - **Target**: `cname.vercel-dns.com`
   - **Proxy status**: ☁️ **Proxied** (orange cloud)
   - **TTL**: Auto
3. Click **"Save"**

### 2.5 Verify DNS Records

You should now see:

| Type | Name | Content | Proxy status | TTL |
|------|------|---------|--------------|-----|
| A | meauxbility.org | 76.76.21.21 | Proxied | Auto |
| CNAME | www | cname.vercel-dns.com | Proxied | Auto |

**IMPORTANT**: Both records must be **Proxied** (orange cloud ☁️) for Cloudflare CDN and security features to work.

---

## Step 3: Configure SSL/TLS Settings

### 3.1 Navigate to SSL/TLS

1. Click **"SSL/TLS"** in the left sidebar
2. Click **"Overview"** tab

### 3.2 Set Encryption Mode

1. Find **"Your SSL/TLS encryption mode is:"**
2. Select **"Full (strict)"**
3. This ensures end-to-end encryption between visitors, Cloudflare, and Vercel

**Why Full (Strict)?**
- Vercel provides valid SSL certificates
- Full (Strict) requires a valid certificate on the origin
- This prevents man-in-the-middle attacks

### 3.3 Enable Always Use HTTPS

1. Click **"Edge Certificates"** tab
2. Scroll to **"Always Use HTTPS"**
3. Toggle to **ON** (should be blue/green)

### 3.4 Enable Automatic HTTPS Rewrites

1. In the same "Edge Certificates" tab
2. Scroll to **"Automatic HTTPS Rewrites"**
3. Toggle to **ON**

### 3.5 Set Minimum TLS Version

1. Scroll to **"Minimum TLS Version"**
2. Select **"TLS 1.2"** (recommended)
3. This ensures older, insecure protocols are not used

### 3.6 Enable TLS 1.3

1. Scroll to **"TLS 1.3"**
2. Toggle to **ON**
3. This enables the latest, most secure TLS version

### 3.7 Enable HTTP Strict Transport Security (HSTS)

1. Scroll to **"HTTP Strict Transport Security (HSTS)"**
2. Click **"Change"** or **"Enable HSTS"**
3. Read the warning carefully
4. Configure as follows:
   - **Status**: Enabled
   - **Max Age**: 6 months (recommended to start)
   - **Include subdomains**: ON
   - **Preload**: OFF (enable later after testing)
   - **No-Sniff header**: ON
5. Click **"Next"**
6. Acknowledge the warning
7. Click **"Enable HSTS"**

**⚠️ HSTS WARNING**: Once enabled and cached, visitors cannot access your site over HTTP for the specified duration. Ensure HTTPS is working correctly before enabling.

---

## Step 4: Configure Security Settings

### 4.1 Navigate to Security

1. Click **"Security"** in the left sidebar
2. Click **"Settings"** tab

### 4.2 Set Security Level

1. Find **"Security Level"**
2. Select **"Medium"** (good balance between security and usability)
3. This determines the sensitivity of the challenge system

### 4.3 Enable Bot Fight Mode

1. Scroll to **"Bot Fight Mode"**
2. Toggle to **ON**
3. This protects against simple bot attacks (free tier)

**Note**: For advanced bot protection, consider upgrading to Bot Management (paid feature).

### 4.4 Enable Browser Integrity Check

1. Scroll to **"Browser Integrity Check"**
2. Toggle to **ON**
3. This blocks known malicious browsers

### 4.5 Configure Challenge Passage

1. Scroll to **"Challenge Passage"**
2. Select **"1 hour"**
3. This sets how long a passed challenge is remembered

### 4.6 Enable Privacy Pass Support

1. Scroll to **"Privacy Pass Support"**
2. Toggle to **ON**
3. This improves privacy for visitors who frequently face challenges

---

## Step 5: Configure Performance Settings

### 5.1 Navigate to Speed Settings

1. Click **"Speed"** in the left sidebar
2. Click **"Optimization"** tab

### 5.2 Enable Auto Minify

1. Find **"Auto Minify"**
2. Check all boxes:
   - ✅ **JavaScript**
   - ✅ **CSS**
   - ✅ **HTML**
3. This reduces file sizes for faster loading

### 5.3 Enable Brotli Compression

1. Scroll to **"Brotli"**
2. Toggle to **ON**
3. This enables better compression than gzip

### 5.4 Enable Early Hints

1. Scroll to **"Early Hints"**
2. Toggle to **ON**
3. This speeds up page loads by sending resource hints earlier

**Note**: Early Hints may require a paid plan depending on your account.

### 5.5 Configure Caching

1. Click **"Caching"** in the left sidebar
2. Click **"Configuration"** tab
3. Find **"Browser Cache TTL"**
4. Select **"Respect Existing Headers"**
5. This lets Vercel control cache headers

### 5.6 Enable Always Online

1. In the same "Caching" tab
2. Scroll to **"Always Online"**
3. Toggle to **ON**
4. This serves cached versions if your origin (Vercel) goes down

### 5.7 Enable HTTP/2 and HTTP/3

1. Click **"Network"** in the left sidebar
2. Find **"HTTP/2"**
3. Toggle to **ON** (usually enabled by default)
4. Find **"HTTP/3 (with QUIC)"**
5. Toggle to **ON**
6. Find **"0-RTT Connection Resumption"**
7. Toggle to **ON**

### 5.8 Enable WebSockets

1. In the same "Network" tab
2. Find **"WebSockets"**
3. Toggle to **ON**
4. This is important for real-time features

---

## Step 6: Create Page Rules

Page Rules allow you to customize Cloudflare's behavior for specific URLs. The free tier includes 3 page rules.

### 6.1 Navigate to Page Rules

1. Click **"Rules"** in the left sidebar
2. Click **"Page Rules"** tab
3. Click **"Create Page Rule"**

### 6.2 Page Rule 1: Redirect WWW to Apex

1. **URL Pattern**: `www.meauxbility.org/*`
2. Click **"Add a Setting"**
3. Select **"Forwarding URL"**
4. **Status Code**: `301 - Permanent Redirect`
5. **Destination URL**: `https://meauxbility.org/$1`
6. Click **"Save and Deploy"**

**What this does**: Redirects www.meauxbility.org to meauxbility.org permanently.

### 6.3 Page Rule 2: Bypass Cache for API Routes

1. Click **"Create Page Rule"**
2. **URL Pattern**: `meauxbility.org/api/*`
3. Click **"Add a Setting"**
4. Select **"Cache Level"**
5. Choose **"Bypass"**
6. Click **"Save and Deploy"**

**What this does**: Ensures API routes always fetch fresh data from Vercel.

### 6.4 Page Rule 3: Cache Static Assets

1. Click **"Create Page Rule"**
2. **URL Pattern**: `meauxbility.org/_next/static/*`
3. Click **"Add a Setting"**
4. Select **"Cache Level"**
5. Choose **"Cache Everything"**
6. Click **"Add a Setting"** again
7. Select **"Edge Cache TTL"**
8. Enter **"1 month"** (or select from dropdown)
9. Click **"Save and Deploy"**

**What this does**: Aggressively caches Next.js static assets for 30 days.

### 6.5 Reorder Page Rules (if needed)

Page rules are processed in order, so ensure they're in the correct priority:

1. **Priority 1**: www redirect
2. **Priority 2**: API bypass
3. **Priority 3**: Static asset caching

Use the **up/down arrows** to reorder if needed.

---

## Step 7: Enable Web Analytics

### 7.1 Navigate to Web Analytics

1. Click on your profile icon (top right)
2. Select **"Analytics & Logs"** → **"Web Analytics"**
3. Or go directly to: https://dash.cloudflare.com/[account_id]/analytics-and-logs/web-analytics

### 7.2 Add Site to Web Analytics

1. Click **"Add a site"**
2. Enter **Hostname**: `meauxbility.org`
3. Toggle **"Automatic setup"** to **ON**
4. Click **"Add site"**

### 7.3 Install Beacon (if automatic setup doesn't work)

1. Copy the **JavaScript beacon code** provided
2. Add it to your Next.js app's `<head>` section
3. Example: Add to `app/layout.tsx` or `_document.tsx`

```typescript
// In app/layout.tsx or _app.tsx
<Script
  defer
  src='https://static.cloudflareinsights.com/beacon.min.js'
  data-cf-beacon='{"token": "YOUR_TOKEN_HERE"}'
/>
```

---

## Step 8: Update Nameservers

This is the **final and most critical step**. Your domain won't be active on Cloudflare until you update nameservers at your domain registrar.

### 8.1 Find Your Registrar

Where did you purchase meauxbility.org? Common registrars:
- GoDaddy
- Namecheap
- Google Domains (now Squarespace)
- Cloudflare Registrar
- Hover
- Name.com

### 8.2 Update Nameservers at Registrar

**This process varies by registrar. General steps:**

1. Login to your domain registrar
2. Find your domain management page
3. Look for "Nameservers", "DNS Settings", or "Name Server Settings"
4. Change from current nameservers to Cloudflare nameservers
5. Replace with the two nameservers Cloudflare assigned (from Step 1.5)
   ```
   Example:
   ava.ns.cloudflare.com
   ben.ns.cloudflare.com
   ```
6. Save changes

**Specific Guides by Registrar:**

- **GoDaddy**: https://www.godaddy.com/help/change-nameservers-for-my-domains-664
- **Namecheap**: https://www.namecheap.com/support/knowledgebase/article.aspx/767/10/how-to-change-dns-for-a-domain/
- **Google Domains**: https://support.google.com/domains/answer/3290309
- **Hover**: https://help.hover.com/hc/en-us/articles/217282477-How-to-Change-Your-Nameservers

### 8.3 Verify Nameserver Update

After updating nameservers (can take 24-48 hours):

```bash
# Check nameservers
dig +short meauxbility.org NS

# Expected output (your Cloudflare nameservers):
# ava.ns.cloudflare.com.
# ben.ns.cloudflare.com.
```

### 8.4 Wait for Cloudflare Confirmation

1. Return to Cloudflare dashboard
2. You should see a banner: "Checking nameservers..."
3. Once confirmed, you'll see: "Great news! Cloudflare is now protecting your site"
4. This can take 24-48 hours

---

## Verification

### Check DNS Propagation

```bash
# Check A record
dig +short meauxbility.org A
# Expected: 76.76.21.21 (or Cloudflare proxy IP)

# Check CNAME
dig +short www.meauxbility.org CNAME
# Expected: cname.vercel-dns.com.

# Check nameservers
dig +short meauxbility.org NS
# Expected: Your Cloudflare nameservers
```

### Check HTTPS

```bash
# Test HTTPS connectivity
curl -I https://meauxbility.org

# Expected: HTTP/2 200 (or similar success status)
```

### Test Security Headers

```bash
curl -I https://meauxbility.org | grep -i security
```

### Online Tools

1. **DNS Propagation**: https://www.whatsmydns.net/#A/meauxbility.org
2. **SSL Test**: https://www.ssllabs.com/ssltest/analyze.html?d=meauxbility.org
3. **Security Headers**: https://securityheaders.com/?q=https://meauxbility.org
4. **Performance**: https://pagespeed.web.dev/?url=https://meauxbility.org

---

## Troubleshooting

### Nameservers Not Updating

- **Issue**: Nameserver check fails after 48 hours
- **Solution**:
  1. Double-check nameservers at registrar
  2. Ensure you updated the correct domain
  3. Some registrars have a "lock" - ensure domain is unlocked
  4. Contact registrar support if still not working

### SSL Errors

- **Issue**: "Your connection is not private" or similar SSL errors
- **Solution**:
  1. Ensure SSL mode is "Full (Strict)" in Cloudflare
  2. Wait 24 hours for SSL propagation
  3. Check Vercel has provisioned SSL certificate
  4. Clear browser cache

### Redirect Loops

- **Issue**: "Too many redirects" error
- **Solution**:
  1. Change SSL mode from "Flexible" to "Full (Strict)"
  2. Disable "Always Use HTTPS" temporarily
  3. Check no conflicting redirects in Vercel
  4. Clear browser cache and cookies

### Page Rules Not Working

- **Issue**: www still accessible or API being cached
- **Solution**:
  1. Check page rule priority (order matters)
  2. Purge Cloudflare cache: Caching → Configuration → Purge Everything
  3. Wait a few minutes for rules to propagate
  4. Test in incognito mode

---

## Next Steps

After completing Cloudflare setup:

1. ✅ Proceed to **Vercel domain configuration** (see 02-MANUAL-VERCEL-SETUP.md)
2. ✅ Deploy Cloudflare Worker for security headers (see workers/README.md)
3. ✅ Set up monitoring and alerts
4. ✅ Test accessibility features
5. ✅ Run performance benchmarks

---

**Document Version**: 1.0
**Last Updated**: 2025-11-16
**Estimated Time**: 45-60 minutes (plus 24-48 hours for DNS propagation)
**Difficulty**: Intermediate
**For Project**: meauxbility.org Cloudflare + Vercel Integration
