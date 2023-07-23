import {
  BaseIndicator,
  BaseIndicatorProps,
} from '@app/components/atoms/Stepper/components/atoms/BaseIndicator';
interface Props {
  indicatorProps?: BaseIndicatorProps;
}

export const Warning = ({ indicatorProps }: Props) => {
  return (
    <BaseIndicator
      icon={
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="6" cy="6" r="6" fill="#FFB35A" />
          <path d="M6 3L6 7" stroke="white" />
          <path d="M6 8L6 9" stroke="white" />
        </svg>
      }
      {...indicatorProps}
    />
  );
};
