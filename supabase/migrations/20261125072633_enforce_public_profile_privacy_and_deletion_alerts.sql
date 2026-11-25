-- A private profile cannot be read by anonymous visitors or other members.
DROP POLICY IF EXISTS profiles_read ON public.profiles;
CREATE POLICY profiles_read ON public.profiles FOR SELECT TO anon, authenticated
USING (public_profile OR id = (SELECT auth.uid()) OR (SELECT private.is_admin()));

-- Public fundraisers must retain a publicly identifiable organizer.
CREATE OR REPLACE FUNCTION private.protect_organizer_profile_visibility()
RETURNS trigger LANGUAGE plpgsql SET search_path = ''
AS $$
BEGIN
 IF OLD.public_profile AND NOT NEW.public_profile
    AND EXISTS (SELECT 1 FROM public.campaigns c
      WHERE c.owner_id = NEW.id AND c.status IN ('live','completed')) THEN
   RAISE EXCEPTION 'A public fundraiser requires a visible organizer profile';
 END IF;
 RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS protect_organizer_profile_visibility ON public.profiles;
CREATE TRIGGER protect_organizer_profile_visibility
 BEFORE UPDATE OF public_profile ON public.profiles
 FOR EACH ROW EXECUTE FUNCTION private.protect_organizer_profile_visibility();

CREATE OR REPLACE FUNCTION private.protect_fundraiser_organizer_visibility()
RETURNS trigger LANGUAGE plpgsql SET search_path = ''
AS $$
BEGIN
 IF NEW.status IN ('live','completed') AND
    NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = NEW.owner_id AND p.public_profile) THEN
   RAISE EXCEPTION 'A public fundraiser requires a visible organizer profile';
 END IF;
 RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS protect_fundraiser_organizer_visibility ON public.campaigns;
CREATE TRIGGER protect_fundraiser_organizer_visibility
 BEFORE INSERT OR UPDATE OF status, owner_id ON public.campaigns
 FOR EACH ROW EXECUTE FUNCTION private.protect_fundraiser_organizer_visibility();

-- Deletion requests notify administrators for manual handling.
CREATE OR REPLACE FUNCTION private.notify(uid uuid, k text, cid uuid, p jsonb)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
 IF uid IS NULL THEN RETURN; END IF;
 INSERT INTO public.notifications(user_id,kind,campaign_id,payload) VALUES(uid,k,cid,p);
 INSERT INTO public.email_outbox(recipient,locale,kind,payload)
 SELECT u.email, pr.locale, k, p FROM auth.users u
 JOIN public.profiles pr ON pr.id=u.id
 WHERE u.id=uid AND NOT pr.banned AND u.email IS NOT NULL AND (
   k LIKE 'security_%' OR k LIKE 'admin_%'
   OR (pr.email_notifications AND CASE
      WHEN k='reminder' THEN pr.notify_reminders AND pr.notify_bookmarks
      WHEN k='campaign_update' THEN pr.notify_bookmarks
      WHEN k LIKE 'marketing_%' THEN pr.notify_marketing
      ELSE pr.notify_fundraisers END)
 );
END;
$$;
CREATE OR REPLACE FUNCTION private.alert_account_deletion_request()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE admin_id uuid;
BEGIN
 FOR admin_id IN SELECT id FROM public.profiles WHERE role='admin' AND NOT banned LOOP
   PERFORM private.notify(admin_id,'admin_deletion_request',NULL,
      jsonb_build_object('title','Deletion request', 'user_id',NEW.user_id));
 END LOOP;
 RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS alert_account_deletion_request ON public.account_deletion_requests;
CREATE TRIGGER alert_account_deletion_request AFTER INSERT ON public.account_deletion_requests
 FOR EACH ROW EXECUTE FUNCTION private.alert_account_deletion_request();