# Comprehensive Troubleshooting Guide

Complete troubleshooting reference for common issues when integrating Cloudflare with Vercel for meauxbility.org.

---

## Table of Contents

1. [DNS Issues](#dns-issues)
2. [SSL/TLS Certificate Issues](#ssltls-certificate-issues)
3. [Redirect Loop Issues](#redirect-loop-issues)
4. [Page Not Loading Issues](#page-not-loading-issues)
5. [Performance Issues](#performance-issues)
6. [Security Header Issues](#security-header-issues)
7. [Cloudflare-Specific Issues](#cloudflare-specific-issues)
8. [Vercel-Specific Issues](#vercel-specific-issues)
9. [Worker Issues](#worker-issues)
10. [Emergency Procedures](#emergency-procedures)

---

## DNS Issues

### Issue: DNS Not Propagating

**Symptoms:**
- Domain doesn't resolve after 24-48 hours
- `dig meauxbility.org` returns NXDOMAIN or no results
- Some regions show correct DNS, others don't

**Diagnosis:**
```bash
# Check current nameservers
dig +short meauxbility.org NS

# Check DNS globally
# Visit: https://www.whatsmydns.net/#NS/meauxbility.org

# Check if authoritative nameservers respond
dig @ava.ns.cloudflare.com meauxbility.org A
```

**Solutions:**

1. **Verify Nameservers at Registrar**
   - Login to domain registrar
   - Check nameserver settings
   - Ensure Cloudflare nameservers are correctly entered
   - Remove any trailing dots or spaces

2. **Check Domain Lock Status**
   - Some registrars lock domains by default
   - Unlock domain in registrar settings
   - Wait 15 minutes and try again

3. **Clear Local DNS Cache**
   ```bash
   # Linux
   sudo systemd-resolve --flush-caches

   # macOS
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

   # Windows
   ipconfig /flushdns
   ```

4. **Use Alternative DNS Server**
   ```bash
   # Test with Google DNS
   dig @8.8.8.8 meauxbility.org A

   # Test with Cloudflare DNS
   dig @1.1.1.1 meauxbility.org A
   ```

5. **Check Cloudflare Dashboard**
   - Ensure zone status is "Active" (not "Pending")
   - If "Pending", nameservers aren't updated yet
   - Cloudflare shows expected vs actual nameservers

**Prevention:**
- Document original nameservers before changing
- Allow full 48 hours for global propagation
- Use DNS propagation checkers to monitor progress

---

### Issue: Wrong DNS Records

**Symptoms:**
- Site loads but shows wrong content
- Old website still appears
- 404 errors on all pages

**Diagnosis:**
```bash
# Check what IP the domain resolves to
dig +short meauxbility.org A

# Expected: 76.76.21.21 OR Cloudflare proxy IP
# Wrong: Your old hosting IP or something else

# Check CNAME for www
dig +short www.meauxbility.org CNAME
# Expected: cname.vercel-dns.com.
```

**Solutions:**

1. **Update DNS Records in Cloudflare**
   - Go to Cloudflare Dashboard → DNS → Records
   - Delete incorrect A record
   - Add: Type A, Name @, Content 76.76.21.21, Proxied ON
   - Add: Type CNAME, Name www, Content cname.vercel-dns.com, Proxied ON

2. **Purge Cloudflare Cache**
   - Cloudflare Dashboard → Caching → Configuration
   - Click "Purge Everything"
   - Wait 5 minutes

3. **Clear Browser Cache**
   - Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
   - Or open in incognito mode

4. **Check for Old DNS Records**
   - Some registrars keep DNS records even after changing nameservers
   - Ensure no conflicting A or CNAME records at registrar

**Prevention:**
- Document DNS records before migration
- Use Cloudflare's import during zone creation
- Double-check records after setup

---

### Issue: DNS Records Not Proxied

**Symptoms:**
- Site works but Cloudflare features (caching, security) don't work
- Security headers missing
- Cache status always shows MISS

**Diagnosis:**
```bash
# Check if DNS returns Cloudflare IP or Vercel IP
dig +short meauxbility.org A

# If returns 76.76.21.21 → Not proxied
# If returns Cloudflare IP (104.x.x.x, etc.) → Proxied correctly
```

**Solutions:**

1. **Enable Proxy in Cloudflare**
   - Cloudflare Dashboard → DNS → Records
   - Click on A record for @ (apex)
   - Toggle proxy status to ON (orange cloud ☁️)
   - Click Save
   - Repeat for CNAME record (www)

2. **Wait for DNS Update**
   - Changes take 5-10 minutes to propagate
   - Purge DNS cache (see above)
   - Test again

**Why This Matters:**
- Without proxy, traffic goes directly to Vercel
- Cloudflare features (WAF, caching, Workers) won't work
- Security headers won't be added

**Prevention:**
- Always enable proxy (orange cloud) for web traffic
- Only use "DNS only" (gray cloud) for mail servers or specific services

---

## SSL/TLS Certificate Issues

### Issue: SSL Certificate Not Issuing

**Symptoms:**
- "Your connection is not private" error
- SSL status in Vercel shows "Pending" for hours
- ERR_CERT_AUTHORITY_INVALID in browser

**Diagnosis:**
```bash
# Check if domain resolves
dig +short meauxbility.org A

# Test SSL connection
openssl s_client -connect meauxbility.org:443 -servername meauxbility.org

# Check Vercel domain status
# Vercel Dashboard → Domains → Check SSL column
```

**Solutions:**

1. **Ensure DNS is Correct**
   - Domain must resolve to Vercel (or Cloudflare proxy)
   - Vercel can't issue SSL if DNS doesn't point to them
   - Wait for DNS propagation if you just updated records

2. **Temporarily Disable Cloudflare Proxy**
   - Cloudflare Dashboard → DNS → Records
   - Toggle A record from Proxied to DNS Only (gray cloud)
   - Wait 5 minutes
   - Vercel Dashboard → Domains → Renew Certificate
   - After SSL issues, re-enable proxy in Cloudflare

3. **Check CAA Records**
   ```bash
   dig meauxbility.org CAA
   ```
   - If CAA records exist, ensure Let's Encrypt is allowed
   - Add CAA record: `0 issue "letsencrypt.org"`
   - Or remove restrictive CAA records

4. **Remove and Re-Add Domain in Vercel**
   - Vercel Dashboard → Settings → Domains
   - Remove meauxbility.org
   - Wait 5 minutes
   - Add it again
   - SSL should provision automatically

5. **Check Cloudflare SSL Mode**
   - Cloudflare Dashboard → SSL/TLS → Overview
   - Must be "Full" or "Full (strict)"
   - NOT "Flexible" or "Off"

6. **Wait Longer**
   - SSL can take up to 24 hours in rare cases
   - Usually only takes 5-10 minutes
   - Check back periodically

**Prevention:**
- Ensure DNS is working before adding domain to Vercel
- Use "Full (strict)" SSL mode from the start
- Don't change DNS while SSL is provisioning

---

### Issue: SSL Certificate Expired or Invalid

**Symptoms:**
- ERR_CERT_DATE_INVALID
- Certificate shows expired date
- Browser warning about invalid certificate

**Diagnosis:**
```bash
# Check certificate dates
openssl s_client -connect meauxbility.org:443 -servername meauxbility.org < /dev/null 2>/dev/null | openssl x509 -noout -dates

# Check certificate issuer
openssl s_client -connect meauxbility.org:443 -servername meauxbility.org < /dev/null 2>/dev/null | openssl x509 -noout -issuer
```

**Solutions:**

1. **Renew Certificate in Vercel**
   - Vercel Dashboard → Settings → Domains
   - Click three dots next to domain
   - Select "Renew Certificate"
   - Wait 5-10 minutes

2. **Check System Time**
   - Ensure your computer's date/time is correct
   - Incorrect system time can cause SSL errors

3. **Clear Browser Cache**
   - Browser may have cached old certificate
   - Hard refresh or use incognito mode

4. **Renew Cloudflare Universal SSL** (if applicable)
   - Cloudflare Dashboard → SSL/TLS → Edge Certificates
   - Check Universal SSL status
   - Should auto-renew, but can manually trigger if needed

**Prevention:**
- Vercel auto-renews SSL certificates
- Cloudflare auto-renews Universal SSL
- Set up monitoring to alert on expiring certificates

---

### Issue: Mixed Content Warnings

**Symptoms:**
- Padlock shows warning icon (not green)
- Console shows "Mixed Content" errors
- Some resources load over HTTP instead of HTTPS

**Diagnosis:**
- Open browser DevTools → Console
- Look for: "Mixed Content" warnings
- Check which resources are loading over HTTP

**Solutions:**

1. **Enable Automatic HTTPS Rewrites in Cloudflare**
   - Cloudflare Dashboard → SSL/TLS → Edge Certificates
   - Toggle "Automatic HTTPS Rewrites" to ON

2. **Update Hardcoded HTTP URLs in Code**
   - Search codebase for `http://` (without 's')
   - Replace with `https://` or use protocol-relative URLs `//`
   - Or use relative paths `/images/photo.jpg`

3. **Use Content Security Policy**
   - Add CSP header: `upgrade-insecure-requests`
   - This automatically upgrades HTTP to HTTPS
   - Included in provided Cloudflare Worker

4. **Check Third-Party Resources**
   - Ensure all CDN links use HTTPS
   - Update embed codes from external services
   - Replace HTTP iframes with HTTPS versions

**Prevention:**
- Always use HTTPS URLs in code
- Use environment variables for API endpoints
- Enable "Automatic HTTPS Rewrites" from day one

---

## Redirect Loop Issues

### Issue: Too Many Redirects (ERR_TOO_MANY_REDIRECTS)

**Symptoms:**
- Browser shows "ERR_TOO_MANY_REDIRECTS"
- Page never loads, just keeps redirecting
- Happens on all pages or specific routes

**Diagnosis:**
```bash
# Test redirect chain
curl -I -L https://meauxbility.org | grep -i "HTTP/\|Location"

# Check if loop exists
# Should see: HTTP/1.1 200 OK
# Should NOT see: Multiple 301/302 redirects to same URL
```

**Solutions:**

1. **Fix Cloudflare SSL Mode** (Most Common)
   - Cloudflare Dashboard → SSL/TLS → Overview
   - Change from "Flexible" to "Full (strict)"
   - This is the #1 cause of redirect loops
   - Wait 5 minutes and test

2. **Check for Conflicting Redirects**
   - Cloudflare Page Rules redirecting to HTTPS
   - Vercel also enforcing HTTPS
   - Next.js middleware doing redirects
   - **Solution**: Remove duplicate redirects, keep only one

3. **Disable "Always Use HTTPS" Temporarily**
   - Cloudflare Dashboard → SSL/TLS → Edge Certificates
   - Toggle "Always Use HTTPS" to OFF
   - Test if loop resolves
   - If yes, conflict is with Vercel HTTPS enforcement
   - Choose one or the other, not both

4. **Check Vercel Configuration**
   - Remove HTTPS redirects from vercel.json
   - Remove redirects from Next.js middleware
   - Let Cloudflare handle HTTPS redirection

5. **Clear All Caches**
   ```bash
   # Purge Cloudflare cache
   # Cloudflare Dashboard → Caching → Purge Everything

   # Clear browser cache
   # Hard refresh: Ctrl+F5 or Cmd+Shift+R
   ```

6. **Check for HSTS**
   - If HSTS is enabled and was previously on HTTP
   - Browser will force HTTPS even if you try HTTP
   - **Solution**: Clear browser HSTS settings
   - Chrome: chrome://net-internals/#hsts → Delete domain

**Prevention:**
- Always use "Full (strict)" SSL mode from the start
- Don't enable multiple HTTPS redirects
- Test in incognito mode when making redirect changes

---

## Page Not Loading Issues

### Issue: 404 Error on All Pages

**Symptoms:**
- Domain loads but shows Vercel 404 page
- "Deployment Not Found" or "This Deployment Cannot Be Found"
- Specific pages return 404

**Diagnosis:**
- Check Vercel Dashboard → Deployments
- Check which domains are assigned to deployments
- Verify production domain setting

**Solutions:**

1. **Set Production Domain in Vercel**
   - Vercel Dashboard → Settings → Domains
   - Find meauxbility.org
   - Click three dots → "Set as Production Domain"
   - Redeploy latest build

2. **Verify Deployment is Successful**
   - Vercel Dashboard → Deployments
   - Latest deployment should show "Ready"
   - If "Error", click to see build logs
   - Fix build errors and redeploy

3. **Check Domain Assignment**
   - Deployments → Click latest deployment
   - Check "Domains" section
   - Should include meauxbility.org
   - If not, something is wrong with domain configuration

4. **Redeploy Application**
   - Vercel Dashboard → Deployments
   - Find latest successful deployment
   - Click three dots → "Redeploy"
   - Or push new commit to trigger automatic deployment

5. **Check Next.js Routes**
   - Ensure pages exist in correct directory
   - Next.js App Router: `app/page.tsx`
   - Next.js Pages Router: `pages/index.tsx`
   - 404 for `/about` means no `app/about/page.tsx`

**Prevention:**
- Always set production domain when adding custom domain
- Monitor deployment status
- Test deployments before updating DNS

---

### Issue: 520 or 521 Error (Cloudflare Error)

**Symptoms:**
- "Error 520: Web server is returning an unknown error"
- "Error 521: Web server is down"
- Intermittent 520/521 errors

**Diagnosis:**
```bash
# Check if origin (Vercel) is accessible
curl -I https://meauxbility-org-xxxxx.vercel.app

# If returns 200, origin is fine → Cloudflare issue
# If timeout or error → Vercel/origin issue
```

**Solutions:**

1. **Check Vercel Status**
   - Visit: https://www.vercel-status.com/
   - If outage, wait for resolution
   - If no outage, continue troubleshooting

2. **Check Cloudflare SSL Mode**
   - Cloudflare Dashboard → SSL/TLS → Overview
   - Change from "Full" to "Full (strict)"
   - 521 often caused by SSL mismatch

3. **Disable Cloudflare Proxy Temporarily**
   - Cloudflare Dashboard → DNS → Records
   - Toggle A record to "DNS only" (gray cloud)
   - Test if site loads directly
   - If yes, issue is with Cloudflare proxy
   - If no, issue is with Vercel

4. **Check Cloudflare Firewall**
   - Cloudflare Dashboard → Security → WAF
   - Check if your IP or Vercel IPs are blocked
   - Add firewall rule to allow Vercel

5. **Contact Support**
   - If issue persists, contact Vercel support
   - Provide:
     - Domain name
     - Error code and time
     - Cloudflare Ray ID (shown in error message)

**Prevention:**
- Use "Full (strict)" SSL mode
- Monitor uptime with external service
- Set up alerts for 520/521 errors

---

### Issue: 500 Internal Server Error

**Symptoms:**
- Site returns 500 error
- "Application Error" page
- Specific routes cause 500

**Diagnosis:**
- Vercel Dashboard → Project → Logs
- Look for errors in runtime logs
- Check specific time of error

**Solutions:**

1. **Check Vercel Runtime Logs**
   - Vercel Dashboard → Project → Logs
   - Filter by time of error
   - Look for error stack traces
   - Fix code errors

2. **Check Environment Variables**
   - Settings → Environment Variables
   - Ensure all required vars are set
   - Redeploy after adding variables

3. **Check Build Logs**
   - Deployments → Click failed deployment
   - Review build logs for errors
   - Fix TypeScript/ESLint errors

4. **Rollback to Previous Deployment**
   - Deployments → Find last working deployment
   - Click three dots → "Promote to Production"
   - Fixes issue immediately while you debug

5. **Check API Route Issues** (if applicable)
   - API routes timing out
   - Database connection failures
   - External API failures
   - Add error handling and logging

**Prevention:**
- Test thoroughly in preview deployments
- Use TypeScript for type safety
- Add comprehensive error handling
- Monitor error rates

---

## Performance Issues

### Issue: Slow Page Load Times

**Symptoms:**
- PageSpeed score < 50
- Pages take > 3 seconds to load
- Images load slowly

**Diagnosis:**
- Test with: https://pagespeed.web.dev/?url=https://meauxbility.org
- Check Network tab in DevTools
- Identify slow resources

**Solutions:**

1. **Enable Cloudflare Performance Features**
   - Speed → Optimization → Auto Minify (HTML, CSS, JS)
   - Speed → Optimization → Brotli (ON)
   - Network → HTTP/3 (ON)
   - Network → 0-RTT (ON)

2. **Optimize Images**
   - Use Next.js `<Image>` component
   - Enable Vercel Image Optimization
   - Compress images before upload
   - Use WebP format

3. **Configure Caching Properly**
   - Page Rule for static assets: Cache Everything
   - Cloudflare Dashboard → Caching → Browser Cache TTL
   - Respect headers or set appropriate TTL

4. **Reduce JavaScript Bundle Size**
   - Run `npm run build` and check bundle size
   - Use dynamic imports for large components
   - Remove unused dependencies
   - Enable tree shaking

5. **Use Cloudflare Workers**
   - Deploy security headers worker
   - Inline critical CSS
   - Optimize font loading

6. **Check Third-Party Scripts**
   - Remove unnecessary analytics scripts
   - Load non-critical scripts asynchronously
   - Use `next/script` with `strategy="lazyOnload"`

**Prevention:**
- Regular performance audits
- Set performance budgets
- Optimize from day one

---

### Issue: Cache Not Working

**Symptoms:**
- CF-Cache-Status always shows MISS
- Static assets not cached
- Page Rule caching not working

**Diagnosis:**
```bash
# Check cache status
curl -I https://meauxbility.org/_next/static/css/app.css | grep -i "cf-cache-status"

# Should show: HIT (cached) or MISS (not cached)
```

**Solutions:**

1. **Check Page Rules**
   - Rules → Page Rules
   - Ensure rule for `meauxbility.org/_next/static/*`
   - Action: Cache Level = Cache Everything
   - Priority: Should be high (but after www redirect)

2. **Check Cache-Control Headers**
   - Cloudflare respects origin Cache-Control
   - If Vercel sets `no-cache`, Cloudflare won't cache
   - Override with Page Rule or Worker

3. **Purge and Test Again**
   - Caching → Configuration → Purge Everything
   - Wait 5 minutes
   - Test again (first request = MISS, second = HIT)

4. **Check Caching Level**
   - Caching → Configuration → Caching Level
   - Should be "Standard" or higher

5. **Bypass Cache for Testing**
   - Add query string: `?test=123`
   - Forces cache miss for testing
   - Remove query string for normal caching

**Prevention:**
- Set up Page Rules from the start
- Test caching with curl before going live
- Monitor cache hit rate in Cloudflare Analytics

---

## Security Header Issues

### Issue: Security Headers Not Showing

**Symptoms:**
- securityheaders.com shows grade D or F
- Missing CSP, HSTS, X-Frame-Options
- Worker deployed but headers not appearing

**Diagnosis:**
```bash
curl -I https://meauxbility.org | grep -i "security\|x-frame\|content-security"
```

**Solutions:**

1. **Verify Worker is Deployed**
   - Cloudflare Dashboard → Workers & Pages
   - Find meauxbility-security-headers
   - Check status: "Deployed"

2. **Check Worker Route**
   - Workers & Pages → meauxbility-security-headers → Triggers
   - Ensure route exists: `meauxbility.org/*`
   - Ensure route is enabled

3. **Test Worker Directly**
   - Workers & Pages → meauxbility-security-headers → Edit Code
   - Click "Save and Deploy"
   - Test immediately

4. **Check for Header Conflicts**
   - If headers set in both Vercel and Cloudflare
   - One may override the other
   - Choose one source of truth

5. **Review Worker Code**
   - Ensure headers are being set correctly
   - Check for JavaScript errors
   - View worker logs (paid feature)

6. **Purge Cache**
   - Headers may be cached
   - Caching → Purge Everything
   - Test again

**Prevention:**
- Deploy worker first, then test
- Use monitoring to alert on missing headers
- Regularly test with securityheaders.com

---

## Cloudflare-Specific Issues

### Issue: Zone Status Shows "Pending"

**Symptoms:**
- Cloudflare zone not activating
- Status stuck on "Pending Nameserver Update"
- Features not working

**Solutions:**

1. **Update Nameservers at Registrar**
   - This is the most common issue
   - Cloudflare cannot be "Active" until nameservers are updated
   - See "Step 8: Update Nameservers" in manual setup guide

2. **Verify Nameserver Update**
   ```bash
   dig +short meauxbility.org NS
   # Should show Cloudflare nameservers
   ```

3. **Wait for Propagation**
   - Can take up to 48 hours
   - Check periodically

4. **Contact Registrar Support**
   - If nameservers won't update after 48 hours
   - Some registrars have issues with Cloudflare

**Prevention:**
- Update nameservers as soon as you get them from Cloudflare
- Don't wait until other setup is complete

---

### Issue: Page Rules Not Working

**Symptoms:**
- www still loads instead of redirecting
- API routes are being cached
- Static assets not cached

**Diagnosis:**
- Test specific URL that should match rule
- Check if rule is enabled
- Verify rule order (priority)

**Solutions:**

1. **Check Rule Pattern**
   - Must match URL exactly
   - `www.meauxbility.org/*` matches www
   - `meauxbility.org/*` matches apex
   - `*.meauxbility.org/*` matches all subdomains

2. **Check Rule Priority**
   - Rules processed in order (1, 2, 3, ...)
   - More specific rules should be higher priority
   - Reorder if needed

3. **Purge Cloudflare Cache**
   - Page Rule changes don't purge cache
   - Must manually purge

4. **Test in Incognito**
   - Browser cache may show old behavior

5. **Check Free Tier Limit**
   - Free tier: 3 page rules
   - If you have > 3, older ones won't work
   - Delete unused rules or upgrade plan

**Prevention:**
- Test page rules after creation
- Document which URLs should match which rules
- Keep under free tier limits

---

## Vercel-Specific Issues

### Issue: Domain Shows "Invalid Configuration"

**Symptoms:**
- Domain added to Vercel but shows error
- Red X next to domain
- "Invalid Configuration" message

**Diagnosis:**
- Check DNS records in Cloudflare
- Verify domain is pointed correctly

**Solutions:**

1. **Verify DNS Records**
   ```bash
   dig +short meauxbility.org A
   # Should return Vercel IP or Cloudflare proxy IP
   ```

2. **Wait for DNS Propagation**
   - If you just updated DNS, wait 5-10 minutes
   - Click "Refresh" in Vercel

3. **Temporarily Disable Cloudflare Proxy**
   - Toggle DNS to "DNS only" (gray cloud)
   - Wait 5 minutes
   - Click "Refresh" in Vercel
   - Re-enable proxy after domain validates

4. **Remove and Re-Add Domain**
   - Remove domain from Vercel
   - Wait 5 minutes
   - Add again

**Prevention:**
- Ensure DNS is correct before adding domain to Vercel
- Wait for DNS propagation

---

### Issue: Preview Deployments Not Working

**Symptoms:**
- Pull requests don't create preview deployments
- Preview URLs return 404
- Git integration not working

**Solutions:**

1. **Check Git Integration**
   - Settings → Git
   - Ensure repository is connected
   - Re-authenticate if needed

2. **Enable Preview Deployments**
   - Settings → Git
   - "Automatic Preview Deployments" should be ON

3. **Check Build Settings**
   - Settings → General
   - Ensure build command is correct
   - Ensure output directory is correct

4. **Check Branch Protection**
   - Some branch protection rules block preview deployments
   - Adjust GitHub/GitLab settings

**Prevention:**
- Test git integration after setup
- Make a test PR to verify previews work

---

## Worker Issues

### Issue: Worker Not Running

**Symptoms:**
- Security headers not appearing
- Worker route shows but headers missing
- X-Accessibility-Optimized header missing

**Diagnosis:**
```bash
curl -I https://meauxbility.org | grep "X-Accessibility-Optimized"
# Should show: x-accessibility-optimized: true
```

**Solutions:**

1. **Verify Route Configuration**
   - Workers & Pages → Worker → Triggers → Routes
   - Route pattern: `meauxbility.org/*` (and www)
   - Ensure route is enabled
   - Ensure zone is selected

2. **Check Worker Code**
   - Workers & Pages → Worker → Edit Code
   - Look for JavaScript errors
   - Test with "Send" button

3. **Redeploy Worker**
   - Edit Code → Save and Deploy
   - Wait 30 seconds
   - Test again

4. **Check Cloudflare Plan**
   - Workers require active Cloudflare zone
   - Free tier has limits (100k requests/day)
   - Check if limits exceeded

5. **Check for Errors**
   - Workers → Logs (requires paid plan)
   - Look for runtime errors

**Prevention:**
- Test worker after deployment
- Use simple curl test to verify
- Monitor worker usage

---

## Emergency Procedures

### Emergency: Site is Down

**Immediate Actions:**

1. **Check External Status Pages**
   - Vercel: https://www.vercel-status.com/
   - Cloudflare: https://www.cloudflarestatus.com/

2. **Bypass Cloudflare** (temporary fix)
   ```bash
   # Update local hosts file to test Vercel directly
   # Find Vercel IP: dig +short meauxbility-org-xxxxx.vercel.app
   # Add to /etc/hosts: <IP> meauxbility.org
   ```

3. **Disable Cloudflare Proxy** (if Cloudflare is the issue)
   - DNS → Records → Toggle to "DNS only" (gray cloud)
   - Restores direct connection to Vercel

4. **Rollback Vercel Deployment**
   - Deployments → Find last working deployment
   - Three dots → "Promote to Production"

5. **Disable Page Rules** (if rules causing issues)
   - Rules → Page Rules → Toggle each rule OFF
   - Test between each disable

6. **Check Recent Changes**
   - What changed in last hour/day?
   - Revert most recent change

**After Site is Restored:**
- Document what went wrong
- Fix root cause
- Add monitoring to prevent recurrence

---

### Emergency: Security Breach

**If you suspect your site is compromised:**

1. **Immediately Enable "I'm Under Attack" Mode**
   - Cloudflare Dashboard → Overview
   - Toggle "I'm Under Attack Mode" ON
   - This shows challenge to all visitors

2. **Review Cloudflare Firewall Logs**
   - Security → Events
   - Look for suspicious IPs or patterns

3. **Block Malicious IPs**
   - Security → WAF → Tools → IP Access Rules
   - Add malicious IPs with "Block" action

4. **Rotate All Credentials**
   - Cloudflare API tokens
   - Vercel API tokens
   - Database credentials (if applicable)
   - GitHub/GitLab tokens

5. **Review Recent Deployments**
   - Check for unauthorized code changes
   - Rollback to known good deployment

6. **Scan for Malware**
   - Review codebase for malicious code
   - Check environment variables

7. **Contact Support**
   - Cloudflare Support
   - Vercel Support
   - Report incident

**Prevention:**
- Use 2FA on all accounts
- Regularly rotate API tokens
- Monitor Cloudflare Security Events
- Set up alerts for unusual traffic

---

## Getting Help

### Self-Help Resources

- **Cloudflare Community**: https://community.cloudflare.com/
- **Cloudflare Docs**: https://developers.cloudflare.com/
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs

### Support Contacts

- **Cloudflare Support**: https://support.cloudflare.com/hc/en-us/requests/new
- **Vercel Support**: support@vercel.com or in-app chat
- **This Project**: See project README for maintainer contact

### Information to Provide When Asking for Help

1. **Domain**: meauxbility.org
2. **Error Message**: Exact error text
3. **Steps to Reproduce**: What actions cause the issue
4. **Expected vs Actual**: What should happen vs what does happen
5. **Screenshots**: If applicable
6. **Logs**: From Cloudflare or Vercel
7. **Cloudflare Ray ID**: Found in error messages
8. **Recent Changes**: What was changed before issue started
9. **Browser/OS**: If client-side issue
10. **Curl Output**: For server-side issues

---

**Document Version**: 1.0
**Last Updated**: 2025-11-16
**For Project**: meauxbility.org Cloudflare + Vercel Integration

---

## Quick Reference: Common Commands

```bash
# DNS Checks
dig +short meauxbility.org A
dig +short meauxbility.org NS
dig +short www.meauxbility.org CNAME

# SSL Checks
curl -I https://meauxbility.org
openssl s_client -connect meauxbility.org:443 -servername meauxbility.org

# Cache Checks
curl -I https://meauxbility.org | grep "cf-cache-status"

# Header Checks
curl -I https://meauxbility.org | grep -i "security"

# Redirect Checks
curl -I -L https://www.meauxbility.org | grep "Location"

# Clear DNS Cache (Linux)
sudo systemd-resolve --flush-caches
```
