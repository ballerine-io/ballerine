import { FunctionComponentWithChildren } from '@/common/types';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { ctw } from '@/common/utils/ctw/ctw';
import { isPdf } from '@/common/utils/is-pdf/is-pdf';
import { ComponentProps } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';

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
        wrapperClass={`max-w-[441px]`}
        contentClass={ctw(`overflow-x-auto`, {
          'hover:cursor-move': !isPdf(image),
        })}
        wrapperStyle={{
          width: '100%',
          height: '100%',
        }}
        contentStyle={{
          width: '100%',
          height: '100%',
        }}
      >
        <ReactCrop
          crop={crop}
          onChange={onCrop}
          disabled={!isCropping || isPdf(image) || isRotatedOrTransformed}
          className={ctw({
            'd-full [&>div]:d-full': isPdf(image),
            'rotate-90': imageRotation === 90,
            'rotate-180': imageRotation === 180,
            'rotate-[270deg]': imageRotation === 270,
          })}
        >
          {children}
        </ReactCrop>
      </TransformComponent>
    </TransformWrapper>
  );
};
