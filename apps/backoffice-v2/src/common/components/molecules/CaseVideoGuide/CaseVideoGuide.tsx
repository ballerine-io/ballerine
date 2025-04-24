import { Skeleton } from '@ballerine/ui';
import { FunctionComponent } from 'react';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';

export interface CaseVideoGuideProps {
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  videoSrc?: string;
}

export const CaseVideoGuide: FunctionComponent<CaseVideoGuideProps> = ({
  title = 'Onboarding Introduction',
  description = 'Learn about Ballerine complete onboarding and underwriting capabilities',
  videoSrc = 'https://www.loom.com/embed/efb8b2fdadef4fa79b4f8b412f1e4f4d?sid=02b86870-55ba-4914-bb59-24ba02121852&hideEmbedTopBar=true',
}) => {
  return (
    <Card className="col-span-1 h-full xl:col-span-2">
      <CardContent className="p-4">
        <div className="flex h-full flex-row gap-6">
          {/* Title and text section */}
          <div className="flex w-1/3 flex-col">
            <h3 className="mb-3 text-lg font-bold">{title}</h3>
            <p className="text-sm text-gray-700">{description}</p>
          </div>

          <div className="relative w-2/3 overflow-hidden rounded-md">
            <div className="relative h-full">
              <div
                id="case-video-iframe"
                style={{
                  position: 'relative',
                  paddingBottom: '56.25%',
                  height: 0,
                }}
              >
                <Skeleton className="absolute inset-0 size-full" />
                <iframe
                  src={videoSrc}
                  frameBorder="0"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
