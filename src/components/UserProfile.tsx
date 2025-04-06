'use client';

import { Button, Flex, Text, Avatar } from '@radix-ui/themes';
import { useAuth } from '@/utils/supabase/auth-context';
import { useRouter } from 'next/navigation';

export default function UserProfile() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  if (!user) {
    return (
      <Button color="amber" onClick={() => router.push('/login')}>
        Sign In
      </Button>
    );
  }

  return (
    <Flex align="center" gap="2">
      <Avatar
        size="2"
        src={user.user_metadata?.avatar_url || undefined}
        fallback={user.email?.charAt(0).toUpperCase() || 'U'}
        radius="full"
      />
      <Text size="2" weight="medium">
        {user.user_metadata?.full_name || user.email}
      </Text>
      <Button variant="ghost" color="amber" onClick={handleSignOut}>
        Sign Out
      </Button>
    </Flex>
  );
}
