import { ReactNode } from 'react';
import { Heading, Flex, Table, Text, Container } from '@radix-ui/themes';

import UnsavedDataPopover from './UnsavedDataPopover';
import DJRankingInfoPopover from './DJRankingInfoPopover';

interface PersonalDJRankingSectionProps {
  children: ReactNode;
  hasRankings: boolean;
  saveButton?: ReactNode;
  notifyUnsavedData: boolean;
}

const PersonalDJRankingSection = ({
  children,
  hasRankings,
  saveButton,
  notifyUnsavedData,
}: PersonalDJRankingSectionProps) => {
  return (
    <Container>
      <Flex align="center" justify="between" gap="2" mb="4">
        <Flex align="center" gap="2">
          <Heading size="6">Your DJ Rankings</Heading>
          <DJRankingInfoPopover />
          {notifyUnsavedData && <UnsavedDataPopover />}
        </Flex>
        {saveButton}
      </Flex>

      {hasRankings ? (
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell width="80px">Rank</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>DJ Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell width="100px" align="center">
                ELO
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell width="100px" align="center">
                Battles
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell width="80px" align="center">
                Action
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{children}</Table.Body>
        </Table.Root>
      ) : (
        <Text size="3" color="gray">
          Rank some DJs first and see your personal ranking here!
        </Text>
      )}
    </Container>
  );
};

export default PersonalDJRankingSection;
