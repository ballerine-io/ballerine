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
import { motion } from 'motion/react';
import { SignUpForm } from './components/SignUpForm';

export const SignUpPage = () => {
  const { themeDefinition } = useTheme();

  return (
    <motion.div>
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
    </motion.div>
  );
};
