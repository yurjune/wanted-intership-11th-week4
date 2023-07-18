/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ChangeEventHandler, useState } from 'react';
import { Header, Recommendation, Search } from '../components';
import { useKeydown, useRecommend } from '../shared/hooks';

const Home = () => {
  const [inputValue, setInputValue] = useState('');
  const [isRecommendationOpen, setRecommendationOpen] = useState(false);

  const [recommends, debouncedUpdateRecommends] = useRecommend({
    expireTime: 5,
    sliceCount: 10,
    onSuccess: () => setRecommendationOpen(true),
  });

  const [currentItemIdx, resetCurrentItemIdx, handleKeyDown] = useKeydown({
    totalLength: recommends.length,
    onEnter: (idx: number) => {
      setInputValue(recommends[idx].sickNm);
      handleInputBlur();
    },
  });

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const word = e.target.value;
    setInputValue(word);
    resetCurrentItemIdx();
    debouncedUpdateRecommends(word);
  };

  const handleInputBlur = () => {
    resetCurrentItemIdx();
    setRecommendationOpen(false);
  };

  const handleInputFocus = () => {
    setRecommendationOpen(true);
  };

  const handleItemClick = (word: string) => () => {
    setInputValue(word);
  };

  return (
    <div css={container}>
      <Header />
      <Search
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
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
  margin-top: 5rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default Home;
