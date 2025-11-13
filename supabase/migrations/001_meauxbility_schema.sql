-- =====================================================
-- Meauxbility.org - Database Schema & RLS Policies
-- Project ref: ghiulqoqujsiofsjcrqk
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- Grant Applications Table
CREATE TABLE IF NOT EXISTS public.grant_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  applicant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Applicant Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  zip TEXT NOT NULL,

  -- Injury Information
  injury_date DATE NOT NULL,
  injury_level TEXT NOT NULL,

  -- Grant Request
  equipment_needed TEXT NOT NULL,
  estimated_cost TEXT NOT NULL,
  additional_info TEXT,

  -- Application Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'denied')),
  review_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,

  -- Metadata
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Donations Table (extending existing or creating new)
CREATE TABLE IF NOT EXISTS public.meauxbility_donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Donor Information
  donor_name TEXT,
  donor_email TEXT,

  -- Payment Information
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',

  -- Donation Details
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  donation_type TEXT NOT NULL DEFAULT 'one_time' CHECK (donation_type IN ('one_time', 'recurring')),
  dedication TEXT,

  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Success Stories Table
CREATE TABLE IF NOT EXISTS public.success_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Story Content
  title TEXT NOT NULL,
  story_text TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  recipient_location TEXT,
  grant_amount DECIMAL(10, 2),
  equipment_received TEXT,

  -- Media
  image_url TEXT,

  -- Publishing
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,

  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Contact Form Submissions Table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Contact Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,

  -- Status
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded', 'archived')),
  response TEXT,
  responded_by UUID REFERENCES auth.users(id),
  responded_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Admin Notes Table
CREATE TABLE IF NOT EXISTS public.admin_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Reference
  reference_type TEXT NOT NULL CHECK (reference_type IN ('grant_application', 'donation', 'contact_submission')),
  reference_id UUID NOT NULL,

  -- Note Content
  note TEXT NOT NULL,

  -- Metadata
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Grant Applications Indexes
CREATE INDEX IF NOT EXISTS idx_grant_applications_applicant_id ON public.grant_applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_grant_applications_status ON public.grant_applications(status);
CREATE INDEX IF NOT EXISTS idx_grant_applications_submitted_at ON public.grant_applications(submitted_at DESC);

-- Donations Indexes
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON public.meauxbility_donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.meauxbility_donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_stripe_session_id ON public.meauxbility_donations(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON public.meauxbility_donations(created_at DESC);

-- Success Stories Indexes
CREATE INDEX IF NOT EXISTS idx_success_stories_published ON public.success_stories(is_published, published_at DESC);

-- Contact Submissions Indexes
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);

-- Admin Notes Indexes
CREATE INDEX IF NOT EXISTS idx_admin_notes_reference ON public.admin_notes(reference_type, reference_id);
CREATE INDEX IF NOT EXISTS idx_admin_notes_created_by ON public.admin_notes(created_by);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.grant_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meauxbility_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- GRANT APPLICATIONS POLICIES
-- =====================================================

-- Allow authenticated users to insert their own application
CREATE POLICY "Users can submit grant applications"
ON public.grant_applications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = applicant_id OR applicant_id IS NULL);

-- Allow users to view their own applications
CREATE POLICY "Users can view own applications"
ON public.grant_applications
FOR SELECT
TO authenticated
USING (auth.uid() = applicant_id);

-- Allow admins to view all applications
CREATE POLICY "Admins can view all applications"
ON public.grant_applications
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Allow admins to update applications
CREATE POLICY "Admins can update applications"
ON public.grant_applications
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- =====================================================
-- DONATIONS POLICIES
-- =====================================================

-- Allow anyone to insert donations (for anonymous donations)
CREATE POLICY "Anyone can create donations"
ON public.meauxbility_donations
FOR INSERT
TO public, authenticated
WITH CHECK (true);

-- Allow users to view their own donations
CREATE POLICY "Users can view own donations"
ON public.meauxbility_donations
FOR SELECT
TO authenticated
USING (auth.uid() = donor_id);

-- Allow admins to view all donations
CREATE POLICY "Admins can view all donations"
ON public.meauxbility_donations
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Allow admins to update donation status
CREATE POLICY "Admins can update donations"
ON public.meauxbility_donations
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- =====================================================
-- SUCCESS STORIES POLICIES
-- =====================================================

-- Allow anyone to view published stories
CREATE POLICY "Anyone can view published stories"
ON public.success_stories
FOR SELECT
TO public, authenticated
USING (is_published = true);

-- Allow admins to view all stories
CREATE POLICY "Admins can view all stories"
ON public.success_stories
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Allow admins to insert stories
CREATE POLICY "Admins can create stories"
ON public.success_stories
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Allow admins to update stories
CREATE POLICY "Admins can update stories"
ON public.success_stories
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- =====================================================
-- CONTACT SUBMISSIONS POLICIES
-- =====================================================

-- Allow anyone to submit contact forms
CREATE POLICY "Anyone can submit contact forms"
ON public.contact_submissions
FOR INSERT
TO public, authenticated
WITH CHECK (true);

-- Allow admins to view all submissions
CREATE POLICY "Admins can view contact submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Allow admins to update submissions
CREATE POLICY "Admins can update contact submissions"
ON public.contact_submissions
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- =====================================================
-- ADMIN NOTES POLICIES
-- =====================================================

-- Allow admins to view all notes
CREATE POLICY "Admins can view admin notes"
ON public.admin_notes
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Allow admins to create notes
CREATE POLICY "Admins can create notes"
ON public.admin_notes
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
  AND created_by = auth.uid()
);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_grant_applications_updated_at
  BEFORE UPDATE ON public.grant_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_donations_updated_at
  BEFORE UPDATE ON public.meauxbility_donations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_success_stories_updated_at
  BEFORE UPDATE ON public.success_stories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_notes_updated_at
  BEFORE UPDATE ON public.admin_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- HELPER VIEWS
-- =====================================================

-- View for dashboard statistics (admins only)
CREATE OR REPLACE VIEW public.dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM public.grant_applications WHERE status = 'pending') as pending_applications,
  (SELECT COUNT(*) FROM public.grant_applications WHERE status = 'approved') as approved_applications,
  (SELECT SUM(amount) FROM public.meauxbility_donations WHERE status = 'completed') as total_donations,
  (SELECT COUNT(*) FROM public.meauxbility_donations WHERE status = 'completed') as total_donation_count,
  (SELECT COUNT(*) FROM public.contact_submissions WHERE status = 'new') as unread_messages,
  (SELECT COUNT(*) FROM public.success_stories WHERE is_published = true) as published_stories;

-- Grant view policy (admins only)
CREATE POLICY "Admins can view dashboard stats"
ON public.dashboard_stats
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);
