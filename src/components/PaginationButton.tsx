import Link from 'next/link';
import { Button } from '@radix-ui/themes';

interface PaginationButtonProps {
  url: string | null;
  label: string;
}

export default function PaginationButton({
  url,
  label,
}: PaginationButtonProps) {
  const hasUrl = url && url.trim() !== '';

  if (hasUrl) {
    return (
      <Button asChild variant="soft">
        <Link href={url!}>{label}</Link>
      </Button>
    );
  }

  return (
    <Button variant="soft" disabled aria-label={`${label} not available`}>
      {label}
    </Button>
  );
}
