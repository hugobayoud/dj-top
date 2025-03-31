import type { Metadata } from 'next';
import { Theme } from '@radix-ui/themes';

import './globals.css';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'DJ Top Ranking',
  description: 'Rank your favorite DJs',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: 'var(--font-open-sans)',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        <Theme
          appearance="dark"
          accentColor="amber"
          grayColor="slate"
          panelBackground="solid"
          scaling="100%"
          radius="medium"
          hasBackground={true}
        >
          <Header />
          {children}
        </Theme>
      </body>
    </html>
  );
}
