import { Flex, Text, Button } from '@radix-ui/themes';

import { UserDJRatingDto } from '@/interfaces/dtos';

interface UnknownDJListItemProps {
  dj: UserDJRatingDto;
  onRevertStatus: (dj: UserDJRatingDto, known: boolean, index: number) => void;
}

const UnknownDJListItem = ({ dj, onRevertStatus }: UnknownDJListItemProps) => {
  return (
    <Flex
      key={dj.dj.id}
      align="center"
      gap="3"
      style={{
        padding: '1rem',
        borderBottom: '1px solid var(--accent-3)',
      }}
    >
      <Text size="4" style={{ flex: 1 }}>
        {dj.dj.name}
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
