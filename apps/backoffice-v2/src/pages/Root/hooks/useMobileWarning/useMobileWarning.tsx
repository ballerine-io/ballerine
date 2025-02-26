import { useEffect, useState } from 'react';

import { BallerineLogo } from '@/common/components/atoms/icons';

export const useMobileWarning = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-8 text-center">
        <BallerineLogo />
        <h2>If you’re on a mobile device, please switch to a desktop for the best experience.</h2>
      </div>
    );
  }
};
