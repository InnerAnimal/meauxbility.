// Meauxbility Database Types
// Generated from Supabase schema

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type UserRole = 'user' | 'admin' | 'volunteer'

export type GrantApplicationStatus = 'pending' | 'under_review' | 'approved' | 'denied'

export type DonationStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export type DonationType = 'one_time' | 'recurring'

export type ContactSubmissionStatus = 'new' | 'read' | 'responded' | 'archived'

export type AdminNoteReferenceType = 'grant_application' | 'donation' | 'contact_submission'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          role: UserRole
          admin_type: string | null
          metadata: Json | null
          preferences: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          role?: UserRole
          admin_type?: string | null
          metadata?: Json | null
          preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          role?: UserRole
          admin_type?: string | null
          metadata?: Json | null
          preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      grant_applications: {
        Row: {
          id: string
          applicant_id: string | null
          name: string
          email: string
          phone: string
          address: string
          city: string
          zip: string
          injury_date: string
          injury_level: string
          equipment_needed: string
          estimated_cost: string
          additional_info: string | null
          status: GrantApplicationStatus
          review_notes: string | null
          reviewed_by: string | null
          reviewed_at: string | null
          submitted_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          applicant_id?: string | null
          name: string
          email: string
          phone: string
          address: string
          city: string
          zip: string
          injury_date: string
          injury_level: string
          equipment_needed: string
          estimated_cost: string
          additional_info?: string | null
          status?: GrantApplicationStatus
          review_notes?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          submitted_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          applicant_id?: string | null
          name?: string
          email?: string
          phone?: string
          address?: string
          city?: string
          zip?: string
          injury_date?: string
          injury_level?: string
          equipment_needed?: string
          estimated_cost?: string
          additional_info?: string | null
          status?: GrantApplicationStatus
          review_notes?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          submitted_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      meauxbility_donations: {
        Row: {
          id: string
          donor_id: string | null
          donor_name: string | null
          donor_email: string | null
          stripe_session_id: string | null
          stripe_payment_intent_id: string | null
          amount: number
          currency: string
          status: DonationStatus
          donation_type: DonationType
          dedication: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          donor_id?: string | null
          donor_name?: string | null
          donor_email?: string | null
          stripe_session_id?: string | null
          stripe_payment_intent_id?: string | null
          amount: number
          currency?: string
          status?: DonationStatus
          donation_type?: DonationType
          dedication?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          donor_id?: string | null
          donor_name?: string | null
          donor_email?: string | null
          stripe_session_id?: string | null
          stripe_payment_intent_id?: string | null
          amount?: number
          currency?: string
          status?: DonationStatus
          donation_type?: DonationType
          dedication?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      success_stories: {
        Row: {
          id: string
          title: string
          story_text: string
          recipient_name: string
          recipient_location: string | null
          grant_amount: number | null
          equipment_received: string | null
          image_url: string | null
          is_published: boolean
          published_at: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          story_text: string
          recipient_name: string
          recipient_location?: string | null
          grant_amount?: number | null
          equipment_received?: string | null
          image_url?: string | null
          is_published?: boolean
          published_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          story_text?: string
          recipient_name?: string
          recipient_location?: string | null
          grant_amount?: number | null
          equipment_received?: string | null
          image_url?: string | null
          is_published?: boolean
          published_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          status: ContactSubmissionStatus
          response: string | null
          responded_by: string | null
          responded_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          status?: ContactSubmissionStatus
          response?: string | null
          responded_by?: string | null
          responded_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          message?: string
          status?: ContactSubmissionStatus
          response?: string | null
          responded_by?: string | null
          responded_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      admin_notes: {
        Row: {
          id: string
          reference_type: AdminNoteReferenceType
          reference_id: string
          note: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reference_type: AdminNoteReferenceType
          reference_id: string
          note: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reference_type?: AdminNoteReferenceType
          reference_id?: string
          note?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      dashboard_stats: {
        Row: {
          pending_applications: number
          approved_applications: number
          total_donations: number
          total_donation_count: number
          unread_messages: number
          published_stories: number
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: UserRole
      grant_application_status: GrantApplicationStatus
      donation_status: DonationStatus
      donation_type: DonationType
      contact_submission_status: ContactSubmissionStatus
      admin_note_reference_type: AdminNoteReferenceType
    }
  }
}
