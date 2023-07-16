/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Select } from 'antd';

const Home = () => {
  return (
    <div css={container}>
      <h1 css={h1}>
        국내 모든 임상시험 검색하고
        <br />
        온라인으로 참여하기
      </h1>
      <Select css={select} size='large' showSearch />
    </div>
  );
};

const container = css`
  width: 50vw;
  height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const h1 = css`
  text-align: center;
  line-height: 4rem;
  font-size: 2.5rem;
`;

const select = css`
  width: 100%;
`;

export default Home;
