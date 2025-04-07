'use client';

import { createClient } from '@/utils/supabase/client';
import { Button } from '@radix-ui/themes';

export default function GoogleLoginButton() {
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <Button onClick={handleGoogleLogin} variant="soft">
      Sign in with Google
    </Button>
  );
}
