import { Hero } from '~/components/Hero';
import { getVaultNetworks, getVaultsAddresses } from '~/lib/vault';
import { getVault, getVaultHistoricData } from './api';
import {
  AboutVault,
  ChartControls,
  FAQ,
  FAQItem,
  HistoryChart,
  Networks,
  SafetyScore,
  SafetyScoreItem,
  VaultComposition,
  VaultCompositionItem,
  VaultLogo,
  VaultSeparator,
  VaultStats,
  WalletSection,
} from './components';
import { DEFAULT_CHART_RANGE } from './stores';

interface Props {
  params: {
    slug: string;
  };
}

export async function VaultScreen({ params }: Props): Promise<JSX.Element> {
  const { slug } = params;

  const vaultData = getVault(slug);
  const vaultHistoryData = getVaultHistoricData(slug, DEFAULT_CHART_RANGE);

  const [vault, vaultHistory] = await Promise.all([vaultData, vaultHistoryData]);

  const { apy, name, tvl } = vault;

  const networks = getVaultNetworks(vault);

  const { localVaults, mainVault } = getVaultsAddresses(vault);

  return (
    <>
      <Hero className="flex flex-col gap-y-20 gap-x-64 lg:grid lg:grid-cols-[18.5rem_1fr] lg:gap-y-30 lg:!pb-48">
        <div className="flex items-center gap-10 lg:order-first">
          <VaultLogo slug={slug} />
          <div className="text-lg">{name}</div>
        </div>

        <div className="flex flex-col">
          <VaultStats className="mb-30 lg:mb-36" apy={apy} tvl={tvl} />

          <Networks value={networks} />
        </div>

        <div className="h-[17.5rem] min-w-0 lg:h-auto">
          <HistoryChart initialData={vaultHistory} slug={slug} />
        </div>

        <ChartControls className="lg:order-first" />
      </Hero>

      <div className="mx-auto mt-30 flex max-w-desktop flex-col gap-30 lg:mt-48 lg:grid lg:grid-cols-[20.75rem_1fr] lg:items-start lg:gap-64">
        <WalletSection localVaults={localVaults} mainVault={mainVault} />

        <div>
          <VaultComposition>
            {Array.from(vault.networks)
              .sort((a, b) => {
                const aTvl = a.strategies.reduce((acc, strategy) => acc + strategy.tvl, 0);
                const bTvl = b.strategies.reduce((acc, strategy) => acc + strategy.tvl, 0);

                return bTvl - aTvl;
              })
              .map((vaultNetwork) => (
                <VaultCompositionItem
                  key={vaultNetwork.contractAddress}
                  vaultNetwork={vaultNetwork}
                />
              ))}
          </VaultComposition>

          <VaultSeparator />

          <SafetyScore score={90.5}>
            <SafetyScoreItem
              text="Low-complexity strategy"
              protocol="88x"
              helpText="A low-complex strategy and its implementation are usually easy to understand and carry fewer potential issues."
            />
            <SafetyScoreItem
              text="Very low or zero expected IL"
              protocol="Very low or zero expected IL"
              helpText="The impermanent loss (IL) of assets in this 88x&rsquo; vault is minimal or non-existent."
            />
            <SafetyScoreItem
              text="Strategy is battle tested"
              protocol="88x"
              helpText="The longer strategy is in use in the DeFi environment that knows no mercy, the higher possibility that the strategy is issue free."
            />
            <SafetyScoreItem
              text="Platform audited by trusted reviewer"
              protocol="Platform"
              helpText="An independent review of a platform/strategy conducted by an organization specialized in information security is one of the best practices that help to find and fix potential security flaws before going to production. However, it's important to remember nobody and nothing can give a 100% guarantee."
            />
          </SafetyScore>

          <VaultSeparator />

          <AboutVault>
            88x is an automated cross-chain yield aggregation protocol. Our know-how: stablecoins
            yield capture in a seamless and secure way. We let you achieve high diversification and
            better yield across various DeFi protocols and blockchain networks.
          </AboutVault>

          <VaultSeparator />

          <FAQ>
            <FAQItem title="How does 88x work?">
              88x finds the best parking slots for your stablecoins. Being cross-chain native, 88x
              is not limited to network-specific strategies and easily rebalances your portfolio to
              maximize yield and keep market-neutral exposure. Besides, 88x provides
              auto-compounding and cost optimization.
            </FAQItem>
            <FAQItem title="Is it stablecoin-only?">
              Yes, we&#39;re launching 88x with USDT, USDC, BUSD and DAI support. Altcoin-based
              strategies might come later on.
            </FAQItem>
            <FAQItem title="Where does the yield come from?">
              88x is an aggregation service, so ultimately you are getting yield from existing
              protocols (e.g. Benqi). The 88x&#39;s value-add is cross-chain compatibility (better
              yield), automation (peace of mind), and ease of use (awesome feature, isn&#39;t it?).
            </FAQItem>
            <FAQItem title="Can actual return vary from the projected APY in UI?">
              Actually, it can. APY is dynamic and depends on many factors, including market
              conditions and rebalancing fees. Given those factors, we&#39;re still trying to
              provide as accurate APY as possible.
            </FAQItem>
            <FAQItem title="Is 88x safe to use?">
              88x has several measures to mitigate smart contract risks. We&apos;ve mitigated this
              risk by equipping all smart contracts with 24hr time-locks and planning to have
              reputable auditors before going live.
            </FAQItem>
          </FAQ>
        </div>
      </div>
    </>
  );
}
