'use client';

import {
  Card,
  Flex,
  Text,
  Table,
  Button,
  Popover,
  Heading,
  Container,
  TextField,
} from '@radix-ui/themes';
import {
  Link1Icon,
  VideoIcon,
  GlobeIcon,
  UpdateIcon,
  LockClosedIcon,
  ArrowTopRightIcon,
  InstagramLogoIcon,
} from '@radix-ui/react-icons';
import { useState, useEffect } from 'react';

import { DJ } from '@/database/entities';
import { createClient } from '@/utils/supabase/client';
import ImageZoomDialog from '@/components/ImageZoomDialog';
import RejectPendingDialog from '@/components/RejectPendingDialog';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [djs, setDjs] = useState<DJ[]>([]);

  const supabase = createClient();

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchPendingDjs();
    }
  }, []);

  const fetchPendingDjs = async () => {
    try {
      const { data, error } = await supabase
        .from('djs')
        .select('*')
        .eq('status', 'STAND_BY')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDjs(data || []);
    } catch (err) {
      console.error('Error fetching DJs:', err);
      setError('Failed to fetch pending DJs');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('adminAuth', 'true');
        fetchPendingDjs();
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch (err) {
      console.error('Error authenticating:', err);
      setError('Failed to authenticate');
    }
  };

  const handleApprove = async (dj: DJ) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('djs')
        .update({ status: 'APPROVED' })
        .eq('id', dj.id);

      if (error) throw error;
      setDjs(djs.filter((d) => d.id !== dj.id));
    } catch (err) {
      console.error('Error approving DJ:', err);
      setError('Failed to approve DJ');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (dj: DJ) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('djs')
        .update({ status: 'REJECTED' })
        .eq('id', dj.id);

      if (error) throw error;
      setDjs(djs.filter((d) => d.id !== dj.id));
    } catch (err) {
      console.error('Error rejecting DJ:', err);
      setError('Failed to reject DJ');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Container size="2" style={{ maxWidth: '400px', margin: '4rem auto' }}>
        <Card style={{ padding: '2rem' }}>
          <Flex direction="column" gap="4" align="center">
            <LockClosedIcon width="32" height="32" />
            <Heading size="5">Admin Access</Heading>
            <form onSubmit={handleLogin} style={{ width: '100%' }}>
              <Flex direction="column" gap="4">
                <TextField.Root>
                  <TextField.Slot>
                    <input
                      type="password"
                      placeholder="Enter admin password"
                      value={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPassword(e.target.value)
                      }
                    />
                  </TextField.Slot>
                </TextField.Root>
                {error && (
                  <Text color="red" size="2">
                    {error}
                  </Text>
                )}
                <Button type="submit">Login</Button>
              </Flex>
            </form>
          </Flex>
        </Card>
      </Container>
    );
  }

  return (
    <Container size="3" style={{ margin: '2rem auto' }}>
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center">
          <Flex gap="4" align="center">
            <Heading size="6">Pending DJs</Heading>
            <Button variant="soft" onClick={fetchPendingDjs} disabled={loading}>
              <UpdateIcon width="16" height="16" />
              Refresh
            </Button>
          </Flex>
          <Button
            variant="soft"
            onClick={() => {
              setIsAuthenticated(false);
              localStorage.removeItem('adminAuth');
            }}
          >
            Logout
          </Button>
        </Flex>

        {error && (
          <Text color="red" size="2">
            {error}
          </Text>
        )}

        <Card>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Photo</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Social Media</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Submitted</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {djs.map((dj) => (
                <Table.Row key={dj.id} align="center">
                  <Table.Cell>
                    <ImageZoomDialog selectedPhoto={dj.photo} />
                  </Table.Cell>
                  <Table.Cell>{dj.name}</Table.Cell>
                  <Table.Cell>
                    <Flex gap="1">
                      {dj.instagram_url && (
                        <SocialMediaPopover
                          url={dj.instagram_url}
                          platform="instagram"
                        />
                      )}
                      {dj.facebook_url && (
                        <SocialMediaPopover
                          url={dj.facebook_url}
                          platform="facebook"
                        />
                      )}
                      {dj.youtube_url && (
                        <SocialMediaPopover
                          url={dj.youtube_url}
                          platform="youtube"
                        />
                      )}
                      {dj.website_url && (
                        <SocialMediaPopover
                          url={dj.website_url}
                          platform="website"
                        />
                      )}
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(dj.created_at).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap="2">
                      <Button
                        variant="soft"
                        color="green"
                        onClick={() => handleApprove(dj)}
                        disabled={loading}
                      >
                        Approve
                      </Button>

                      <RejectPendingDialog
                        onReject={() => handleReject(dj)}
                        loading={loading}
                        info={dj.name}
                      />
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card>
      </Flex>
    </Container>
  );
}

const SocialMediaPopover = ({
  url,
  platform,
}: {
  url: string;
  platform: 'instagram' | 'facebook' | 'youtube' | 'website';
}) => {
  const icon =
    platform === 'instagram' ? (
      <InstagramLogoIcon />
    ) : platform === 'facebook' ? (
      <Link1Icon />
    ) : platform === 'youtube' ? (
      <VideoIcon />
    ) : (
      <GlobeIcon />
    );
  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="soft">{icon}</Button>
      </Popover.Trigger>
      <Popover.Content>
        <Flex gap="4" align="center">
          <Flex gap="2" align="center">
            {icon}
            <Text>{url}</Text>
          </Flex>
          <Popover.Close>
            <Button size="1">
              <ArrowTopRightIcon />
              Visit
            </Button>
          </Popover.Close>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
};
