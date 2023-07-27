import { TitleFieldProps } from '@rjsf/utils';

export const TitleLayout = ({ id, title, required }: TitleFieldProps) => {
  return (
    <header id={id}>
      <p className="pb-4 text-3xl font-semibold">
        {title} {required && <mark className="bg-transparent text-sm">*</mark>}
      </p>
    </header>
  );
};
