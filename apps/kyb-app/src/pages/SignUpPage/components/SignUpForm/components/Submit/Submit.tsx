import { Chip } from '@/common/components/atoms/Chip';
import { LoadingSpinner } from '@/common/components/atoms/LoadingSpinner';
import { useSignupLayout } from '@/common/components/layouts/Signup';
import { Button, ctw } from '@ballerine/ui';
import { getSubmitButtonOptions, SubmitButtonProps } from '@rjsf/utils';
import { Check } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { FunctionComponent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Submit: FunctionComponent<SubmitButtonProps> = ({ uiSchema }) => {
  const { themeParams } = useSignupLayout();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { t } = useTranslation();
  const { norender, submitText, props } = getSubmitButtonOptions(uiSchema);
  const disabled = Boolean(uiSchema?.['ui:options']?.submitButtonOptions?.props?.disabled);

  const onClick = useCallback(() => {
    setIsSubmitted(true);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSaved(true);
    }, 3000);
  }, []);

  if (norender) return null;

  return (
    <div className={ctw('flex justify-end items-center', props?.layoutClassName)}>
      <AnimatePresence mode="wait">
        {!isSubmitted && (
          <motion.div
            key="button"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              type="button"
              className="bg-black text-white shadow-sm hover:bg-black/80"
              loaderClassName="text-secondary-foreground"
              isLoading={isLoading}
              onClick={onClick}
            >
              {themeParams?.form?.submitText || submitText}
            </Button>
          </motion.div>
        )}
        {isSubmitted && (
          <AnimatePresence mode="wait">
            <motion.div
              key="chip"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div layout style={{ width: 'fit-content' }}>
                <Chip
                  icon={
                    <AnimatePresence mode="wait">
                      {isLoading && !isSaved && (
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
                      {isSaved && (
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
                  variant={!isSaved ? 'primary' : 'success'}
                  text={!isSaved ? t('saving') : t('progressSaved')}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </AnimatePresence>
    </div>
  );
};
