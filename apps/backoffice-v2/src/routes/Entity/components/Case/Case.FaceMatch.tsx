import { FunctionComponent } from 'react';
import { IFaceMatchProps } from './interfaces';
import { BallerineImage } from '../../../../common/components/atoms/BallerineImage';
import { DataField } from '../../../../common/components/molecules/DataField/DataField';
import { useFaceMatch } from './hooks/useFaceMatch/useFaceMatch';
import { ctw } from '../../../../common/utils/ctw/ctw';

/**
 * @description To be used by {@link Case}, and be wrapped by {@link Case.Content}. Displays a single entity's face match photos and result using {@link BallerineImage}.
 *
 * @see {@link BallerineImage}
 *
 * @param props
 * @param props.faceAUrl - A string url for photo 1/2 to compare against.
 * @param props.faceBUrl - A string url for photo 2/2 to compare against.
 *
 * @constructor
 */
export const FaceMatch: FunctionComponent<IFaceMatchProps> = ({
  faceAUrl,
  faceBUrl,
  isLoading,
  className,
  ...props
}) => {
  const {
    faceARef,
    faceBRef,
    faceSimilarity,
    imageQuality,
    isComparing,
    faceSimilarityThreshold,
    imageQualityThreshold,
  } = useFaceMatch(isLoading);

  return (
    <div className={ctw(`space-y-8 p-4 pt-0`, className)} {...props}>
      {/* Compared images */}
      <div className={`flex h-[143px] space-x-4`}>
        <BallerineImage
          withPlaceholder
          src={faceAUrl}
          alt={`Face match - image A`}
          className={`w-[117px] !object-cover`}
          ref={faceARef}
          isLoading={isLoading}
        />
        <BallerineImage
          withPlaceholder
          src={faceBUrl}
          alt={`Face match - image B`}
          className={`w-[117px] !object-cover`}
          ref={faceBRef}
          isLoading={isLoading}
        />
      </div>

      {/* Comparison result */}
      <div className={`flex space-x-4`}>
        <DataField
          title={`Face Similarity`}
          text={`${faceSimilarity}%`}
          loading={{
            text: isComparing || isLoading,
          }}
          textProps={{
            className: ctw({
              'text-error': faceSimilarity < faceSimilarityThreshold,
              'text-success': faceSimilarity >= faceSimilarityThreshold,
            }),
          }}
        />
        <DataField
          loading={{
            text: isComparing || isLoading,
          }}
          title={`Image Quality`}
          text={faceSimilarity && imageQuality >= imageQualityThreshold ? `OK` : `INVALID`}
          textProps={{
            className: ctw({
              'text-error': !faceSimilarity || imageQuality < imageQualityThreshold,
              'text-success': faceSimilarity && imageQuality >= imageQualityThreshold,
            }),
          }}
        />
      </div>
    </div>
  );
};
