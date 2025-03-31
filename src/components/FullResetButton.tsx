import { AlertDialog, Button, Flex } from '@radix-ui/themes';

interface FullResetButtonProps {
  onReset: () => void;
}

const FullResetButton = ({ onReset }: FullResetButtonProps) => {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button
          size="3"
          variant="outline"
          color="red"
          style={{
            alignSelf: 'center',
          }}
        >
          Reset Everything
        </Button>
      </AlertDialog.Trigger>

      <AlertDialog.Content>
        <AlertDialog.Title>Reset Everything</AlertDialog.Title>
        <AlertDialog.Description>
          Are you sure you want to reset everything (all personal ranking and
          unknown DJs)? This action cannot be undone.
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>

          <AlertDialog.Action>
            <Button color="red" onClick={onReset}>
              Reset
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default FullResetButton;
