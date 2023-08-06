import clsx from 'clsx';

interface Props {
  text: string;
  className?: string;
}

export const ErrorMessage = ({ text, className }: Props) => {
  return <p className={clsx('text-destructive text-[0.8rem]', className)}>{text}</p>;
};
