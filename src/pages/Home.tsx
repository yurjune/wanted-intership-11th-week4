/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { InputRef } from 'antd';
import { ChangeEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { getSick } from '../shared/api';
import { Header, Recommendations, Search } from '../components';
import { debounce } from '../shared/utils';
import { Recommend } from '../shared/model';

export type Cache = {
  [key: string]: {
    data: Recommend[];
    time: number;
  };
};

const Home = () => {
  const [value, setValue] = useState('');
  const [recommends, setRecommends] = useState<Recommend[]>([]);
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [open, setOpen] = useState(false);
  const cache = useRef<Cache>({});
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    const input = inputRef.current?.input;
    if (input == null) return;

    const endIdx = recommends.length - 1;
    const handleEvent = (event: KeyboardEvent) => {
      if (!open) return;

      switch (event.key) {
        case 'ArrowDown':
          setCurrentIdx((prev) => (prev === endIdx ? 0 : prev + 1));
          break;
        case 'ArrowUp':
          setCurrentIdx((prev) => (prev === 0 || prev === -1 ? endIdx : prev - 1));
          break;
        case 'Enter':
          if (currentIdx !== -1) {
            setValue(recommends[currentIdx].sickNm);
            handleBlur();
          }
          break;
      }
    };

    input.addEventListener('keydown', handleEvent);

    return () => {
      input.removeEventListener('keydown', handleEvent);
    };
  }, [recommends, currentIdx, open]);

  const getRecommends = async (word: string): Promise<Recommend[]> => {
    const EXPIRE_TIME = 5;
    const cached = cache.current[word];
    const currentTime = new Date().getTime();

    if (!word) {
      return [];
    }
    if (cached !== undefined && currentTime - cached.time < EXPIRE_TIME * 1000) {
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

  const debouncedGetRecommends = useCallback(
    debounce<[word: string]>(async (word) => {
      const result = await getRecommends(word);
      setRecommends(result.slice(0, 10));
      handleFocus();
    }),
    [],
  );

  const handleChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const word = e.target.value;
    setValue(word);
    setCurrentIdx(-1);
    debouncedGetRecommends(word);
  };

  const handleFocus = () => {
    setOpen(true);
  };

  const handleBlur = () => {
    setCurrentIdx(-1);
    setOpen(false);
  };

  const handleItemClick = (word: string) => () => {
    setValue(word);
  };

  return (
    <div css={container}>
      <Header />
      <Search
        ref={inputRef}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {open && (
        <Recommendations
          value={value}
          recommends={recommends}
          handleClick={handleItemClick}
          currentIdx={currentIdx}
        />
      )}
    </div>
  );
};

const container = css`
  width: 50vw;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default Home;
