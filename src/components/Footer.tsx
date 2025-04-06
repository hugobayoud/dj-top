import React from 'react';
import { Box, Flex, Text } from '@radix-ui/themes';

const Footer: React.FC = () => {
  return (
    <Box py="6" mt="auto">
      <Flex justify="center" align="center">
        <Text size="2" color="gray">
          Made with ❤️ by a hardstyle fan (especially rawstyle)
        </Text>
      </Flex>
    </Box>
  );
};

export default Footer;
