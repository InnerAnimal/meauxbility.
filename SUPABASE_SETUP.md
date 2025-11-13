# Meauxbility Supabase Setup Guide

## Project Information
- **Project Ref**: `ghiulqoqujsiofsjcrqk`
- **Project URL**: `https://ghiulqoqujsiofsjcrqk.supabase.co`
- **Schemas**: `public`, `auth`, `storage`, `realtime`

---

## 📋 Setup Steps

### 1. Run Database Migrations

Run the migration file to create all necessary tables, indexes, RLS policies, and triggers:

```bash
# Navigate to your project
cd meauxbility.org

# Run migration in Supabase SQL Editor
# Copy contents of supabase/migrations/001_meauxbility_schema.sql
# Paste and execute in Supabase Dashboard → SQL Editor
```

Or using Supabase CLI:

```bash
supabase db push
```

### 2. Configure Environment Variables

Update your `.env.local` file with actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ghiulqoqujsiofsjcrqk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key
```

Get these keys from: **Supabase Dashboard → Project Settings → API**

### 3. Set Up Storage Buckets (Optional)

If you need file uploads (e.g., for application documents or success story images):

```sql
-- Create storage bucket for grant application documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('grant-documents', 'grant-documents', false);

-- Create storage bucket for success story images
INSERT INTO storage.buckets (id, name, public)
VALUES ('story-images', 'story-images', true);

-- RLS policy for grant documents (applicants can upload their own)
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'grant-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS policy for story images (admins can upload)
CREATE POLICY "Admins can upload story images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'story-images'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);
```

---

## 🗄️ Database Schema

### Tables Created

#### `grant_applications`
Stores grant application submissions from SCI survivors

**Key Fields:**
- `applicant_id` - Links to auth.users
- `name`, `email`, `phone`, `address`, `city`, `zip`
- `injury_date`, `injury_level`
- `equipment_needed`, `estimated_cost`
- `status` - 'pending', 'under_review', 'approved', 'denied'
- `review_notes` - Admin notes on the application

**RLS Policies:**
- Users can submit applications
- Users can view their own applications
- Admins can view and update all applications

#### `meauxbility_donations`
Tracks donations processed through Stripe

**Key Fields:**
- `donor_id` - Links to auth.users (optional for anonymous)
- `donor_name`, `donor_email`
- `stripe_session_id`, `stripe_payment_intent_id`
- `amount`, `currency`
- `status` - 'pending', 'completed', 'failed', 'refunded'
- `donation_type` - 'one_time', 'recurring'

**RLS Policies:**
- Anyone can create donations (for anonymous donations)
- Users can view their own donations
- Admins can view all donations

#### `success_stories`
Published success stories of grant recipients

**Key Fields:**
- `title`, `story_text`
- `recipient_name`, `recipient_location`
- `grant_amount`, `equipment_received`
- `image_url`
- `is_published` - Controls visibility

**RLS Policies:**
- Anyone can view published stories
- Admins can create, update, and view all stories

#### `contact_submissions`
Contact form submissions from the website

**Key Fields:**
- `name`, `email`, `message`
- `status` - 'new', 'read', 'responded', 'archived'
- `response`, `responded_by`, `responded_at`

**RLS Policies:**
- Anyone can submit contact forms
- Admins can view and update submissions

#### `admin_notes`
Internal notes on applications, donations, or contacts

**Key Fields:**
- `reference_type` - 'grant_application', 'donation', 'contact_submission'
- `reference_id` - ID of the related record
- `note` - Note content
- `created_by` - Admin who created the note

**RLS Policies:**
- Only admins can view and create notes

### Views

#### `dashboard_stats`
Aggregated statistics for the admin dashboard

Returns:
- `pending_applications` - Count of pending grant applications
- `approved_applications` - Count of approved applications
- `total_donations` - Sum of completed donations
- `total_donation_count` - Count of donations
- `unread_messages` - Count of new contact submissions
- `published_stories` - Count of published success stories

---

## 🔐 Row Level Security (RLS)

All tables have RLS enabled. Key policies:

### Public Access
- ✅ Anyone can submit grant applications
- ✅ Anyone can create donations (anonymous donations)
- ✅ Anyone can view published success stories
- ✅ Anyone can submit contact forms

### User Access
- ✅ Users can view their own grant applications
- ✅ Users can view their own donations

### Admin Access
- ✅ Admins can view all grant applications
- ✅ Admins can update application status and add review notes
- ✅ Admins can view all donations
- ✅ Admins can create and manage success stories
- ✅ Admins can view and respond to contact submissions
- ✅ Admins can create internal notes

**Admin Role Check:**
```sql
EXISTS (
  SELECT 1 FROM public.profiles
  WHERE profiles.id = auth.uid()
  AND profiles.role = 'admin'
)
```

---

## 👥 User Management

### Create Admin User

After a user signs up, promote them to admin:

```sql
-- Update user role to admin
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@meauxbility.org';
```

### User Roles

Defined in `profiles.role`:
- `'user'` - Regular user (donors, applicants)
- `'admin'` - Administrator (full access)
- `'volunteer'` - Volunteer (future use)

---

## 🔗 Integration Examples

### Frontend: Submit Grant Application

```typescript
import { createClient } from '@/lib/integrations/supabase-client'

const supabase = createClient()

const { data, error } = await supabase
  .from('grant_applications')
  .insert({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-0123',
    address: '123 Main St',
    city: 'Lafayette',
    zip: '70501',
    injury_date: '2020-01-15',
    injury_level: 'T6',
    equipment_needed: 'Wheelchair ramp',
    estimated_cost: '$3,000',
    additional_info: 'Need ramp for home entrance',
  })
  .select()
  .single()
```

### Backend API: Fetch Applications (Admin)

```typescript
import { createClient } from '@/lib/integrations/supabase-server'

const supabase = await createClient()

const { data, error } = await supabase
  .from('grant_applications')
  .select('*')
  .order('submitted_at', { ascending: false })

// This will only work if the authenticated user is an admin
// (enforced by RLS policy)
```

### Backend API: Create Donation Record

```typescript
import { createServiceClient } from '@/lib/integrations/supabase-server'

const supabase = await createServiceClient()

const { data, error } = await supabase
  .from('meauxbility_donations')
  .insert({
    stripe_session_id: session.id,
    amount: 100.00,
    donor_email: 'donor@example.com',
    donor_name: 'Jane Smith',
    status: 'completed',
    currency: 'usd',
  })
  .select()
  .single()
```

### Fetch Dashboard Stats (Admin)

```typescript
const { data, error } = await supabase
  .from('dashboard_stats')
  .select('*')
  .single()

// Returns:
// {
//   pending_applications: 5,
//   approved_applications: 23,
//   total_donations: 15000.00,
//   total_donation_count: 87,
//   unread_messages: 3,
//   published_stories: 12
// }
```

---

## 🧪 Testing

### Test Data Inserts

```sql
-- Insert test admin user profile
INSERT INTO public.profiles (id, email, role)
VALUES (
  'test-admin-uuid',
  'admin@meauxbility.org',
  'admin'
);

-- Insert test grant application
INSERT INTO public.grant_applications (
  name, email, phone, address, city, zip,
  injury_date, injury_level, equipment_needed, estimated_cost
) VALUES (
  'Test Applicant',
  'test@example.com',
  '555-0123',
  '123 Test St',
  'Lafayette',
  '70501',
  '2020-01-01',
  'T6',
  'Wheelchair',
  '$5,000'
);

-- Insert test donation
INSERT INTO public.meauxbility_donations (
  donor_name, donor_email, amount, status
) VALUES (
  'Test Donor',
  'donor@example.com',
  100.00,
  'completed'
);

-- Insert test success story
INSERT INTO public.success_stories (
  title, story_text, recipient_name, is_published
) VALUES (
  'Life-Changing Mobility Grant',
  'This grant helped me regain my independence...',
  'John Smith',
  true
);
```

---

## 📊 Monitoring

### Check Table Counts

```sql
SELECT
  (SELECT COUNT(*) FROM public.grant_applications) as applications,
  (SELECT COUNT(*) FROM public.meauxbility_donations) as donations,
  (SELECT COUNT(*) FROM public.success_stories) as stories,
  (SELECT COUNT(*) FROM public.contact_submissions) as contacts;
```

### Recent Activity

```sql
-- Recent grant applications
SELECT * FROM public.grant_applications
ORDER BY submitted_at DESC
LIMIT 10;

-- Recent donations
SELECT * FROM public.meauxbility_donations
WHERE status = 'completed'
ORDER BY created_at DESC
LIMIT 10;
```

---

## 🔧 Maintenance

### Backup Recommendations

1. Enable Point-in-Time Recovery (PITR) in Supabase Dashboard
2. Set up weekly backups
3. Test restoration procedures

### Index Maintenance

Indexes are automatically created via migration. Monitor slow queries and add indexes as needed:

```sql
-- Example: Add index if queries filter by status frequently
CREATE INDEX IF NOT EXISTS idx_custom_field
ON public.grant_applications(custom_field);
```

---

## 🚨 Troubleshooting

### RLS Policy Issues

If queries are returning empty results:

1. Check if user is authenticated:
```typescript
const { data: { user } } = await supabase.auth.getUser()
console.log('User:', user)
```

2. Check user role:
```sql
SELECT role FROM public.profiles WHERE id = auth.uid();
```

3. Test policy in SQL Editor:
```sql
-- Test as specific user
SET request.jwt.claim.sub = 'user-uuid-here';
SELECT * FROM public.grant_applications;
```

### Permission Errors

If getting permission denied errors:
- Ensure RLS policies exist for the operation
- Check if user has required role
- Verify table RLS is enabled: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Client Library](https://supabase.com/docs/reference/javascript/introduction)
- [Storage Guide](https://supabase.com/docs/guides/storage)

---

**Need Help?** Check the [Meauxbility README-NEXTJS.md](./README-NEXTJS.md) for integration examples.
