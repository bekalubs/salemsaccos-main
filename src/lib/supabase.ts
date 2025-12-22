import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Member = {
  id: string
  full_name: string
  father_name: string
  grandfather_name: string
  gender: string
  region: string
  woreda: string
  city_kebele: string
  occupation: string
  id_front_url?: string
  id_back_url?: string
  id_fcn: string
  kebele_id_front_url?: string
  kebele_id_back_url?: string
  referrer_phone?: string
  phone_number: string
  marital_status: string
  digital_signature_url?: string
  created_at: string
  updated_at: string
}