import { classNames } from '~/lib/classNames';
import { Logo } from '~/ui/Logo';
import { MenuItem } from '~/ui/MenuItem';

interface Props {
  className?: string;
}

export function Footer({ className }: Props): JSX.Element {
  return (
    <footer className={classNames('w-full px-20 sm:h-60 md:px-36', className)}>
      <div className="mx-auto flex h-full max-w-desktop flex-col items-center gap-12 px-20 sm:flex-row sm:gap-30 md:px-36 lg:grid lg:grid-cols-3">
        <div className="flex items-center gap-14">
          <Logo />
        </div>

        <div className="flex h-full gap-24 text-sm sm:justify-center lg:gap-48">
          <MenuItem href="/">Privacy Policy</MenuItem>
          <MenuItem href="/">Terms of Use</MenuItem>
        </div>

        <div className="text-sm text-dark-4 sm:ml-auto sm:text-right">
          © 2022 88x. All right reserved
        </div>
      </div>
    </footer>
  );
}
