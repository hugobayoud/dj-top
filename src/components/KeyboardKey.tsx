import { Box, Flex } from '@radix-ui/themes';

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

  return (
    <Flex
      style={{
        backgroundColor: '#1c1c1e',
        color: 'white',
        width: '24px',
        height: '24px',
        borderRadius: '4px',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        margin: '0 2px',
      }}
    >
      {getArrow(direction)}
    </Flex>
  );
};

export default KeyboardKey;
