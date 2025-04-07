'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Card,
  Flex,
  Avatar,
  Separator,
} from '@radix-ui/themes';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          throw error;
        }

        setUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [router, supabase.auth]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <Container size="2">
        <Box py="9" style={{ textAlign: 'center' }}>
          <Text>Loading profile...</Text>
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container size="2">
        <Box py="9" style={{ textAlign: 'center' }}>
          <Heading size="6" mb="4">
            Not Authenticated
          </Heading>
          <Text color="gray" mb="6">
            Please sign in to view your profile.
          </Text>
          <Button asChild>
            <a href="/">Return Home</a>
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container size="2">
      <Box py="9">
        <Heading size="8" mb="6" align="center">
          Your Profile
        </Heading>

        <Card size="3" style={{ maxWidth: 600, margin: '0 auto' }}>
          <Flex direction="column" gap="4">
            <Flex align="center" gap="4">
              <Avatar
                size="6"
                src={user.user_metadata.avatar_url || undefined}
                fallback={user.email?.charAt(0).toUpperCase() || 'U'}
              />
              <Box>
                <Heading size="5">
                  {user.user_metadata.full_name || user.email}
                </Heading>
                <Text color="gray" size="2">
                  {user.email}
                </Text>
              </Box>
            </Flex>

            <Separator size="4" />

            <Box>
              <Heading size="3" mb="2">
                Account Details
              </Heading>
              <Flex direction="column" gap="2">
                <Text>
                  <strong>Email:</strong> {user.email}
                </Text>
                <Text>
                  <strong>Last Sign In:</strong>{' '}
                  {new Date(user.last_sign_in_at || '').toLocaleString()}
                </Text>
                <Text>
                  <strong>Account Created:</strong>{' '}
                  {new Date(user.created_at).toLocaleString()}
                </Text>
                <Text>
                  <strong>Provider:</strong>{' '}
                  {user.app_metadata.provider || 'Email'}
                </Text>
              </Flex>
            </Box>

            <Separator size="4" />

            <Button color="red" variant="soft" onClick={handleSignOut}>
              Sign Out
            </Button>
          </Flex>
        </Card>
      </Box>
    </Container>
  );
}
