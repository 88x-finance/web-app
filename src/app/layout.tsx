import '@rainbow-me/rainbowkit/styles.css';
import type { Metadata } from 'next';
import { Inter, Public_Sans } from 'next/font/google';
import { Footer } from '~/components/Footer';
import { Header } from '~/components/Header';
import { TransactionStatusModal } from '~/components/TransactionStatusModal';
import { classNames } from '~/lib/classNames';
import '../styles/globals.css';
import { Providers } from './Providers';

export const metadata: Metadata = {
  viewport: 'width=device-width, initial-scale=1.0',
  title: {
    default: 'Vaults · 88x',
    template: '%s · 88x',
  },
  manifest: '/site.webmanifest',
  icons: {
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      {
        url: '/favicon-32x32.png',
        type: 'image/png',
        sizes: '32x32',
      },
      {
        url: '/favicon-16x16.png',
        type: 'image/png',
        sizes: '16x16',
      },
    ],
  },
};

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const publicSans = Public_Sans({
  variable: '--font-public-sans',
  subsets: ['latin'],
});

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props): JSX.Element {
  return (
    <html lang="en" className="h-full">
      <head />
      <body
        className={classNames(
          'flex min-h-full flex-col overflow-x-hidden bg-gray-7 font-sans text-base text-dark-1 antialiased',
          inter.variable,
          publicSans.variable,
        )}
      >
        <Providers>
          <Header />
          <main className="mb-auto w-full px-20 md:px-36">{children}</main>
          <Footer className="mt-48 mb-20 sm:mb-0 md:mt-72" />

          <TransactionStatusModal />
        </Providers>
      </body>
    </html>
  );
}
