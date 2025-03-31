import { Flex } from '@radix-ui/themes';

import { DJ } from '@/constant/djs';
import DJBattleCard from './DJBattleCard';

export interface DJBattle {
  dj: DJ;
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
        dj={leftDJ}
        onChoicePress={onLeftKeyPress}
        onUnknownStatusPress={onUpKeyPress}
      />
      <DJBattleCard
        dj={rightDJ}
        onChoicePress={onRightKeyPress}
        onUnknownStatusPress={onDownKeyPress}
      />
    </Flex>
  );
};

export default DJBattleSection;
