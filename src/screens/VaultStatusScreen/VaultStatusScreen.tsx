import { Hero } from '~/components/Hero';
import { fetchApi } from '~/lib/fetchApi';
import { Vault } from '~/lib/vault';
import {
  BackedBalanceCard,
  LocalVaultStatusCard,
  MainVaultStatusCard,
  Transactions,
} from './components';

interface Props {
  params: {
    slug: string;
  };
}

function getVault(slug: string): Promise<Vault> {
  return fetchApi(`/vaults/${slug}`);
}

export async function VaultStatusScreen({ params }: Props): Promise<JSX.Element> {
  const vault = await getVault(params.slug);

  return (
    <>
      <Hero className="flex flex-col gap-4">
        <h1 className="font-public-sans text-h1">Vault status</h1>
        <div className="text-dark-4">Latest in-chain status of vault</div>
      </Hero>

      <div className="mx-auto mt-20 flex max-w-desktop flex-col">
        <div className="mb-16 text-lg">Main vault</div>

        <div className="mb-20 grid max-w-desktop gap-30 md:grid-cols-2 lg:grid-cols-3">
          <MainVaultStatusCard vault={vault} />
        </div>

        <div className="mb-16 text-lg">Local vaults</div>
        <div className="mb-20 grid max-w-desktop gap-30 md:grid-cols-2 lg:grid-cols-3">
          {vault.networks.map((vaultNetwork) => {
            return <LocalVaultStatusCard key={vaultNetwork.network} vaultNetwork={vaultNetwork} />;
          })}
        </div>

        <Transactions vault={vault} />

        <div className="mb-16 mt-20 text-lg">Backend balances</div>
        <div className="mb-20 grid max-w-desktop gap-30 md:grid-cols-2 lg:grid-cols-3">
          <BackedBalanceCard network={vault.contract.network} />
          {vault.networks.map((vaultNetwork) => {
            return (
              <BackedBalanceCard
                key={vaultNetwork.network}
                network={vaultNetwork.network}
                depositToken={vaultNetwork.depositToken}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
