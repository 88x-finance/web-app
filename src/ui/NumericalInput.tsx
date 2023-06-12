// Based on uniswap input component
// https://github.dev/Uniswap/interface/blob/aeb636cf8a48e057ea6c835869c84b1b2f5cf2e6/src/components/NumericalInput/index.tsx

interface Props extends React.ComponentPropsWithoutRef<'input'> {
  onValueChange?: (value: string) => void;
}

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function NumericalInput({
  value,
  placeholder,
  onValueChange,
  ...props
}: Props): JSX.Element {
  return (
    <input
      value={value}
      onChange={(event) => {
        if (!onValueChange) {
          return;
        }

        let value = event.target.value.replace(/,/g, '.');

        if (value.startsWith('.')) {
          value = `0${value}`;
        }

        value = value.replace(/^0+(?=\d)/, '');

        if (value === '' || inputRegex.test(escapeRegExp(value))) {
          onValueChange(value);
        }
      }}
      // universal input options
      inputMode="decimal"
      autoComplete="off"
      autoCorrect="off"
      // text-specific options
      type="text"
      pattern="^[0-9]*[.,]?[0-9]*$"
      placeholder={placeholder ?? '0'}
      minLength={1}
      maxLength={79}
      spellCheck="false"
      {...props}
    />
  );
}
