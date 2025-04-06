import type { Metadata } from 'next';
import { Theme } from '@radix-ui/themes';

import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ToastContainer } from '@/components/Toast/Toast';

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
          <ToastContainer>{children}</ToastContainer>
          <Footer />
        </Theme>
      </body>
      <script src="https://accounts.google.com/gsi/client" async></script>
    </html>
  );
}
