import { useValidator } from '@/components/providers/Validator/hooks/useValidator';

export const SubmitButton = () => {
  const { validate } = useValidator();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const isValid = validate();

    if (!isValid) {
      e.preventDefault();
    }
  };

  return (
    //@ts-ignore
    <button type="button" onClick={handleSubmit}>
      Submit
    </button>
  );
};
