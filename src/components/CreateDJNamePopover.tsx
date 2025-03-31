import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Button, Flex, Popover, Text } from '@radix-ui/themes';

const CreateDJNamePopover = () => {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="soft">
          <InfoCircledIcon height="16" width="16" />
        </Button>
      </Popover.Trigger>
      <Popover.Content width="360px">
        <Flex gap="3">
          <Text>
            In the case of a duo (or group), please give the artist name most
            commonly given to the group. In the case of an artist who has
            several artist names and who produces music or mixes at festivals or
            concerts under his or her different artist names, we consider that
            there are several different artists who can be chosen and voted on
            independently.
          </Text>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
};

export default CreateDJNamePopover;
