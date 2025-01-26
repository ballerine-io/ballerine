import { AnyChildren } from '@ballerine/ui';

interface Props {
  children: AnyChildren;
}

export const Content = ({ children }: Props) => {
  return (
    <div
      className="text-secondary-foreground h-full w-[100%] overflow-auto p-4"
      style={{
        background: 'var(--secondary)',
      }}
    >
      {children}
    </div>
  );
};
