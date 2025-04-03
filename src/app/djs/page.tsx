import {
  Box,
  Grid,
  Text,
  Flex,
  Link,
  Button,
  Heading,
  Container,
} from '@radix-ui/themes';

import DJListItem from '@/components/DJListItem';
import { fetchGlobalDJRankings } from '@/utils/api';

const getDjsWithUserRanking = async (page: number) => {
  // Fetch the global rankings for the DJs
  const globalRankings = await fetchGlobalDJRankings({
    page,
    limit: 100,
    userId: 'user_1',
    sortBy: 'average_elo_rating_desc',
    filterBy: 'all',
  });

  // Merge the user rankings with the DJs

  return {
    djs: globalRankings.globalRankings,
    totalPages: globalRankings.totalPages,
  };
};

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const currentPage = parseInt(
    typeof searchParams.page === 'string' ? searchParams.page : '1'
  );
  const { djs, totalPages } = await getDjsWithUserRanking(currentPage);

  return (
    <Container size="4">
      <Box py="8">
        <Heading size="8" mb="6" align="center">
          Discover all the Hard Music DJs
        </Heading>

        {/* DJs list */}
        <Grid
          columns={{ initial: '1', sm: '3', lg: '3' }}
          gap="6"
          m={{ initial: '0', sm: '4' }}
        >
          {djs.map((dj) => (
            <DJListItem
              key={dj.dj.id}
              dj={dj.dj}
              averageEloRating={dj.average_elo_rating}
              userRank={dj.user_ranking}
              userKnowsThisDJ={dj.user_knows_this_dj}
            />
          ))}
        </Grid>

        {/* Pagination */}
        <Flex justify="center" gap="4" mt="8">
          <Button asChild disabled={currentPage === 1} variant="soft">
            <Link href={`/djs?page=${Math.max(1, currentPage - 1)}`}>
              Previous
            </Link>
          </Button>
          <Text as="span" size="3">
            Page {currentPage} of {totalPages}
          </Text>
          <Button asChild disabled={currentPage === totalPages} variant="soft">
            <Link href={`/djs?page=${Math.min(totalPages, currentPage + 1)}`}>
              Next
            </Link>
          </Button>
        </Flex>
      </Box>
    </Container>
  );
}
