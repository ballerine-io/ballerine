import { useEffect, useRef } from 'react';

export const usePersistentScroll = () => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const resetScrollPosition = () => {
    sessionStorage.removeItem('scrollPosition');
  };

  const restoreScrollPosition = () => {
    const savedPosition = sessionStorage.getItem('scrollPosition');

    if (savedPosition && scrollAreaRef.current) {
      scrollAreaRef.current.scroll(0, parseInt(savedPosition, 10));
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current?.scrollTop === 0) {
      return restoreScrollPosition();
    }
  }, []);

  const handleScroll = () => {
    const scrollTop = scrollAreaRef.current?.scrollTop ?? 0;
    sessionStorage.setItem('scrollPosition', scrollTop.toString());
  };

  return { ref: scrollAreaRef, handleScroll };
};
