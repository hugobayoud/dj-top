import Link from 'next/link';
import { IconButton, IconProps } from '@radix-ui/themes';

interface SocialIconButtonProps {
  url: string | null;
  label: string;
  Icon: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;
}

export default function SocialIconButton({
  url,
  label,
  Icon,
}: SocialIconButtonProps) {
  const hasUrl = url && url.trim() !== '';

  if (hasUrl) {
    return (
      <IconButton asChild variant="soft">
        <Link
          href={url!}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
        >
          <Icon height="16" width="16" />
        </Link>
      </IconButton>
    );
  }

  return (
    <IconButton
      variant="soft"
      disabled
      style={{ opacity: 0.5 }}
      aria-label={`${label} not available`}
    >
      <Icon height="16" width="16" />
    </IconButton>
  );
}
