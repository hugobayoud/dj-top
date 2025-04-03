import Image from 'next/image';
import { DJ } from '@/database/entities';
import { Card, Box, Heading, Flex, Badge } from '@radix-ui/themes';
import {
  Link1Icon,
  GlobeIcon,
  VideoIcon,
  InstagramLogoIcon,
} from '@radix-ui/react-icons';
import SocialIconButton from './SocialIconButton';

interface DJListItemProps {
  dj: DJ;
  averageEloRating: number;
  userRank?: number;
  userKnowsThisDJ?: boolean;
}

export default function DJListItem({
  dj,
  averageEloRating,
  userRank,
  userKnowsThisDJ,
}: DJListItemProps) {
  return (
    <Card size="2" style={{ border: '2px solid transparent' }}>
      <Flex direction="column" align="center" style={{ position: 'relative' }}>
        <Flex
          gap="2"
          style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 10 }}
        >
          <Badge color="blue" variant="soft">
            Global: {averageEloRating ? `#${averageEloRating}` : '#?'}
          </Badge>
          <Badge color="green" variant="soft">
            Personal:{' '}
            {userKnowsThisDJ ? 'Unknown' : userRank ? `#${userRank}` : '#?'}
          </Badge>
        </Flex>
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
