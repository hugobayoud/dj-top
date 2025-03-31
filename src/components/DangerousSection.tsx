import FullResetButton from './FullResetButton';

import { ResetIcon } from '@radix-ui/react-icons';
import { Card, Flex, Heading, Text } from '@radix-ui/themes';

interface DangerousSectionProps {
  onReset: () => void;
}

const DangerousSection = ({ onReset }: DangerousSectionProps) => {
  return (
    <Card style={{ backgroundColor: 'var(--accent-2)', padding: '2rem' }}>
      <Heading size="6" mb="4" style={{ color: 'var(--red-9)' }}>
        ⚠️ Dangerous Section
      </Heading>
      <Flex direction="column" gap="7">
        <Flex direction="column">
          <Text size="3" color="gray">
            This will reset all your rankings and start over. This action cannot
            be undone.
          </Text>
          <Text size="3" color="gray" style={{ opacity: 0.6 }}>
            You can reset one DJ's ranking at a time by clicking on the reset
            button <ResetIcon />.
          </Text>
        </Flex>

        <FullResetButton onReset={onReset} />
      </Flex>
    </Card>
  );
};

export default DangerousSection;
