export interface TitleOptions {
  text: string;
}

export interface TitleProps {
  options: TitleOptions;
}

export const Title = ({ options = { text: '' } }: TitleProps) => {
  const { text = '' } = options;

  return <p className="text-xl">{text}</p>;
};
