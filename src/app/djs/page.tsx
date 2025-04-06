'use client';

import {
  Box,
  Grid,
  Text,
  Flex,
  Button,
  Heading,
  Container,
} from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import DJListItem from '@/components/DJListItem';
import { FetchDJsSortOption } from '@/constant/djs';
import { GlobalDJRankingDto } from '@/interfaces/dtos';
import DJSortSegmentedControl from '@/components/DJSortSegmentedControl';

export default function Page() {
  // Start with default values
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSort, setCurrentSort] =
    useState<FetchDJsSortOption>('global_rating');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [djs, setDjs] = useState<GlobalDJRankingDto[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const pathname = usePathname();

  // Parse the URL directly on client side
  useEffect(() => {
    // Get URL search params from window.location
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const page = urlParams.get('page');
      const sort = urlParams.get('sort');

      if (page) setCurrentPage(parseInt(page));
      if (sort) setCurrentSort(sort as FetchDJsSortOption);
    }
  }, []);

  useEffect(() => {
    const fetchDjs = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/djs?page=${currentPage}&sort=${currentSort}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch DJs');
        }

        const data = await response.json();
        setDjs(data.list);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError('An error occurred while fetching DJs');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDjs();
  }, [currentPage, currentSort]);

  const handleSortChange = (sort: FetchDJsSortOption) => {
    setCurrentSort(sort);
    updateURL(currentPage, sort);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(page, currentSort);
  };

  const updateURL = (page: number, sort: FetchDJsSortOption) => {
    // Update URL without navigation
    window.history.pushState({}, '', `${pathname}?page=${page}&sort=${sort}`);
  };

  if (error) {
    return (
      <Container size="4">
        <Box py="8" style={{ textAlign: 'center' }}>
          <Text color="red" size="4">
            {error}
          </Text>
          <Button onClick={() => window.location.reload()} mt="4">
            Try Again
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container size="4">
      <Box py="8">
        <Heading size="8" mb="6" align="center">
          Discover all the Hard Music DJs
        </Heading>

        {/* Sort controls */}
        <Flex justify="center" mb="6">
          <DJSortSegmentedControl
            currentSort={currentSort}
            currentPage={currentPage}
            onSortChange={handleSortChange}
          />
        </Flex>

        {isLoading ? (
          <Flex justify="center" py="9">
            <Text>Loading DJs...</Text>
          </Flex>
        ) : (
          <>
            {/* DJs list */}
            <Grid
              columns={{ initial: '1', sm: '3', lg: '3' }}
              gap="6"
              m={{ initial: '0', sm: '4' }}
            >
              {djs.map((dj) => (
                <DJListItem key={dj.dj.id} sort={currentSort} item={dj} />
              ))}
            </Grid>

            {/* Pagination */}
            <Flex align="center" justify="center" gap="4" mt="8">
              <Button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                variant="soft"
              >
                Previous
              </Button>

              <Text as="span" size="3">
                Page {currentPage} of {totalPages}
              </Text>

              <Button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                variant="soft"
              >
                Next
              </Button>
            </Flex>
          </>
        )}
      </Box>
    </Container>
  );
}
