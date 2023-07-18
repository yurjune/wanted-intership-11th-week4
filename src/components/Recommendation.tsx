/** @jsxImportSource @emotion/react */
import { SearchOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { List } from 'antd';
import { Recommend } from '../shared/model';

interface RecommendationProps {
  searchWord: string;
  recommends: Recommend[];
  currentItemIdx: number;
  handleClick: (word: string) => () => void;
}

export const Recommendation = (props: RecommendationProps) => {
  const { searchWord, recommends, handleClick, currentItemIdx } = props;

  return (
    <List
      css={container}
      bordered
      split={false}
      dataSource={recommends}
      header={
        searchWord ? (
          <div css={header}>
            <div>
              <SearchOutlined css={searchIcon} />
              {searchWord}
            </div>
            <div css={search}>추천 검색어</div>
          </div>
        ) : null
      }
      renderItem={(item, idx) => (
        <List.Item
          css={listItem}
          style={{ backgroundColor: idx === currentItemIdx ? 'rgb(244, 246, 250)' : 'white' }}
          onMouseDown={handleClick(recommends[idx].sickNm)}
        >
          <SearchOutlined css={searchIcon} />
          {item.sickNm}
        </List.Item>
      )}
    />
  );
};

const container = css`
  width: 100%;
  background-color: white;
  margin-top: 1rem;
  border-radius: 0;
`;

const header = css`
  margin-bottom: -12px;
`;

const search = css`
  font-size: 12px;
  color: gray;
  margin-top: 16px;
`;

const listItem = css`
  cursor: pointer;
`;

const searchIcon = css`
  color: gray;
  margin-right: 8px;
`;
