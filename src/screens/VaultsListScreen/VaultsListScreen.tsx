import { Hero } from '~/components/Hero';
import { getVaults } from './api';
import { VaultCard } from './components';

export async function VaultsListScreen(): Promise<JSX.Element> {
  const vaults = await getVaults();

  return (
    <>
      <Hero className="flex flex-col gap-4">
        <h1 className="font-public-sans text-h1">Vaults</h1>
        <div className="text-dark-4">Run automated strategies in cross-chain world</div>
      </Hero>

      <div className="mx-auto mt-30 grid max-w-desktop gap-30 lg:mt-48 lg:grid-cols-2">
        {vaults.map((vault) => (
          <VaultCard key={vault.id} vault={vault} />
        ))}
      </div>
    </>
  );
}
