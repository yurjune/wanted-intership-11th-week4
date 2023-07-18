import { useEffect, useState } from 'react';

interface useSelectCurrentItemProps {
  domElement: HTMLElement | null | undefined;
  totalLength: number;
  onSelect: (idx: number) => void;
}

export const useSelectCurrentItem = ({
  domElement,
  totalLength,
  onSelect,
}: useSelectCurrentItemProps) => {
  const [currentItemIdx, setCurrentItemIdx] = useState(-1);

  useEffect(() => {
    if (domElement == null) return;

    const endIdx = totalLength - 1;
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

    domElement.addEventListener('keydown', handleKeyDown);
    return () => domElement.removeEventListener('keydown', handleKeyDown);
  }, [totalLength, currentItemIdx, onSelect, domElement]);

  const resetCurrentItemIdx = () => setCurrentItemIdx(-1);

  return [currentItemIdx, resetCurrentItemIdx] as const;
};
