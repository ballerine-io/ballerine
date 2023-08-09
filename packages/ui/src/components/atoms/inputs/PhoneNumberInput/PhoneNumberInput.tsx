import clsx from 'clsx';
import styles from './PhoneNumberInput.module.scss';
import PhoneInput, { PhoneInputProps } from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export type PhoneInputStylesPropsNames =
  | 'inputClass'
  | 'buttonClass'
  | 'dropdownClass'
  | 'searchClass'
  | 'containerStyle'
  | 'inputStyle'
  | 'buttonStyle'
  | 'dropdownStyle'
  | 'searchStyle';

export type PhoneInputPropsWithoutStyleProps = Omit<PhoneInputProps, PhoneInputStylesPropsNames>;

export type PhoneNumberInputProps = PhoneInputPropsWithoutStyleProps;

export const PhoneNumberInput = (props: PhoneNumberInputProps) => {
  const { disableSearchIcon = true, disabled, ...restProps } = props;

  return (
    <PhoneInput
      {...restProps}
      disabled={disabled}
      disableSearchIcon={disableSearchIcon}
      containerClass="flex items-center border border-input h-9 focus-within:ring-ring focus-within:ring-1 rounded-md font-inter disabled:cursor-not-allowed disabled:opacity-50"
      inputClass="w-full h-8 border-none outline-none disabled:cursor-not-allowed disabled:opacity-50"
      searchClass={styles.searchInput}
      buttonClass={clsx(
        'border-none rounded-l-md',
        { 'cursor-not-allowed opacity-50': disabled },
        styles.hiddenArrow,
        styles.flagCenter,
      )}
    />
  );
};
