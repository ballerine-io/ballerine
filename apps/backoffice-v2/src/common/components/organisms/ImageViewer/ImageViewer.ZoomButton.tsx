import { FunctionComponent } from 'react';
import { ButtonComponent } from '../../../types';
import { useZoomButton } from './hooks/useZoomButton/useZoomButton';
import { ctw } from '../../../utils/ctw/ctw';
import { MagnifyingGlassSvg } from '../../atoms/icons';

export const ZoomButton: FunctionComponent<ButtonComponent> = ({ className, ...props }) => {
  const { onToggleOnIsZoomModalOpen } = useZoomButton();

  return (
    <button
      onClick={onToggleOnIsZoomModalOpen}
      aria-label={'Open zoomed selected image modal'}
      className={ctw(
        `btn-ghost btn-sm btn-circle btn grid place-content-center bg-base-300/70 focus:outline-primary`,
        className,
      )}
      {...props}
    >
      <MagnifyingGlassSvg className={`p-0.5`} />
    </button>
  );
};
