/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { InputRef } from 'antd';
import { ChangeEventHandler, useEffect, useRef, useState } from 'react';
import { Header, Recommendation, Search } from '../components';
import { useRecommend } from '../shared/hooks';

const Home = () => {
  const [inputValue, setInputValue] = useState('');
  const [currentItemIdx, setCurrentItemIdx] = useState(-1);
  const [isRecommendationOpen, setRecommendationOpen] = useState(false);
  const inputRef = useRef<InputRef>(null);

  const [recommends, debouncedUpdateRecommends] = useRecommend({
    expireTime: 5,
    sliceCount: 10,
    onSuccess: () => setRecommendationOpen(true),
  });

  useEffect(() => {
    const inputEl = inputRef.current?.input;
    if (inputEl == null) return;

    const endIdx = recommends.length - 1;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isRecommendationOpen) return;

      switch (event.key) {
        case 'ArrowDown':
          setCurrentItemIdx((prev) => (prev === endIdx ? 0 : prev + 1));
          break;
        case 'ArrowUp':
          setCurrentItemIdx((prev) => (prev === 0 || prev === -1 ? endIdx : prev - 1));
          break;
        case 'Enter':
          if (currentItemIdx !== -1) {
            setInputValue(recommends[currentItemIdx].sickNm);
            handleInputBlur();
          }
          break;
      }
    };

    inputEl.addEventListener('keydown', handleKeyDown);
    return () => inputEl.removeEventListener('keydown', handleKeyDown);
  }, [recommends, currentItemIdx, isRecommendationOpen]);

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const word = e.target.value;
    setInputValue(word);
    setCurrentItemIdx(-1);
    debouncedUpdateRecommends(word);
  };

  const handleInputFocus = () => {
    setRecommendationOpen(true);
  };

  const handleInputBlur = () => {
    setCurrentItemIdx(-1);
    setRecommendationOpen(false);
  };

  const handleItemClick = (word: string) => () => {
    setInputValue(word);
  };

  return (
    <div css={container}>
      <Header />
      <Search
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      />
      {isRecommendationOpen && (
        <Recommendation
          searchWord={inputValue}
          recommends={recommends}
          handleClick={handleItemClick}
          currentItemIdx={currentItemIdx}
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
