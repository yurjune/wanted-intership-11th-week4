import { useCallback, useRef, useState } from 'react';
import { getSick } from '../api';
import type { Recommend } from '../model';
import { debounce } from '../utils';

type Cache = {
  [key: string]: {
    data: Recommend[];
    time: number;
  };
};

interface useRecommendProps {
  expireTime: number;
  sliceCount: number;
  onSuccess: () => void;
}

export const useRecommend = (props: useRecommendProps) => {
  const { expireTime, sliceCount, onSuccess } = props;
  const [recommends, setRecommends] = useState<Recommend[]>([]);
  const cache = useRef<Cache>({});

  const getRecommends = async (word: string): Promise<Recommend[]> => {
    const cached = cache.current[word];
    const currentTime = new Date().getTime();

    if (!word) return [];
    if (cached !== undefined && currentTime - cached.time < expireTime * 1000) {
      return cached.data;
    }

    try {
      const data = await getSick({ key: word });
      cache.current[word] = {
        data,
        time: currentTime,
      };
      return data;
    } catch (err) {
      console.error(err);
    }

    return [];
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateRecommends = useCallback(
    debounce<[word: string]>(async (word) => {
      const result = await getRecommends(word);
      setRecommends(result.slice(0, sliceCount));
      onSuccess();
    }),
    [],
  );

  return [recommends, debouncedUpdateRecommends] as const;
};
