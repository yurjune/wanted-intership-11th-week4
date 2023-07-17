/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Input, InputRef, List } from 'antd';
import { ChangeEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { Recommend, getSick } from '../api';
import { debounce } from '../utils';

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

  const getRecommends = async (word: string) => {
    const EXPIRE_TIME = 5;
    const cached = cache.current[word];
    const currentTime = new Date().getTime();

    let result: Recommend[] = [];

    if (cached !== undefined && currentTime - cached.time < EXPIRE_TIME * 1000) {
      result = cached.data;
    } else {
      try {
        const data = await getSick({ key: word });
        cache.current[word] = {
          data,
          time: currentTime,
        };
        result = data;
      } catch (err) {
        console.error(err);
      }
    }

    return result;
  };

  const debouncedGetRecommends = useCallback(
    debounce<[word: string]>(async (word) => {
      const result = await getRecommends(word);
      setRecommends(result.slice(0, 10));
      handleFocus();
    }),
    [],
  );

  const handleValue: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const word = e.target.value;
    setValue(word);
    setCurrentIdx(-1);

    if (word) {
      debouncedGetRecommends(word);
    }
  };

  const handleFocus = () => {
    setOpen(true);
  };

  const handleBlur = () => {
    setCurrentIdx(-1);
    setOpen(false);
  };

  return (
    <div css={container}>
      <h1 css={h1}>
        국내 모든 임상시험 검색하고
        <br />
        온라인으로 참여하기
      </h1>
      <Input
        size='large'
        value={value}
        onChange={handleValue}
        ref={inputRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {open && (
        <List
          css={listContainer}
          bordered
          dataSource={recommends}
          renderItem={(item, idx) => (
            <List.Item
              style={{ backgroundColor: idx === currentIdx ? 'rgb(244, 246, 250)' : 'white' }}
              onMouseDown={() => setValue(recommends[idx].sickNm)}
            >
              {item.sickNm}
            </List.Item>
          )}
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

const h1 = css`
  text-align: center;
  line-height: 4rem;
  font-size: 2.5rem;
`;

const listContainer = css`
  width: 100%;
  background-color: white;
  margin-top: 1rem;
`;

export default Home;
