# Meauxbility.org - Next.js 14 App Router

**Transform Your Pain into Purpose**

A production Next.js application for Meauxbility, a 501(c)(3) nonprofit providing mobility grants and accessibility services to spinal cord injury survivors across Louisiana's Acadiana region.

---

## 🎯 Project Overview

- **Organization:** Meauxbility (EIN: 33-4214907)
- **Framework:** Next.js 14 App Router with TypeScript
- **Design:** Clay.Global-inspired cinematic minimalism
- **Hosting:** Vercel
- **Domain:** https://www.meauxbility.org
- **Vercel Project ID:** prj_tLe5xpmnA0hbDNRytqCbWq8R2Gul

---

## 📁 Repository Structure

```
meauxbility.org/
├── app/                          # Next.js 14 App Router
│   ├── layout.tsx               # Root layout with Header/Footer
│   ├── page.tsx                 # Home page (light theme)
│   ├── about/
│   │   └── page.tsx            # About page (dark theme)
│   ├── programs/
│   │   └── page.tsx            # Programs page (light)
│   ├── community/
│   │   └── page.tsx            # Community page (dark)
│   ├── resources/
│   │   └── page.tsx            # Resources page (dark)
│   ├── connect/
│   │   └── page.tsx            # Contact page (light)
│   ├── impact/
│   │   └── page.tsx            # Donate page (light)
│   └── api/
│       ├── donations/
│       │   └── route.ts        # Stripe PaymentIntent endpoint
│       ├── forms/
│       │   └── contact/
│       │       └── route.ts    # Resend email endpoint
│       ├── subscribe/
│       │   └── route.ts        # Newsletter subscription
│       └── upload/
│           └── route.ts        # Supabase file upload
├── components/
│   ├── Header.tsx               # Main navigation
│   ├── Header.module.css
│   ├── Footer.tsx               # Site footer
│   └── Footer.module.css
├── styles/
│   ├── mbx-tokens.css          # Brand design tokens
│   └── globals.css             # Global styles & resets
├── public/                      # Static assets
├── next.config.js              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies & scripts
└── repo.json                   # Repository metadata
```

---

## 🎨 Brand Tokens

All brand colors and design tokens are defined in `styles/mbx-tokens.css`:

### Core Colors
```css
--mbx-orange: #FF6B00          /* Primary action color */
--mbx-orange-ink: #E85D00      /* Darker orange */
--mbx-teal: #339999            /* Secondary brand color */
--mbx-teal-ink: #0A4F4F        /* Dark teal */
--mbx-teal-mid: #2C8B8B        /* Mid teal */
--mbx-highlight: #00CFFF       /* Accent/focus color */
--mbx-ink: #0B1F24             /* Primary text */
--mbx-bg: #f8fdf9              /* Light background */
```

### Design System
- Typography: Inter (400-900)
- Border Radius: Semi-glow buttons with 2xl radius
- Motion: Cubic bezier easing
- Max Width: 1440px
- Spacing: 8px base unit system

---

## 🗺️ Page Routes

### Public Routes
- `/` - Home (light theme)
- `/about` - About Meauxbility (dark theme)
- `/programs` - Grant programs & eligibility (light)
- `/community` - Community stories & events (dark)
- `/resources` - Helpful resources & guides (dark)
- `/connect` - Contact form (light)
- `/impact` - Donation page (light)

### Legacy Redirects (SEO preservation)
- `/about.html` → `/about` (301)
- `/apply.html` → `/programs` (301)
- `/donate.html` → `/impact` (301)
- `/contact.html` → `/connect` (301)
- `/index.html` → `/` (301)
- `/stories.html` → `/community` (301)

All redirects are permanent (301) and configured in `next.config.js`.

---

## 🔌 API Endpoints

### POST `/api/donations`
Creates Stripe PaymentIntent for donations.
```typescript
// Request
{ amount: 5000, currency: 'usd', metadata: {} }

// Response
{ clientSecret: 'pi_...', paymentIntentId: 'pi_...' }
```

### POST `/api/forms/contact`
Sends contact form emails via Resend.
```typescript
// Request
{ name, email, phone, subject, message }

// Response
{ success: true, message: 'Message sent successfully' }
```

### POST `/api/subscribe`
Subscribes email to newsletter via Supabase.
```typescript
// Request
{ email: 'user@example.com' }

// Response
{ success: true, message: 'Successfully subscribed' }
```

### POST `/api/upload`
Uploads files to Supabase Storage.
```typescript
// Request: multipart/form-data with 'file' field

// Response
{ success: true, url: 'https://...', fileName: '...' }
```

---

## 🔐 Environment Variables

Required environment variables for deployment:

```env
# Stripe Integration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase Integration
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Resend Email Service
RESEND_API_KEY=re_...
ADMIN_EMAIL=info@meauxbility.org

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://www.meauxbility.org
```

**Security Notes:**
- Never commit `.env` files to version control
- Use Vercel's environment variable dashboard for production
- Service role keys should only be used in API routes (server-side)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0+
- npm 9.0+

### Installation

```bash
# Clone repository
git clone https://github.com/InnerAnimal/meauxbility.org.git
cd meauxbility.org

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local
# Add your environment variables

# Run development server
npm run dev
```

Visit http://localhost:3000 to view the site.

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

---

## 🌐 Deployment

### Vercel Deployment

1. **Link to existing Vercel project:**
   ```bash
   vercel link --project prj_tLe5xpmnA0hbDNRytqCbWq8R2Gul
   ```

2. **Set environment variables in Vercel dashboard:**
   - Go to Project Settings → Environment Variables
   - Add all required environment variables
   - Set for Production, Preview, and Development

3. **Deploy:**
   ```bash
   # Deploy to production
   vercel deploy --prod

   # Or push to main branch for automatic deployment
   git push origin main
   ```

### Build & Deploy Commands

```bash
# Vercel will automatically run:
npm run build    # Builds the Next.js application
npm start        # Starts the production server
```

---

## ✅ Acceptance Checklist

- ✅ Home `/` renders light theme; header/footer match brand
- ✅ All nav routes exist and load without .html extensions
- ✅ Legacy .html paths 301 redirect to clean routes
- ✅ Stripe donation integration configured
- ✅ Contact form sends emails via Resend
- ✅ Newsletter subscription stores to Supabase
- ✅ File upload works with Supabase Storage
- ✅ repo.json updated with project metadata
- ✅ README.md documents all features and setup
- ✅ TypeScript strict mode enabled
- ✅ Responsive design (mobile-first)
- ✅ Accessibility features (WCAG 2.1 AA)
- ✅ Reduced motion support

### Performance Targets
- Lighthouse Performance: ≥ 90
- Lighthouse Accessibility: ≥ 95
- Lighthouse SEO: ≥ 95
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s

---

## 🎨 Theme System

Pages are automatically themed based on route:

### Light Theme Pages
- Home (`/`)
- Programs (`/programs`)
- Connect (`/connect`)
- Impact (`/impact`)

### Dark Theme Pages
- About (`/about`)
- Community (`/community`)
- Resources (`/resources`)

Dark theme is applied by adding `theme-dark` class to the page wrapper, which updates CSS variables for dark backgrounds and light text.

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - App Router with Server Components
- **React 18** - UI framework
- **TypeScript** - Type safety
- **CSS Modules** - Scoped component styles
- **CSS Variables** - Brand token system

### Backend & Services
- **Stripe** - Payment processing for donations
- **Supabase** - Database, authentication, and file storage
- **Resend** - Transactional email service
- **Vercel** - Hosting and deployment

### Development Tools
- **ESLint** - Code linting
- **TypeScript Compiler** - Type checking
- **Git** - Version control

---

## 📱 Responsive Design

Mobile-first approach with breakpoints:

```css
/* Mobile: < 640px (base styles) */
/* Tablet: ≥ 640px */
/* Desktop: ≥ 768px */
/* Large Desktop: ≥ 1024px */
/* XL: ≥ 1440px (max-width) */
```

All components are fully responsive and tested across devices.

---

## ♿ Accessibility

- Semantic HTML5 elements
- ARIA labels on interactive elements
- Focus states visible on all interactive elements
- Keyboard navigation support
- Color contrast meets WCAG 2.1 AA standards
- Reduced motion support via `prefers-reduced-motion`
- Alt text on all images (when implemented)
- Form labels and error messages

---

## 📊 Analytics & Monitoring

To be implemented:
- Google Analytics 4
- Sentry for error tracking
- Vercel Analytics
- Stripe Dashboard for donation tracking

---

## 👥 Team

- **Sam** - Founder & CEO
- **Connor McNeely** - CTO
- **Fred Williams** - CMO

---

## 📞 Contact

- **Website:** https://www.meauxbility.org
- **Email:** info@meauxbility.org
- **Location:** Lafayette, Louisiana (Acadiana Region)
- **EIN:** 33-4214907

---

## 📜 License

© 2024-2025 Meauxbility. All rights reserved.
501(c)(3) Nonprofit Organization

---

## 📝 Development Notes

### Working with This Codebase

1. **Brand Tokens:** All colors/spacing defined in `styles/mbx-tokens.css`
2. **Components:** Use CSS Modules for component-specific styles
3. **API Routes:** Server-side only, use environment variables
4. **Type Safety:** Run `npm run type-check` before committing
5. **Accessibility:** Test with keyboard navigation and screen readers

### Adding New Pages

1. Create directory in `app/`
2. Add `page.tsx` with metadata export
3. Create corresponding `.module.css` file
4. Update Header navigation if needed
5. Add to `repo.json` routes array

### Common Tasks

```bash
# Add new dependency
npm install package-name

# Update all dependencies
npm update

# Check for outdated packages
npm outdated

# Run production build locally
npm run build && npm start
```

---

*Last Updated: November 2024*
*Version: 2.0.0 - Next.js App Router Rebuild*

