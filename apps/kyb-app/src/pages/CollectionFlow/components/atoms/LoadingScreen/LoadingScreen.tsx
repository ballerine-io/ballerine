import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  onAnimationComplete?: () => void;
  onExitComplete?: () => void;

  // When providing exactly false onExit callback will be fired
  isLoading?: boolean;
}

export const LoadingScreen = ({
  onAnimationComplete,
  onExitComplete,
  isLoading,
}: LoadingScreenProps) => {
  return (
    <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
      {isLoading === false ? null : (
        <motion.div
          key="loading"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{
            duration: 0.7,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          className="fixed inset-0 flex h-screen w-screen items-center justify-center bg-white/80 backdrop-blur-sm"
          onAnimationComplete={onAnimationComplete}
        >
          <Loader2 className="animate-spin text-black" size={72} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
