import { SegmentedControl } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import { FetchDJsSortOption } from '@/constant/djs';

interface DJSortSegmentedControlProps {
  currentSort: FetchDJsSortOption;
  currentPage: number;
}

export default function DJSortSegmentedControl({
  currentSort,
  currentPage,
}: DJSortSegmentedControlProps) {
  const router = useRouter();

  const handleSortChange = (value: string) => {
    router.push(`/djs?page=${currentPage}&sort=${value}`);
  };

  return (
    <SegmentedControl.Root
      value={currentSort}
      onValueChange={handleSortChange}
      mb="6"
    >
      <SegmentedControl.Item
        value="global_rating"
        style={{
          backgroundColor:
            currentSort === 'global_rating' ? '#3b82f6' : undefined,
        }}
      >
        Global DJs Rating
      </SegmentedControl.Item>
      <SegmentedControl.Item
        value="user_rating"
        style={{
          backgroundColor:
            currentSort === 'user_rating' ? '#22c55e' : undefined,
        }}
      >
        Your DJs Rating
      </SegmentedControl.Item>
      <SegmentedControl.Item
        value="user_unknown"
        style={{
          backgroundColor:
            currentSort === 'user_unknown' ? '#94a3b8' : undefined,
        }}
      >
        Your Unknown DJs
      </SegmentedControl.Item>
    </SegmentedControl.Root>
  );
}
