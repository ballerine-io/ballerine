import { pageContext } from '@app/components/organisms/DynamicUI/Page/page.context';
import { useContext } from 'react';

export const usePageContext = () => useContext(pageContext);
