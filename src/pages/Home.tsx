/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Input, List } from 'antd';
import { ChangeEventHandler, useState } from 'react';
import { Recommend, getSick } from '../api';

const Home = () => {
  const [value, setValue] = useState('');
  const [recommends, setRecommends] = useState<Recommend[]>([]);

  const handleValue: ChangeEventHandler<HTMLInputElement> = async (e) => {
    setValue(e.target.value);
    try {
      if (e.target.value) {
        const result = await getSick({ key: e.target.value });
        setRecommends(result);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div css={container}>
      <h1 css={h1}>
        국내 모든 임상시험 검색하고
        <br />
        온라인으로 참여하기
      </h1>
      <Input size='large' value={value} onChange={handleValue} />
      {value.length >= 1 && (
        <List
          css={listContainer}
          bordered
          dataSource={recommends.slice(0, 10)}
          renderItem={(item) => <List.Item>{item.sickNm}</List.Item>}
        />
      )}
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

const listContainer = css`
  width: 100%;
  background-color: white;
  margin-top: 1rem;
`;

export default Home;
