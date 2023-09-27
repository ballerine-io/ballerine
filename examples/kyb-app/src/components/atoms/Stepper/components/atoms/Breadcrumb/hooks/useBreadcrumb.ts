import { breadcrumbContext } from '@app/components/atoms/Stepper/components/atoms/Breadcrumb/breadcrumb.context';
import { useContext } from 'react';

export const useBreadcrumb = () => useContext(breadcrumbContext);
