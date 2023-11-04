'use client';

import { useSupabase } from '@/app/supabase-provider';
import { Button } from '@material-tailwind/react';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();
  const { supabase } = useSupabase();
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };
  return (
    <Button variant="text" color="white" onClick={handleSignOut}>
      Sign out
    </Button>
  );
}
