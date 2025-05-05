import { useParams } from 'react-router-dom';

export const IdentityVerificationCheck = () => {
  const { checkId } = useParams();

  return <div>IdentityVerificationCheck {checkId}</div>;
};
