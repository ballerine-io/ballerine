import { ComponentPropsWithoutRef, FunctionComponent } from 'react';

/**
 * @description MiKashBoks logo asset.
 * @param props
 * @constructor
 */
export const MiKashBoksLogo: FunctionComponent<ComponentPropsWithoutRef<'img'>> = props => {
  return <img src="/images/mikashboks-logo-horizontal.png" alt="MiKashBoks" {...props} />;
};
