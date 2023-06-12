import { getContract, Hash, PrepareWriteContractConfig } from '@wagmi/core';
import { BigNumber } from 'ethers';
import { Address } from 'wagmi';
import { LOCAL_VAULT_ABI } from '~/abi/localVaultAbi';
import { MULTICALL_ROUTER_ABI } from '~/abi/multicallRouter';
import { Currency, isCurrencyEqual, isToken } from '~/lib/currency';
import { MulticallRouter } from '~/lib/multicallRouter';
import { LocalVaultAddress } from '~/lib/vault';

interface Params {
  axelarFee?: BigNumber;
  address?: Address;
  amount?: BigNumber;
  currency: Currency;
  localVault: LocalVaultAddress;
  openOceanSwapData?: Hash;
  multicallRouter?: MulticallRouter;
}

const OPEN_OCEAN_ADDRESS = '0x6352a56caadc4f1e25cd6c75970fa768a3304e64';

export function getDepositConfig({
  axelarFee,
  address,
  amount,
  currency,
  localVault,
  openOceanSwapData,
  multicallRouter,
}: Params): PrepareWriteContractConfig | undefined {
  if (!amount || !address || !axelarFee) {
    return;
  }

  // Direct deposit of stablecoin
  if (isCurrencyEqual(currency, localVault.depositToken)) {
    return {
      abi: LOCAL_VAULT_ABI,
      address: localVault.address,
      functionName: 'deposit',
      args: [amount, address, address],
      overrides: { value: axelarFee },
    };
  }

  if (!openOceanSwapData || !multicallRouter) {
    return;
  }

  const localVaultContract = getContract({
    abi: LOCAL_VAULT_ABI,
    address: localVault.address,
  });

  const depositCalldata = localVaultContract.interface.encodeFunctionData('deposit', [
    BigNumber.from(0),
    address,
    address,
  ]);

  if (!isToken(currency)) {
    return {
      abi: MULTICALL_ROUTER_ABI,
      address: multicallRouter.router,
      functionName: 'multicallNative',
      args: [
        [openOceanSwapData, depositCalldata as Hash],
        [
          OPEN_OCEAN_ADDRESS, // OpenOcean address
          localVault.address,
        ],
        [localVault.depositToken.address],
        [BigNumber.from(1 * 32 + 4)],
        [amount, axelarFee],
        address,
      ],
      overrides: {
        value: amount.add(axelarFee),
      },
    };
  }

  return {
    abi: MULTICALL_ROUTER_ABI,
    address: multicallRouter.router,
    functionName: 'multicall',
    args: [
      amount,
      [openOceanSwapData, depositCalldata as Hash],
      [
        OPEN_OCEAN_ADDRESS, // OpenOcean address
        localVault.address,
      ],
      [currency.address, localVault.depositToken.address],
      [BigNumber.from(8 * 32 + 4), BigNumber.from(1 * 32 + 4)],
      [BigNumber.from(0), axelarFee],
      address,
    ],
    overrides: {
      value: axelarFee,
    },
  };
}
