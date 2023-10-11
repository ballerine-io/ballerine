interface Props {
  logoSrc: string;
  appName: string;
}

export const Logo = ({ logoSrc, appName }: Props) => {
  return <img src={logoSrc} alt={appName} className="max-h-[80px] max-w-[200px] object-cover" />;
};
