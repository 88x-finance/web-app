import { useId } from 'react';
import { AccordionItem } from '~/ui/Accordion';

interface Props {
  title: string;
  children: React.ReactNode;
}

export function FAQItem({ title, children }: Props): JSX.Element {
  const id = useId();

  return (
    <AccordionItem title={title} value={id}>
      {children}
    </AccordionItem>
  );
}
