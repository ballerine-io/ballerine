import InterSemibold from '../assets/Inter-SemiBold.ttf';
import InterBold from '../assets/Inter-Bold.ttf';
import InterRegular from '../assets/Inter-Regular.ttf';
import InterLight from '../assets/Inter-Light.ttf';

//@ts-ignore
export const registerFont = (store: any) => {
  store.register({
    family: 'Inter',
    fonts: [
      {
        src: InterLight,
        fontWeight: 300,
      },
      {
        src: InterRegular,
        fontWeight: 400,
      },
      {
        src: InterSemibold,
        fontWeight: 600,
      },
      {
        src: InterBold,
        fontWeight: 700,
      },
    ],
  });
};
