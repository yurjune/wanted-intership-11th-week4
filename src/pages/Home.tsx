/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { InputRef } from 'antd';
import { ChangeEventHandler, useEffect, useRef, useState } from 'react';
import { Header, Recommendations, Search } from '../components';
import { useRecommend } from '../shared/hooks';

const Home = () => {
  const [value, setValue] = useState('');
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<InputRef>(null);

  const [recommends, getRecommends] = useRecommend({
    expireTime: 5,
    sliceCount: 10,
    onSuccess: () => setOpen(true),
  });

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

  const handleChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const word = e.target.value;
    setValue(word);
    setCurrentIdx(-1);
    getRecommends(word);
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
