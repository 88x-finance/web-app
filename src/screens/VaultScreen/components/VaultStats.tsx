import { classNames } from '~/lib/classNames';
import { calcDailyApy, formatPercent, formatTvl } from '~/lib/formatters';
import { Stat } from '~/ui/Stat';

interface Props {
  className?: string;
  apy: number;
  tvl: number;
}

export function VaultStats({ className, apy, tvl }: Props): JSX.Element {
  return (
    <div
      className={classNames(
        'md flex flex-col gap-30 md:max-lg:flex-row md:max-lg:items-end',
        className,
      )}
    >
      <Stat
        value={formatPercent(apy)}
        size="xl"
        title="APY"
        helpText="The annual percentage yield (APY) is the real rate of return earned on the 88x&rsquo; vault, taking into account the effect of compounding interest."
      />
      <div className="flex gap-30">
        <Stat
          value={formatPercent(calcDailyApy(apy), 4)}
          title="Daily"
          size="xl"
          variant="secondary"
          helpText="The daily compounded interest is interest on the principal of the 88x&rsquo; vault plus interest earned daily."
        />
        <Stat
          value={formatTvl(tvl)}
          title="TVL"
          size="xl"
          variant="secondary"
          helpText="Total value locked (TVL) is the overall value of crypto assets in USD equivalent users deposited in 88x&rsquo; vaults."
        />
      </div>
    </div>
  );
}
