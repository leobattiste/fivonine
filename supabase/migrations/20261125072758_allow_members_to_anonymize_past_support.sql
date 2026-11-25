-- Member-initiated irreversible masking of historical supporter identity.
CREATE OR REPLACE FUNCTION public.anonymize_my_support()
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE uid uuid := auth.uid(); n integer;
BEGIN
 IF uid IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
 UPDATE public.contributions
    SET anonymous = true, display_name = NULL
  WHERE user_id = uid AND (NOT anonymous OR display_name IS NOT NULL);
 GET DIAGNOSTICS n = ROW_COUNT;
 RETURN n;
END;
$$;
REVOKE ALL ON FUNCTION public.anonymize_my_support() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.anonymize_my_support() TO authenticated;