import {
  Background,
  Content,
  Footer,
  FormContainer,
  Header,
  Logo,
  Signup,
} from '@/common/components/layouts/Signup';
import { useTheme } from '@/common/providers/ThemeProvider';

export const SignUpPage = () => {
  const { themeDefinition } = useTheme();

  return (
    <Signup themeParams={themeDefinition.signup}>
      <Content>
        <Logo />
        <Header />
        <FormContainer>
          <div className={'h-[400px] bg-green-500'}>Form mock</div>
        </FormContainer>
        <Footer />
      </Content>
      <Background />
    </Signup>
  );
};
