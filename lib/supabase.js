import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vzmhofeqtbzxcgygkwsd.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6bWhvZmVxdGJ6eGNneWdrd3NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExODMzOTYsImV4cCI6MjA5Njc1OTM5Nn0.WWTXbqlgZUB59g3-LYGi589WfV6ITLumucvU6SJP4mY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)