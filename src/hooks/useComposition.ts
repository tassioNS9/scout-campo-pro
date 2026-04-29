import { useRef } from "react";

export function useComposition() {
  const isComposing = useRef(false);

  const onCompositionStart = () => {
    isComposing.current = true;
  };

  const onCompositionEnd = () => {
    isComposing.current = false;
  };

  return {
    isComposing,
    onCompositionStart,
    onCompositionEnd,
  };
}
