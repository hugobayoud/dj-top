import { ResetIcon } from '@radix-ui/react-icons';
import { useState, useEffect, useRef } from 'react';
import { Flex, Text, Button } from '@radix-ui/themes';

import { getBackgroundColor } from '@/utils/utils';
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

  return (
    <Flex
      key={dj.dj.id}
      align="center"
      gap="3"
      style={{
        padding: '0.5rem',
        backgroundColor: getBackgroundColor(index),
        borderRadius: '4px',
      }}
    >
      <Flex style={{ flex: 1 }} gap="4">
        <Text size="4" weight={index === 0 ? 'bold' : 'regular'}>
          {`#${index + 1}`}
        </Text>
        <Text size="4" weight={index === 0 ? 'bold' : 'regular'}>
          {dj.dj.name}
        </Text>
      </Flex>
      <Flex
        gap="2"
        align="center"
        direction="column"
        style={{ alignItems: 'flex-end' }}
      >
        <Flex gap="2" align="center">
          {dj.elo_rating && (
            <Text size="3" color="gray">
              ELO: {dj.elo_rating}
            </Text>
          )}
          {dj.battles_count && (
            <Text size="2" color="gray">
              ({dj.battles_count} battles)
            </Text>
          )}
        </Flex>
        <Button
          ref={buttonRef}
          size="2"
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
      </Flex>
    </Flex>
  );
};

export default PersonalDJRankingListItem;
