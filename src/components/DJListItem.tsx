import Image from 'next/image';
import { DJ } from '@/database/entities';
import { Card, Box, Heading, Flex } from '@radix-ui/themes';
import {
  Link1Icon,
  GlobeIcon,
  VideoIcon,
  InstagramLogoIcon,
} from '@radix-ui/react-icons';
import SocialIconButton from './SocialIconButton';

interface DJListItemProps {
  dj: DJ;
}

export default function DJListItem({ dj }: DJListItemProps) {
  return (
    <Card size="2" style={{ border: '2px solid transparent' }}>
      <Flex direction="column" align="center">
        <Image
          src={dj.photo}
          alt={dj.name}
          width={250}
          height={250}
          style={{ objectFit: 'cover' }}
        />

        <Box p="4">
          <Flex direction="column" gap="2" align="center">
            <Heading as="h2" size="5" mb="2">
              {dj.name}
            </Heading>
            <Flex gap="4">
              <SocialIconButton
                url={dj.instagram_url}
                label="Instagram"
                Icon={InstagramLogoIcon}
              />
              <SocialIconButton
                url={dj.facebook_url}
                label="Facebook"
                Icon={Link1Icon}
              />
              <SocialIconButton
                url={dj.website_url}
                label="Website"
                Icon={GlobeIcon}
              />
              <SocialIconButton
                url={dj.youtube_url}
                label="YouTube"
                Icon={VideoIcon}
              />
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Card>
  );
}
