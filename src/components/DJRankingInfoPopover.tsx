import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Button, Flex, Popover, Text } from '@radix-ui/themes';

const DJRankingInfoPopover = () => {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="soft" size="1">
          <InfoCircledIcon height="16" width="16" />
        </Button>
      </Popover.Trigger>
      <Popover.Content width="360px">
        <Flex direction="column" gap="3">
          <Text weight="bold">How DJs are ranked</Text>
          <Text>
            We use an <strong>Elo rating system</strong> (like in chess and most
            video games) to rank DJs. {`Here's how it works:`}
          </Text>
          <Text>• Every DJ starts with 1400 points</Text>
          <Text>
            {`• When you choose one DJ over another, both DJs' ratings are updated`}
          </Text>
          <Text>• Beating higher-rated DJs earns more points</Text>
          <Text>
            • The more battles a DJ participates in, the more accurate their
            rating becomes
          </Text>
          <Text>• DJs are ranked by their Elo rating (higher is better)</Text>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
};

export default DJRankingInfoPopover;
