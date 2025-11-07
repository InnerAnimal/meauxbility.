# Meauxbility.org - Vercel Deployment Guide

## 🚀 Quick Deploy to Vercel

Your DNS is already configured! Here's how to deploy your app:

### Prerequisites
- Vercel account (sign up at https://vercel.com)
- GitHub repository connected to Vercel
- Environment variables ready (see below)

---

## Step 1: Install Vercel CLI (Optional but Recommended)

```bash
npm install -g vercel
```

---

## Step 2: Deploy via Vercel CLI

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

The CLI will:
- ✅ Detect your Express app automatically
- ✅ Use the vercel.json configuration
- ✅ Deploy to meauxbility.org (since DNS is configured)
- ✅ Set up SSL certificates automatically

---

## Step 3: Configure Environment Variables

In your Vercel dashboard or via CLI, add these environment variables:

### Required Variables:
```bash
NODE_ENV=production
WEBHOOK_SIGNING_SECRET=your-webhook-secret-here
```

### Optional (for future features):
```bash
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-key
STRIPE_SECRET_KEY=your-stripe-secret-key
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
```

**Via Vercel Dashboard:**
1. Go to your project on vercel.com
2. Click "Settings" → "Environment Variables"
3. Add each variable

**Via Vercel CLI:**
```bash
vercel env add WEBHOOK_SIGNING_SECRET production
vercel env add NODE_ENV production
```

---

## Step 4: Deploy from GitHub (Recommended for CI/CD)

### Connect GitHub Repository:
1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select your GitHub repository: `InnerAnimal/meauxbility.org`
4. Vercel will auto-detect settings from `vercel.json`
5. Add environment variables
6. Click "Deploy"

### Auto-deployment:
- ✅ Push to `main` → Auto-deploy to production
- ✅ Push to other branches → Preview deployments
- ✅ Pull requests → Automatic preview URLs

---

## 🔧 Your Current DNS Configuration

```
Domain: meauxbility.org
Status: ✅ Configured for Vercel

DNS Records:
- * (wildcard)  → ALIAS → cname.vercel-dns-016.com
- @ (root)      → ALIAS → cname.vercel-dns-016.com
- CAA           → 0 issue "letsencrypt.org"
```

**This means:**
- ✅ meauxbility.org → Points to Vercel
- ✅ www.meauxbility.org → Points to Vercel
- ✅ SSL/HTTPS → Automatic via Let's Encrypt

---

## 📁 Project Structure for Vercel

```
meauxbility.org/
├── server.js              # Express server (entry point)
├── vercel.json           # Vercel configuration ✅
├── .vercelignore         # Files to exclude ✅
├── package.json          # Dependencies
├── public/               # Static assets
│   └── assets.html
├── assets/               # CSS/JS/images
├── *.html               # Page templates
└── admin/               # Admin dashboard
```

---

## 🚦 Deployment Checklist

Before deploying:

- [ ] Environment variables configured in Vercel
- [ ] `package.json` has all required dependencies
- [ ] Test locally: `npm start` (should run on port 3000)
- [ ] Git repository pushed to GitHub
- [ ] Vercel project connected to GitHub repo

---

## 🧪 Test Your Deployment

After deployment, verify:

### Health Checks:
```bash
curl https://meauxbility.org/api/health
curl https://meauxbility.org/healthz
```

### Test Pages:
- https://meauxbility.org → Homepage
- https://meauxbility.org/about → About page
- https://meauxbility.org/donate → Donation page
- https://meauxbility.org/apply → Application form
- https://meauxbility.org/stories → Success stories
- https://meauxbility.org/contact → Contact form
- https://meauxbility.org/admin → Admin dashboard
- https://meauxbility.org/assets → Assets page

### Test API:
- https://meauxbility.org/api/status
- https://meauxbility.org/api/health

### Test Webhook (with valid signature):
```bash
curl -X POST https://meauxbility.org/api/webhooks/meauxbilityorg \
  -H "Content-Type: application/json" \
  -H "x-webhook-signature: your-hmac-signature" \
  -d '{"type":"test","id":"123"}'
```

---

## 🔍 Monitoring & Logs

### View Logs:
```bash
# Via CLI
vercel logs

# Via Dashboard
# Go to vercel.com → Your Project → Deployments → Click deployment → Logs
```

### Analytics:
- Visit vercel.com → Your Project → Analytics
- Track pageviews, performance, errors

---

## 🚀 Deployment Commands

```bash
# Deploy to production
vercel --prod

# Deploy preview (test branch)
vercel

# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]

# Open project in browser
vercel open

# View environment variables
vercel env ls
```

---

## 🔄 Update Workflow

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main

# Vercel automatically deploys!
# Check status at: vercel.com/dashboard
```

---

## 🐛 Troubleshooting

### Issue: "Build failed"
- Check `vercel logs` for errors
- Verify all dependencies in package.json
- Test locally: `npm install && npm start`

### Issue: "Environment variables not working"
- Add them in Vercel dashboard: Settings → Environment Variables
- Redeploy after adding variables

### Issue: "404 on static assets"
- Check routes in vercel.json
- Verify files exist in public/ and assets/ folders

### Issue: "Domain not working"
- DNS propagation can take up to 48 hours
- Check DNS: `dig meauxbility.org`
- Verify domain in Vercel: Settings → Domains

### Issue: "Webhook signature verification fails"
- Ensure WEBHOOK_SIGNING_SECRET is set in Vercel
- Check signature header format (sha256=...)
- Use raw body parser for webhook endpoint

---

## 🎯 Performance Optimization

Vercel automatically provides:
- ✅ Global CDN (fast worldwide)
- ✅ Automatic compression (gzip/brotli)
- ✅ Edge caching
- ✅ HTTP/2 & HTTP/3
- ✅ Image optimization
- ✅ Smart routing

---

## 📊 Next Steps After Deployment

1. ✅ Verify all pages load correctly
2. ✅ Test on mobile devices
3. ✅ Set up monitoring/alerts in Vercel
4. ✅ Connect Supabase for backend
5. ✅ Integrate Stripe for donations
6. ✅ Set up email notifications (Nodemailer)
7. ✅ Add Google Analytics (optional)
8. ✅ Test webhook integration

---

## 💰 Vercel Pricing

**Free Tier includes:**
- 100GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS
- Preview deployments
- Analytics

**Perfect for:**
- Personal projects ✅
- Non-profits ✅
- Small sites ✅

---

## 📚 Resources

- Vercel Docs: https://vercel.com/docs
- Vercel CLI: https://vercel.com/docs/cli
- Node.js on Vercel: https://vercel.com/docs/runtimes#official-runtimes/node-js
- Custom Domains: https://vercel.com/docs/custom-domains

---

## 🆘 Need Help?

- Vercel Support: https://vercel.com/support
- Community: https://github.com/vercel/vercel/discussions
- Documentation: https://vercel.com/docs

---

**Ready to deploy?** Run: `vercel --prod` 🚀
