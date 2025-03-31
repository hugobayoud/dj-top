import { Flex, Text, Button } from '@radix-ui/themes';

import { DJ } from '@/constant/djs';

interface UnknownDJListItemProps {
  dj: DJ;
  onRevertStatus: (dj: DJ, known: boolean, weight: number) => void;
}

const UnknownDJListItem = ({ dj, onRevertStatus }: UnknownDJListItemProps) => {
  return (
    <Flex
      key={dj.id}
      align="center"
      gap="3"
      style={{
        padding: '1rem',
        borderBottom: '1px solid var(--accent-3)',
      }}
    >
      <Text size="4" style={{ flex: 1 }}>
        {dj.name}
      </Text>
      <Button
        size="2"
        variant="solid"
        onClick={() => onRevertStatus(dj, true, -1)}
        style={{ backgroundColor: 'var(--accent-9)' }}
      >
        I know this DJ
      </Button>
    </Flex>
  );
};

export default UnknownDJListItem;
