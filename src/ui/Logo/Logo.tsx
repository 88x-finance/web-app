import Link from 'next/link';
import LogoImage from './logo.svg';

interface Props {}

export function Logo({}: Props): JSX.Element {
  return (
    <Link href="/">
      <LogoImage className="h-24 w-72" />
    </Link>
  );
}
