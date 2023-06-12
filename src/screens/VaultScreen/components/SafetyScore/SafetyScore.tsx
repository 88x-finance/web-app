import { Popover } from '~/ui/Popover';
import { ScoreBadge } from '~/ui/ScoreBadge';

interface Props {
  children?: React.ReactNode;
  score: number;
}

export function SafetyScore({ children, score }: Props): JSX.Element {
  return (
    <div className="flex flex-col gap-26 @container">
      <div className="flex items-center text-base">
        Safety Score
        <ScoreBadge className="ml-10">{score}</ScoreBadge>
        <Popover className="ml-4 text-dark-5">
          The safety score is a metric used to estimate the safety of a particular asset or
          investment. The score ranges from 0 to 100, with 100 being the safest.
        </Popover>
      </div>

      <div className="grid grid-cols-1 gap-24 @xl:grid-cols-2">{children}</div>
    </div>
  );
}
