import { PropsWithChildren } from 'react';
import { Flex, Heading, Text, Table, Container } from '@radix-ui/themes';

import KeyboardKey from './KeyboardKey';

interface UnknownDjsSectionProps extends PropsWithChildren {
  length: number;
}

const UnknownDjsSection = ({ length, children }: UnknownDjsSectionProps) => {
  return (
    <Container>
      <Heading size="6" mb="4">
        {`DJs You Don't Know Yet`}
      </Heading>
      {length === 0 ? (
        <Text>
          <Flex gap="2" align="center">
            <Text size="3" color="gray">
              {`If you don't know some DJs, you can press on `}
            </Text>
            <KeyboardKey direction="up" />
            <Text size="3" color="gray">
              {` and `}
            </Text>
            <KeyboardKey direction="down" />
            <Text size="3" color="gray">
              {` of your keyboard to mark DJs as unknown`}
            </Text>
          </Flex>
        </Text>
      ) : (
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>DJ Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell width="200px" align="center">
                Action
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{children}</Table.Body>
        </Table.Root>
      )}
    </Container>
  );
};

export default UnknownDjsSection;
