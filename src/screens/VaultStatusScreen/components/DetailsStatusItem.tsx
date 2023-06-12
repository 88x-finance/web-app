import { BigNumber } from 'ethers';
import { formatAmount } from '~/lib/formatters';
import { DetailsItem } from '~/ui/Details';

interface Props {
  isLoading: boolean;
  value?: BigNumber | undefined;
  title: string;
  method: string;
}

export function DetailsStatusItem({ isLoading, method, title, value }: Props): JSX.Element {
  return (
    <DetailsItem title={title} helpText={`Method: ${method}`} loading={isLoading}>
      {formatAmount(BigNumber.from(value ?? 0), 18)}
    </DetailsItem>
  );
}
