## 실행 방법

```
git clone https://github.com/yurjune/wanted-intership-11th-week4.git
npm install
npm start

// api 서버
git clone https://github.com/walking-sunset/assignment-api
npm install
npm start
```

## 기술 스택

- React, React-router-dom
- Typescript
- Axios
- Antd, Emotion

## 구현사항

### 1. 로컬 캐싱 + expired time 구현

1. 데이터를 캐싱할 객체를 ref 변수로 선언

2. 입력값이 들어오면 먼저 캐싱된 데이터가 존재하는지 확인

3. 캐시에 저장된 timestamp 와 요청이 들어온 시간의 timestamp 를 비교하여 차이가 expire time 보다 작으면 캐시된 데이터를 반환

4. 그렇지 않으면 데이터를 fetching 하고, 현재 시간과 가져온 데이터를 검색어 key 로 캐싱

```Typescript
const Home = () => {
  // description 1)
  const cache = useRef<Cache>({});

  const getRecommends = async (word: string): Promise<Recommend[]> => {
    const EXPIRE_TIME = 5;
    const cached = cache.current[word];
    const currentTime = new Date().getTime();

    if (!word) return [];
    // description 2, 3)
    if (cached !== undefined && currentTime - cached.time < EXPIRE_TIME * 1000) {
      return cached.data;
    }

    // description 4)
    try {
      const data = await getSick({ key: word });
      cache.current[word] = {
        data,
        time: currentTime,
      };
      return data;
    } catch (err) {
      console.error(err);
    }

    return [];
  };
}
```

### 2. API 호출 횟수 줄이기 - Debounce

1. 디바운스를 이용하여 입력 이벤트를 그룹화하고, 마지막 입력으로부터 timeout(0.5초) 이 경과하면 마지막 입력값에 대한 api 호출만 수행
2. 디바운스 함수를 만들어 데이터를 페칭할 콜백함수를 전달하고 타이머에 등록.<br/>
   만일 새 이벤트가 발생했을 때 timeout 이 경과하지 않으면 타이머를 없애고 새로운 타이머를 할당

```Typescript
// utils.ts
export function debounce<Params extends any[]>(
  func: (...args: Params) => any,
  timeout = 500,
): (...args: Params) => void {
  let timer: NodeJS.Timeout;

  return async (...args: Params) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), timeout);
  };
}
```

```Typescript
// pages/Home.tsx
const debouncedGetRecommends = useCallback(
  debounce<[word: string]>(async (word) => {
    const result = await getRecommends(word);
    setRecommends(result.slice(0, 10));
    handleFocus();
  }),
  [],
);
```

### 3. 키보드만으로 추천 검색어 이동

1. input element 를 ref 변수에 할당
2. useEffect 에서 input element 에 keyboardEvent 를 등록하여 ArrowDown, ArrowUp 이벤트가 발생하면 추천 검색어 리스트의 인덱스를 변경

```Typescript
  // description 1)
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    const input = inputRef.current?.input;
    if (input == null) return;

    const endIdx = recommends.length - 1;

    // description 2)
    const handleEvent = (event: KeyboardEvent) => {
      if (!open) return;

      switch (event.key) {
        case 'ArrowDown':
          setCurrentIdx((prev) => (prev === endIdx ? 0 : prev + 1));
          break;
        case 'ArrowUp':
          setCurrentIdx((prev) => (prev === 0 || prev === -1 ? endIdx : prev - 1));
          break;
        case 'Enter':
          if (currentIdx !== -1) {
            setValue(recommends[currentIdx].sickNm);
            handleBlur();
          }
          break;
      }
    };

    input.addEventListener('keydown', handleEvent);

    return () => {
      input.removeEventListener('keydown', handleEvent);
    };
  }, [recommends, currentIdx, open]);
```
