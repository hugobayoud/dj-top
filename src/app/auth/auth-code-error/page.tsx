import { Box, Container, Heading, Text, Button, Link } from '@radix-ui/themes';

export default function AuthCodeError() {
  return (
    <Container size="2">
      <Box py="9" style={{ textAlign: 'center' }}>
        <Heading size="6" mb="4">
          Authentication Error
        </Heading>
        <Text color="gray" mb="6">
          There was an error during the authentication process. Please try
          again.
        </Text>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </Box>
    </Container>
  );
}
