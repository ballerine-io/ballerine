import { useEffect, useRef } from 'react';

export const useRadixScrollBoundaries = () => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const resetScrollPosition = () => {
    localStorage.removeItem('scrollPosition');
  };

  const restoreScrollPosition = () => {
    const savedPosition = localStorage.getItem('scrollPosition');

    if (savedPosition && scrollAreaRef.current) {
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = parseInt(savedPosition, 10);
      }
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current?.scrollTop === 0) {
      return restoreScrollPosition();
    }
  }, []);

  const handleScroll = () => {
    const scrollTop = scrollAreaRef.current?.scrollTop ?? 0;
    localStorage.setItem('scrollPosition', scrollTop.toString());
  };

  return { ref: scrollAreaRef, handleScroll };
};
