import { ResetIcon } from '@radix-ui/react-icons';
import { useState, useEffect, useRef } from 'react';
import { Table, Text, Button } from '@radix-ui/themes';

import { UserDJRatingDto } from '@/interfaces/dtos';

interface PersonalDJRankingListItemProps {
  dj: UserDJRatingDto;
  onDJReset: (djId: string) => void;
  index: number;
}

const PersonalDJRankingListItem = ({
  dj,
  onDJReset,
  index,
}: PersonalDJRankingListItemProps) => {
  const [confirmingReset, setConfirmingReset] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        event.target &&
        !buttonRef.current.contains(event.target as Node) &&
        confirmingReset
      ) {
        setConfirmingReset(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [confirmingReset]);

  const handleReset = () => {
    onDJReset(dj.dj.id);
    setConfirmingReset(false);
  };

  const rank = index + 1;
  const isTopRank = rank === 1;

  return (
    <Table.Row
      key={dj.dj.id}
      style={isTopRank ? { fontWeight: 'bold' } : undefined}
    >
      <Table.Cell>#{rank}</Table.Cell>
      <Table.Cell>{dj.dj.name}</Table.Cell>
      <Table.Cell align="center">{dj.elo_rating}</Table.Cell>
      <Table.Cell align="center">{dj.battles_count}</Table.Cell>
      <Table.Cell align="center" style={{ width: '100px' }}>
        <Button
          ref={buttonRef}
          size="1"
          variant="soft"
          onClick={
            confirmingReset ? handleReset : () => setConfirmingReset(true)
          }
          style={{
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.15s ease',
            paddingRight: confirmingReset ? '12px' : '0',
          }}
        >
          <ResetIcon />
          <Text
            size="1"
            style={{
              opacity: confirmingReset ? 1 : 0,
              transform: confirmingReset
                ? 'translateX(0)'
                : 'translateX(-100%)',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
              maxWidth: confirmingReset ? '100px' : '0',
            }}
          >
            reset
          </Text>
        </Button>
      </Table.Cell>
    </Table.Row>
  );
};

export default PersonalDJRankingListItem;
