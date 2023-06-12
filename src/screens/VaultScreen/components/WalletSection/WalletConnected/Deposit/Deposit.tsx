import { BigNumber, utils } from 'ethers';
import { useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { useApprove } from '~/hooks/useApprove';
import { useCurrencyBalance } from '~/hooks/useCurrencyBalance';
import { useDebouncedValue } from '~/hooks/useDebounceValue';
import { useQueryOpenOceanQuote } from '~/hooks/useQueryOpenOceanQuote';
import { classNames } from '~/lib/classNames';
import { Currency, isCurrencyEqual, isToken, Token } from '~/lib/currency';
import { formatAmount } from '~/lib/formatters';
import { MULTICALL_ROUTER } from '~/lib/multicallRouter';
import { NATIVES } from '~/lib/tokens';
import { LocalVaultAddress } from '~/lib/vault';
import { Details, DetailsItem } from '~/ui/Details';
import { LoadingButton } from '~/ui/LoadingButton';
import { AmountInput } from '../AmountInput';
import { useQueryAxelarFee } from '../useQueryAxelarFee';
import { getDepositConfig } from './getDepositConfig';
import { useDeposit } from './useDeposit';

interface Props {
  className?: string;
  localVault: LocalVaultAddress;
  mainVaultToken: Token;
}

export function Deposit({ className, localVault, mainVaultToken }: Props): JSX.Element {
  const { network } = localVault;

  const [amount, setAmount] = useState('');

  const [inToken, setInToken] = useState<Currency>(localVault.depositToken);

  if (inToken.network !== network) {
    setInToken(localVault.depositToken);
  }

  const { address } = useAccount();
  const { data: balanceData, isLoading: isBalanceLoading } = useCurrencyBalance({
    address,
    currency: inToken,
    watch: true,
  });

  const { data: gasBalanceData, isLoading: isGasBalanceLoading } = useCurrencyBalance({
    address,
    watch: true,
  });

  const bnAmount = useMemo(() => {
    if (!amount) {
      return;
    }

    return utils.parseUnits(amount, inToken.decimals);
  }, [amount, inToken]);

  const { debouncedValue: debouncedBnAmount, isDebouncing } = useDebouncedValue(bnAmount);

  const multicallRouter = MULTICALL_ROUTER[network];
  const swapEnabled = !isCurrencyEqual(inToken, localVault.depositToken) && !!multicallRouter;

  const { data: swapData, isLoading: isOpenOceanLoading } = useQueryOpenOceanQuote({
    amountBN: debouncedBnAmount,
    inToken,
    outToken: localVault.depositToken,
    enabled: swapEnabled,
  });

  const { data: axelarFee, isLoading: isAxelarFeeLoading } = useQueryAxelarFee(
    localVault.network,
    mainVaultToken.network,
  );

  const config = getDepositConfig({
    localVault,
    address,
    amount: debouncedBnAmount,
    currency: inToken,
    openOceanSwapData: swapData?.data,
    multicallRouter,
    axelarFee,
  });

  const {
    deposit,
    isPending: isDepositPending,
    isLoading: isDepositLoading,
  } = useDeposit({
    amount: debouncedBnAmount,
    currency: inToken,
    config,
  });

  const {
    needApprove,
    approve,
    loading: isApproveLoading,
    pending: isApprovePending,
  } = useApprove({
    tokenAddress: isToken(inToken) ? inToken.address : undefined,
    spenderAddress: isCurrencyEqual(inToken, localVault.depositToken)
      ? localVault.address
      : multicallRouter?.gateway,
    amount: debouncedBnAmount,
  });

  const nativeToken = NATIVES[localVault.network];

  let balanceForFeeIsValid: boolean;
  if (isToken(inToken)) {
    balanceForFeeIsValid = !!gasBalanceData && !!axelarFee && gasBalanceData.value.gt(axelarFee);
  } else {
    const totalAmount = bnAmount?.add(axelarFee ?? 0);
    balanceForFeeIsValid = !!balanceData && !!totalAmount && totalAmount.lte(balanceData.value);
  }

  let buttonText: string;
  let buttonDisabled = false;
  let onButtonClick: (() => void) | undefined;
  if (!bnAmount || bnAmount.lte(0)) {
    buttonText = 'Enter amount';
    buttonDisabled = true;
  } else if (balanceData && bnAmount.gt(balanceData.value)) {
    buttonText = 'Insufficient balance';
    buttonDisabled = true;
  } else if (isBalanceLoading || isApproveLoading || isGasBalanceLoading || isAxelarFeeLoading) {
    buttonText = 'Loading';
    buttonDisabled = true;
  } else if (!balanceForFeeIsValid) {
    buttonText = 'Insufficient balance for fee';
    buttonDisabled = true;
  } else if (isApprovePending) {
    buttonText = 'Approving';
    buttonDisabled = true;
  } else if (needApprove) {
    buttonText = `Approve ${inToken.symbol}`;
    onButtonClick = approve;
  } else if (isDepositPending) {
    buttonText = 'Depositing';
  } else if (!axelarFee) {
    buttonText = "Can't calculate Axelar fee";
    buttonDisabled = true;
  } else {
    buttonText = 'Deposit';
    onButtonClick = deposit;
  }

  const buttonLoading =
    !buttonDisabled &&
    (isBalanceLoading ||
      isDebouncing ||
      isGasBalanceLoading ||
      isApproveLoading ||
      isApprovePending ||
      isDepositPending ||
      isDepositLoading ||
      isAxelarFeeLoading ||
      (swapEnabled && isOpenOceanLoading));

  return (
    <div className={classNames('flex flex-col', className)}>
      <AmountInput
        value={amount}
        onValueChange={setAmount}
        className="rounded-25"
        title="Deposit via"
        currency={inToken}
        onCurrencyChange={multicallRouter && setInToken}
      />

      <Details className="mt-8">
        {swapEnabled && (
          <DetailsItem title="USDC" loading={!swapData?.outAmount || isOpenOceanLoading}>
            {formatAmount(
              BigNumber.from(swapData?.outAmount ?? 0),
              localVault.depositToken.decimals,
            )}
          </DetailsItem>
        )}
        <DetailsItem
          title="Deposit fee"
          helpText="The deposit fee is a fee paid by users to cover the transaction costs of moving assets to their 88x&rsquo; vault."
        >
          0%
        </DetailsItem>
        <DetailsItem
          title="Withdrawal fee"
          helpText="The withdrawal fee is a fee paid by users to cover the transaction costs of moving assets out of their 88x&rsquo; vault."
        >
          0%
        </DetailsItem>
        <DetailsItem
          title="Performance fee"
          helpText="The performance fee is a payment made to 88x for generating positive returns. The fee is a percentage of the profits earned on the investments."
        >
          9,5%
        </DetailsItem>
        {nativeToken && (
          <DetailsItem
            title="Gas fee"
            loading={!axelarFee}
            helpText="The gas fee will be paid for the depositing transaction execution on the destination blockchain."
          >
            {formatAmount(BigNumber.from(axelarFee ?? 0), nativeToken.decimals)}{' '}
            {nativeToken.symbol}
          </DetailsItem>
        )}
      </Details>

      <div className="mt-12 text-xsm text-dark-5">
        Performance fees are already subtracted from the displayed APY.
      </div>

      <LoadingButton
        className="mt-20"
        loading={buttonLoading}
        disabled={buttonDisabled}
        onClick={onButtonClick}
      >
        {buttonText}
      </LoadingButton>
    </div>
  );
}
