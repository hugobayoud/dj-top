import Image from 'next/image';
import { Button, Dialog, Flex } from '@radix-ui/themes';

interface ImageZoomDialogProps {
  selectedPhoto: string;
}

const ImageZoomDialog = ({ selectedPhoto }: ImageZoomDialogProps) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="ghost">
          <Image
            src={selectedPhoto}
            alt={selectedPhoto}
            width={50}
            height={50}
            style={{
              objectFit: 'cover',
              borderRadius: '4px',
            }}
          />
        </Button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: '450px' }}>
        <Dialog.Title>DJ Photo Preview</Dialog.Title>
        <Flex direction="column" gap="4" mt="4">
          {selectedPhoto && (
            <Image
              src={selectedPhoto}
              alt="DJ Photo Preview"
              width={400}
              height={400}
              style={{
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
          )}
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Close
              </Button>
            </Dialog.Close>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ImageZoomDialog;
