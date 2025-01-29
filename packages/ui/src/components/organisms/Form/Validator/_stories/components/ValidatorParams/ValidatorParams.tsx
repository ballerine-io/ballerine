import { Button } from '@/components/atoms';
import { Input } from '@/components/atoms/Input';
import { Switch } from '@mui/material';
import { useValidator } from '../../../hooks/external/useValidator';

interface Props {
  params: {
    validateOnChange?: boolean;
    validateSync?: boolean;
    validationDelay?: number;
    abortEarly?: boolean;
  };
  onChange: (params: Props['params']) => void;
  onSave: () => void;
}

export const ValidatorParams = ({ params, onChange, onSave }: Props) => {
  const { validate } = useValidator();

  return (
    <div className="flex flex-row items-center gap-4">
      <label className="flex flex-col gap-2">
        <code>validateOnChange</code>
        <Switch
          checked={params.validateOnChange}
          onChange={() => onChange({ ...params, validateOnChange: !params.validateOnChange })}
        />
      </label>
      <label className="flex flex-col gap-2">
        <code>validateSync</code>
        <Switch
          checked={params.validateSync}
          onChange={() => onChange({ ...params, validateSync: !params.validateSync })}
        />
      </label>
      <label className="flex flex-col gap-2">
        <code>abortEarly</code>
        <Switch
          checked={params.abortEarly}
          onChange={() => onChange({ ...params, abortEarly: !params.abortEarly })}
        />
      </label>
      <label className="flex flex-col gap-2">
        <code>validationDelay</code>
        <Input
          type="number"
          placeholder="500"
          value={params.validationDelay || ''}
          onChange={e =>
            onChange({
              ...params,
              validationDelay: e.target.value === '' ? undefined : Number(e.target.value),
            })
          }
        />
      </label>
      {!params.validateOnChange && (
        <label className="flex flex-col gap-2">
          Manual validation
          <Button type="button" onClick={() => validate()}>
            validate
          </Button>
        </label>
      )}
      <label className="flex flex-col gap-2">
        Apply schema changes
        <Button type="button" onClick={onSave}>
          Save
        </Button>
      </label>
    </div>
  );
};
