import { UIRenderer, UIRendererProps } from '@/components/organisms/UIRenderer';
import { UIPage } from '@/domains/collection-flow';
import { motion } from 'framer-motion';
import { FunctionComponent } from 'react';

export const AnimatedUIRenderer: FunctionComponent<UIRendererProps & { currentPage: UIPage }> = ({
  schema,
  elements,
  currentPage,
}) => {
  return (
    <motion.div
      initial={{ x: '50%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      key={currentPage.stateName}
    >
      <UIRenderer schema={schema} elements={elements} />
    </motion.div>
  );
};

AnimatedUIRenderer.displayName = 'AnimatedUIRenderer';
