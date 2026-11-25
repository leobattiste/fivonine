-- Require the existing server-only backend secret in addition to verified user authentication.
-- Direct Data API calls made with a session must never be able to delete an account.
REVOKE ALL ON FUNCTION public.delete_my_empty_account() FROM PUBLIC, anon, authenticated;
DROP FUNCTION IF EXISTS public.delete_my_empty_account();

CREATE FUNCTION public.delete_my_empty_account(backend_secret text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE uid uuid := auth.uid();
BEGIN
 IF uid IS NULL OR NOT private.valid_backend(backend_secret) THEN
   RAISE EXCEPTION 'Unauthorized';
 END IF;
 IF NOT EXISTS (SELECT 1 FROM public.account_deletion_requests
   WHERE user_id=uid AND status='pending') THEN
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
REVOKE ALL ON FUNCTION public.delete_my_empty_account(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.delete_my_empty_account(text) TO authenticated;