import { utils } from 'ethers';
import Link from 'next/link';
import { useMemo } from 'react';
import Balancer from 'react-wrap-balancer';
import { useAccount } from 'wagmi';
import { useCurrencyBalance } from '~/hooks/useCurrencyBalance';
import { useDebouncedValue } from '~/hooks/useDebounceValue';
import { classNames } from '~/lib/classNames';
import { Token } from '~/lib/currency';
import { LocalVaultAddress, VaultAddress } from '~/lib/vault';
import { Details, DetailsItem } from '~/ui/Details';
import { LoadingButton } from '~/ui/LoadingButton';
import { AmountInput } from '../AmountInput';
import { useWithdraw } from './useWithdraw';
import { useWithdrawLocked } from './useWithdrawLocked';
import { useWithdrawRate } from './useWithdrawRate';
import { useWithdrawValue } from './useWithdrawValue';

interface Props {
  className?: string;
  mainVault: VaultAddress;
  localVault: LocalVaultAddress;
  localVaults: LocalVaultAddress[];
  mainVaultToken: Token;
}

export function Withdraw({
  className,
  mainVaultToken,
  localVault,
  localVaults,
  mainVault,
}: Props): JSX.Element {
  const outCurrency = localVault.depositToken;

  const { address } = useAccount();
  const { data: balanceData, isLoading: isBalanceLoading } = useCurrencyBalance({
    address,
    currency: mainVaultToken,
    watch: true,
  });

  const { isLoading: isLockedLoading, locked } = useWithdrawLocked({ localVaults, mainVault });

  const { data: rate } = useWithdrawRate(mainVaultToken);

  const { inValue, outValue, onInValueChange, onOutValueChange } = useWithdrawValue({
    inCurrency: mainVaultToken,
    outCurrency: outCurrency,
    rate,
  });

  const bnAmount = useMemo(() => {
    if (!inValue) {
      return;
    }

    return utils.parseUnits(inValue, mainVaultToken.decimals);
  }, [inValue, mainVaultToken.decimals]);

  const { debouncedValue: debouncedBnAmount, isDebouncing } = useDebouncedValue(bnAmount);

  const {
    withdraw,
    isPending: isWithdrawPending,
    isLoading: isWithdrawLoading,
  } = useWithdraw({
    mainVault: mainVaultToken,
    localVault,
    amount: debouncedBnAmount,
    currency: outCurrency,
  });

  let buttonText: string;
  let buttonDisabled = false;
  let onButtonClick: (() => void) | undefined;
  if (isBalanceLoading || isLockedLoading) {
    buttonText = 'Loading';
    buttonDisabled = true;
  } else if (locked) {
    buttonText = 'Withdrawal in progress';
    buttonDisabled = true;
  } else if (!bnAmount || bnAmount.lte(0)) {
    buttonText = 'Enter amount';
    buttonDisabled = true;
  } else if (balanceData && bnAmount.gt(balanceData.value)) {
    buttonText = 'Insufficient balance';
    buttonDisabled = true;
  } else if (isWithdrawPending) {
    buttonText = 'Withdrawing';
  } else {
    buttonText = 'Withdraw';
    onButtonClick = withdraw;
    buttonDisabled = isDebouncing || isWithdrawLoading;
  }

  const buttonLoading =
    !buttonDisabled &&
    (isBalanceLoading ||
      isWithdrawPending ||
      isWithdrawPending ||
      isWithdrawLoading ||
      isWithdrawLoading ||
      isLockedLoading);

  return (
    <div className={classNames('flex flex-col', className)}>
      <AmountInput
        className="rounded-t-25 border-b-0"
        currency={mainVaultToken}
        value={inValue}
        onValueChange={onInValueChange}
        title="Sell"
      />
      <AmountInput
        value={outValue}
        onValueChange={onOutValueChange}
        className="rounded-b-25"
        title="Receive"
        currency={outCurrency}
      />

      <Details className="mt-8">
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

      {!isLockedLoading && locked && (
        <div className="mt-12 flex flex-col items-center gap-4 text-center text-xsm text-dark-3">
          <Balancer>
            The withdrawal request has already been initiated and is currently being processed.
          </Balancer>
          <Link
            href="/activity"
            className="underline underline-offset-2 transition-colors hover:text-black"
          >
            View Withdrawal Request.
          </Link>
        </div>
      )}
    </div>
  );
}
