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
import { AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { SignUpForm } from './components/SignUpForm';

export const SignUpPage = () => {
  const { themeDefinition } = useTheme();

  const themeRef = useRef(themeDefinition);

  useEffect(() => {
    if (!themeDefinition) return;

    themeRef.current = themeDefinition;
  }, [themeDefinition]);

  return (
    <Signup themeParams={themeRef.current?.signup}>
      <Content>
        <AnimatePresence mode="wait">
          <Logo />
          <Header />
          <FormContainer>
            <SignUpForm />
          </FormContainer>
          <Footer />
        </AnimatePresence>
      </Content>
      <Background />
    </Signup>
  );
};
