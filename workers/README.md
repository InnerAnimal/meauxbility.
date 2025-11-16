# Cloudflare Worker Deployment Guide

## Overview

The `security-headers.js` Cloudflare Worker adds comprehensive security headers, accessibility optimizations, and performance enhancements to meauxbility.org.

## Features

### Security Headers
- **Content Security Policy (CSP)**: Prevents XSS and injection attacks
- **Strict Transport Security (HSTS)**: Forces HTTPS connections
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME sniffing
- **Referrer Policy**: Enhances privacy
- **Permissions Policy**: Disables unnecessary browser features
- **Cross-Origin Policies**: Isolates the application

### Accessibility Features
- **UTF-8 Encoding**: Ensures proper character encoding for screen readers
- **Custom Headers**: Indicates accessibility optimizations
- **Proper Content Types**: Ensures correct MIME types for assistive technologies

### Performance Optimizations
- **Intelligent Caching**: Different strategies for static vs dynamic content
- **Server Timing**: Performance metrics for monitoring
- **CORS Configuration**: Optimized for API and asset requests

## Deployment Methods

### Method 1: Cloudflare Dashboard (Recommended for Beginners)

1. **Login to Cloudflare Dashboard**
   - Go to: https://dash.cloudflare.com/
   - Select your account
   - Click on "Workers & Pages" in the left sidebar

2. **Create Worker**
   - Click "Create application"
   - Select "Create Worker"
   - Name it: `meauxbility-security-headers`
   - Click "Deploy"

3. **Edit Worker Code**
   - Click "Edit code" after deployment
   - Delete the default code
   - Copy and paste the entire contents of `security-headers.js`
   - Click "Save and Deploy"

4. **Add Route**
   - Go back to the worker overview
   - Click "Triggers" tab
   - Click "Add route"
   - Route: `meauxbility.org/*` (and `www.meauxbility.org/*` if needed)
   - Zone: Select `meauxbility.org`
   - Click "Add route"

5. **Test Worker**
   - Visit: https://meauxbility.org
   - Open browser DevTools → Network tab
   - Refresh the page
   - Check the response headers for security headers

### Method 2: Wrangler CLI (Recommended for Developers)

1. **Install Wrangler**
   ```bash
   npm install -g wrangler
   # or
   yarn global add wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   wrangler login
   ```

3. **Create wrangler.toml**
   Create a `wrangler.toml` file in the `/workers` directory:
   ```toml
   name = "meauxbility-security-headers"
   main = "security-headers.js"
   compatibility_date = "2024-01-01"

   [env.production]
   routes = [
     { pattern = "meauxbility.org/*", zone_name = "meauxbility.org" },
     { pattern = "www.meauxbility.org/*", zone_name = "meauxbility.org" }
   ]
   ```

4. **Deploy Worker**
   ```bash
   cd workers
   wrangler deploy
   ```

5. **Verify Deployment**
   ```bash
   curl -I https://meauxbility.org
   ```

### Method 3: Using Cloudflare API

1. **Create Worker Script**
   ```bash
   # Set your credentials
   export CLOUDFLARE_API_TOKEN="your_token"
   export CLOUDFLARE_ACCOUNT_ID="your_account_id"
   export WORKER_NAME="meauxbility-security-headers"

   # Upload worker script
   curl -X PUT "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/workers/scripts/${WORKER_NAME}" \
     -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
     -H "Content-Type: application/javascript" \
     --data-binary "@security-headers.js"
   ```

2. **Create Worker Route**
   ```bash
   export ZONE_ID="your_zone_id"

   curl -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/workers/routes" \
     -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
     -H "Content-Type: application/json" \
     --data '{
       "pattern": "meauxbility.org/*",
       "script": "meauxbility-security-headers"
     }'
   ```

## Testing the Worker

### Check Security Headers

```bash
# Test apex domain
curl -I https://meauxbility.org

# Test www subdomain
curl -I https://www.meauxbility.org

# Test specific route
curl -I https://meauxbility.org/api/test
```

### Expected Headers

You should see these headers in the response:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'...
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
X-Accessibility-Optimized: true
```

### Test with Browser DevTools

1. Open https://meauxbility.org in your browser
2. Open DevTools (F12)
3. Go to Network tab
4. Refresh the page
5. Click on the main document request
6. Check the "Headers" section → "Response Headers"
7. Verify all security headers are present

### Test with Online Tools

- **Security Headers**: https://securityheaders.com/?q=https://meauxbility.org
- **SSL Labs**: https://www.ssllabs.com/ssltest/analyze.html?d=meauxbility.org
- **Mozilla Observatory**: https://observatory.mozilla.org/analyze/meauxbility.org

## Customization

### Adjusting Content Security Policy

If you need to allow additional sources (e.g., third-party analytics), edit the CSP header:

```javascript
'Content-Security-Policy': [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://analytics.example.com", // Add your domains here
  // ... other directives
].join('; ')
```

### Adding Custom Routes

To add more caching rules, modify the arrays:

```javascript
const BYPASS_CACHE_ROUTES = [
  '/api/',
  '/your-custom-route/',  // Add new routes here
];

const CACHE_EVERYTHING_ROUTES = [
  '/_next/static/',
  '/your-static-assets/',  // Add new routes here
];
```

### Enabling CORS for More Routes

Modify the `shouldEnableCORS` function:

```javascript
function shouldEnableCORS(pathname) {
  return pathname.startsWith('/api/') ||
         pathname.startsWith('/your-route/');  // Add your routes
}
```

## Monitoring

### View Worker Logs

1. **Via Dashboard**
   - Go to Workers & Pages → Select your worker
   - Click "Logs" tab (requires paid plan)

2. **Via Wrangler**
   ```bash
   wrangler tail meauxbility-security-headers
   ```

### Monitor Performance

The worker adds `Server-Timing` headers for performance monitoring:

```bash
curl -I https://meauxbility.org | grep "Server-Timing"
```

## Troubleshooting

### Worker Not Running

**Check Route Configuration**
```bash
curl -I https://meauxbility.org | grep "X-Accessibility-Optimized"
```

If you don't see the header:
1. Verify the route is configured correctly
2. Check worker is deployed
3. Ensure zone is active

### CSP Blocking Resources

If the CSP is too strict and blocking legitimate resources:

1. Open browser console
2. Look for CSP violation errors
3. Add the blocked domain to the appropriate CSP directive
4. Redeploy the worker

### Cache Issues

If caching is too aggressive or not working:

1. Check the `Cache-Control` header
2. Verify the route matches the caching configuration
3. Adjust cache rules in the worker code

## Cost Considerations

**Cloudflare Workers Free Tier:**
- 100,000 requests per day
- 10ms CPU time per request
- Should be sufficient for most small to medium sites

**Paid Plan ($5/month):**
- 10 million requests per month
- 50ms CPU time per request
- Real-time logs
- Recommended for production sites with high traffic

## Security Best Practices

1. **Regularly Update**: Keep the CSP and security headers up to date
2. **Monitor Violations**: Use CSP reporting to track policy violations
3. **Test Thoroughly**: Test all routes after deploying changes
4. **Use Version Control**: Keep worker code in git repository
5. **Review Permissions**: Regularly audit API token permissions

## Next Steps

After deploying the worker:

1. ✅ Test all major routes on your site
2. ✅ Run security header scanners
3. ✅ Monitor for any CSP violations in browser console
4. ✅ Set up monitoring alerts in Cloudflare dashboard
5. ✅ Document any customizations for your team

## Support

For issues with the worker:
1. Check Cloudflare Workers documentation: https://developers.cloudflare.com/workers/
2. Review worker logs for errors
3. Test with simplified version of the worker to isolate issues

---

**Version**: 1.0
**Last Updated**: 2025-11-16
**Maintained By**: meauxbility.org team
