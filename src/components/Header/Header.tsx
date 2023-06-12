'use client';

import { motion, useMotionTemplate, useScroll, useTransform } from 'framer-motion';
import { classNames } from '~/lib/classNames';
import { Logo } from '~/ui/Logo';
import { MenuItem } from '~/ui/MenuItem';
import { ConnectButton } from '../ConnectButton';
import { WhyItsSecure } from './WhyItsSecure';

interface Props {
  className?: string;
}

// Half of the height of the header
const INPUT_RANGE = [0, 30];

export function Header({ className }: Props): JSX.Element {
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(scrollY, INPUT_RANGE, [
    'rgba(255,255,255,0)',
    'rgba(255,255,255,0.6)',
  ]);
  const blur = useTransform(scrollY, INPUT_RANGE, [0, 15]);
  const backdropFilter = useMotionTemplate`blur(${blur}px)`;
  const lineOpacity = useTransform(scrollY, INPUT_RANGE, [1, 0]);

  const menuItems = (
    <>
      <MenuItem href="/">Vaults</MenuItem>
      <MenuItem href="/activity">Activity</MenuItem>
    </>
  );

  return (
    <>
      <motion.header
        className={classNames('fixed z-10 h-60 w-full px-20 md:px-36', className)}
        style={{ backgroundColor, backdropFilter, WebkitBackdropFilter: backdropFilter }}
      >
        <nav className="gap-3.5 relative mx-auto flex h-full max-w-desktop items-center gap-14 px-20 md:px-36 lg:grid lg:grid-cols-3">
          <div className="flex items-center gap-14">
            <Logo />
            <WhyItsSecure />
          </div>

          <div className="hidden h-full justify-center gap-20 md:flex lg:gap-48">{menuItems}</div>

          <ConnectButton className="ml-auto" />

          <motion.div
            className="absolute left-20 right-20 top-full border-t border-gray-6 md:left-36 md:right-36"
            style={{ opacity: lineOpacity }}
          />
        </nav>
      </motion.header>

      <div className="fixed bottom-0 z-10 h-60 w-full bg-white px-36 md:hidden">
        <div className="mx-auto grid h-full max-w-desktop auto-cols-fr grid-flow-col gap-48 px-36 text-center ">
          {menuItems}
        </div>
      </div>
    </>
  );
}
