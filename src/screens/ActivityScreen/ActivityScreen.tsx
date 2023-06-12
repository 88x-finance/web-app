import { Hero } from '~/components/Hero';
import { ActivityTable, Filter } from './components';

export function ActivityScreen(): JSX.Element {
  return (
    <>
      <Hero className="flex flex-col gap-4">
        <h1 className="font-public-sans text-h1">Activity</h1>
        <div className="text-dark-4">Run automated strategies in cross-chain world</div>
      </Hero>

      <div className="mx-auto mt-30 flex max-w-desktop flex-col gap-30 lg:mt-48 lg:grid lg:grid-cols-[20.75rem_1fr] lg:items-start lg:gap-64">
        <Filter />

        <ActivityTable />
      </div>
    </>
  );
}
