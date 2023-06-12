import { styled } from '~/types/styled';

/**
 * Responsive table components. Cards on mobile and table on desktop.
 */

export const Root = styled(
  'div',
  'flex flex-col text-sm sm:grid sm:grid-cols-[auto_1fr_auto_auto] sm:items-center',
);

export const Row = styled(
  'button',
  'flex flex-col items-stretch rounded-30 bg-white p-24 text-left shadow sm:contents',
);

export const HeadRow = styled('div', 'hidden sm:contents');

export const Cell = styled(
  'div',
  'flex min-w-0 flex-col gap-4 px-8 max-sm:contents sm:border-b sm:border-dark-7 sm:px-20 sm:py-16 sm:[&:nth-child(4n-3)]:pl-20 sm:[&:nth-child(4n)]:pr-20',
);

export const HeadCell = styled(
  Cell,
  'h-full border-b-0 bg-gray-6 py-10 text-dark-4 first:rounded-l-[0.75rem] last:rounded-r-[0.75rem]',
);

// Get label from data-label attribute on mobile
export const CellEntry = styled(
  'div',
  'flex justify-between gap-4 border-b border-b-dark-7 py-12 before:block before:text-dark-4 before:content-[attr(data-label)_":"] sm:block sm:border-b-0 sm:py-0 sm:before:hidden',
);
