'use client';

import { Text, Flex, Container } from '@radix-ui/themes';
import { useState, useEffect, useMemo, useCallback } from 'react';

import { DJ, djs } from '@/constant/djs';
import { getRandomDJs } from '@/utils/utils';
import HeroSection from '@/components/HeroSection';
import LoadingScreen from '@/components/LoadingScreen';
import DJBattleSection from '@/components/DJBattleSection';
import DangerousSection from '@/components/DangerousSection';
import UnknownDjsSection from '@/components/UnknownDjsSection';
import UnknownDJListItem from '@/components/UnknownDJListItem';
import PersonalDJRankingSection from '@/components/PersonalDJRankingSection';
import PersonalDJRankingListItem from '@/components/PersonalDJRankingListItem';

export default function Home() {
  const [allDJs, setAllDJs] = useState<DJ[]>([]);
  const [currentDJs, setCurrentDJs] = useState<[DJ, DJ] | null>(null);

  useEffect(() => {
    if (djs.length === 0) return;

    setAllDJs(djs);
    setCurrentDJs(getRandomDJs(djs, []));
  }, [djs]);

  const handleChoice = useCallback(
    (winner: DJ, loser: DJ, winnerIndex: number) => {
      // Replace Map.get with find
      const winnerDj = allDJs.find((dj) => dj.id === winner.id);
      const loserDj = allDJs.find((dj) => dj.id === loser.id);

      if (!winnerDj || !loserDj) return;

      // Update the winner's weight
      const winnerUpdated = { ...winnerDj, weight: (winnerDj.weight || 0) + 1 };
      setAllDJs((prev) =>
        prev.map((dj) => (dj.id === winner.id ? winnerUpdated : dj))
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
        console.error('Not enough known DJs available');
      }
    },
    [allDJs]
  );

  const handleKnownStatus = useCallback(
    (dj: DJ, isKnown: boolean, index: number) => {
      // Update the DJ's unknown status in allDJs
      setAllDJs((prev) =>
        prev.map((d) => (d.id === dj.id ? { ...d, unknown: !isKnown } : d))
      );

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
    setAllDJs((prev) =>
      prev.map((dj) => (dj.id === djId ? { ...dj, weight: 0 } : dj))
    );
  }, []);

  const sortedRankedDJs = useMemo(() => {
    return Array.from(allDJs.values())
      .filter((dj) => dj.unknown !== true && dj.weight)
      .sort((a, b) => b.weight - a.weight);
  }, [allDJs]);

  const unknownDJs = useMemo(() => {
    return Array.from(allDJs.values()).filter((dj) => dj.unknown === true);
  }, [allDJs]);

  if (!djs || !currentDJs) return <LoadingScreen />;

  return (
    <Container
      size="4"
      style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}
    >
      <Flex direction="column" gap="8">
        {/* Heading + Instructions Section */}
        <HeroSection />

        {/* DJ Battle Section */}
        {currentDJs && (
          <DJBattleSection
            leftDJ={{
              dj: currentDJs[0],
              currentPosition: 'left',
              currentRank:
                sortedRankedDJs.findIndex((d) => d.id === currentDJs[0].id) + 1,
            }}
            rightDJ={{
              dj: currentDJs[1],
              currentPosition: 'right',
              currentRank:
                sortedRankedDJs.findIndex((d) => d.id === currentDJs[1].id) + 1,
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
        <PersonalDJRankingSection>
          {sortedRankedDJs.length === 0 ? (
            <Text size="3" color="gray">
              Rank some DJs first and see your personal ranking here!
            </Text>
          ) : (
            <>
              {sortedRankedDJs.map((dj, index) => (
                <PersonalDJRankingListItem
                  key={index}
                  dj={dj}
                  onDJReset={handleResetDJ}
                  index={index}
                />
              ))}
            </>
          )}
        </PersonalDJRankingSection>

        {/* Unknown DJs Section */}
        <UnknownDjsSection length={unknownDJs.length}>
          {unknownDJs.map((dj, index) => (
            <UnknownDJListItem
              key={dj.id}
              dj={dj}
              onRevertStatus={() => handleKnownStatus(dj, true, -1)}
            />
          ))}
        </UnknownDjsSection>

        {/* Dangerous Section */}
        {sortedRankedDJs.length >= 3 && (
          <DangerousSection
            onReset={() => {
              setAllDJs(djs);
              setCurrentDJs(getRandomDJs(allDJs, []));
            }}
          />
        )}
      </Flex>
    </Container>
  );
}
