import { useEffect } from 'react';

interface Props {
  logoSrc: string;
  appName: string;
  onLoad?: () => void;
}

const prefetchImage = (url: string) =>
  new Promise(resolve => {
    const image = new Image();
    image.src = url;
    image.onload = resolve;
  });

const fallback = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout));

export const Logo = ({ logoSrc, appName, onLoad }: Props) => {
  useEffect(() => {
    if (!onLoad) {
      return;
    }

    // Using race here in case if image is corrupted or load takes to long we don't want to lock stepper breadcrumbs forever.
    Promise.race([prefetchImage(logoSrc), fallback(3000)]).then(onLoad);
  }, [logoSrc, onLoad]);

  return <img src={logoSrc} alt={appName} className="max-h-[80px] max-w-[200px] object-cover" />;
};
