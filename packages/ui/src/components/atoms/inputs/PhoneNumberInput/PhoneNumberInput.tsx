import clsx from 'clsx';
import styles from './PhoneNumberInput.module.scss';
import PhoneInput, { PhoneInputProps } from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

type PhoneInputStylesPropsNames =
  | 'inputClass'
  | 'buttonClass'
  | 'dropdownClass'
  | 'searchClass'
  | 'containerStyle'
  | 'inputStyle'
  | 'buttonStyle'
  | 'dropdownStyle'
  | 'searchStyle';

type PhoneInputPropsWithoutStyleProps = Omit<PhoneInputProps, PhoneInputStylesPropsNames>;

export type PhoneNumberInputProps = PhoneInputPropsWithoutStyleProps;

export const PhoneNumberInput = (props: PhoneNumberInputProps) => {
  const { disableSearchIcon = true, ...restProps } = props;

  return (
    <PhoneInput
      {...restProps}
      disableSearchIcon={disableSearchIcon}
      containerClass="flex items-center border border-input h-9 focus-within:ring-ring focus-within:ring-1 rounded-md"
      inputClass="w-full h-8 border-none outline-none"
      searchClass={styles.searchInput}
      buttonClass={clsx('border-none rounded-l-md', styles.hiddenArrow, styles.flagCenter)}
    />
  );
};
