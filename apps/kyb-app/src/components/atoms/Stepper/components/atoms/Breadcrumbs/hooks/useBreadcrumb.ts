import { breadcrumbContext } from '@/components/atoms/Stepper/components/atoms/Breadcrumbs/breadcrumb.context';
import { useContext } from 'react';

export const useBreadcrumbContext = () => useContext(breadcrumbContext);
