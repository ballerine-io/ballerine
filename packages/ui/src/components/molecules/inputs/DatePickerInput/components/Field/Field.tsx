import { ctw } from '@utils/ctw';
import { Dayjs } from 'dayjs';
import { Calendar } from 'lucide-react';
import { forwardRef } from 'react';

export interface FieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange' | 'value'> {
  label?: React.ReactNode;
  InputProps?: {
    ref?: React.Ref<any>;
    endAdornment?: React.ReactNode;
    startAdornment?: React.ReactNode;
  };
  error?: boolean;
  focused?: boolean;
  onAdornmentClick: () => void;
  ownerState?: any;
  value: Dayjs | null;
  onChange: (value: any) => void;
}

export const Field = forwardRef(
  (
    {
      disabled,
      id,
      label,
      InputProps: { ref: containerRef, startAdornment, endAdornment } = {},
      // extracting `error`, 'focused', and `ownerState` as `input` does not support those props
      error,
      focused,
      ownerState,
      ...other
    }: FieldProps,
    inputRef: React.Ref<HTMLInputElement>,
  ) => {
    // const clearField = useCallback(
    //   (event: React.MouseEvent) => {
    //     event.stopPropagation();

    //     //This throws errors bot doesnt broke excpected behavior
    //     //TO DO: Find out why this causing exception
    //     onChange(null);
    //   },
    //   [onChange],
    // );

    return (
      <div
        id={id}
        className={ctw(
          'border-input bg-background focus:ring-ring flex h-9 items-center gap-2 rounded-md border px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1',
          {
            ['bg-slate-50']: disabled,
            ['text-slate-50']: disabled,
            ['pointer-events-none']: disabled,
          },
        )}
        tabIndex={0}
        ref={containerRef}
        // onClick={onAdornmentClick}
      >
        <div className="font-inter flex-1">
          <input disabled={disabled} ref={inputRef} {...other} />
        </div>
        <div className="flex items-center justify-center gap-2">
          {/* {value ? <X size="14" className="cursor-pointer" onClick={clearField} /> : null} */}
          <Calendar size="14" className="cursor-pointer" />
        </div>
      </div>
    );
  },
);
