import { PropsWithChildren } from 'react';
import { Card, Flex, Heading, Text } from '@radix-ui/themes';

import KeyboardKey from './KeyboardKey';

interface UnknownDjsSectionProps extends PropsWithChildren {
  length: number;
}

const UnknownDjsSection = ({ length, children }: UnknownDjsSectionProps) => {
  return (
    <Card
      style={{
        backgroundColor: 'var(--accent-2)',
        padding: '2rem',
      }}
    >
      <Heading size="6" mb="4">
        DJs You Don't Know Yet
      </Heading>
      <Flex direction="column" gap="2">
        {length === 0 ? (
          <Text>
            <Flex gap="2" align="center">
              <Text size="3" color="gray">
                {`If you don't know some DJs, you can press on `}
              </Text>
              <KeyboardKey direction="up" />
              <Text size="3" color="gray">
                {` and `}
              </Text>
              <KeyboardKey direction="down" />
              <Text size="3" color="gray">
                {` of your keyboard to mark DJs as unknown`}
              </Text>
            </Flex>
          </Text>
        ) : (
          children
        )}
      </Flex>
    </Card>
  );
};

export default UnknownDjsSection;
