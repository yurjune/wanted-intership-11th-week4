/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Button, Input, Space, type InputProps } from 'antd';
import { ChangeEventHandler } from 'react';

interface SearchProps extends Pick<InputProps, 'onKeyDown' | 'onFocus' | 'onBlur'> {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export const Search = (props: SearchProps) => {
  const { value, onChange, onFocus, onBlur, onKeyDown } = props;

  return (
    <Space.Compact css={container} size='large'>
      <Input
        css={input}
        placeholder='질환명을 입력해주세요.'
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <Button type='primary'>검색</Button>
    </Space.Compact>
  );
};

const container = css`
  width: 100%;
`;

const input = css`
  &::placeholder {
    color: #a9a9a9;
  }
`;
