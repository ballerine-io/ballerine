import { AnyChildren } from '@ballerine/ui';

interface Props {
  children: AnyChildren;
  bgSrc: string;
}

export const SigninLayout = ({ children, bgSrc }: Props) => {
  return (
    <div className="justify-stretch flex min-h-screen items-stretch">
      <div className="flex w-full justify-center p-10 md:block md:py-[110px] md:px-[100px] lg:w-[38%]">
        {children}
      </div>
      <div
        className="hidden w-[62%] bg-cover lg:block"
        style={{
          backgroundImage: `url(${bgSrc})`,
        }}
      ></div>
    </div>
  );
};
