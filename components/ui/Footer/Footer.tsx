import { Typography } from '../MaterialTailwind';
import GitHub from '@/components/icons/GitHub';
import Logo from '@/components/icons/Logo';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mx-auto max-w-[1920px] px-6 bg-[rgb(24,24,27)]">
      <div className="grid grid-cols-1 gap-8 py-12 text-white transition-colors duration-150 border-b lg:grid-cols-12 border-gray-600 bg-[rgb(24,24,27)]">
        <div className="col-span-1 lg:col-span-2">
          <Typography
            as={Link}
            href="/"
            className="flex items-center flex-initial font-bold md:mr-24"
          >
            <Typography
              as="span"
              className="mr-2 border rounded-full border-[rgb(63,63,70)]"
            >
              <Logo />
            </Typography>
            <Typography as="span">ACME</Typography>
          </Typography>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <ul className="flex flex-col flex-initial md:flex-1">
            <li className="py-3 md:py-0 md:pb-4">
              <Typography
                as={Link}
                href="/"
                className="text-white transition duration-150 ease-in-out hover:text-[rgb(228,228,231)]"
              >
                Home
              </Typography>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Typography
                as={Link}
                href="/"
                className="text-white transition duration-150 ease-in-out hover:text-[rgb(228,228,231)]"
              >
                About
              </Typography>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Typography
                as={Link}
                href="/"
                className="text-white transition duration-150 ease-in-out hover:text-[rgb(228,228,231)]"
              >
                Careers
              </Typography>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Typography
                as={Link}
                href="/"
                className="text-white transition duration-150 ease-in-out hover:text-[rgb(228,228,231)]"
              >
                Blog
              </Typography>
            </li>
          </ul>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <ul className="flex flex-col flex-initial md:flex-1">
            <li className="py-3 md:py-0 md:pb-4">
              <Typography className="font-bold text-white transition duration-150 ease-in-out hover:text-[rgb(228,228,231)]">
                LEGAL
              </Typography>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Typography
                as={Link}
                href="/"
                className="text-white transition duration-150 ease-in-out hover:text-[rgb(228,228,231)]"
              >
                Privacy Policy
              </Typography>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Typography
                as={Link}
                href="/"
                className="text-white transition duration-150 ease-in-out hover:text-[rgb(228,228,231)]"
              >
                Terms of Use
              </Typography>
            </li>
          </ul>
        </div>
        <div className="flex items-start col-span-1 text-white lg:col-span-6 lg:justify-end">
          <div className="flex items-center h-10 space-x-6">
            <a
              aria-label="Github Repository"
              href="https://github.com/vercel/nextjs-subscription-payments"
            >
              <GitHub />
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-between py-12 space-y-4 md:flex-row bg-[rgb(24,24,27)]">
        <div>
          <Typography as="span">
            &copy; {new Date().getFullYear()} ACME, Inc. All rights reserved.
          </Typography>
        </div>
        <div className="flex items-center">
          <Typography as="span" className="text-white">
            Crafted by
          </Typography>
          <a href="https://vercel.com" aria-label="Vercel.com Link">
            <img
              src="/vercel.svg"
              alt="Vercel.com Logo"
              className="inline-block h-6 ml-4 text-white"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
