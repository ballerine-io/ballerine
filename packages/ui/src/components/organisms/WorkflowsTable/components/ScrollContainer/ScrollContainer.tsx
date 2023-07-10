import Scrollbars from 'react-custom-scrollbars';

interface Props {
  children: React.ReactNode;
}

export function ScrollContainer({ children }: Props) {
  return <Scrollbars children={children} autoHide />;
}

ScrollContainer.displayName = 'ScrollContainer';
