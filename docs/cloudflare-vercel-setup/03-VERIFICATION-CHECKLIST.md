# Complete Verification & Testing Checklist

Use this checklist to verify that your Cloudflare + Vercel integration is working correctly for meauxbility.org.

---

## Pre-Flight Checks

Before starting verification, ensure:

- [ ] Cloudflare zone created for meauxbility.org
- [ ] DNS records configured in Cloudflare
- [ ] Nameservers updated at domain registrar
- [ ] DNS propagation complete (24-48 hours after nameserver update)
- [ ] Custom domains added in Vercel
- [ ] Latest code deployed to production on Vercel

---

## Part 1: DNS Verification

### 1.1 Nameserver Check

```bash
dig +short meauxbility.org NS
```

**Expected Result**:
```
<nameserver1>.ns.cloudflare.com.
<nameserver2>.ns.cloudflare.com.
```

- [ ] Nameservers point to Cloudflare
- [ ] Both nameservers respond

### 1.2 A Record Check

```bash
dig +short meauxbility.org A
```

**Expected Result**:
```
76.76.21.21
# OR Cloudflare proxy IP (if proxied)
```

- [ ] A record exists
- [ ] Points to Vercel IP or Cloudflare proxy

### 1.3 CNAME Record Check

```bash
dig +short www.meauxbility.org CNAME
```

**Expected Result**:
```
cname.vercel-dns.com.
```

- [ ] CNAME record exists for www
- [ ] Points to cname.vercel-dns.com

### 1.4 DNS Propagation (Global)

Visit: https://www.whatsmydns.net/#A/meauxbility.org

- [ ] DNS propagated globally (green checkmarks worldwide)
- [ ] Consistent results across all regions

---

## Part 2: SSL/TLS Verification

### 2.1 HTTPS Accessibility

```bash
curl -I https://meauxbility.org
```

**Expected Result**:
```
HTTP/2 200
strict-transport-security: max-age=31536000; includeSubDomains; preload
x-content-type-options: nosniff
...
```

- [ ] Returns HTTP/2 or HTTP/3
- [ ] Status code is 200 OK
- [ ] Security headers present

### 2.2 SSL Certificate Validity

```bash
openssl s_client -connect meauxbility.org:443 -servername meauxbility.org < /dev/null 2>/dev/null | openssl x509 -noout -dates
```

**Expected Result**:
```
notBefore=<date>
notAfter=<date in future>
```

- [ ] Certificate is valid (not expired)
- [ ] Expiry date is in the future
- [ ] Certificate is for correct domain

### 2.3 SSL Labs Test

Visit: https://www.ssllabs.com/ssltest/analyze.html?d=meauxbility.org

- [ ] Overall rating: A or A+
- [ ] Certificate: Trusted
- [ ] Protocol Support: TLS 1.2 and TLS 1.3
- [ ] No major warnings

### 2.4 Browser SSL Check

1. Visit https://meauxbility.org in browser
2. Click padlock icon in address bar
3. View certificate details

- [ ] Padlock shows (🔒)
- [ ] Certificate is valid
- [ ] Issued by recognized CA (Let's Encrypt or Cloudflare)
- [ ] No browser warnings

---

## Part 3: Domain & Redirect Verification

### 3.1 Apex Domain (meauxbility.org)

Visit: https://meauxbility.org

- [ ] Site loads successfully
- [ ] No 404 or 500 errors
- [ ] SSL certificate valid (🔒 in browser)
- [ ] URL stays as meauxbility.org (no redirect)

### 3.2 WWW Redirect

Visit: https://www.meauxbility.org

- [ ] Automatically redirects to https://meauxbility.org
- [ ] Redirect is 301 (permanent) or 307 (temporary)
- [ ] Browser shows meauxbility.org in address bar after redirect
- [ ] No redirect loop

Test redirect header:
```bash
curl -I https://www.meauxbility.org
```

**Expected Result**:
```
HTTP/1.1 301 Moved Permanently
Location: https://meauxbility.org/
```

### 3.3 HTTP to HTTPS Redirect

Visit: http://meauxbility.org (without 's')

- [ ] Automatically redirects to https://meauxbility.org
- [ ] Browser shows HTTPS in address bar
- [ ] No mixed content warnings

Test redirect:
```bash
curl -I http://meauxbility.org
```

**Expected Result**:
```
HTTP/1.1 301 Moved Permanently
Location: https://meauxbility.org/
```

### 3.4 WWW without HTTPS

Visit: http://www.meauxbility.org

- [ ] Redirects to https://meauxbility.org
- [ ] No redirect loop
- [ ] Final URL is https://meauxbility.org

---

## Part 4: Cloudflare Configuration Verification

### 4.1 Cloudflare Dashboard Checks

Login to: https://dash.cloudflare.com/

- [ ] Zone status: Active
- [ ] SSL/TLS mode: Full (strict)
- [ ] Always Use HTTPS: ON
- [ ] Automatic HTTPS Rewrites: ON
- [ ] Minimum TLS Version: 1.2
- [ ] TLS 1.3: ON

### 4.2 Cloudflare DNS Records

Navigate to: DNS → Records

- [ ] A record: @ → 76.76.21.21 (Proxied: ON)
- [ ] CNAME record: www → cname.vercel-dns.com (Proxied: ON)
- [ ] Both records show orange cloud (proxied)

### 4.3 Cloudflare Page Rules

Navigate to: Rules → Page Rules

- [ ] Rule 1: www.meauxbility.org/* → Forwarding URL (301) → https://meauxbility.org/$1
- [ ] Rule 2: meauxbility.org/api/* → Cache Level: Bypass
- [ ] Rule 3: meauxbility.org/_next/static/* → Cache Everything, Edge TTL: 30 days
- [ ] All rules are active

### 4.4 Cloudflare Security Settings

Navigate to: Security → Settings

- [ ] Security Level: Medium
- [ ] Bot Fight Mode: ON
- [ ] Browser Integrity Check: ON
- [ ] Challenge Passage: 1 hour

### 4.5 Cloudflare Performance Settings

Navigate to: Speed → Optimization

- [ ] Auto Minify: HTML, CSS, JS all checked
- [ ] Brotli: ON
- [ ] Early Hints: ON (if available)
- [ ] HTTP/2: ON
- [ ] HTTP/3 (with QUIC): ON

---

## Part 5: Vercel Configuration Verification

### 5.1 Vercel Dashboard Checks

Login to: https://vercel.com/dashboard

Navigate to: meauxbility.org project → Settings → Domains

- [ ] meauxbility.org: Added, Valid ✓, SSL ✓
- [ ] www.meauxbility.org: Added, Redirects to apex, SSL ✓
- [ ] meauxbility.org set as Production Domain
- [ ] No "Invalid Configuration" errors

### 5.2 Vercel Deployment Status

Navigate to: meauxbility.org project → Deployments

- [ ] Latest deployment shows "Production" badge
- [ ] Deployment status: Ready
- [ ] No errors in deployment logs
- [ ] Domain shows meauxbility.org (not .vercel.app)

### 5.3 Vercel SSL Certificates

In Domains section:

- [ ] meauxbility.org: SSL certificate issued
- [ ] www.meauxbility.org: SSL certificate issued
- [ ] Certificates auto-renew enabled

---

## Part 6: Security Headers Verification

### 6.1 Security Headers Test

Visit: https://securityheaders.com/?q=https://meauxbility.org

**If Cloudflare Worker deployed**:
- [ ] Grade: A or A+
- [ ] Content-Security-Policy: Present
- [ ] Strict-Transport-Security: Present
- [ ] X-Content-Type-Options: Present
- [ ] X-Frame-Options: Present

**If Worker NOT deployed**:
- [ ] Grade: C or better
- [ ] Plan to deploy worker for improved security

### 6.2 Manual Header Check

```bash
curl -I https://meauxbility.org | grep -i security
curl -I https://meauxbility.org | grep -i x-frame
curl -I https://meauxbility.org | grep -i content-security
```

Expected headers (if Worker deployed):
- [ ] strict-transport-security: max-age=31536000
- [ ] x-frame-options: DENY or SAMEORIGIN
- [ ] x-content-type-options: nosniff
- [ ] content-security-policy: <policy>
- [ ] x-accessibility-optimized: true (if using provided worker)

---

## Part 7: Performance Verification

### 7.1 PageSpeed Insights

Visit: https://pagespeed.web.dev/?url=https://meauxbility.org

**Desktop**:
- [ ] Performance: > 90
- [ ] Accessibility: > 90 (critical for meauxbility.org!)
- [ ] Best Practices: > 90
- [ ] SEO: > 90

**Mobile**:
- [ ] Performance: > 70
- [ ] Accessibility: > 90
- [ ] Best Practices: > 90
- [ ] SEO: > 90

### 7.2 HTTP Protocol Test

```bash
curl -I https://meauxbility.org | grep -i "HTTP/"
```

- [ ] Response shows HTTP/2 or HTTP/3
- [ ] Not HTTP/1.1 (indicates protocol upgrade working)

### 7.3 Compression Test

```bash
curl -I -H "Accept-Encoding: br, gzip, deflate" https://meauxbility.org | grep -i "content-encoding"
```

- [ ] content-encoding: br (Brotli) or gzip
- [ ] Compression is active

### 7.4 Cache Headers

```bash
curl -I https://meauxbility.org/_next/static/css/test.css
```

- [ ] Cache-Control header present
- [ ] cf-cache-status header present (HIT, MISS, BYPASS, etc.)

### 7.5 WebPageTest

Visit: https://www.webpagetest.org/

Test: https://meauxbility.org

- [ ] First Contentful Paint: < 1.5s
- [ ] Time to Interactive: < 3.5s
- [ ] Total Blocking Time: < 300ms
- [ ] Cumulative Layout Shift: < 0.1

---

## Part 8: Functionality Testing

### 8.1 Page Navigation

Test all major routes:

- [ ] Homepage (/) loads correctly
- [ ] About page (/about) loads (if exists)
- [ ] Contact page (/contact) loads (if exists)
- [ ] 404 page shows for invalid routes
- [ ] No JavaScript errors in browser console

### 8.2 API Routes (if applicable)

If your Next.js app has API routes:

```bash
curl https://meauxbility.org/api/health
```

- [ ] API routes respond correctly
- [ ] Response is JSON (if expected)
- [ ] No CORS errors
- [ ] Cache headers show "bypass" for API routes

### 8.3 Static Assets

Check static assets load:

- [ ] Images load correctly
- [ ] CSS loads and applies
- [ ] JavaScript loads and executes
- [ ] Fonts load correctly
- [ ] No 404s in Network tab

### 8.4 Browser Compatibility

Test in multiple browsers:

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

### 8.5 Accessibility Testing

**Critical for meauxbility.org!**

Use WAVE or Axe DevTools:

- [ ] No critical accessibility errors
- [ ] All images have alt text
- [ ] Proper heading hierarchy
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG AA standards

---

## Part 9: Monitoring & Analytics

### 9.1 Cloudflare Analytics

Navigate to: Cloudflare Dashboard → Analytics

- [ ] Requests showing for meauxbility.org
- [ ] Data Transferred shows activity
- [ ] No unusual spikes or errors

### 9.2 Vercel Analytics (if enabled)

Navigate to: Vercel Dashboard → meauxbility.org → Analytics

- [ ] Page views tracked
- [ ] Core Web Vitals showing
- [ ] No deployment errors

### 9.3 Error Tracking

Check for errors:

- [ ] Vercel: No errors in Runtime Logs
- [ ] Cloudflare: No unusual 4xx or 5xx errors
- [ ] Browser console: No JavaScript errors

---

## Part 10: Documentation & Backup

### 10.1 Configuration Backup

- [ ] DNS configuration saved (dns-configuration.json/yaml)
- [ ] Cloudflare nameservers documented
- [ ] Page Rules documented
- [ ] Environment variables backed up (if any)

### 10.2 Access & Credentials

Ensure you have:

- [ ] Cloudflare account access
- [ ] Vercel account access
- [ ] Domain registrar access
- [ ] API tokens stored securely
- [ ] Recovery email configured

### 10.3 Documentation Review

- [ ] Read all setup guides
- [ ] Understand troubleshooting steps
- [ ] Know how to update DNS
- [ ] Know how to renew SSL certificates (auto-renewed, but know the process)

---

## Part 11: Final Production Checks

### 11.1 SEO Basics

- [ ] robots.txt exists and allows crawling
- [ ] sitemap.xml exists
- [ ] Meta tags present (title, description)
- [ ] Open Graph tags configured
- [ ] Google Search Console verification (if needed)

### 11.2 Performance Budget

Recommended targets for accessibility platform:

- [ ] Page load time: < 2 seconds
- [ ] First Contentful Paint: < 1.5s
- [ ] Largest Contentful Paint: < 2.5s
- [ ] Cumulative Layout Shift: < 0.1
- [ ] First Input Delay: < 100ms

### 11.3 Security Scan

- [ ] No exposed API keys in source code
- [ ] Environment variables properly configured
- [ ] HTTPS enforced everywhere
- [ ] Security headers present
- [ ] No mixed content warnings

---

## Troubleshooting Failed Checks

If any check fails, refer to:

1. **01-MANUAL-CLOUDFLARE-SETUP.md** - Cloudflare configuration issues
2. **02-MANUAL-VERCEL-SETUP.md** - Vercel domain issues
3. **04-TROUBLESHOOTING.md** - Common problems and solutions
4. **Cloudflare Community**: https://community.cloudflare.com/
5. **Vercel Support**: https://vercel.com/support

---

## Quick Verification Script

Save this as `verify.sh` and run to check basics:

```bash
#!/bin/bash

echo "=== DNS Check ==="
dig +short meauxbility.org A
dig +short www.meauxbility.org CNAME
dig +short meauxbility.org NS

echo ""
echo "=== SSL Check ==="
curl -I https://meauxbility.org | head -1

echo ""
echo "=== Redirect Check ==="
curl -I https://www.meauxbility.org | grep Location

echo ""
echo "=== Security Headers ==="
curl -I https://meauxbility.org | grep -i "strict-transport-security"
curl -I https://meauxbility.org | grep -i "x-frame-options"

echo ""
echo "=== Performance ==="
curl -I https://meauxbility.org | grep -i "HTTP/"
curl -I https://meauxbility.org | grep -i "content-encoding"

echo ""
echo "✅ Basic checks complete. Review output above."
```

Make executable and run:
```bash
chmod +x verify.sh
./verify.sh
```

---

## Summary

**Minimum Required Checks** (must pass):
- ✅ DNS resolves correctly
- ✅ HTTPS works with valid SSL
- ✅ www redirects to apex
- ✅ HTTP redirects to HTTPS
- ✅ Vercel domains configured
- ✅ Site loads without errors
- ✅ Accessibility standards met

**Recommended Checks** (should pass):
- ✅ Security headers present (A rating)
- ✅ Performance score > 90
- ✅ HTTP/2 or HTTP/3 enabled
- ✅ Caching configured correctly
- ✅ Page Rules active

**Optional Checks** (nice to have):
- ✅ Cloudflare Worker deployed
- ✅ Analytics configured
- ✅ Monitoring set up

---

**Document Version**: 1.0
**Last Updated**: 2025-11-16
**Estimated Time**: 30-45 minutes for complete verification
**For Project**: meauxbility.org Cloudflare + Vercel Integration
