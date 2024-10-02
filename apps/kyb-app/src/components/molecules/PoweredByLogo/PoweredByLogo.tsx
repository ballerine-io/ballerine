import { getRGBColorFromElement, isColorDark } from '@/components/molecules/PoweredByLogo/helpers';
import { FunctionComponent, useEffect, useState } from 'react';

interface IPoweredByLogoProps {
  className?: string;
  sidebarRootId: string;
}

export const PoweredByLogo: FunctionComponent<IPoweredByLogoProps> = ({
  className,
  sidebarRootId,
}) => {
  const [sidebarElement, setSidebarElement] = useState<HTMLElement | null>(null);
  const [logoSrc, setLogoSrc] = useState<string | null>(null);

  useEffect(() => {
    setSidebarElement(document.getElementById(sidebarRootId));
  }, [sidebarRootId]);

  useEffect(() => {
    if (!sidebarElement) return;

    const rgb = getRGBColorFromElement(sidebarElement);

    if (rgb) {
      const [r, g, b] = rgb as [number, number, number];

      const isDark = isColorDark(r, g, b);

      setLogoSrc(isDark ? '/poweredby-white.svg' : '/poweredby.svg');
    } else {
      console.warn('Could not detect color. Default powered by logo will be used.');

      setLogoSrc('/poweredby.svg');
    }
  }, [sidebarElement]);

  if (!logoSrc) return null;

  return <img src={logoSrc} className={className} alt="Powered by logo" />;
};
