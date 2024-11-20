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
import { motion } from 'framer-motion';
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
    <motion.div className="w-full" exit={{ x: '-100%', opacity: 0 }} transition={{ duration: 0.7 }}>
      <Signup themeParams={themeRef.current?.signup}>
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
