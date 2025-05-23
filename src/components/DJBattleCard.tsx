import Image from 'next/image';
import { Card, Flex, Box, Text, Button } from '@radix-ui/themes';

import KeyboardKey from './KeyboardKey';
import { BASE_ELO } from '@/constant/djs';
import { DJBattle } from './DJBattleSection';

interface DJBattleCardProps {
  oponent: DJBattle;
  onChoicePress: () => void;
  onUnknownStatusPress: () => void;
}

const DJBattleCard = ({
  oponent,
  onChoicePress,
  onUnknownStatusPress,
}: DJBattleCardProps) => {
  return (
    <Card
      key={oponent.dj.dj.id}
      style={{
        padding: '2rem',
        border: '2px solid transparent',
        transition: 'border-color 0.2s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent-9)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'transparent';
      }}
      onClick={onChoicePress}
    >
      <Flex direction="column" gap="4" align="center">
        <Box
          style={{
            position: 'relative',
            width: '300px',
            height: '300px',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <Image
            src={oponent.dj.dj.photo}
            alt={oponent.dj.dj.name}
            fill
            style={{ objectFit: 'cover' }}
          />
          {/* Rank Badge */}
          <Box
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            #{oponent.currentRank || '?'}
          </Box>
          {/* Elo Rating Badge */}
          <Box
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            {oponent.dj.elo_rating || BASE_ELO}
          </Box>
        </Box>
        <Text size="6" weight="bold" align="center">
          {oponent.dj.dj.name}
        </Text>

        <Button size="3" variant="solid" onClick={onChoicePress}>
          {oponent.currentPosition === 'left' && (
            <KeyboardKey direction="left" />
          )}
          {`I prefer this DJ`}
          {oponent.currentPosition === 'right' && (
            <KeyboardKey direction="right" />
          )}
        </Button>
        <Button
          size="3"
          variant="soft"
          color="amber"
          onClick={onUnknownStatusPress}
        >
          {oponent.currentPosition === 'left' && <KeyboardKey direction="up" />}
          {`I don't know this DJ`}
          {oponent.currentPosition === 'right' && (
            <KeyboardKey direction="down" />
          )}
        </Button>
      </Flex>
    </Card>
  );
};

export default DJBattleCard;
