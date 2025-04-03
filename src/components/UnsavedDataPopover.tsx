import { Button, Flex, Popover, Text } from '@radix-ui/themes';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

const UnsavedDataPopover = () => {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="soft" size="1" color="orange">
          <ExclamationTriangleIcon height="16" width="16" />
          Unsaved data
        </Button>
      </Popover.Trigger>
      <Popover.Content width="360px">
        <Flex direction="column" gap="3">
          <Text weight="bold">Some data is unsaved</Text>
          <Text>
            Your current personal DJ raking is not saved. Click the button next
            to it to save your data.
          </Text>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
};

export default UnsavedDataPopover;
