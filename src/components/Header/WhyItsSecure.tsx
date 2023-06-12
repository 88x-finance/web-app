import { Shield } from 'iconsax-react';

export function WhyItsSecure(): JSX.Element {
  return (
    <button className="flex h-32 items-center gap-6 rounded-10 border border-green-6 bg-green-7 px-8 text-sm text-green-1 transition-colors hover:border-green-5 lg:px-14">
      <Shield size="18" />
      <div className="hidden lg:block">Why it&#39;s secure?</div>
    </button>
  );
}
