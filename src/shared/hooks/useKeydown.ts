import { KeyboardEventHandler, useCallback, useState } from 'react';

interface useKeydownProps {
  totalLength: number;
  onEnter: (idx: number) => void;
}

export const useKeydown = ({ totalLength, onEnter }: useKeydownProps) => {
  const [currentItemIdx, setCurrentItemIdx] = useState(-1);
  const endIdx = totalLength - 1;

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      switch (event.key) {
        case 'ArrowDown':
          setCurrentItemIdx((prev) => (prev === endIdx ? 0 : prev + 1));
          break;
        case 'ArrowUp':
          setCurrentItemIdx((prev) => (prev === 0 || prev === -1 ? endIdx : prev - 1));
          break;
        case 'Enter':
          if (currentItemIdx !== -1) {
            onEnter(currentItemIdx);
          }
          break;
      }
    },
    [currentItemIdx, endIdx, onEnter],
  );

  const resetCurrentItemIdx = () => {
    setCurrentItemIdx(-1);
  };

  return [currentItemIdx, resetCurrentItemIdx, handleKeyDown] as const;
};
