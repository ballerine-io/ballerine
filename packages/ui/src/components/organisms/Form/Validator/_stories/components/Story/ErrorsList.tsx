import { useValidator } from '../../../hooks/external/useValidator';

export const ErrorsList = () => {
  const { errors } = useValidator();

  return (
    <div className="flex flex-col gap-1">
      {errors.map((error, index) => (
        <div key={index}>{JSON.stringify(error)}</div>
      ))}
    </div>
  );
};
