import {
  Link1Icon,
  GlobeIcon,
  VideoIcon,
  InstagramLogoIcon,
} from '@radix-ui/react-icons';
import Image from 'next/image';
import { Card, Box, Heading, Flex, Badge } from '@radix-ui/themes';

import SocialIconButton from './SocialIconButton';
import { FetchDJsSortOption } from '@/constant/djs';
import { GlobalDJRankingDto } from '@/interfaces/dtos';

interface DJListItemProps {
  sort: FetchDJsSortOption;
  item: GlobalDJItem;
}

export interface GlobalDJItem extends GlobalDJRankingDto {
  ranking?: number;
  user_ranking?: number;
}

export default function DJListItem({ sort, item }: DJListItemProps) {
  const { user_ranking, user_knows_this_dj, ranking, dj } = item;

  return (
    <Card size="2" style={{ border: '2px solid transparent' }}>
      <Flex direction="column" align="center" style={{ position: 'relative' }}>
        <Flex
          gap="2"
          style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 10 }}
        >
          {sort === 'global_rating' && (
            <Badge size="3" color="blue" variant="solid">
              {ranking ? `#${ranking}` : '#?'}
            </Badge>
          )}

          {sort === 'user_rating' && (
            <Badge size="3" color="green" variant="solid">
              {`${
                user_knows_this_dj
                  ? user_ranking
                    ? `#${user_ranking}`
                    : '#?'
                  : 'Unknown'
              }`}
            </Badge>
          )}
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
