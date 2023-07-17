/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ReactNode } from 'react';

export const Layout = ({ children }: { children: ReactNode }) => {
  return <div css={container}>{children}</div>;
};

const container = css`
  width: 100vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
