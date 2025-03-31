'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button, Container, Flex } from '@radix-ui/themes';
import { HomeIcon, PersonIcon } from '@radix-ui/react-icons';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isAddingDj = pathname === '/add-dj';

  return (
    <Container size="4" style={{ maxWidth: '80%', margin: '2rem auto' }}>
      <Flex justify="between" align="center">
        <Button
          variant="soft"
          onClick={() => router.push('/')}
          style={{ gap: '0.5rem' }}
        >
          <HomeIcon width="16" height="16" />
          Home
        </Button>

        {!isAddingDj && (
          <Button
            variant="soft"
            onClick={() => router.push('/add-dj')}
            style={{ gap: '0.5rem' }}
          >
            <PersonIcon width="16" height="16" />
            Submit a new DJ
          </Button>
        )}
      </Flex>
    </Container>
  );
};

export default Header;
