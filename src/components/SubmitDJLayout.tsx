import { Card, Container, Flex, Heading, Text } from '@radix-ui/themes';

const SubmitDJLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container
      size="2"
      style={{
        maxWidth: '600px',
        marginTop: '2rem',
        paddingBottom: '200px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <Card style={{ padding: '2rem' }}>
        <Flex direction="column" gap="6" align="center">
          <Heading size="6" mb="4" align="center">
            Add New DJ
          </Heading>

          {children}

          <Text size="1" color="gray" style={{ opacity: 0.8 }}>
            By submitting a new DJ, you understand that the status of this DJ
            will be in STAND BY until we approve it. Then you will be able to
            vote for them.
          </Text>
        </Flex>
      </Card>
    </Container>
  );
};

export default SubmitDJLayout;
