-- Security policies and RLS setup
-- Run this migration to implement proper Row Level Security

-- Enable RLS on critical tables
ALTER TABLE IF EXISTS public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.member_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.biometric_data ENABLE ROW LEVEL SECURITY;

-- Members table policies
DROP POLICY IF EXISTS "members_select_policy" ON public.members;
CREATE POLICY "members_select_policy" ON public.members
    FOR SELECT USING (
        auth.uid() = id OR 
        auth.jwt() ->> 'role' = 'admin' OR
        auth.jwt() ->> 'role' = 'staff'
    );

DROP POLICY IF EXISTS "members_update_policy" ON public.members;
CREATE POLICY "members_update_policy" ON public.members
    FOR UPDATE USING (auth.uid() = id OR auth.jwt() ->> 'role' = 'admin');

-- Member integrations policies (strict - only owner can access)
DROP POLICY IF EXISTS "integrations_select_policy" ON public.member_integrations;
CREATE POLICY "integrations_select_policy" ON public.member_integrations
    FOR SELECT USING (auth.uid() = member_id);

DROP POLICY IF EXISTS "integrations_insert_policy" ON public.member_integrations;
CREATE POLICY "integrations_insert_policy" ON public.member_integrations
    FOR INSERT WITH CHECK (auth.uid() = member_id);

DROP POLICY IF EXISTS "integrations_update_policy" ON public.member_integrations;
CREATE POLICY "integrations_update_policy" ON public.member_integrations
    FOR UPDATE USING (auth.uid() = member_id);

-- Payments table policies
DROP POLICY IF EXISTS "payments_select_policy" ON public.payments;
CREATE POLICY "payments_select_policy" ON public.payments
    FOR SELECT USING (
        auth.uid() = member_id OR 
        auth.jwt() ->> 'role' = 'admin' OR
        auth.jwt() ->> 'role' = 'staff'
    );

DROP POLICY IF EXISTS "payments_insert_policy" ON public.payments;
CREATE POLICY "payments_insert_policy" ON public.payments
    FOR INSERT WITH CHECK (
        auth.uid() = member_id OR 
        auth.jwt() ->> 'role' = 'admin'
    );

-- Biometric data policies (extremely restrictive)
DROP POLICY IF EXISTS "biometric_select_policy" ON public.biometric_data;
CREATE POLICY "biometric_select_policy" ON public.biometric_data
    FOR SELECT USING (
        auth.uid() = member_id AND 
        (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'staff')
    );

DROP POLICY IF EXISTS "biometric_insert_policy" ON public.biometric_data;
CREATE POLICY "biometric_insert_policy" ON public.biometric_data
    FOR INSERT WITH CHECK (
        auth.jwt() ->> 'role' = 'admin' OR 
        auth.jwt() ->> 'role' = 'staff'
    );

-- Access logs policies (read-only for users, full access for staff)
DROP POLICY IF EXISTS "access_logs_select_policy" ON public.access_logs;
CREATE POLICY "access_logs_select_policy" ON public.access_logs
    FOR SELECT USING (
        auth.uid() = member_id OR 
        auth.jwt() ->> 'role' = 'admin' OR
        auth.jwt() ->> 'role' = 'staff'
    );

DROP POLICY IF EXISTS "access_logs_insert_policy" ON public.access_logs;
CREATE POLICY "access_logs_insert_policy" ON public.access_logs
    FOR INSERT WITH CHECK (
        auth.jwt() ->> 'role' = 'admin' OR 
        auth.jwt() ->> 'role' = 'staff'
    );

-- Create audit log table for security events
CREATE TABLE IF NOT EXISTS public.security_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    ip_address INET,
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can read audit logs
CREATE POLICY "audit_log_admin_only" ON public.security_audit_log
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
    p_event_type TEXT,
    p_details JSONB DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    INSERT INTO public.security_audit_log (
        event_type,
        user_id,
        details
    ) VALUES (
        p_event_type,
        auth.uid(),
        p_details
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;