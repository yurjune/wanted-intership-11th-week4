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
    <Space.Compact style={{ width: '100%' }} size='large'>
      <Input value={value} onChange={onChange} ref={ref} onFocus={onFocus} onBlur={onBlur} />
      <Button type='primary'>검색</Button>
    </Space.Compact>
  );
});
