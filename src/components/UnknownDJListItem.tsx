import { Button, Table } from '@radix-ui/themes';

import { UserDJRatingDto } from '@/interfaces/dtos';

interface UnknownDJListItemProps {
  dj: UserDJRatingDto;
  onRevertStatus: (dj: UserDJRatingDto, known: boolean, index: number) => void;
}

const UnknownDJListItem = ({ dj, onRevertStatus }: UnknownDJListItemProps) => {
  return (
    <Table.Row key={dj.dj.id}>
      <Table.Cell>{dj.dj.name}</Table.Cell>
      <Table.Cell align="center">
        <Button
          size="2"
          variant="solid"
          onClick={() => onRevertStatus(dj, true, -1)}
          style={{ backgroundColor: 'var(--accent-9)' }}
        >
          I know this DJ
        </Button>
      </Table.Cell>
    </Table.Row>
  );
};

export default UnknownDJListItem;
