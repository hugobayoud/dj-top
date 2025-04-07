'use client';

import { v4 as uuidv4 } from 'uuid';
import { Flex, Container, Button } from '@radix-ui/themes';
import { useState, useEffect, useMemo, useCallback } from 'react';

import { DJ } from '@/database/entities';
import { getRandomDJs } from '@/utils/utils';
import { useToast } from '@/components/Toast/Toast';
import HeroSection from '@/components/HeroSection';
import { UserDJRatingDto } from '@/interfaces/dtos';
import { BASE_ELO, K_FACTOR } from '@/constant/djs';
import { createClient } from '@/utils/supabase/client';
import LoadingScreen from '@/components/LoadingScreen';
import DJBattleSection from '@/components/DJBattleSection';
import DangerousSection from '@/components/DangerousSection';
import UnknownDjsSection from '@/components/UnknownDjsSection';
import UnknownDJListItem from '@/components/UnknownDJListItem';
import PersonalDJRankingSection from '@/components/PersonalDJRankingSection';
import PersonalDJRankingListItem from '@/components/PersonalDJRankingListItem';

export default function Page() {
  const [allDJs, setAllDJs] = useState<UserDJRatingDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [currentDJs, setCurrentDJs] = useState<
    [UserDJRatingDto, UserDJRatingDto] | null
  >(null);
  const [unsavedData, setUnsavedData] = useState<boolean>(false);
  const supabase = createClient();

  // Get toast function from context
  const { showToast } = useToast();

  // Calculate Elo rating change
  const calculateEloChange = (
    winnerRating: number,
    loserRating: number
  ): number => {
    // Calculate expected outcome for winner
    const expectedOutcome =
      1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
    // Calculate rating change using K-factor
    return Math.round(K_FACTOR * (1 - expectedOutcome));
  };

  // Fetch approved DJs and user ratings
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Fetch all approved DJs
        const { data: djsData, error: djsError } = await supabase
          .from('djs')
          .select('*')
          .eq('status', 'APPROVED');

        if (djsError) throw djsError;

        // Fetch user's DJ ratings
        const { data: userDJRatings, error: ratingsError } = await supabase
          .from('user_dj_ratings')
          .select('*, dj:djs(*)')
          .eq('user_id', 'user_1');

        if (ratingsError) throw ratingsError;

        // Create a map of DJ ratings by DJ ID
        const userDJRatingsMap = new Map<string, UserDJRatingDto>();
        userDJRatings.forEach((userDjRating) => {
          userDJRatingsMap.set(userDjRating.dj_id, {
            id: userDjRating.id,
            dj: userDjRating.dj,
            elo_rating: userDjRating.elo_rating,
            battles_count: userDjRating.battles_count,
            unknown: userDjRating.unknown,
            last_updated: userDjRating.last_updated,
          });
        });

        // Combine DJs with their ratings (or default values if no rating exists)
        const djsWithRatings: UserDJRatingDto[] = djsData.map((dj: DJ) => {
          const rating = userDJRatingsMap.get(dj.id);

          if (rating) return rating;

          return {
            id: uuidv4(),
            dj,
            elo_rating: BASE_ELO,
            battles_count: 0,
            unknown: null,
            last_updated: new Date(),
          };
        });

        setAllDJs(djsWithRatings);

        // Set initial battle DJs
        if (djsWithRatings.length >= 2) {
          setCurrentDJs(getRandomDJs(djsWithRatings, []));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save user's DJ ratings to the database
  const saveRankings = async () => {
    try {
      setIsSaving(true);

      // Filter out DJs with battles
      const djsToSave = allDJs.filter(
        (dj) => dj.battles_count > 0 || dj.unknown !== null
      );

      // Prepare upsert data
      const upsertData = djsToSave.map((dj) => ({
        id: dj.id,
        user_id: 'user_1',
        dj_id: dj.dj.id,
        elo_rating: dj.elo_rating,
        battles_count: dj.battles_count,
        unknown: dj.unknown,
      }));

      // Upsert the ratings
      const { error } = await supabase
        .from('user_dj_ratings')
        .upsert(upsertData, { onConflict: 'user_id,dj_id' });

      if (error) throw error;

      setUnsavedData(false);

      // Show success toast instead of alert
      showToast({
        type: 'success',
        title: 'DJ rankings saved successfully!',
        description: 'Your DJ rankings have been saved.',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error saving rankings:', error);

      // Show error toast instead of alert
      showToast({
        type: 'error',
        title: 'Failed to save rankings',
        description: 'Please try again.',
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChoice = useCallback(
    (winner: UserDJRatingDto, loser: UserDJRatingDto, winnerIndex: 0 | 1) => {
      // Find winner and loser in allDJs
      const winnerDj = allDJs.find((dj) => dj.dj.id === winner.dj.id);
      const loserDj = allDJs.find((dj) => dj.dj.id === loser.dj.id);

      if (!winnerDj || !loserDj) return;

      setUnsavedData(true);

      // Calculate Elo rating change
      const winnerRating = winnerDj.elo_rating;
      const loserRating = loserDj.elo_rating;
      const ratingChange = calculateEloChange(winnerRating, loserRating);

      // Update ratings for both DJs
      const winnerUpdated: UserDJRatingDto = {
        ...winnerDj,
        elo_rating: winnerRating + ratingChange,
        battles_count: winnerDj.battles_count + 1,
      };

      const loserUpdated: UserDJRatingDto = {
        ...loserDj,
        elo_rating: loserRating - ratingChange,
        battles_count: loserDj.battles_count + 1,
      };

      // Update all DJs
      setAllDJs((prev) =>
        prev.map((dj) => {
          if (dj.dj.id === winner.dj.id) return winnerUpdated;
          if (dj.dj.id === loser.dj.id) return loserUpdated;
          return dj;
        })
      );

      try {
        // Get a new challenger, excluding the current winner and loser
        const [newChallenger] = getRandomDJs(allDJs, [winner, loser]);

        // Keep the winner and add the new challenger in current DJs
        setCurrentDJs(
          winnerIndex === 0
            ? [winnerUpdated, newChallenger]
            : [newChallenger, winnerUpdated]
        );
      } catch (error) {
        console.error('Not enough known DJs available', error);
      }
    },
    [allDJs]
  );

  const handleKnownStatus = useCallback(
    (dj: UserDJRatingDto, isKnown: boolean, index: 0 | 1 | -1) => {
      // Update the DJ's unknown status in allDJs
      setAllDJs((prev) =>
        prev.map((d) =>
          d.dj.id === dj.dj.id ? { ...d, unknown: !isKnown } : d
        )
      );

      setUnsavedData(true);

      if (!isKnown && currentDJs) {
        // Get a new challenger for the current DJ's index
        const [newChallenger] = getRandomDJs(allDJs, [dj]);

        // Keep the current DJ and add the new challenger in current DJs
        setCurrentDJs(
          index === 0
            ? [newChallenger, currentDJs[1]]
            : [currentDJs[0], newChallenger]
        );
      }
    },
    [allDJs, currentDJs]
  );

  useEffect(() => {
    if (!currentDJs) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handleChoice(currentDJs[0], currentDJs[1], 0);
      } else if (event.key === 'ArrowRight') {
        handleChoice(currentDJs[1], currentDJs[0], 1);
      } else if (event.key === 'ArrowUp') {
        handleKnownStatus(currentDJs[0], false, 0);
      } else if (event.key === 'ArrowDown') {
        handleKnownStatus(currentDJs[1], false, 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentDJs, handleChoice, handleKnownStatus]);

  const handleResetDJ = useCallback((djId: string) => {
    setUnsavedData(true);
    setAllDJs((prev) =>
      prev.map((dj) =>
        dj.dj.id === djId
          ? { ...dj, elo_rating: BASE_ELO, battles_count: 0, unknown: false }
          : dj
      )
    );
  }, []);

  const sortedRankedDJs = useMemo(() => {
    return Array.from(allDJs.values())
      .filter((dj) => dj.unknown !== true && dj.battles_count > 0)
      .sort((a, b) => b.elo_rating - a.elo_rating);
  }, [allDJs]);

  const unknownDJs = useMemo(() => {
    return Array.from(allDJs.values())
      .filter((dj) => dj.unknown === true)
      .sort((a, b) => a.dj.name.localeCompare(b.dj.name));
  }, [allDJs]);

  if (isLoading) return <LoadingScreen />;

  return (
    <Container
      size="4"
      style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}
    >
      <Flex direction="column" gap="9">
        {/* Heading + Instructions Section */}
        <HeroSection />

        {/* DJ Battle Section */}
        {currentDJs && (
          <DJBattleSection
            leftDJ={{
              dj: currentDJs[0],
              currentPosition: 'left',
              currentRank:
                sortedRankedDJs.findIndex(
                  (d) => d.dj.id === currentDJs[0].dj.id
                ) + 1,
            }}
            rightDJ={{
              dj: currentDJs[1],
              currentPosition: 'right',
              currentRank:
                sortedRankedDJs.findIndex(
                  (d) => d.dj.id === currentDJs[1].dj.id
                ) + 1,
            }}
            onLeftKeyPress={() => handleChoice(currentDJs[0], currentDJs[1], 0)}
            onRightKeyPress={() =>
              handleChoice(currentDJs[1], currentDJs[0], 1)
            }
            onUpKeyPress={() => handleKnownStatus(currentDJs[0], false, 0)}
            onDownKeyPress={() => handleKnownStatus(currentDJs[1], false, 1)}
          />
        )}

        {/* Personal Rankings Section */}
        <PersonalDJRankingSection
          hasRankings={sortedRankedDJs.length > 0}
          notifyUnsavedData={unsavedData}
          saveButton={
            sortedRankedDJs.length > 0 && (
              <Button
                size="3"
                color="green"
                variant="surface"
                onClick={saveRankings}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save my personal DJ ranking'}
              </Button>
            )
          }
        >
          {sortedRankedDJs.map((dj, index) => (
            <PersonalDJRankingListItem
              key={index}
              dj={dj}
              onDJReset={handleResetDJ}
              index={index}
            />
          ))}
        </PersonalDJRankingSection>

        {/* Unknown DJs Section */}
        <UnknownDjsSection length={unknownDJs.length}>
          {unknownDJs.map((dj) => (
            <UnknownDJListItem
              key={dj.dj.id}
              dj={dj}
              onRevertStatus={() => handleKnownStatus(dj, true, -1)}
            />
          ))}
        </UnknownDjsSection>

        <div style={{ height: '1px', backgroundColor: 'var(--accent-2)' }} />

        {/* Dangerous Section */}
        {sortedRankedDJs.length >= 3 && (
          <DangerousSection
            onReset={() => {
              // Reset all DJs to base Elo rating
              const resetDJs = allDJs.map((dj) => ({
                ...dj,
                elo_rating: BASE_ELO,
                battles_count: 0,
                unknown: null,
              }));
              setAllDJs(resetDJs);

              // Set new current DJs
              if (resetDJs.length >= 2) {
                setCurrentDJs(getRandomDJs(resetDJs, []));
              }
            }}
          />
        )}
      </Flex>
    </Container>
  );
}
