import { FunctionComponent } from 'react';
import { Logo } from './Header.Logo';
import { Navbar } from './Header.Navbar';
import { BottomActions } from './Header.BottomActions';

/**
 * @description A header element wrapper for the {@link Logo}, {@link Navbar}, and {@link BottomActions} (Settings and Log out).
 *
 * @see {@link Logo}
 * @see {@link Navbar}
 * @see {@link BottomActions}
 *
 * @constructor
 */
export const Header: FunctionComponent = () => {
  return (
    <header className={`flex flex-col bg-[#F4F6FD] px-3 py-4`}>
      <Logo />
      <Navbar />
      <BottomActions />
    </header>
  );
};
