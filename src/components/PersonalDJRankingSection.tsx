import { PropsWithChildren } from 'react';
import { Card, Heading, Flex } from '@radix-ui/themes';

import DJRankingInfoPopover from './DJRankingInfoPopover';

const PersonalDJRankingSection = ({ children }: PropsWithChildren) => {
  return (
    <Card style={{ backgroundColor: 'var(--accent-2)', padding: '2rem' }}>
      <Flex align="center" justify="between" gap="2" mb="4">
        <Heading size="6">Your DJ Rankings</Heading>
        <DJRankingInfoPopover />
      </Flex>
      <Flex direction="column" gap="2">
        {children}
      </Flex>
    </Card>
  );
};

export default PersonalDJRankingSection;
