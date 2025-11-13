# Meauxbility.org - Next.js Full Stack Application

**Complete Next.js + Vercel migration with full integration stack**

Tech Stack: **Next.js 14, Vercel, Stripe, Supabase, OpenAI, Claude, Resend**

---

## 🎯 Project Overview

Meauxbility is a 501(c)(3) nonprofit organization (EIN: 33-4214907) providing mobility grants and accessibility services to spinal cord injury survivors across Louisiana's Acadiana region.

**Status:** Next.js 14 Full Stack Application
**Deployment:** Vercel
**Architecture:** App Router with TypeScript

---

## 📁 New Project Structure

```
meauxbility.org/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   ├── globals.css               # Global styles with Tailwind
│   ├── about/                    # About page
│   ├── apply/                    # Grant application
│   ├── donate/                   # Donation page
│   ├── stories/                  # Success stories
│   ├── contact/                  # Contact form
│   ├── admin/                    # Admin dashboard
│   └── api/                      # API Routes
│       ├── forms/                # Form submission endpoints
│       ├── stripe/               # Stripe payment endpoints
│       ├── webhooks/             # Webhook handlers
│       └── ai/                   # AI chat endpoints
├── components/                   # React components
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   └── ui/                       # UI components
├── lib/                          # Utilities & integrations
│   ├── integrations/
│   │   ├── supabase-client.ts    # Supabase browser client
│   │   ├── supabase-server.ts    # Supabase server client
│   │   ├── stripe.ts             # Stripe integration
│   │   ├── openai.ts             # OpenAI integration
│   │   ├── anthropic.ts          # Claude integration
│   │   └── resend.ts             # Email integration
│   └── utils.ts                  # Utility functions
├── public/                       # Static assets
├── .env.example                  # Environment variables template
├── next.config.js                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind configuration
└── vercel.json                   # Vercel deployment config
```

---

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

---

## 🛠️ Tech Stack

### Framework & Deployment
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Vercel** - Deployment platform

### Database & Auth
- **Supabase** - PostgreSQL database
- **Supabase Auth** - Authentication system
- **Supabase SSR** - Server-side auth

### Payments
- **Stripe** - Payment processing
- **@stripe/stripe-js** - Client-side Stripe

### AI Integrations
- **OpenAI** - GPT-4 for chat assistance
- **Claude (Anthropic)** - Advanced AI capabilities
- **AI Chat API** - Custom chat endpoint at `/api/ai/chat`

### Email & Communication
- **Resend** - Transactional email service
- **Email Templates** - Pre-built templates for grants, donations, contact

### UI Components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **tailwindcss-animate** - Animation utilities

---

## 🔐 Environment Variables

Required environment variables (see `.env.example`):

```env
# App Configuration
NEXT_PUBLIC_SITE_URL=https://meauxbility.org
NODE_ENV=production

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# OpenAI
OPENAI_API_KEY=sk-xxx
OPENAI_ORG_ID=org-xxx

# Claude/Anthropic
ANTHROPIC_API_KEY=sk-ant-xxx

# Resend Email
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=noreply@meauxbility.org
RESEND_TO_EMAIL=contact@meauxbility.org
```

---

## 📡 API Routes

### Forms
- `POST /api/forms/contact` - Contact form submission
- `POST /api/forms/apply` - Grant application submission

### Stripe
- `POST /api/stripe/create-checkout` - Create Stripe checkout session

### Webhooks
- `POST /api/webhooks/stripe` - Stripe webhook handler

### AI
- `POST /api/ai/chat` - AI chat endpoint (Claude-powered)

---

## 🎨 Design System

The application maintains the signature **glassmorphic design** with:

- **Gradient Backgrounds** - Purple/blue radial gradients
- **Backdrop Blur** - Glass-like effects on cards and navigation
- **Tailwind Classes** - Utility-first styling
- **Custom Components** - `.glass-card`, `.btn-glass-primary`, `.btn-glass-secondary`

### Key CSS Classes

```css
.glass-card           /* Glassmorphic card with blur */
.glass-input          /* Glassmorphic form input */
.btn-glass-primary    /* Primary glass button */
.btn-glass-secondary  /* Secondary glass button */
```

---

## 🚀 Vercel Deployment

### Initial Setup

1. **Connect Repository to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login and link project
   vercel login
   vercel link
   ```

2. **Configure Environment Variables**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add all variables from `.env.example`
   - Set for Production, Preview, and Development

3. **Deploy**
   ```bash
   # Deploy to production
   vercel --prod

   # Or simply push to main branch for auto-deploy
   git push origin main
   ```

### Continuous Deployment

- **Main Branch** → Automatic production deployment
- **Feature Branches** → Automatic preview deployments
- **Pull Requests** → Preview URLs for testing

---

## 📋 Feature Checklist

### ✅ Completed
- [x] Next.js 14 App Router setup
- [x] TypeScript configuration
- [x] Tailwind CSS with glassmorphic design
- [x] Supabase integration (client & server)
- [x] Stripe payment integration
- [x] OpenAI integration
- [x] Claude/Anthropic integration
- [x] Resend email integration
- [x] Form API routes (contact, apply)
- [x] Webhook handlers (Stripe)
- [x] AI chat endpoint
- [x] Navigation component
- [x] Footer component
- [x] Homepage with TRUTEC Stack
- [x] Vercel deployment configuration

### 🔄 Next Steps
- [ ] Create remaining page components (About, Apply, Donate, Stories, Contact, Admin)
- [ ] Build grant application form with validation
- [ ] Implement Stripe donation flow
- [ ] Create admin dashboard
- [ ] Set up Supabase database tables
- [ ] Add authentication system
- [ ] Implement user roles
- [ ] Add analytics tracking
- [ ] Create email templates for all use cases
- [ ] Add comprehensive error handling
- [ ] Write unit and integration tests
- [ ] Add loading states and skeletons
- [ ] Optimize images and assets
- [ ] Set up monitoring and logging
- [ ] Create sitemap and robots.txt
- [ ] SEO optimization

---

## 🔧 Development Guidelines

### Code Style
- **TypeScript** - Always use types
- **Async/Await** - For asynchronous operations
- **Error Handling** - Try-catch with proper error messages
- **Validation** - Use Zod for input validation
- **Comments** - Document complex logic

### Component Patterns
```tsx
// Server Component (default)
export default function Page() {
  return <div>Server Component</div>
}

// Client Component (interactive)
'use client'
export default function Interactive() {
  const [state, setState] = useState()
  return <div>Client Component</div>
}
```

### API Route Pattern
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({ /* ... */ })

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = schema.parse(body)
    // Process request
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Message' }, { status: 400 })
  }
}
```

---

## 📞 Team

- **Sam** - CEO/Founder, UI/UX Engineer
- **Connor McNeely** - CTO
- **Fred Williams** - CMO

---

## 📜 License

© 2024 Meauxbility. All rights reserved.
501(c)(3) Nonprofit Organization - EIN: 33-4214907

---

## 🔗 Links

- **Website:** [meauxbility.org](https://meauxbility.org)
- **Vercel Dashboard:** [vercel.com/dashboard](https://vercel.com/dashboard)
- **Supabase Dashboard:** [supabase.com/dashboard](https://supabase.com/dashboard)
- **Stripe Dashboard:** [dashboard.stripe.com](https://dashboard.stripe.com)

---

## 💡 Migration Notes

### What Changed
- ✅ **Static HTML → Next.js React Components**
- ✅ **GitHub Pages → Vercel**
- ✅ **Express Server → Next.js API Routes**
- ✅ **Vanilla JS → TypeScript + React**
- ✅ **No Backend → Full Stack with Database**
- ✅ **Manual Emails → Automated Email System**
- ✅ **No Payments → Stripe Integration**
- ✅ **No AI → OpenAI + Claude Integration**

### Benefits
- 🚀 **Faster Performance** - Server-side rendering
- 🔒 **Better Security** - Environment variables, API routes
- 📈 **Scalability** - Vercel edge network
- 🤖 **AI-Powered** - Chatbots and automation
- 💳 **Payment Processing** - Stripe donations
- 📧 **Email Automation** - Transactional emails
- 🗄️ **Database** - Supabase PostgreSQL
- 🔐 **Authentication** - Supabase Auth

---

*Last Updated: November 2024 - Next.js Migration Complete*
