import { useQuery } from '@tanstack/react-query';
import { BigNumber } from 'ethers';
import { useDeferredValue, useMemo, useState } from 'react';
import { useNetwork } from 'wagmi';
import { classNames } from '~/lib/classNames';
import { Currency, getCurrencyKey } from '~/lib/currency';
import { chainIdToNetwork } from '~/lib/network';
import { ethersKeys } from '~/lib/queryKeys';
import { NATIVES, STABLES } from '~/lib/tokens';
import { getTokens } from '~/screens/VaultScreen/api';
import { DialogTitle } from '~/ui/Dialog';
import { Input } from '~/ui/Input';
import { ScrollArea, ScrollAreaViewport } from '~/ui/ScrollArea';
import { Separator } from '~/ui/Separator';
import { TokenButton } from '~/ui/TokenButton';
import { CurrencyListItem } from './CurrencyListItem';
import { useQueryBalances } from './useQueryBalances';

interface Props {
  onChange: (currency: Currency) => void;
  setOpen: (open: boolean) => void;
}

export function CurrencyList({ onChange, setOpen }: Props): JSX.Element {
  const { chain } = useNetwork();
  const network = chain?.id !== undefined ? chainIdToNetwork(chain.id) : undefined;

  const [search, setSearch] = useState('');

  const deferredSearch = useDeferredValue(search);

  const { data } = useQuery({ queryKey: ethersKeys.tokens(), queryFn: getTokens });

  const currencies = useMemo(() => {
    const tokens: Currency[] = [...Object.values(NATIVES), ...STABLES, ...(data || [])];

    const set = new Set<string>();

    const filtered = [];
    for (const token of tokens) {
      // Remove duplicates
      if (set.has(getCurrencyKey(token))) {
        continue;
      }

      // Remove tokens from other networks
      if (!!network && token.network !== network) {
        continue;
      }

      set.add(getCurrencyKey(token));
      filtered.push(token);
    }

    return filtered;
  }, [data, network]);

  const { balances, isInitialLoading } = useQueryBalances(currencies);
  const deferredBalances = useDeferredValue(balances);

  const items = useMemo(() => {
    let filteredTokens: Currency[] = currencies;
    if (deferredSearch) {
      filteredTokens = currencies.filter(
        (token) =>
          token.symbol.toLowerCase().includes(deferredSearch.toLowerCase()) ||
          token.name.toLowerCase().includes(deferredSearch.toLowerCase()),
      );
    }

    if (deferredBalances) {
      filteredTokens = filteredTokens.sort((a, b) => {
        let balanceA = deferredBalances.get(getCurrencyKey(a));
        let balanceB = deferredBalances.get(getCurrencyKey(b));

        if (balanceA === undefined && balanceB === undefined) {
          return 0;
        }

        if (balanceA === undefined) {
          return 1;
        }

        if (balanceB === undefined) {
          return -1;
        }

        // Normalize decimals
        if (a.decimals > b.decimals) {
          balanceB = balanceB.mul(BigNumber.from(10).pow(a.decimals - b.decimals));
        } else if (a.decimals < b.decimals) {
          balanceA = balanceA.mul(BigNumber.from(10).pow(b.decimals - a.decimals));
        }

        return balanceB.gt(balanceA) ? 1 : -1;
      });
    }

    return filteredTokens.map((token) => (
      <CurrencyListItem
        key={getCurrencyKey(token)}
        currency={token}
        balance={balances?.get(getCurrencyKey(token))}
        onClick={() => {
          onChange(token);
          setOpen(false);
        }}
      />
    ));
  }, [currencies, deferredSearch, deferredBalances, balances, onChange, setOpen]);

  return (
    <>
      <DialogTitle>Ethereum token</DialogTitle>
      <Input
        className="mt-16 shrink-0"
        placeholder="Search by name"
        autoComplete="off"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
        }}
      />
      <div className="mt-10 flex shrink-0 flex-wrap gap-6">
        {STABLES.filter((token) => token.network === network).map((token) => (
          <TokenButton
            key={token.address}
            token={token}
            onClick={() => {
              onChange(token);
              setOpen(false);
            }}
          />
        ))}
      </div>

      <Separator className="mt-16 shrink-0" />

      <ScrollArea
        className={classNames(
          'relative -mx-16 -mb-40 flex min-h-0 flex-col overflow-hidden px-8 transition-opacity',
          isInitialLoading ? 'pointer-events-none opacity-20' : 'opacity-100',
        )}
      >
        <ScrollAreaViewport
          className={classNames('flex flex-col py-8', isInitialLoading && 'animate-pulse')}
        >
          {items}
        </ScrollAreaViewport>
      </ScrollArea>
    </>
  );
}
