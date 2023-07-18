/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Button, Input, InputRef, Space } from 'antd';
import { ChangeEvent, forwardRef } from 'react';

interface SearchProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
}

export const Search = forwardRef<InputRef, SearchProps>((props, ref) => {
  const { value, onChange, onFocus, onBlur } = props;

  return (
    <Space.Compact css={container} size='large'>
      <Input
        css={input}
        placeholder='질환명을 입력해주세요.'
        value={value}
        onChange={onChange}
        ref={ref}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <Button type='primary'>검색</Button>
    </Space.Compact>
  );
});

const container = css`
  width: 100%;
`;

const input = css`
  &::placeholder {
    color: #a9a9a9;
  }
`;
