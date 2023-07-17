/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Input, List } from 'antd';
import { ChangeEventHandler, useRef, useState } from 'react';
import { Recommend, getSick } from '../api';

type Cache = {
  [key: string]: {
    data: Recommend[];
    time: number;
  };
};

const EXPIRE_TIME = 5;

const Home = () => {
  const [value, setValue] = useState('');
  const [recommends, setRecommends] = useState<Recommend[]>([]);
  const cache = useRef<Cache>({});

  const fetchRecommendsOrGetCachedRecommends = async (val: string) => {
    let result: Recommend[] = [];
    const cached = cache.current[val];
    const currentTime = new Date().getTime();

    if (cached !== undefined && currentTime - cached.time < EXPIRE_TIME * 1000) {
      result = cached.data;
    } else {
      try {
        const data = await getSick({ key: val });
        cache.current[val] = {
          data,
          time: currentTime,
        };
        result = data;
      } catch (err) {
        console.error(err);
      }
    }

    return result;
  };

  const handleValue: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const val = e.target.value;
    setValue(val);

    if (val) {
      const result = await fetchRecommendsOrGetCachedRecommends(val);
      setRecommends(result);
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
