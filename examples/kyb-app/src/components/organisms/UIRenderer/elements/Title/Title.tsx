export interface TitleOptions {
  text: string;
}

export interface TitleProps {
  options: TitleOptions;
}

export const Title = ({ options = { text: '' } }: TitleProps) => {
  const { text = '' } = options;

  return <h1 className="text-2xl pb-6 font-bold">{text}</h1>;
};
