import { ButtonProps } from '@/common/components/atoms/Button/Button';
import { ComponentProps } from 'react';
import { Link } from 'react-router-dom';

export type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, 'size'> &
  ComponentProps<typeof Link>;
