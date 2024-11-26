import {
  Background,
  Content,
  Footer,
  FormContainer,
  Header,
  Logo,
  Signup,
} from '@/common/components/layouts/Signup';
import { LoadingScreen } from '@/common/components/molecules/LoadingScreen';
import { useTheme } from '@/common/providers/ThemeProvider';
import { useLanguage } from '@/hooks/useLanguage';
import { useUISchemasQuery } from '@/hooks/useUISchemasQuery';
import { SignUpForm } from './components/SignUpForm';

export const SignUpPage = () => {
  const language = useLanguage();
  const { isLoading } = useUISchemasQuery(language);

  const { themeDefinition } = useTheme();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Signup themeParams={themeDefinition?.signup}>
      <Content>
        <Logo />
        <Header />
        <FormContainer>
          <SignUpForm />
        </FormContainer>
        <Footer />
      </Content>
      <Background />
    </Signup>
  );
};
