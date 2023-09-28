import { breadcrumbContext } from '@app/components/atoms/Stepper/components/atoms/Breadcrumbs/breadcrumb.context';
import { useContext } from 'react';

export const useBreadcrumb = () => useContext(breadcrumbContext);
