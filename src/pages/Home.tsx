/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { InputRef } from 'antd';
import { ChangeEventHandler, useRef, useState } from 'react';
import { Header, Recommendation, Search } from '../components';
import { useRecommend, useSelectCurrentItem } from '../shared/hooks';

const Home = () => {
  const [inputValue, setInputValue] = useState('');
  const [isRecommendationOpen, setRecommendationOpen] = useState(false);
  const inputRef = useRef<InputRef>(null);

  const [recommends, debouncedUpdateRecommends] = useRecommend({
    expireTime: 5,
    sliceCount: 10,
    onSuccess: () => setRecommendationOpen(true),
  });

  const [currentItemIdx, resetCurrentItemIdx] = useSelectCurrentItem({
    domElement: inputRef.current?.input,
    totalLength: recommends.length,
    onSelect: (idx: number) => {
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
  margin-top: 5rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default Home;
