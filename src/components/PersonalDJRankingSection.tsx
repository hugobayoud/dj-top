import { PropsWithChildren } from 'react';
import { Card, Heading, Flex } from '@radix-ui/themes';

const PersonalDJRankingSection = ({ children }: PropsWithChildren) => {
  return (
    <Card
      style={{
        backgroundColor: 'var(--accent-2)',
        padding: '2rem',
      }}
    >
      <Heading size="6" mb="4">
        Your DJ Rankings
      </Heading>
      <Flex direction="column" gap="2">
        {children}
      </Flex>
    </Card>
  );
};

export default PersonalDJRankingSection;
