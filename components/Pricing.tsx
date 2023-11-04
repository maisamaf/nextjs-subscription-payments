'use client';

import LoadingDots from './ui/LoadingDots';
import { Database } from '@/types_db';
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';
import { Button } from '@material-tailwind/react';
import { Typography } from '@material-tailwind/react';
import { Session, User } from '@supabase/supabase-js';
import cn from 'classnames';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];
type Product = Database['public']['Tables']['products']['Row'];
type Price = Database['public']['Tables']['prices']['Row'];
interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface Props {
  session: Session | null;
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
}

type BillingInterval = 'lifetime' | 'year' | 'month';

export default function Pricing({
  session,
  user,
  products,
  subscription
}: Props) {
  const intervals = Array.from(
    new Set(
      products.flatMap((product) =>
        product?.prices?.map((price) => price?.interval)
      )
    )
  );
  const router = useRouter();
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>('month');
  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  const handleCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);
    if (!user) {
      return router.push('/signin');
    }
    if (subscription) {
      return router.push('/account');
    }
    try {
      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: { price }
      });

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      return alert((error as Error)?.message);
    } finally {
      setPriceIdLoading(undefined);
    }
  };

  if (!products.length)
    return (
      <section className="bg-black">
        <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center">
            <Typography
              variant="h2"
              className="font-extrabold text-white sm:text-center sm:text-6xl"
            >
              No subscription pricing plans found. Create them in your{' '}
              <a
                className="text-pink-500 underline"
                href="https://dashboard.stripe.com/products"
                rel="noopener noreferrer"
                target="_blank"
              >
                Stripe Dashboard
              </a>
              .
            </Typography>
          </div>
        </div>
        <LogoCloud />
      </section>
    );

  if (products.length === 1)
    return (
      <section className="bg-black">
        <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center">
            <Typography
              variant="h1"
              className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl"
            >
              Pricing Plans
            </Typography>
            <Typography
              variant="lead"
              className="max-w-2xl m-auto mt-5 text-gray-200 sm:text-center sm:text-2xl"
            >
              Start building for free, then add a site plan to go live. Account
              plans unlock additional features.
            </Typography>

            <div className="relative flex self-center mt-12 bg-gray-900 border border-gray-800 rounded-lg">
              <div className="bg-gray-900 border border-pink-500 border-opacity-50 divide-y divide-gray-600 rounded-lg shadow-sm">
                <div className="p-6 py-2 m-1 text-2xl font-medium text-white border-gray-800 rounded-md shadow-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8">
                  {products[0].name}
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-4 sm:mt-12 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
              {products[0].prices?.map((price) => {
                const priceString =
                  price.unit_amount &&
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: price.currency!,
                    minimumFractionDigits: 0
                  }).format(price.unit_amount / 100);

                return (
                  <div
                    key={price.interval}
                    className="bg-gray-900 divide-y divide-gray-600 rounded-lg shadow-sm"
                  >
                    <div className="p-6">
                      <Typography>
                        <Typography
                          as="span"
                          className="text-5xl font-extrabold white"
                        >
                          {priceString}
                        </Typography>
                        <Typography
                          as="span"
                          className="text-base font-medium text-gray-100"
                        >
                          /{price.interval}
                        </Typography>
                      </Typography>
                      <Typography color="gray">{price.description}</Typography>

                      <Button size="md" onClick={() => handleCheckout(price)}>
                        {products[0].name ===
                          subscription?.prices?.products?.name
                          ? 'Manage'
                          : 'Subscribe'}
                        {priceIdLoading === price.id && (
                          <i className="pl-2 m-0">
                            <LoadingDots />
                          </i>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <LogoCloud />
        </div>
      </section>
    );

  return (
    <section className="bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <Typography variant='h1' className="!text-4xl !font-extrabold !text-white sm:text-center sm:text-6xl">
            Pricing Plans
          </Typography>
          <Typography as='p' className="max-w-2xl m-auto mt-5 text-xl text-gray-200 sm:text-center sm:text-2xl">
            Start building for free, then add a site plan to go live. Account
            plans unlock additional features.
          </Typography>
          <div className="relative self-center mt-6 bg-gray-900 rounded-lg p-0.5 flex sm:mt-8 border border-gray-800">
            {intervals.includes('month') && (
              <button
                onClick={() => setBillingInterval('month')}
                type="button"
                className={`${billingInterval === 'month'
                    ? 'relative w-1/2 bg-gray-700 border-gray-800 shadow-sm text-white'
                    : 'ml-0.5 relative w-1/2 border border-transparent text-gray-400'
                  } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
              >
                Monthly billing
              </button>
            )}
            {intervals.includes('year') && (
              <button
                onClick={() => setBillingInterval('year')}
                type="button"
                className={`${billingInterval === 'year'
                    ? 'relative w-1/2 bg-gray-700 border-gray-800 shadow-sm text-white'
                    : 'ml-0.5 relative w-1/2 border border-transparent text-gray-400'
                  } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
              >
                Yearly billing
              </button>
            )}
          </div>
        </div>
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
          {products.map((product) => {
            const price = product?.prices?.find(
              (price) => price.interval === billingInterval
            );
            if (!price) return null;
            const priceString = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: price.currency!,
              minimumFractionDigits: 0
            }).format((price?.unit_amount || 0) / 100);
            return (
              <div
                key={product.id}
                className={cn(
                  'rounded-lg shadow-sm divide-y divide-gray-600 bg-gray-900',
                  {
                    'border border-pink-500': subscription
                      ? product.name === subscription?.prices?.products?.name
                      : product.name === 'Freelancer'
                  }
                )}
              >
                <div className="p-6">
                  <Typography variant='h2' className="!text-2xl !leading-6 text-white">
                    {product.name}
                  </Typography>
                  <Typography as="span" className="mt-4 text-gray-300">{product.description}</Typography>
                  <Typography className="mt-8">
                    <Typography as="span" className="text-5xl font-extrabold text-white">
                      {priceString}
                    </Typography>
                    <Typography as="span" className="text-base font-medium text-gray-100">
                      /{billingInterval}
                    </Typography>
                  </Typography>
                  <Button size="md" onClick={() => handleCheckout(price)} disabled={!session}>
                    {subscription ? 'Manage' : 'Subscribe'}
                    {priceIdLoading === price.id && (
                      <i className="pl-2 m-0">
                        <LoadingDots />
                      </i>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        <LogoCloud />
      </div>
    </section>
  );
}

function LogoCloud() {
  return (
    <div>
      <p className="mt-24 text-xs uppercase text-gray-400 text-center font-bold tracking-[0.3em]">
        Brought to you by
      </p>
      <div className="flex flex-col items-center my-12 space-y-4 sm:mt-8 sm:space-y-0 md:mx-auto md:max-w-2xl sm:grid sm:gap-6 sm:grid-cols-5">
        <div className="flex items-center justify-start">
          <a href="https://nextjs.org" aria-label="Next.js Link">
            <img
              src="/nextjs.svg"
              alt="Next.js Logo"
              className="h-12 text-white"
            />
          </a>
        </div>
        <div className="flex items-center justify-start">
          <a href="https://vercel.com" aria-label="Vercel.com Link">
            <img
              src="/vercel.svg"
              alt="Vercel.com Logo"
              className="h-6 text-white"
            />
          </a>
        </div>
        <div className="flex items-center justify-start">
          <a href="https://stripe.com" aria-label="stripe.com Link">
            <img
              src="/stripe.svg"
              alt="stripe.com Logo"
              className="h-12 text-white"
            />
          </a>
        </div>
        <div className="flex items-center justify-start">
          <a href="https://supabase.io" aria-label="supabase.io Link">
            <img
              src="/supabase.svg"
              alt="supabase.io Logo"
              className="h-10 text-white"
            />
          </a>
        </div>
        <div className="flex items-center justify-start">
          <a href="https://github.com" aria-label="github.com Link">
            <img
              src="/github.svg"
              alt="github.com Logo"
              className="h-8 text-white"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
