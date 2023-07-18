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
// useRecommend.ts
export const useRecommend = (props: useRecommendProps) => {
  // omit...

  // description 1
  const cache = useRef<Cache>({});

  const getRecommends = async (word: string): Promise<Recommend[]> => {
    const cached = cache.current[word];
    const currentTime = new Date().getTime();

    if (!word) return [];

    // description 2, 3
    if (cached !== undefined && currentTime - cached.time < expireTime * 1000) {
      return cached.data;
    }

    try {
      // description 4
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

  // omit...
};
```

### 2. API 호출 횟수 줄이기 - Debounce

1. 디바운스를 이용하여 입력 이벤트를 그룹화하고, 마지막 입력으로부터 timeout(0.5초) 이 경과하면 마지막 입력값에 대한 api 호출만 수행<br>

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
// useRecommend.ts
const debouncedUpdateRecommends = useCallback(
  debounce<[word: string]>(async (word) => {
    const result = await getRecommends(word);
    setRecommends(result.slice(0, sliceCount));
    onSuccess();
  }),
  [],
);
```

### 3. 키보드만으로 추천 검색어 이동

1. keydown 이벤트에 대한 이벤트 핸들러를 생성:

- ArrowDown, ArrowUp 이벤트가 발생하면 추천 검색어 리스트의 현재 선택된 아이템의 인덱스를 변경
- Enter 이벤트가 발생하면 onSelect 콜백함수를 실행

2. 이벤트 핸들러를 domElement 에 부착

```Typescript
// useSelectCurrentItem.ts
const [currentItemIdx, setCurrentItemIdx] = useState(-1);

useEffect(() => {
  if (domElement == null) return;

  const endIdx = totalLength - 1;

  // description 1
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        setCurrentItemIdx((prev) => (prev === endIdx ? 0 : prev + 1));
        break;
      case 'ArrowUp':
        setCurrentItemIdx((prev) => (prev === 0 || prev === -1 ? endIdx : prev - 1));
        break;
      case 'Enter':
        if (currentItemIdx !== -1) {
          onSelect(currentItemIdx);
        }
        break;
    }
  };

  // description 2
  domElement.addEventListener('keydown', handleKeyDown);
  return () => domElement.removeEventListener('keydown', handleKeyDown);
}, [totalLength, currentItemIdx, onSelect, domElement]);
```

## 기타 구현 사항

### 1. 추천 검색어에 대한 관심사 분리<br>

- useRecommend custom hook 을 생성하여 추천 검색어 리스트에 대한 상태 관리
- 데이터 캐싱과 추천 검색어 api 요청에 대한 로직 관리
- 사용처로부터 캐시 만료 주기, 렌더링할 추천 검색어의 최대 개수, 데이터 페칭 성공 시 실행할 onSuccess 콜백 함수를 사용처로부터 주입받아 컨트롤

```Typescript
// Home.tsx
const [recommends, debouncedUpdateRecommends] = useRecommend({
  expireTime: 5,
  sliceCount: 10,
  onSuccess: () => setRecommendationOpen(true),
});
```

### 2. 추천 검색어 방향키 선택에 대한 관심사 분리

- useSelectCurrentItem custom hook 을 생성하여 방향키 입력에 대한 동작 관리<br>
  useEffect 에서 dom 요소에 keydown 이벤트에 이벤트 핸들러 부착
- 사용처로부터 dom 요소, 목록 최대 길이, 아이템 선택 시 실행할 onSelect 콜백함수를 주입받아 컨트롤

```Typescript
// Home.tsx
const [currentItemIdx, resetCurrentItemIdx] = useSelectCurrentItem({
  domElement: inputRef.current?.input,
  totalLength: recommends.length,
  onSelect: (idx: number) => {
    setInputValue(recommends[idx].sickNm);
    handleInputBlur();
  },
});
```
