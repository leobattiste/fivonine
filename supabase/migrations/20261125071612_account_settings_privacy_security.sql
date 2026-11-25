-- Account preferences, privacy, activity and safe deletion workflow.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS display_locale text NOT NULL DEFAULT 'fr' CHECK (display_locale IN ('en','fr','ht','es')),
  ADD COLUMN IF NOT EXISTS date_style text NOT NULL DEFAULT 'long' CHECK (date_style IN ('long','short')),
  ADD COLUMN IF NOT EXISTS currency_style text NOT NULL DEFAULT 'code' CHECK (currency_style IN ('code','symbol')),
  ADD COLUMN IF NOT EXISTS reduce_motion boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS large_text boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS high_contrast boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS notify_fundraisers boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_bookmarks boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_reminders boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_marketing boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS public_profile boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_bio boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_location boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS default_anonymous boolean NOT NULL DEFAULT false;
UPDATE public.profiles SET display_locale = locale WHERE display_locale = 'fr' AND locale <> 'fr';

CREATE TABLE IF NOT EXISTS public.account_deletion_requests (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','review','completed')),
  requested_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.account_deletion_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own_deletion_requests_read" ON public.account_deletion_requests;
CREATE POLICY "own_deletion_requests_read" ON public.account_deletion_requests FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);
DROP POLICY IF EXISTS "own_deletion_requests_insert" ON public.account_deletion_requests;
CREATE POLICY "own_deletion_requests_insert" ON public.account_deletion_requests FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id AND status = 'pending');
REVOKE ALL ON public.account_deletion_requests FROM anon, authenticated;
GRANT SELECT, INSERT ON public.account_deletion_requests TO authenticated;

-- Only non-sensitive, own-session metadata is returned.
CREATE OR REPLACE FUNCTION public.my_active_sessions()
RETURNS TABLE(session_id uuid, created_at timestamptz, last_seen_at timestamptz, device text, is_current boolean)
LANGUAGE sql SECURITY DEFINER SET search_path = ''
AS $$
 SELECT s.id, s.created_at,
        COALESCE(s.updated_at, s.created_at),
        LEFT(COALESCE(s.user_agent, 'Unknown browser'), 180),
        s.id::text = COALESCE((auth.jwt() ->> 'session_id'),'')
   FROM auth.sessions AS s
  WHERE auth.uid() IS NOT NULL AND s.user_id = auth.uid()
  ORDER BY s.updated_at DESC LIMIT 20;
$$;
REVOKE ALL ON FUNCTION public.my_active_sessions() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.my_active_sessions() TO authenticated;

-- Auth's own audit trail, filtered to this authenticated user.
CREATE OR REPLACE FUNCTION public.my_security_activity()
RETURNS TABLE(action text, occurred_at timestamptz)
LANGUAGE sql SECURITY DEFINER SET search_path = ''
AS $$
 SELECT LEFT(COALESCE(a.payload::jsonb ->> 'action','Account event'),100), a.created_at
   FROM auth.audit_log_entries AS a
  WHERE auth.uid() IS NOT NULL
    AND a.payload::jsonb ->> 'actor_id' = auth.uid()::text
  ORDER BY a.created_at DESC LIMIT 20;
$$;
REVOKE ALL ON FUNCTION public.my_security_activity() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.my_security_activity() TO authenticated;

-- Preserve fundraiser histories and related safety/financial records.
-- This operation may only complete for accounts with no such obligations,
-- and must be invoked after independent password reauthentication.
CREATE OR REPLACE FUNCTION public.delete_my_empty_account()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE uid uuid := auth.uid();
BEGIN
 IF uid IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
 IF NOT EXISTS (SELECT 1 FROM public.account_deletion_requests WHERE user_id=uid AND status='pending') THEN
   RAISE EXCEPTION 'Deletion request required';
 END IF;
 IF EXISTS (SELECT 1 FROM public.campaigns WHERE owner_id=uid)
    OR EXISTS (SELECT 1 FROM public.contributions WHERE user_id=uid)
    OR EXISTS (SELECT 1 FROM public.vouches WHERE voucher_id=uid)
    OR EXISTS (SELECT 1 FROM public.campaign_members WHERE user_id=uid)
    OR EXISTS (SELECT 1 FROM public.campaign_updates WHERE author_id=uid)
    OR EXISTS (SELECT 1 FROM public.reports WHERE reporter_id=uid)
    OR EXISTS (SELECT 1 FROM public.contact_messages WHERE user_id=uid) THEN
   RAISE EXCEPTION 'Account has retained activity requiring review';
 END IF;
 DELETE FROM auth.users WHERE id=uid;
 RETURN FOUND;
END;
$$;
REVOKE ALL ON FUNCTION public.delete_my_empty_account() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.delete_my_empty_account() TO authenticated;

-- Filter optional email notices while keeping in-app notices and essential security emails.
CREATE OR REPLACE FUNCTION private.notify(uid uuid, k text, cid uuid, p jsonb)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
 IF uid IS NULL THEN RETURN; END IF;
 INSERT INTO public.notifications(user_id,kind,campaign_id,payload) VALUES(uid,k,cid,p);
 INSERT INTO public.email_outbox(recipient,locale,kind,payload)
 SELECT u.email, pr.locale, k, p
 FROM auth.users u JOIN public.profiles pr ON pr.id=u.id
 WHERE u.id=uid AND NOT pr.banned AND u.email IS NOT NULL AND (
   k LIKE 'security_%'
   OR (
     pr.email_notifications
     AND (CASE
        WHEN k = 'reminder' THEN pr.notify_reminders AND pr.notify_bookmarks
        WHEN k IN ('campaign_update') THEN pr.notify_bookmarks
        WHEN k LIKE 'marketing_%' THEN pr.notify_marketing
        ELSE pr.notify_fundraisers
       END)
   )
 );
END;
$$;

CREATE OR REPLACE FUNCTION private.enqueue_reminders(backend_secret text)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE b record; n integer := 0;
BEGIN
 IF NOT private.valid_backend(backend_secret) THEN RAISE EXCEPTION 'Unauthorized'; END IF;
 FOR b IN SELECT bm.user_id, bm.campaign_id, c.title, c.slug
   FROM public.bookmarks bm
   JOIN public.campaigns c ON c.id = bm.campaign_id AND c.status = 'live'
   JOIN public.profiles p ON p.id=bm.user_id AND p.notify_reminders AND p.notify_bookmarks
   WHERE bm.remind AND (bm.last_reminded IS NULL OR bm.last_reminded < now() - interval '30 days')
   AND bm.created_at < now() - interval '30 days' LIMIT 500 LOOP
   PERFORM private.notify(b.user_id,'reminder',b.campaign_id,jsonb_build_object('title',b.title,'slug',b.slug));
   UPDATE public.bookmarks SET last_reminded=now() WHERE user_id=b.user_id AND campaign_id=b.campaign_id;
   n:=n+1;
 END LOOP;
 RETURN n;
END;
$$;