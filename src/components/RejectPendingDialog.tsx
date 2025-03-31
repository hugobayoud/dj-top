import { AlertDialog, Button, Flex } from '@radix-ui/themes';

interface RejectPendingDialogProps {
  onReject: () => void;
  info: string;
  loading: boolean;
}

const RejectPendingDialog = ({
  onReject,
  info,
  loading,
}: RejectPendingDialogProps) => {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button variant="soft" color="red" disabled={loading}>
          Reject
        </Button>
      </AlertDialog.Trigger>

      <AlertDialog.Content>
        <AlertDialog.Title>Reject DJ</AlertDialog.Title>
        <AlertDialog.Description>
          Are you sure you want to reject {info}? This action cannot be undone.
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>

          <AlertDialog.Action>
            <Button color="red" onClick={onReject} disabled={loading}>
              Reject
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default RejectPendingDialog;
