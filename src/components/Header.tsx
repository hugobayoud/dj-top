'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button, Container, Flex } from '@radix-ui/themes';
import { DiscIcon, HomeIcon, PersonIcon } from '@radix-ui/react-icons';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isHome = pathname === '/';
  const isAddingDj = pathname === '/add-dj';
  const isDJsList = pathname === '/djs';
  const isLogin = pathname === '/login';

  return (
    <Container size="4" style={{ maxWidth: '80%', margin: '2rem auto' }}>
      <Flex justify="between" align="center">
        {!isHome && (
          <Button
            variant="soft"
            onClick={() => router.push('/')}
            style={{ gap: '0.5rem' }}
          >
            <HomeIcon width="16" height="16" />
            Home
          </Button>
        )}

        <Flex justify="end" style={{ width: '100%' }} align="center" gap="2">
          {!isAddingDj && !isLogin && (
            <Button
              variant="soft"
              onClick={() => router.push('/add-dj')}
              style={{ gap: '0.5rem' }}
            >
              <PersonIcon width="16" height="16" />
              Submit a new DJ
            </Button>
          )}

          {!isDJsList && !isLogin && (
            <Button
              variant="soft"
              onClick={() => router.push('/djs')}
              style={{ gap: '0.5rem' }}
            >
              <DiscIcon width="16" height="16" />
              Global Rankings
            </Button>
          )}
        </Flex>
      </Flex>
    </Container>
  );
};

export default Header;
