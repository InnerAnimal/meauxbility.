# Manual Vercel Domain Setup Guide for meauxbility.org

This guide provides step-by-step instructions for adding custom domains to your Vercel project through the web dashboard.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Access Vercel Dashboard](#step-1-access-vercel-dashboard)
3. [Step 2: Navigate to Project Settings](#step-2-navigate-to-project-settings)
4. [Step 3: Add Custom Domains](#step-3-add-custom-domains)
5. [Step 4: Configure Domain Settings](#step-4-configure-domain-settings)
6. [Step 5: Verify SSL Certificates](#step-5-verify-ssl-certificates)
7. [Step 6: Test Your Deployment](#step-6-test-your-deployment)
8. [Verification](#verification)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- ✅ Vercel account
- ✅ Project deployed on Vercel (meauxbility.org Next.js app)
- ✅ Cloudflare DNS configured (see 01-MANUAL-CLOUDFLARE-SETUP.md)
- ✅ DNS records propagated (at least the initial setup)

---

## Step 1: Access Vercel Dashboard

### 1.1 Login to Vercel

1. Go to **https://vercel.com/**
2. Click **"Login"** (top right)
3. Sign in with your account:
   - GitHub
   - GitLab
   - Bitbucket
   - Email

### 1.2 Find Your Project

1. You should see your projects on the dashboard
2. Look for **"meauxbility"** or **"meauxbility.org"**
3. If you don't see it:
   - Check you're in the correct team (top-left dropdown)
   - Search for it using the search bar

---

## Step 2: Navigate to Project Settings

### 2.1 Open Project

1. Click on your **meauxbility.org** project
2. You'll see the project overview with recent deployments

### 2.2 Access Settings

1. Click **"Settings"** tab at the top
2. You should see various setting categories in the left sidebar

### 2.3 Navigate to Domains

1. In the left sidebar, click **"Domains"**
2. You'll see a list of current domains (likely just the Vercel auto-generated domain)
3. Example: `meauxbility-org-xxxxx.vercel.app`

---

## Step 3: Add Custom Domains

### 3.1 Add Apex Domain

1. In the **"Domains"** section, find the input field
2. Enter: `meauxbility.org` (without www)
3. Click **"Add"**

### 3.2 Domain Verification

Vercel will check if the domain is configured correctly:

**Scenario A: Domain is Ready**
- ✅ If DNS is already configured in Cloudflare, Vercel will verify it immediately
- ✅ You'll see a success message
- ✅ Skip to Step 3.5

**Scenario B: Domain Not Configured**
- ⚠️ Vercel will show DNS configuration instructions
- ⚠️ This means Cloudflare DNS isn't set up yet or hasn't propagated
- **Solution**: Return to Cloudflare setup and ensure:
  - A record for `@` points to `76.76.21.21` (proxied)
  - DNS has propagated (check with `dig meauxbility.org`)
- Click **"Refresh"** in Vercel after fixing DNS

**Scenario C: Domain Already in Use**
- ❌ Error: "Domain is already in use by another project"
- **Solution**:
  - Remove domain from other Vercel project first
  - Or use a different Vercel account

### 3.3 Domain Added Successfully

Once added, you should see:
- Domain: `meauxbility.org`
- Status: Valid Configuration ✓
- SSL: Certificate Pending (or Issued)

### 3.4 Add WWW Subdomain

1. In the same input field, enter: `www.meauxbility.org`
2. Click **"Add"**
3. Vercel will verify the CNAME record
4. If Cloudflare DNS is configured, it should verify immediately

### 3.5 Check Domain List

You should now see:

| Domain | Redirect | SSL |
|--------|----------|-----|
| meauxbility.org | - | ✓ |
| www.meauxbility.org | Redirect to meauxbility.org | ✓ |

**Note**: Vercel automatically configures www to redirect to apex domain if both are added.

---

## Step 4: Configure Domain Settings

### 4.1 Set Production Domain

1. Find `meauxbility.org` in the domain list
2. Click the **three dots** (⋯) next to it
3. Select **"Set as Production Domain"** (if not already)
4. Confirm

**What this does**: Production domain is the primary domain used for production deployments.

### 4.2 Configure WWW Redirect

1. Find `www.meauxbility.org` in the domain list
2. Click the **three dots** (⋯)
3. Verify it shows **"Redirects to meauxbility.org"**
4. If not, select **"Edit"** → **"Redirect to"** → Select `meauxbility.org`

**Note**: This is a Vercel-level redirect. Combined with the Cloudflare Page Rule, you have double protection.

### 4.3 Remove Vercel Auto-Generated Domain (Optional)

If you want to hide the `.vercel.app` domain:

1. Find `meauxbility-org-xxxxx.vercel.app` in the domain list
2. **DON'T DELETE IT** - it's needed for deployments
3. To hide it from search engines:
   - Add `robots.txt` with disallow rule for `.vercel.app` domains
   - Or use Vercel's built-in "Deployment Protection"

### 4.4 Git Branch Domains (Optional)

If you want preview domains for branches:

1. Scroll down in the Domains section
2. Find **"Git Branch Domains"**
3. Add branches you want custom domains for (e.g., `staging`, `dev`)
4. Example: `staging.meauxbility.org` → `staging` branch

---

## Step 5: Verify SSL Certificates

### 5.1 Check Certificate Status

1. In the Domains section, look at the **SSL** column
2. Each domain should show ✓ or a status

**Possible SSL Statuses:**

- ✅ **Valid Certificate**: SSL is active and working
- ⏳ **Pending**: Certificate is being provisioned (wait 5-10 minutes)
- ⏳ **Issuing**: Certificate issuance in progress
- ❌ **Failed**: Certificate couldn't be issued (see troubleshooting)

### 5.2 Wait for Certificate Provisioning

If status is "Pending" or "Issuing":

1. Wait 5-10 minutes
2. Refresh the page
3. Certificate should be issued automatically

**SSL Certificate Details:**
- **Provider**: Let's Encrypt (via Vercel)
- **Renewal**: Automatic
- **Wildcard**: No (specific domains only)
- **Validity**: 90 days (auto-renewed)

### 5.3 Force SSL Refresh (if needed)

If SSL is stuck in "Pending" for more than 30 minutes:

1. Click the **three dots** (⋯) next to the domain
2. Select **"Renew Certificate"**
3. Confirm
4. Wait 5-10 minutes

---

## Step 6: Test Your Deployment

### 6.1 Test Apex Domain

1. Open a new browser tab
2. Go to: **https://meauxbility.org**
3. Your site should load with:
   - ✅ Valid SSL certificate (🔒 padlock in address bar)
   - ✅ Fast loading (thanks to Cloudflare CDN)
   - ✅ No errors in browser console

### 6.2 Test WWW Redirect

1. Go to: **https://www.meauxbility.org**
2. You should be redirected to: **https://meauxbility.org**
3. Check the address bar - should show `meauxbility.org` (without www)

### 6.3 Test HTTP to HTTPS Redirect

1. Go to: **http://meauxbility.org** (without 's')
2. Should automatically redirect to: **https://meauxbility.org**
3. This is handled by Cloudflare's "Always Use HTTPS" setting

### 6.4 Check Browser Developer Tools

1. On **https://meauxbility.org**, open DevTools (F12)
2. Go to **Network** tab
3. Refresh the page
4. Check the first request:
   - **Status**: 200 OK
   - **Protocol**: h2 (HTTP/2) or h3 (HTTP/3)
   - **Security**: View certificate (should be valid)

### 6.5 Test Different Pages

1. Navigate to different routes:
   - `/` (home page)
   - `/about` (if it exists)
   - `/api/*` (API routes, if any)
2. Ensure all routes work correctly
3. Check for any 404 or 500 errors

---

## Verification

### Command-Line Tests

```bash
# Test DNS resolution
dig +short meauxbility.org A
# Should return Cloudflare proxy IP or Vercel IP

# Test HTTPS
curl -I https://meauxbility.org
# Should return HTTP/2 200

# Test www redirect
curl -I https://www.meauxbility.org
# Should show 301 or 307 redirect to apex

# Test HTTP to HTTPS redirect
curl -I http://meauxbility.org
# Should show 301 redirect to https://

# Check SSL certificate
openssl s_client -connect meauxbility.org:443 -servername meauxbility.org < /dev/null 2>/dev/null | openssl x509 -noout -text
# Should show valid certificate details
```

### Online Tools

1. **SSL Test**:
   - https://www.ssllabs.com/ssltest/analyze.html?d=meauxbility.org
   - Should get A or A+ rating

2. **Security Headers**:
   - https://securityheaders.com/?q=https://meauxbility.org
   - Should show security headers (especially if Worker is deployed)

3. **DNS Check**:
   - https://www.whatsmydns.net/#A/meauxbility.org
   - Should show consistent results globally

4. **Performance**:
   - https://pagespeed.web.dev/?url=https://meauxbility.org
   - Should score well on all metrics

### Vercel Dashboard Checks

1. **Deployments Tab**:
   - Go to project → Deployments
   - Latest deployment should show "Production" badge
   - Domain should be `meauxbility.org`

2. **Analytics** (if enabled):
   - Check traffic is coming through custom domain
   - Verify no errors in production

3. **Logs** (if needed):
   - View → Runtime Logs
   - Check for any errors or warnings

---

## Troubleshooting

### Domain Not Verifying

**Issue**: "Invalid configuration" error when adding domain

**Possible Causes & Solutions**:

1. **DNS not propagated yet**
   ```bash
   # Check DNS
   dig meauxbility.org A
   # If it doesn't return Vercel IP or Cloudflare proxy, DNS isn't ready
   ```
   - Solution: Wait for DNS propagation (up to 48 hours)
   - Solution: Double-check Cloudflare DNS records

2. **DNS records not proxied in Cloudflare**
   - Solution: Ensure both A and CNAME records are "Proxied" (orange cloud)

3. **Cloudflare SSL mode incorrect**
   - Solution: Set SSL/TLS mode to "Full (Strict)" in Cloudflare

4. **Domain locked at registrar**
   - Solution: Unlock domain in registrar settings

### SSL Certificate Not Issuing

**Issue**: SSL status stuck on "Pending" or "Failed"

**Solutions**:

1. **Wait longer**
   - Can take up to 24 hours in some cases
   - Usually only takes 5-10 minutes

2. **Check DNS**
   ```bash
   dig meauxbility.org A
   # Must resolve correctly for SSL to issue
   ```

3. **Disable Cloudflare proxy temporarily**
   - In Cloudflare DNS, toggle from "Proxied" to "DNS only" (gray cloud)
   - Wait 5 minutes
   - Click "Renew Certificate" in Vercel
   - After SSL issues, re-enable proxy in Cloudflare

4. **Check CAA records**
   ```bash
   dig meauxbility.org CAA
   # If CAA records exist, ensure Let's Encrypt is allowed
   ```
   - Solution: Add CAA record: `0 issue "letsencrypt.org"`

5. **Remove and re-add domain**
   - Remove domain from Vercel
   - Wait 5 minutes
   - Add it again

### Redirect Loop

**Issue**: "Too many redirects" when accessing site

**Causes & Solutions**:

1. **Cloudflare SSL mode is "Flexible"**
   - Solution: Change to "Full (Strict)" in Cloudflare

2. **Conflicting redirects**
   - Check: Cloudflare Page Rules
   - Check: Vercel domain redirects
   - Check: Next.js middleware or redirects in code
   - Solution: Remove duplicate redirects

3. **Always Use HTTPS causing conflict**
   - Solution: Temporarily disable in Cloudflare
   - Test if issue resolves
   - If yes, check Vercel HTTPS settings

### WWW Not Redirecting

**Issue**: www.meauxbility.org doesn't redirect to apex

**Solutions**:

1. **Check Cloudflare Page Rule**
   - Ensure Page Rule for `www.meauxbility.org/*` → `https://meauxbility.org/$1` is active
   - Priority should be 1 (highest)

2. **Check Vercel domain settings**
   - Ensure www domain shows "Redirects to meauxbility.org"

3. **Purge Cloudflare cache**
   - Cloudflare dashboard → Caching → Purge Everything

4. **Test in incognito mode**
   - Browser cache might show old version

### Site Not Loading / 404 Error

**Issue**: Domain resolves but shows 404 or "Deployment Not Found"

**Solutions**:

1. **Check production domain**
   - Vercel Settings → Domains
   - Ensure `meauxbility.org` is set as production domain

2. **Check deployment status**
   - Vercel → Deployments tab
   - Ensure latest deployment is successful
   - Ensure it's assigned to production domain

3. **Redeploy**
   - Trigger a new deployment
   - Or manually redeploy latest: Deployments → ⋯ → Redeploy

4. **Check Vercel project settings**
   - Settings → General
   - Ensure "Root Directory" is correct
   - Ensure "Framework Preset" is set to Next.js

---

## Advanced Configuration

### Environment Variables for Domain

If you need to use domain in environment variables:

1. Settings → Environment Variables
2. Add new variable:
   - **Name**: `NEXT_PUBLIC_SITE_URL`
   - **Value**: `https://meauxbility.org`
   - **Environment**: Production, Preview, Development
3. Redeploy for changes to take effect

### Custom Headers

If not using Cloudflare Worker, you can add headers in Vercel:

1. Create/edit `vercel.json` in your project root:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

2. Commit and push changes
3. Vercel will redeploy automatically

**Note**: If using Cloudflare Worker for headers, you don't need this.

### Preview Deployments

Configure preview domains for branches:

1. Settings → Git
2. Ensure "Automatic Preview Deployments" is ON
3. Each PR will get a unique preview URL: `meauxbility-git-<branch>-<team>.vercel.app`

---

## Next Steps

After completing Vercel domain setup:

1. ✅ Deploy Cloudflare Worker for security headers (see workers/README.md)
2. ✅ Set up Vercel Analytics (Settings → Analytics)
3. ✅ Configure environment variables
4. ✅ Set up Git integration for auto-deployments
5. ✅ Configure preview deployments for branches
6. ✅ Add sitemap and robots.txt
7. ✅ Set up monitoring (Vercel Analytics, Sentry, etc.)

---

## Summary Checklist

- [ ] Logged into Vercel dashboard
- [ ] Navigated to meauxbility.org project settings
- [ ] Added `meauxbility.org` custom domain
- [ ] Added `www.meauxbility.org` custom domain
- [ ] Set `meauxbility.org` as production domain
- [ ] Verified www redirects to apex
- [ ] Confirmed SSL certificates issued (✓ for both domains)
- [ ] Tested https://meauxbility.org loads correctly
- [ ] Tested https://www.meauxbility.org redirects to apex
- [ ] Tested HTTP to HTTPS redirect works
- [ ] Verified SSL certificate in browser (🔒)
- [ ] Checked deployment logs for errors
- [ ] Ran online SSL and security tests

---

**Document Version**: 1.0
**Last Updated**: 2025-11-16
**Estimated Time**: 15-30 minutes
**Difficulty**: Beginner to Intermediate
**For Project**: meauxbility.org Cloudflare + Vercel Integration
