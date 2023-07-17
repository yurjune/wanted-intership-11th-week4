/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

export const Header = () => {
  return (
    <h1 css={header}>
      국내 모든 임상시험 검색하고
      <br />
      온라인으로 참여하기
    </h1>
  );
};

const header = css`
  text-align: center;
  line-height: 4rem;
  font-size: 2rem;
`;
