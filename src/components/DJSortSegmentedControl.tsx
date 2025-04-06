import { SegmentedControl } from '@radix-ui/themes';
import { FetchDJsSortOption } from '@/constant/djs';

interface DJSortSegmentedControlProps {
  currentSort: FetchDJsSortOption;
  currentPage: number;
  onSortChange?: (sort: FetchDJsSortOption) => void;
}

export default function DJSortSegmentedControl({
  currentSort,
  currentPage,
  onSortChange,
}: DJSortSegmentedControlProps) {
  const handleSortChange = (value: string) => {
    // If parent provided a callback, use it for client-side update
    if (onSortChange) {
      onSortChange(value as FetchDJsSortOption);
    }

    // Update URL without full page reload
    const url = `/djs?page=${currentPage}&sort=${value}`;
    window.history.pushState({}, '', url);
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
