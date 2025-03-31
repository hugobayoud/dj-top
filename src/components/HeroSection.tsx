import { Flex, Heading, Text } from '@radix-ui/themes';

import KeyboardKey from './KeyboardKey';

const HeroSection = () => {
  return (
    <Flex gap="8" direction="column">
      {/* Title */}
      <Heading size="9" align="center" style={{ color: 'var(--accent-9)' }}>
        DJ Top Ranking
      </Heading>

      {/* Instructions */}
      <Flex direction="column" gap="4" align="center">
        <Flex gap="2" align="center">
          <Text size="3" color="gray">
            {`Use `}
          </Text>
          <KeyboardKey direction="left" />
          <Text size="3" color="gray">
            {` and `}
          </Text>
          <KeyboardKey direction="right" />
          <Text size="3" color="gray">
            {` of your keyboard to choose your favorite DJ`}
          </Text>
        </Flex>

        <Flex gap="2" align="center">
          <Text size="3" color="gray">
            {`Use `}
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
      </Flex>
    </Flex>
  );
};

export default HeroSection;
