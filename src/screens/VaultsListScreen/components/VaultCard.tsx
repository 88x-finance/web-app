import Link from 'next/link';
import { calcDailyApy, formatPercent, formatTvl } from '~/lib/formatters';
import { getVaultNetworks, Vault } from '~/lib/vault';
import { Button } from '~/ui/Button';
import { NetworkIcon } from '~/ui/NetworkIcon';
import { ScoreBadge } from '~/ui/ScoreBadge';
import { Stat } from '~/ui/Stat';

interface Props {
  vault: Vault;
}

export function VaultCard({ vault }: Props): JSX.Element {
  const { name, apy, tvl } = vault;
  const networks = getVaultNetworks(vault);

  return (
    <div className="rounded-30 bg-white p-20 shadow @container md:p-36">
      <div className="grid items-end gap-24 @md:grid-cols-2 @2xl:grid-cols-3 ">
        <div className="order-first flex items-center gap-10 self-center">
          <div className="h-26 w-26 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
          <div className="text-lg">{name}</div>
        </div>

        <div className="order-first flex items-center gap-10 self-center text-base text-dark-4">
          Safety Score
          <ScoreBadge>90.5</ScoreBadge>
        </div>

        <Stat value={formatPercent(apy)} title="APY" size="xl" />

        <div className="order-last flex flex-col gap-12 @md:order-none @2xl:-order-1">
          <div className="flex gap-6">
            {networks.map((network) => (
              <NetworkIcon key={network} network={network} width={30} height={30} />
            ))}
          </div>
          <div className="text-base text-dark-4">Networks</div>
        </div>

        <Stat
          value={formatPercent(calcDailyApy(apy), 3)}
          title="Daily"
          size="xl"
          variant="secondary"
        />

        <Stat value={formatTvl(tvl)} title="TVL" size="xl" variant="secondary" />
      </div>
      <Button className="mt-30" as={Link} href="/1" variant="dark">
        View vault
      </Button>
    </div>
  );
}
