import { AnimatePresence } from 'framer-motion';
import { cloneElement, useRef } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';

export const Root = () => {
  const { pathname } = useLocation();
  const element = useOutlet();
  const prevPathRef = useRef(pathname);

  // Determine animation direction based on path depth or specific routes
  const getDirection = (prevPath: string, currentPath: string) => {
    // Example logic - adjust based on your routing structure
    return prevPath.split('/').length < currentPath.split('/').length ? 1 : -1;
  };

  const direction = getDirection(prevPathRef.current, pathname);
  prevPathRef.current = pathname; // Update after calculating direction

  return (
    <AnimatePresence mode="wait" initial={false} custom={direction}>
      {element &&
        cloneElement(element, {
          key: pathname,
          initial: { x: `${100 * direction}%`, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: `${-100 * direction}%`, opacity: 0 },
          transition: { duration: 0.3, ease: 'easeInOut' },
          custom: direction,
        })}
    </AnimatePresence>
  );
};
