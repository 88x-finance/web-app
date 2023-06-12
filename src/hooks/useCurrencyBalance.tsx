import { useBalance } from 'wagmi';
import { Currency, isToken } from '~/lib/currency';
import { networkToChainId } from '~/lib/network';

type Params = Exclude<NonNullable<Parameters<typeof useBalance>[0]>, 'token' | 'chainId'> & {
  currency?: Currency;
};

export function useCurrencyBalance({ currency, ...otherParams }: Params) {
  return useBalance({
    token: currency && isToken(currency) ? currency.address : undefined,
    chainId: currency && networkToChainId(currency.network),
    ...otherParams,
  });
}
