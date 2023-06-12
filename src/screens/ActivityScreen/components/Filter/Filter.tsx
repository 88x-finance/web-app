'use client';

import { ACTIVE_CHAINS, chainIdToNetwork } from '~/lib/network';
import { Checkbox } from '~/ui/Checkbox';
import { useTransactionFilterStore } from '../../stores';
import { FilterGroup } from './FilterGroup';
import { FilterSeparator } from './FilterSeparator';

export function Filter(): JSX.Element {
  const { deposit, withdrawn, setDeposit, setWithdrawn, reset, checkNetwork, networks } =
    useTransactionFilterStore();

  return (
    <div className="rounded-30 bg-white p-24 shadow">
      <div className="flex justify-between">
        <div>Filter</div>
        <button className="text-sm text-dark-5" onClick={reset}>
          Clear all
        </button>
      </div>

      <FilterSeparator />

      <FilterGroup title="Activity type:">
        <div className="flex flex-col gap-10">
          <Checkbox
            checked={withdrawn}
            onCheckedChange={(checked) => {
              setWithdrawn(!!checked);
            }}
          >
            Withdrawn
          </Checkbox>
          <Checkbox
            checked={deposit}
            onCheckedChange={(checked) => {
              setDeposit(!!checked);
            }}
          >
            Deposit
          </Checkbox>
        </div>
      </FilterGroup>

      <FilterSeparator />

      <FilterGroup title="Network:">
        <div className="grid grid-cols-2 gap-10">
          {ACTIVE_CHAINS.map((chain) => {
            const network = chainIdToNetwork(chain.id);

            const checked = network && networks.has(network);
            return (
              <Checkbox
                key={chain.id}
                checked={checked}
                onCheckedChange={(checked) => {
                  if (!network) {
                    return;
                  }

                  checkNetwork(network, !!checked);
                }}
              >
                {chain.name}
              </Checkbox>
            );
          })}
        </div>
      </FilterGroup>
    </div>
  );
}
