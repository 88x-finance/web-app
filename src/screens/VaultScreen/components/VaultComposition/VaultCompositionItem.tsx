import { NetworkBadge } from '~/components/NetworkBadge';
import { formatPercent, formatTvl } from '~/lib/formatters';
import { VaultNetwork } from '~/lib/vault';
import { styled } from '~/types/styled';
import { Stat } from '~/ui/Stat';
import { TokenBadge } from '~/ui/TokenBadge';
import { Protocol } from './Protocol';

interface Props {
  vaultNetwork: VaultNetwork;
}

const Title = styled('div', 'text-sm text-dark-5');

export function VaultCompositionItem({ vaultNetwork }: Props): JSX.Element {
  const { network, strategies } = vaultNetwork;

  let totalApy = 0;
  let totalTvl = 0;
  for (const strategy of strategies) {
    totalApy += strategy.apy;
    totalTvl += strategy.tvl;
  }
  totalApy = totalApy / strategies.length;

  return (
    <div className="rounded-25 border border-gray-5">
      <div className="-m-px grid grid-cols-[50%_repeat(2,_minmax(25%,1fr))] items-center justify-start gap-8 rounded-25 border border-transparent bg-white py-[1.0625rem] pl-20 pr-36 shadow">
        <NetworkBadge className="justify-self-start" network={network} />

        <Stat title="APY" value={formatPercent(totalApy)} size="base" />
        <Stat title="TVL" value={formatTvl(totalTvl)} size="base" variant="secondary" />
      </div>
      <div className="flex flex-col px-20 pt-16 pb-24">
        <div className="grid grid-cols-[2fr_1fr_1fr] gap-8">
          <Title>Assets</Title>
          <Title>Protocols</Title>
          <Title className="">TVL %</Title>
        </div>
        <div className="flex flex-col divide-y divide-gray-6">
          {Array.from(strategies)
            .sort((a, b) => {
              return b.tvl - a.tvl;
            })
            .map((strategy) => {
              const { protocols, id, tvl, contractAddress } = strategy;

              const protocol = protocols[0];

              if (!protocol) {
                console.warn('No protocol found for strategy', strategy);
                return null;
              }

              let percent = (tvl / totalTvl) * 100;
              if (Number.isNaN(percent)) {
                percent = 0;
              }

              return (
                <div
                  key={id}
                  className="grid grid-cols-[2fr_1fr_1fr] justify-items-start gap-8 py-6"
                >
                  <div className="flex flex-wrap gap-6">
                    {protocol?.tokens.map((token) => (
                      <TokenBadge key={token.address} token={token} />
                    ))}
                  </div>
                  <Protocol name={protocol.name} address={contractAddress} network={network} />
                  <div className="flex h-24 items-center text-sm text-dark-4">
                    {formatPercent(percent)}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
