import { Flex } from '@radix-ui/themes';

import DJBattleCard from './DJBattleCard';
import { UserDJRatingDto } from '@/interfaces/dtos';

export interface DJBattle {
  dj: UserDJRatingDto;
  currentRank: number;
  currentPosition: 'left' | 'right';
}

interface DJBattleSectionProps {
  leftDJ: DJBattle;
  rightDJ: DJBattle;
  onLeftKeyPress: () => void;
  onRightKeyPress: () => void;
  onUpKeyPress: () => void;
  onDownKeyPress: () => void;
}

const DJBattleSection = ({
  leftDJ,
  rightDJ,
  onLeftKeyPress,
  onRightKeyPress,
  onUpKeyPress,
  onDownKeyPress,
}: DJBattleSectionProps) => {
  return (
    <Flex gap="6" justify="center" align="center">
      <DJBattleCard
        oponent={leftDJ}
        onChoicePress={onLeftKeyPress}
        onUnknownStatusPress={onUpKeyPress}
      />
      <DJBattleCard
        oponent={rightDJ}
        onChoicePress={onRightKeyPress}
        onUnknownStatusPress={onDownKeyPress}
      />
    </Flex>
  );
};

export default DJBattleSection;
