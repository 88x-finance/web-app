import { utils } from 'ethers';
import { useContractRead } from 'wagmi';
import { MAIN_VAULT_ABI } from '~/abi/mainVaultAbi';
import { Token } from '~/lib/currency';
import { networkToChainId } from '~/lib/network';
import { LP_TOKEN_DECIMALS } from '~/lib/tokens';

const AMOUNT = utils.parseUnits('1', LP_TOKEN_DECIMALS); // 1 LP token

export function useWithdrawRate(mainVaultToken: Token) {
  return useContractRead({
    address: mainVaultToken.address,
    abi: MAIN_VAULT_ABI,
    chainId: networkToChainId(mainVaultToken.network),
    functionName: 'calculateAmountForWithdraw',
    args: [AMOUNT],
  });
}
