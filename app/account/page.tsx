import ManageSubscriptionButton from './ManageSubscriptionButton';
import {
  getSession,
  getUserDetails,
  getSubscription
} from '@/app/supabase-server';
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Input
} from '@/components/ui/MaterialTailwind';
import { Database } from '@/types_db';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Account() {
  const [session, userDetails, subscription] = await Promise.all([
    getSession(),
    getUserDetails(),
    getSubscription()
  ]);

  const user = session?.user;

  if (!session) {
    return redirect('/signin');
  }

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency!,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  const updateName = async (formData: FormData) => {
    'use server';

    const newName = formData.get('name') as string;
    const supabase = createServerActionClient<Database>({ cookies });
    const session = await getSession();
    const user = session?.user;
    const { error } = await supabase
      .from('users')
      .update({ full_name: newName })
      .eq('id', user?.id);
    if (error) {
      console.log(error);
    }
    revalidatePath('/account');
  };

  const updateEmail = async (formData: FormData) => {
    'use server';

    const newEmail = formData.get('email') as string;
    const supabase = createServerActionClient<Database>({ cookies });
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) {
      console.log(error);
    }
    revalidatePath('/account');
  };

  return (
    <section className="mb-32 bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <Typography
            variant="h1"
            className="font-extrabold sm:text-center sm:text-6xl"
          >
            Account
          </Typography>
          <Typography
            variant="lead"
            className="max-w-2xl m-auto mt-5 sm:text-center sm:text-2xl text-[rgb(228,228,231)]"
          >
            We partnered with Stripe for a simplified billing.
          </Typography>
        </div>
      </div>
      <div className="p-4">
        <Card className="w-full max-w-3xl m-auto my-8 border rounded-md p border-[rgb(63,63,70)] bg-transparent">
          <CardBody className="px-5 py-4">
            <Typography variant="h4" className="font-medium" color="white">
              Your Plan
            </Typography>
            <Typography className="text-[rgb(212,212,216)]">
              {subscription
                ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
                : 'You are not currently subscribed to any plan.'}
            </Typography>
            <div className="mt-8 mb-4 text-xl font-semibold text-white">
              {subscription ? (
                `${subscriptionPrice}/${subscription?.prices?.interval}`
              ) : (
                <Link href="/">Choose your plan</Link>
              )}
            </div>
          </CardBody>
          <CardFooter className="p-4 border-t rounded-b-md border-[rgb(63,63,70)] bg-[rgb(24,24,27)] text-[rgb(113,113,122)]">
            <ManageSubscriptionButton session={session} />
          </CardFooter>
        </Card>

        <Card className="w-full max-w-3xl m-auto my-8 border rounded-md p border-[rgb(63,63,70)] bg-transparent">
          <CardBody className="px-5 py-4">
            <Typography variant="h4" className="font-medium" color="white">
              Your Name
            </Typography>
            <Typography className="text-[rgb(212,212,216)]">
              Please enter your full name, or a display name you are comfortable
              with.{' '}
            </Typography>
            <div className="mt-8 mb-4 text-xl font-semibold">
              <form id="nameForm" action={updateName}>
                <div className="w-1/2">
                  <Input
                    type="text"
                    name="name"
                    size="lg"
                    color="white"
                    placeholder="Your name"
                    className="!border focus:!border-gray-300  text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 !border-gray-900 focus:ring-gray-900/10"
                    labelProps={{
                      className: 'hidden'
                    }}
                    maxLength={64}
                    containerProps={{ className: 'min-w-[100px]' }}
                    crossOrigin=""
                  />
                </div>
              </form>
            </div>
          </CardBody>
          <CardFooter className="p-4 border-t rounded-b-md border-[rgb(63,63,70)] bg-[rgb(24,24,27)] text-[rgb(113,113,122)]">
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <Typography className="pb-4 sm:pb-0">
                64 characters maximum
              </Typography>
              <Button type="submit" form="nameForm" disabled className="">
                {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
                Update Name
              </Button>
            </div>{' '}
          </CardFooter>
        </Card>
        <Card className="w-full max-w-3xl m-auto my-8 border rounded-md p border-[rgb(63,63,70)] bg-transparent">
          <CardBody className="px-5 py-4">
            <Typography variant="h4" className="font-medium" color="white">
              Your Email
            </Typography>
            <Typography className="text-[rgb(212,212,216)]">
              Please enter the email address you want to use to login.
            </Typography>
            <div className="mt-8 mb-4 text-xl font-semibold">
              <form id="emailForm" action={updateEmail}>
                <div className="w-1/2">
                  <Input
                    type="email"
                    name="email"
                    size="lg"
                    color="white"
                    placeholder="Your email"
                    defaultValue={user ? user.email : ''}
                    className="!border focus:!border-gray-300  text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 !border-gray-900 focus:ring-gray-900/10"
                    labelProps={{
                      className: 'hidden'
                    }}
                    maxLength={64}
                    containerProps={{ className: 'min-w-[100px]' }}
                    crossOrigin
                  />
                </div>
              </form>
            </div>
          </CardBody>
          <CardFooter className="p-4 border-t rounded-b-md border-[rgb(63,63,70)] bg-[rgb(24,24,27)] text-[rgb(113,113,122)]">
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <Typography className="pb-4 sm:pb-0">
                We will email you to verify the change.
              </Typography>
              <Button type="submit" form="emailForm" disabled>
                {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
                Update Email
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
