import { FunctionComponentWithChildren } from '@/common/types';
import { ctw } from '@/common/utils/ctw/ctw';
import { isCsv } from '@/common/utils/is-csv/is-csv';
import { isPdf } from '@/common/utils/is-pdf/is-pdf';
import { ComponentProps } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

export interface IImageEditorProps {
  onTransformed: NonNullable<ComponentProps<typeof TransformWrapper>['onTransformed']>;
  image: { imageUrl: string; fileType: string; id: string };
  crop: Crop | undefined;
  onCrop: (crop: Crop) => void;
  isCropping: boolean;
  isRotatedOrTransformed: boolean;
  imageRotation: number;
}

export const ImageEditor: FunctionComponentWithChildren<IImageEditorProps> = ({
  children,
  onTransformed,
  image,
  crop,
  onCrop,
  isCropping,
  isRotatedOrTransformed,
  imageRotation,
}) => {
  return (
    <TransformWrapper onTransformed={onTransformed}>
      <TransformComponent
        wrapperClass={`d-full max-w-[600px] max-h-[600px] h-full`}
        contentClass={ctw({
          'hover:cursor-move': !isPdf(image) && !isCsv(image),
        })}
        wrapperStyle={{
          width: '100%',
          maxHeight: '600px',
          height: '100%',
          overflow: 'hidden',
        }}
        contentStyle={{
          width: '100%',
          height: '100%',
          display: !isPdf(image) && !isCsv(image) ? 'block' : 'flex',
        }}
      >
        <ReactCrop
          crop={crop}
          onChange={onCrop}
          disabled={!isCropping || isPdf(image) || isCsv(image) || isRotatedOrTransformed}
          className={ctw('h-full w-full overflow-hidden [&>div]:!w-full', {
            'flex flex-row [&>div]:min-h-[600px]': isPdf(image) || isCsv(image),
          })}
        >
          <div
            className={ctw('flex h-full', {
              'rotate-90': imageRotation === 90,
              'rotate-180': imageRotation === 180,
              'rotate-[270deg]': imageRotation === 270,
            })}
          >
            {children}
          </div>
        </ReactCrop>
      </TransformComponent>
    </TransformWrapper>
  );
};
