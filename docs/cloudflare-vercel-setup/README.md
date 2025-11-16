# Cloudflare + Vercel Integration Guide for meauxbility.org

Complete documentation for setting up Cloudflare as the DNS provider and CDN for the meauxbility.org Vercel project.

---

## 🎯 Project Overview

**Domain**: meauxbility.org
**Platform**: Vercel (Next.js 14 with App Router)
**CDN/Security**: Cloudflare
**Project Type**: 501(c)3 Nonprofit Accessibility Consulting Platform
**Status**: Ready for Configuration

---

## ⚠️ Important Notice: API Token Issue

The provided API tokens returned "Access denied" errors and need to be regenerated. This documentation provides both **automated scripts** (ready for valid tokens) and **complete manual setup guides**.

### Current Status

- ❌ Cloudflare API Token: Invalid/Expired
- ❌ Vercel API Token: Invalid/Expired
- ✅ Documentation: Complete and ready to use
- ✅ Scripts: Ready (need valid tokens)
- ✅ Manual Guides: Complete with step-by-step instructions

---

## 📁 Documentation Structure

### Core Guides

| Document | Description | When to Use |
|----------|-------------|-------------|
| **[00-API-TOKEN-SETUP.md](00-API-TOKEN-SETUP.md)** | How to create valid API tokens | Start here if tokens are invalid |
| **[01-MANUAL-CLOUDFLARE-SETUP.md](01-MANUAL-CLOUDFLARE-SETUP.md)** | Complete Cloudflare dashboard setup | Preferred for first-time setup |
| **[02-MANUAL-VERCEL-SETUP.md](02-MANUAL-VERCEL-SETUP.md)** | Complete Vercel domain setup | After Cloudflare is configured |
| **[03-VERIFICATION-CHECKLIST.md](03-VERIFICATION-CHECKLIST.md)** | Comprehensive testing checklist | After completing setup |
| **[04-TROUBLESHOOTING.md](04-TROUBLESHOOTING.md)** | Common issues and solutions | When something goes wrong |

### Configuration Reference

| Document | Description |
|----------|-------------|
| **[dns-configuration.json](dns-configuration.json)** | Complete DNS config in JSON format |
| **[dns-configuration.yaml](dns-configuration.yaml)** | Complete DNS config in YAML format |

### Automation Scripts

| Script | Description |
|--------|-------------|
| **[../../scripts/cloudflare-setup.sh](../../scripts/cloudflare-setup.sh)** | Automated Cloudflare configuration |
| **[../../scripts/vercel-setup.sh](../../scripts/vercel-setup.sh)** | Automated Vercel domain setup |

### Advanced Features

| Location | Description |
|----------|-------------|
| **[../../workers/](../../workers/)** | Cloudflare Worker for security headers |
| **[../../workers/README.md](../../workers/README.md)** | Worker deployment guide |

---

## 🚀 Quick Start

### Recommended Path: Manual Setup (Beginner-Friendly)

1. **Generate API Tokens** (if needed)
   - Read: [00-API-TOKEN-SETUP.md](00-API-TOKEN-SETUP.md)
   - Create Cloudflare token with required permissions
   - Create Vercel token with full access

2. **Configure Cloudflare**
   - Follow: [01-MANUAL-CLOUDFLARE-SETUP.md](01-MANUAL-CLOUDFLARE-SETUP.md)
   - Time: 45-60 minutes
   - Difficulty: Intermediate

3. **Configure Vercel**
   - Follow: [02-MANUAL-VERCEL-SETUP.md](02-MANUAL-VERCEL-SETUP.md)
   - Time: 15-30 minutes
   - Difficulty: Beginner

4. **Verify Setup**
   - Use: [03-VERIFICATION-CHECKLIST.md](03-VERIFICATION-CHECKLIST.md)
   - Complete all checks
   - Fix any issues found

5. **Deploy Cloudflare Worker** (Optional but Recommended)
   - Follow: [../../workers/README.md](../../workers/README.md)
   - Adds security headers and optimizations
   - Time: 10-15 minutes

### Alternative Path: Automated Setup (Advanced)

1. **Generate Valid API Tokens**
   - See: [00-API-TOKEN-SETUP.md](00-API-TOKEN-SETUP.md)

2. **Set Environment Variables**
   ```bash
   export CLOUDFLARE_API_TOKEN="your_cloudflare_token"
   export VERCEL_API_TOKEN="your_vercel_token"
   export VERCEL_PROJECT_ID="prj_tLe5xpmnA0hbDNRytqCbWq8R2Gul"
   export DOMAIN="meauxbility.org"
   ```

3. **Run Cloudflare Setup Script**
   ```bash
   cd scripts
   ./cloudflare-setup.sh
   ```

4. **Run Vercel Setup Script**
   ```bash
   ./vercel-setup.sh
   ```

5. **Verify Setup**
   - Use verification checklist

---

## 📋 Setup Checklist

Use this high-level checklist to track your progress:

### Phase 1: Preparation
- [ ] Create Cloudflare account (if needed)
- [ ] Create Vercel account (if needed)
- [ ] Ensure Next.js app deployed to Vercel
- [ ] Have domain registrar access
- [ ] Generate API tokens (if using scripts)

### Phase 2: Cloudflare Configuration
- [ ] Add domain to Cloudflare
- [ ] Configure DNS records (A and CNAME)
- [ ] Set SSL/TLS to Full (strict)
- [ ] Enable security features
- [ ] Enable performance features
- [ ] Create Page Rules
- [ ] Get nameservers from Cloudflare

### Phase 3: Domain Registrar
- [ ] Update nameservers at registrar
- [ ] Wait for DNS propagation (24-48 hours)
- [ ] Verify nameserver update

### Phase 4: Vercel Configuration
- [ ] Add meauxbility.org custom domain
- [ ] Add www.meauxbility.org custom domain
- [ ] Set meauxbility.org as production domain
- [ ] Verify SSL certificates issued
- [ ] Test domain accessibility

### Phase 5: Advanced Features
- [ ] Deploy Cloudflare Worker for security headers
- [ ] Enable Web Analytics
- [ ] Configure monitoring

### Phase 6: Testing & Verification
- [ ] Complete verification checklist
- [ ] Run performance tests
- [ ] Run security tests
- [ ] Test all major user flows
- [ ] Accessibility audit

---

## 🎯 Target Configuration

### DNS Records

| Type | Name | Value | Proxied |
|------|------|-------|---------|
| A | @ | 76.76.21.21 | ✅ Yes |
| CNAME | www | cname.vercel-dns.com | ✅ Yes |

### SSL/TLS Settings

- **Encryption Mode**: Full (strict)
- **Always Use HTTPS**: Enabled
- **Automatic HTTPS Rewrites**: Enabled
- **Minimum TLS Version**: 1.2
- **TLS 1.3**: Enabled
- **HSTS**: Enabled (6 months, includeSubDomains)

### Security Features

- **Security Level**: Medium
- **Bot Fight Mode**: Enabled
- **Browser Integrity Check**: Enabled
- **Challenge Passage**: 1 hour
- **DDoS Protection**: Automatic (included)

### Performance Features

- **Auto Minify**: HTML, CSS, JS
- **Brotli**: Enabled
- **HTTP/2**: Enabled
- **HTTP/3 (QUIC)**: Enabled
- **Early Hints**: Enabled
- **0-RTT**: Enabled

### Page Rules

1. **www → apex redirect**: `www.meauxbility.org/*` → `https://meauxbility.org/$1` (301)
2. **API cache bypass**: `meauxbility.org/api/*` → Cache Level: Bypass
3. **Static asset caching**: `meauxbility.org/_next/static/*` → Cache Everything, Edge TTL: 30 days

### Vercel Domains

- **Production**: meauxbility.org
- **Redirect**: www.meauxbility.org → meauxbility.org
- **SSL**: Auto-provisioned via Let's Encrypt

---

## 🔧 Configuration Files

### DNS Configuration

Complete DNS reference available in:
- **JSON**: [dns-configuration.json](dns-configuration.json)
- **YAML**: [dns-configuration.yaml](dns-configuration.yaml)

Includes:
- Required DNS records
- Optional records (email, staging, etc.)
- SSL configuration details
- Cloudflare settings reference
- Verification commands
- Troubleshooting tips

### Cloudflare Worker

Security headers worker available at:
- **Code**: [../../workers/security-headers.js](../../workers/security-headers.js)
- **Config**: [../../workers/wrangler.toml](../../workers/wrangler.toml)
- **Docs**: [../../workers/README.md](../../workers/README.md)

Features:
- Content Security Policy
- Strict Transport Security (HSTS)
- XSS Protection
- Clickjacking prevention
- Accessibility optimizations
- Performance headers

---

## 📊 Success Criteria

Your setup is complete when:

### Minimum Requirements (Must Have)
- ✅ `dig meauxbility.org` returns correct IP
- ✅ HTTPS works with valid SSL certificate
- ✅ www.meauxbility.org redirects to meauxbility.org
- ✅ http:// redirects to https://
- ✅ Site loads without errors
- ✅ Accessibility standards met (WCAG AA)

### Recommended Features (Should Have)
- ✅ Security headers present (A rating on securityheaders.com)
- ✅ Performance score > 90 (PageSpeed Insights)
- ✅ HTTP/2 or HTTP/3 enabled
- ✅ Caching working correctly
- ✅ All Page Rules active

### Optional Enhancements (Nice to Have)
- ✅ Cloudflare Worker deployed
- ✅ Web Analytics configured
- ✅ Monitoring alerts set up
- ✅ Staging subdomain configured

---

## ⏱️ Time Estimates

### Manual Setup
- **Cloudflare Configuration**: 45-60 minutes
- **Vercel Configuration**: 15-30 minutes
- **Nameserver Update**: 5 minutes (+ 24-48 hours propagation)
- **Worker Deployment**: 10-15 minutes
- **Testing & Verification**: 30-45 minutes
- **Total Active Time**: ~2 hours
- **Total Elapsed Time**: 24-48 hours (due to DNS propagation)

### Automated Setup (with valid tokens)
- **Script Execution**: 5-10 minutes
- **Nameserver Update**: 5 minutes (+ 24-48 hours propagation)
- **Testing & Verification**: 30-45 minutes
- **Total Active Time**: ~45 minutes
- **Total Elapsed Time**: 24-48 hours (due to DNS propagation)

---

## 🆘 Need Help?

### Documentation

1. **API token issues**: [00-API-TOKEN-SETUP.md](00-API-TOKEN-SETUP.md)
2. **Setup issues**: [01-MANUAL-CLOUDFLARE-SETUP.md](01-MANUAL-CLOUDFLARE-SETUP.md) or [02-MANUAL-VERCEL-SETUP.md](02-MANUAL-VERCEL-SETUP.md)
3. **Errors or problems**: [04-TROUBLESHOOTING.md](04-TROUBLESHOOTING.md)
4. **Verification failures**: [03-VERIFICATION-CHECKLIST.md](03-VERIFICATION-CHECKLIST.md)

### Common Issues Quick Links

- [DNS not propagating](04-TROUBLESHOOTING.md#issue-dns-not-propagating)
- [SSL certificate not issuing](04-TROUBLESHOOTING.md#issue-ssl-certificate-not-issuing)
- [Redirect loops](04-TROUBLESHOOTING.md#issue-too-many-redirects-err_too_many_redirects)
- [404 errors](04-TROUBLESHOOTING.md#issue-404-error-on-all-pages)
- [Performance issues](04-TROUBLESHOOTING.md#issue-slow-page-load-times)

### External Resources

- **Cloudflare Community**: https://community.cloudflare.com/
- **Cloudflare Docs**: https://developers.cloudflare.com/
- **Vercel Docs**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **Next.js Docs**: https://nextjs.org/docs

### Support Contacts

- **Cloudflare Support**: https://support.cloudflare.com/hc/en-us/requests/new
- **Vercel Support**: support@vercel.com
- **Emergency**: See [04-TROUBLESHOOTING.md#emergency-procedures](04-TROUBLESHOOTING.md#emergency-procedures)

---

## 📝 Key Information

### Project Details
- **Domain**: meauxbility.org
- **Vercel Project ID**: prj_tLe5xpmnA0hbDNRytqCbWq8R2Gul
- **Vercel Project Name**: meauxbility.org
- **Framework**: Next.js 14 (App Router)
- **Organization Type**: 501(c)3 Nonprofit

### Important URLs
- **Cloudflare Dashboard**: https://dash.cloudflare.com/
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Production Site**: https://meauxbility.org (after setup)

### Critical Nameserver Note
After Cloudflare configuration, you MUST update nameservers at your domain registrar. The site will not work until this is complete. See:
- Cloudflare assigns nameservers during zone creation
- Update at your registrar within 48 hours
- Allow 24-48 hours for global propagation
- Monitor status in Cloudflare dashboard

---

## 🔐 Security Best Practices

### API Tokens
- ✅ Use tokens with minimum required permissions
- ✅ Set expiration dates
- ✅ Rotate tokens regularly
- ✅ Store securely (use environment variables)
- ✅ Never commit to git
- ✅ Revoke unused tokens

### Domain Security
- ✅ Enable 2FA on Cloudflare account
- ✅ Enable 2FA on Vercel account
- ✅ Enable 2FA on domain registrar
- ✅ Use strong, unique passwords
- ✅ Enable domain lock at registrar (after setup)
- ✅ Monitor security events in Cloudflare

### Application Security
- ✅ Deploy security headers worker
- ✅ Enable HSTS with appropriate duration
- ✅ Configure CSP to prevent XSS
- ✅ Regular security audits
- ✅ Keep dependencies updated
- ✅ Monitor for vulnerabilities

---

## ♿ Accessibility Notes

As an accessibility consulting platform, meauxbility.org must meet the highest accessibility standards:

### Requirements
- ✅ WCAG 2.1 Level AA compliance (minimum)
- ✅ WCAG 2.1 Level AAA compliance (target)
- ✅ Screen reader compatible
- ✅ Keyboard navigation functional
- ✅ Proper semantic HTML
- ✅ Sufficient color contrast
- ✅ No auto-playing media
- ✅ Clear focus indicators

### Testing Tools
- **WAVE**: https://wave.webaim.org/
- **Axe DevTools**: Browser extension
- **Lighthouse**: Built into Chrome DevTools
- **NVDA**: Free screen reader (Windows)
- **VoiceOver**: Built-in screen reader (macOS/iOS)

### Performance Impact on Accessibility
- Fast loading times benefit all users, especially those on assistive technology
- Target: < 2 seconds page load time
- Minimize layout shifts (CLS < 0.1)
- Ensure interactive elements respond quickly (FID < 100ms)

---

## 🎉 What's Included

This documentation package includes:

### ✅ Complete Setup Guides
- Manual Cloudflare configuration (step-by-step)
- Manual Vercel configuration (step-by-step)
- API token creation guide
- Verification checklist
- Troubleshooting guide

### ✅ Automation Scripts
- Cloudflare setup script (Bash)
- Vercel setup script (Bash)
- Verification script
- Ready for execution with valid tokens

### ✅ Configuration References
- DNS configuration (JSON & YAML)
- Cloudflare settings reference
- Vercel settings reference
- Security policy configurations

### ✅ Advanced Features
- Cloudflare Worker for security headers
- Worker deployment guide
- Wrangler configuration
- Performance optimizations

### ✅ Maintenance & Support
- Troubleshooting guide (comprehensive)
- Emergency procedures
- Common issues and solutions
- External resource links

---

## 📅 Next Steps

### After Initial Setup
1. **Monitor Performance**
   - Set up Cloudflare Analytics
   - Enable Vercel Analytics
   - Regular PageSpeed audits

2. **Enhance Security**
   - Deploy Cloudflare Worker
   - Review security events weekly
   - Set up rate limiting (if needed)

3. **Optimize Further**
   - Configure image optimization
   - Set up R2 for asset storage (optional)
   - Implement service worker (optional)

4. **Maintain**
   - Regular dependency updates
   - Security patch monitoring
   - Performance monitoring
   - Accessibility audits

### Future Enhancements
- Staging environment on subdomain
- Email routing through Cloudflare
- Advanced WAF rules
- Bot Management (if needed)
- Load balancing (for high traffic)

---

## 📜 Version History

- **v1.0** (2025-11-16): Initial documentation release
  - Complete manual setup guides
  - Automated setup scripts
  - Cloudflare Worker implementation
  - Comprehensive verification checklist
  - Troubleshooting guide
  - Configuration references

---

## 📄 License & Credits

### Documentation
This documentation is provided for meauxbility.org. Feel free to adapt for your own projects.

### Technologies
- **Cloudflare**: DNS, CDN, Security, Performance
- **Vercel**: Hosting, Edge Functions, Analytics
- **Next.js**: React framework
- **Let's Encrypt**: SSL certificates

### Accessibility Commitment
meauxbility.org is committed to digital accessibility. If you encounter any accessibility barriers, please report them so they can be addressed promptly.

---

**Document Version**: 1.0
**Last Updated**: 2025-11-16
**For Project**: meauxbility.org Cloudflare + Vercel Integration
**Status**: Complete and Ready for Use

---

## 🚀 Ready to Begin?

1. **Start with**: [00-API-TOKEN-SETUP.md](00-API-TOKEN-SETUP.md) - Create valid API tokens
2. **Then follow**: [01-MANUAL-CLOUDFLARE-SETUP.md](01-MANUAL-CLOUDFLARE-SETUP.md) - Configure Cloudflare
3. **Next**: [02-MANUAL-VERCEL-SETUP.md](02-MANUAL-VERCEL-SETUP.md) - Configure Vercel
4. **Verify**: [03-VERIFICATION-CHECKLIST.md](03-VERIFICATION-CHECKLIST.md) - Test everything
5. **If issues**: [04-TROUBLESHOOTING.md](04-TROUBLESHOOTING.md) - Fix problems

**Good luck with your setup! 🎉**
