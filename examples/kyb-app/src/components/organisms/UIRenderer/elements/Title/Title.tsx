export interface TitleOptions {
  title: string;
}

export interface TitleProps {
  options: TitleOptions;
}

export const Title = ({ options = { title: '' } }: TitleProps) => {
  const { title = '' } = options;

  return <p className="text-xl">{title}</p>;
};
