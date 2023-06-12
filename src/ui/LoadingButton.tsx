import { classNames } from '~/lib/classNames';
import { Button, ButtonProps } from './Button';
import { Spinner } from './Spinner';

interface Props
  extends Omit<ButtonProps, 'variant'>,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

// Loading button with forced "dark" variant (for now)
export function LoadingButton({
  loading,
  children,
  className,
  disabled,
  ...props
}: Props): JSX.Element {
  return (
    <Button
      variant="dark"
      className={classNames(
        className,
        loading && 'disabled:cursor-not-allowed disabled:!bg-dark-1',
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner className="mr-10" />}
      {children}
    </Button>
  );
}
