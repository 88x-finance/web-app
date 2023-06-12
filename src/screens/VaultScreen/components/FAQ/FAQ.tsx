import { Accordion } from '~/ui/Accordion';

interface Props {
  children?: React.ReactNode;
}

export function FAQ({ children }: Props): JSX.Element {
  return (
    <div>
      <div>FAQ</div>

      <Accordion className="mt-30" type="multiple">
        {children}
      </Accordion>
    </div>
  );
}
