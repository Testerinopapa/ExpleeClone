import { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';

export default function useAuthSession() {
  const [state, setState] = useState({ session: null, loading: true });
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setState({ session: data.session, loading: false });
    }).catch(() => { if (active) setState({ session: null, loading: false }); });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setState({ session, loading: false });
    });
    return () => { active = false; data.subscription.unsubscribe(); };
  }, []);
  return state;
}
