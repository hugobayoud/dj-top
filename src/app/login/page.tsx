'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Flex, Heading, Text, Container } from '@radix-ui/themes';

import { supabase } from '@/utils/supabase/client';
import LoadingScreen from '@/components/LoadingScreen';
import { useAuth } from '@/utils/supabase/auth-context';

// Add TypeScript declaration for Google response
interface GoogleCredentialResponse {
  credential: string;
}

// Extend Window interface to include our custom handler
declare global {
  interface Window {
    handleSignInWithGoogle?: (
      response: GoogleCredentialResponse
    ) => Promise<void>;
  }
}

export default function LoginPage() {
  const { user, isLoading, signInWithGoogle } = useAuth();
  const [hashedNonce, setHashedNonce] = useState<string | null>(null);
  const router = useRouter();

  /*
   * generate nonce to use for google id token sign-in
   * Use 'hashedNonce' when making the authentication request to Google
   * Use 'nonce' when invoking the supabase.auth.signInWithIdToken() method
   */
  const generateNonce = async (): Promise<string[]> => {
    const nonce = btoa(
      String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))
    );
    const encoder = new TextEncoder();
    const encodedNonce = encoder.encode(nonce);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedNonce = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return [nonce, hashedNonce];
  };

  useEffect(() => {
    if (user && !isLoading) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    // Define the handler in the global scope
    window.handleSignInWithGoogle = async (
      response: GoogleCredentialResponse
    ) => {
      try {
        const [nonce, hashedNonce] = await generateNonce();
        setHashedNonce(hashedNonce);
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: response.credential,
          nonce,
        });

        if (error) throw error;

        // Successful login will be handled by the auth context
        // which should redirect automatically
      } catch (error) {
        console.error('Error logging in with Google:', error);
      }
    };

    return () => {
      // Clean up when component unmounts
      delete window.handleSignInWithGoogle;
    };
  }, [router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Container
      size="1"
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '4rem 2rem',
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Flex
        direction="column"
        gap="6"
        align="center"
        justify="center"
        style={{ width: '100%' }}
      >
        <Heading size="8" align="center">
          Welcome to DJ Top Ranking
        </Heading>
        <Text align="center" size="3">
          Sign in to create and save your DJ rankings
        </Text>

        <div
          id="g_id_onload"
          data-client_id="32843990447-ebupvfn4pt0668nerlkfm33847bmcrum.apps.googleusercontent.com"
          data-context="signin"
          data-ux_mode="popup"
          data-callback="handleSignInWithGoogle"
          data-nonce={hashedNonce}
          data-auto_select="true"
          data-itp_support="true"
          data-use_fedcm_for_prompt="true"
        ></div>

        <div
          className="g_id_signin"
          data-type="standard"
          data-shape="pill"
          data-theme="outline"
          data-text="signin_with"
          data-size="large"
          data-logo_alignment="left"
        ></div>
      </Flex>
    </Container>
  );
}
