'use client';

import { postData } from '@/utils/helpers';
import { Typography, Button } from '@material-tailwind/react';
import { Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface Props {
  session: Session;
}

export default function ManageSubscriptionButton({ session }: Props) {
  const router = useRouter();
  const redirectToCustomerPortal = async () => {
    try {
      const { url } = await postData({
        url: '/api/create-portal-link'
      });
      router.push(url);
    } catch (error) {
      if (error) return alert((error as Error).message);
    }
  };

  return (
    <Typography as='div' className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
      <Typography className="pb-4 sm:pb-0">
        Manage your subscription on Stripe.
      </Typography>
      <Button
        color="white"
        size="lg"
        disabled={!session}
        onClick={redirectToCustomerPortal}
      >
        Open customer portal
      </Button>
    </Typography>
  );
}
