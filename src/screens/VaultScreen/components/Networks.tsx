import { Network } from '~/lib/network';
import { NetworkIcon } from '~/ui/NetworkIcon';

interface Props {
  value: Network[];
}

export function Networks({ value }: Props): JSX.Element {
  return (
    <div className="flex items-center gap-12">
      <div>Networks:</div>
      <div className="flex gap-8 text-[2rem]">
        {value.map((network) => (
          <NetworkIcon network={network} key={network} />
        ))}
      </div>
    </div>
  );
}
