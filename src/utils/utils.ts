import { UserDJRatingDto } from '@/interfaces/dtos';

export function getRandomDJs(
  djs: UserDJRatingDto[],
  excludes: UserDJRatingDto[]
): [UserDJRatingDto, UserDJRatingDto] {
  // Filter out unknown DJs and excluded DJs
  const availableDJs = djs.filter(
    (dj) => !excludes.some((e) => e.dj.id === dj.dj.id) && dj.unknown !== true // Exclude DJs that are marked as unknown
  );

  // If we don't have enough DJs, throw an error
  if (availableDJs.length < 2) {
    throw new Error('Not enough known DJs available');
  }

  const shuffled = [...availableDJs].sort(() => 0.5 - Math.random());
  return [shuffled[0], shuffled[1]];
}

export function getBackgroundColor(index: number) {
  switch (index) {
    case 0:
      return 'var(--accent-8)';
    case 1:
      return 'var(--accent-5)';
    case 2:
      return 'var(--accent-3)';
    default:
      return 'transparent';
  }
}
