export interface TitleOptions {
  text: string;
}

export interface TitleProps {
  options: TitleOptions;
}

export const Title = ({ options = { text: '' } }: TitleProps) => {
  const { text = '' } = options;

  return <h1 className="text-3xl py-4 font-bold">{text}</h1>;
};
