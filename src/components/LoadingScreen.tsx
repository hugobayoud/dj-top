import { Container, Flex, Heading } from '@radix-ui/themes';

const LoadingScreen = () => {
  return (
    <Container size="4">
      <Flex direction="column" gap="6" py="6" align="center">
        <Heading size="8">Loading...</Heading>
      </Flex>
    </Container>
  );
};

export default LoadingScreen;
