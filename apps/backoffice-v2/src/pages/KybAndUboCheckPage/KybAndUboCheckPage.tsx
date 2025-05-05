import { FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';

export const KybAndUboCheckPage: FunctionComponent = () => {
  const { checkId } = useParams();

  return <div>KybAndUboCheckPage {checkId}</div>;
};
