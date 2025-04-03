import { Kbd } from '@radix-ui/themes';

type KeyboardKeyProps = {
  direction: 'up' | 'down' | 'left' | 'right';
};

const KeyboardKey = ({ direction }: KeyboardKeyProps) => {
  const getArrow = (dir: string) => {
    switch (dir) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      case 'left':
        return '←';
      case 'right':
        return '→';
      default:
        return '';
    }
  };

  return <Kbd>{getArrow(direction)}</Kbd>;
};

export default KeyboardKey;
