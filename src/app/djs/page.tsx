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

import { DJ } from '@/database/entities';
import DJListItem from '@/components/DJListItem';
import { fetchDJs } from '@/utils/api';

const getDjs = async (page: number) => {
  return fetchDJs({
    isServer: true,
    page,
    approvedOnly: true,
  });
};

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = parseInt(searchParams.page || '1');
  const { djs, totalPages } = await getDjs(currentPage);

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
            <DJListItem key={dj.id} dj={dj} />
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
