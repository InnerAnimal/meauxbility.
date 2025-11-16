# API Token Setup Guide for meauxbility.org

## Issue Detected

The provided API tokens returned "Access denied" errors. This guide will help you create new tokens with the correct permissions.

---

## Cloudflare API Token

### Required Permissions

To complete the Cloudflare setup, create an API token with these permissions:

| Permission | Resource | Level |
|------------|----------|-------|
| Zone | DNS | Edit |
| Zone | Zone Settings | Edit |
| Zone | Zone | Edit |
| Zone | SSL and Certificates | Edit |
| Zone | Page Rules | Edit |
| Zone | Workers Routes | Edit |
| Account | Account Settings | Read |
| Account | Account Analytics | Read |
| User | User Details | Read |

### How to Create Cloudflare API Token

1. **Login to Cloudflare Dashboard**
   - Go to: https://dash.cloudflare.com/
   - Sign in with your account

2. **Navigate to API Tokens**
   - Click on your profile icon (top right)
   - Select "My Profile"
   - Click "API Tokens" in the left sidebar
   - Click "Create Token"

3. **Use Custom Token Template**
   - Click "Create Custom Token"
   - Name: `meauxbility-vercel-integration`

4. **Configure Permissions**
   - Add the permissions listed above
   - For "Zone Resources": Select "Specific zone" → "meauxbility.org" (if zone exists) or "All zones"

5. **Set Additional Settings** (Optional but Recommended)
   - **Client IP Address Filtering**: Add your current IP for security
   - **TTL**: Set an expiration date (e.g., 90 days from now)

6. **Create and Save Token**
   - Click "Continue to summary"
   - Review permissions
   - Click "Create Token"
   - **IMPORTANT**: Copy the token immediately - it won't be shown again!

### Token Format
```
cloudflare_api_token=YOUR_TOKEN_HERE
```

---

## Vercel API Token

### Required Scopes

The Vercel API token needs these scopes:

- **Read/Write access to projects**
- **Read/Write access to deployments**
- **Read/Write access to domains**
- **Read access to teams** (if using team account)

### How to Create Vercel API Token

1. **Login to Vercel Dashboard**
   - Go to: https://vercel.com/
   - Sign in with your account

2. **Navigate to Settings**
   - Click on your avatar (top right)
   - Select "Settings"

3. **Access Tokens Section**
   - In the left sidebar, click "Tokens"
   - Alternatively, go directly to: https://vercel.com/account/tokens

4. **Create New Token**
   - Click "Create Token" or "Create"
   - Name: `meauxbility-cloudflare-setup`
   - Scope: Select the appropriate scope
     - If personal project: "Full Account"
     - If team project: Select the team and "Full Access" or specific project

5. **Set Expiration** (Optional but Recommended)
   - Choose an expiration period (e.g., 90 days)
   - For long-term integrations, you can set "No Expiration" but this is less secure

6. **Create and Save Token**
   - Click "Create Token"
   - **IMPORTANT**: Copy the token immediately - it won't be shown again!

### Token Format
```
vercel_api_token=YOUR_TOKEN_HERE
```

---

## Verify Your Tokens

### Test Cloudflare Token

```bash
curl -X GET "https://api.cloudflare.com/v4/user/tokens/verify" \
  -H "Authorization: Bearer YOUR_CLOUDFLARE_TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "result": {
    "id": "...",
    "status": "active"
  },
  "success": true,
  "errors": [],
  "messages": []
}
```

### Test Vercel Token

```bash
curl -X GET "https://api.vercel.com/v9/projects/prj_tLe5xpmnA0hbDNRytqCbWq8R2Gul" \
  -H "Authorization: Bearer YOUR_VERCEL_TOKEN"
```

**Expected Response:**
```json
{
  "id": "prj_tLe5xpmnA0hbDNRytqCbWq8R2Gul",
  "name": "meauxbility.org",
  ...
}
```

---

## Using the Tokens

Once you have valid tokens, update the configuration scripts:

### Option 1: Environment Variables (Recommended)
```bash
export CLOUDFLARE_API_TOKEN="your_cloudflare_token"
export VERCEL_API_TOKEN="your_vercel_token"
export VERCEL_PROJECT_ID="prj_tLe5xpmnA0hbDNRytqCbWq8R2Gul"
export DOMAIN="meauxbility.org"
```

### Option 2: Configuration File
Create a `.env` file in the project root:
```bash
CLOUDFLARE_API_TOKEN=your_cloudflare_token
VERCEL_API_TOKEN=your_vercel_token
VERCEL_PROJECT_ID=prj_tLe5xpmnA0hbDNRytqCbWq8R2Gul
DOMAIN=meauxbility.org
```

**⚠️ SECURITY WARNING**: Add `.env` to `.gitignore` to prevent committing secrets!

---

## Next Steps

After creating valid tokens:

1. ✅ Verify both tokens using the test commands above
2. ✅ Update the automation scripts with your new tokens
3. ✅ Proceed with the automated setup scripts in `01-AUTOMATED-SETUP.md`
4. ✅ Or follow the manual setup guides if you prefer UI-based configuration

---

## Troubleshooting

### "Access Denied" Error
- Token doesn't have required permissions
- Token has expired
- Token is for wrong account/zone

**Solution**: Create a new token with correct permissions

### "Invalid Token Format" Error
- Token contains extra spaces or characters
- Token is incomplete

**Solution**: Copy the token carefully, ensure no whitespace

### Token Works But Operations Fail
- Insufficient permissions for specific operations
- Zone/project doesn't exist yet
- Account limits reached (e.g., free tier limitations)

**Solution**: Check Cloudflare/Vercel dashboard for specific errors

---

**Document Version**: 1.0
**Last Updated**: 2025-11-16
**For Project**: meauxbility.org Cloudflare + Vercel Integration
