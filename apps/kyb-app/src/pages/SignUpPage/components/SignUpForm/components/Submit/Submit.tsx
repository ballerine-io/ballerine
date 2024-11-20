import { Chip } from '@/common/components/atoms/Chip';
import { LoadingSpinner } from '@/common/components/atoms/LoadingSpinner';
import { useSignupLayout } from '@/common/components/layouts/Signup';
import { Button, ctw } from '@ballerine/ui';
import { getSubmitButtonOptions, SubmitButtonProps } from '@rjsf/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useSignupForm } from '../SignUpFormProvider';

export const Submit: FunctionComponent<SubmitButtonProps> = ({ uiSchema }) => {
  const { themeParams } = useSignupLayout();
  const { t } = useTranslation();
  const { norender, submitText, props } = getSubmitButtonOptions(uiSchema);
  const { isLoading: isSignupLoading, isSuccess: isSignupSuccess } = useSignupForm();

  if (norender) return null;

  return (
    <div className={ctw('flex items-center justify-end', props?.layoutClassName)}>
      <AnimatePresence mode="wait">
        {!isSignupLoading && !isSignupSuccess && (
          <motion.div
            key="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              type="submit"
              className="bg-black text-white shadow-sm hover:bg-black/80"
              loaderClassName="text-secondary-foreground"
              isLoading={isSignupLoading}
            >
              {themeParams?.form?.submitText || submitText}
            </Button>
          </motion.div>
        )}
        {(isSignupLoading || isSignupSuccess) && (
          <AnimatePresence mode="wait">
            <motion.div
              key="chip"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div layout style={{ width: 'fit-content' }}>
                <Chip
                  icon={
                    <AnimatePresence mode="wait">
                      {isSignupLoading && !isSignupSuccess && (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <LoadingSpinner size="14" />
                        </motion.div>
                      )}
                      {isSignupSuccess && (
                        <motion.div
                          key="check"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Check
                            size="8"
                            color="#fff"
                            className="flex h-3 w-3 items-center justify-center rounded-full bg-[#00BD59]"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  }
                  className="whitespace-nowrap"
                  variant={!isSignupSuccess ? 'primary' : 'success'}
                  text={!isSignupSuccess ? t('saving') : t('progressSaved')}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </AnimatePresence>
    </div>
  );
};
