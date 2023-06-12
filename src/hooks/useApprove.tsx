import { MaxUint256 } from '@ethersproject/constants';
import { useMutation } from '@tanstack/react-query';
import { BigNumber } from 'ethers';
import { Address, erc20ABI, useAccount, useContract, useContractRead, useSigner } from 'wagmi';

interface Params {
  tokenAddress?: Address;
  spenderAddress?: Address;
  amount?: BigNumber;
}

interface Result {
  approve: () => void;
  loading: boolean;
  needApprove: boolean;
  pending: boolean;
}

export function useApprove({ amount, spenderAddress, tokenAddress }: Params): Result {
  const { address } = useAccount();
  const { data: signer } = useSigner();

  const tokenContract = useContract({
    address: tokenAddress,
    abi: erc20ABI,
    signerOrProvider: signer,
  });

  const { data: allowance, isLoading: isLoadingAllowance } = useContractRead({
    abi: erc20ABI,
    address: tokenAddress,
    functionName: 'allowance',
    args: [address as Address, spenderAddress as Address],
    enabled: !!address && !!spenderAddress && !!tokenAddress,
    watch: true,
  });

  const { mutate: approve, isLoading: isApproving } = useMutation({
    mutationFn: async () => {
      if (!tokenContract || !spenderAddress) {
        return;
      }

      const tx = await tokenContract?.approve(spenderAddress, MaxUint256);

      await tx.wait();
    },
  });

  return {
    approve,
    loading: isLoadingAllowance,
    needApprove: !!amount && !!allowance?.lt(amount),
    pending: isApproving,
  };
}
