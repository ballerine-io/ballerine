import { ctw } from '@ballerine/ui';
import { AlertTriangleIcon, PlayCircleIcon, RefreshCwIcon } from 'lucide-react';
import { Skeleton } from '@ballerine/ui';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as Sentry from '@sentry/react';
import posthog from 'posthog-js';
import { Button } from '@/common/components/atoms/Button/Button';
import { env } from '@/common/env/env';

const VIDEO_URL = 'https://www.loom.com/embed/7cd69b5e2db24e81ace760cc38b3d7dc';
const THUMBNAIL_URL =
  'https://cdn.loom.com/sessions/thumbnails/7cd69b5e2db24e81ace760cc38b3d7dc-8dd5afc805842339-full-play.gif';

type VideoLoadingState = 'initial' | 'loading' | 'loaded' | 'error';

export type WelcomeVideoCardProps = {
  className?: string;
};

export const WelcomeVideoCard = ({ className }: WelcomeVideoCardProps) => {
  const [showVideo, setShowVideo] = useState(false);
  const [videoState, setVideoState] = useState<VideoLoadingState>('initial');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const retryCount = useRef(0);

  const logVideoEvent = useCallback(
    (event: string, details?: Record<string, any>) => {
      if (env.VITE_POSTHOG_KEY && env.VITE_POSTHOG_HOST) {
        posthog.capture(`welcome_video_${event}`, {
          ...details,
          state: videoState,
          showingVideo: showVideo,
        });
      }

      if (env.VITE_ENVIRONMENT_NAME === 'development') {
        console.log(`[WelcomeVideo] ${event}`, {
          ...details,
          state: videoState,
          showingVideo: showVideo,
        });
      }
    },
    [videoState, showVideo],
  );

  const handleIframeLoad = useCallback(() => {
    setVideoState('loaded');
    logVideoEvent('loaded');
  }, [logVideoEvent]);

  const handleIframeError = useCallback(
    (error: Error | string) => {
      setVideoState('error');
      const errorMessage = typeof error === 'string' ? error : error.message;
      setErrorDetails(errorMessage);

      if (env.VITE_SENTRY_DSN) {
        Sentry.captureException(error, {
          tags: {
            component: 'WelcomeVideoCard',
            videoUrl: VIDEO_URL,
          },
          extra: {
            retryCount: retryCount.current,
          },
        });
      }

      logVideoEvent('error', { error: errorMessage, retryCount: retryCount.current });
    },
    [logVideoEvent],
  );

  const handlePlayVideo = useCallback(() => {
    setShowVideo(true);
    setVideoState('loading');
    logVideoEvent('play_clicked');
  }, [logVideoEvent]);

  const handleRetry = useCallback(() => {
    retryCount.current += 1;
    setVideoState('loading');
    setErrorDetails(null);

    setShowVideo(false);
    setTimeout(() => {
      setShowVideo(true);
      logVideoEvent('retry', { retryCount: retryCount.current });
    }, 100);
  }, [logVideoEvent]);

  useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe || !showVideo) return;

    const handleError = () => {
      handleIframeError('Iframe failed to load content');
    };

    window.addEventListener('error', handleError);

    if (showVideo && videoState === 'loading') {
      logVideoEvent('view_initiated');
    }

    return () => {
      window.removeEventListener('error', handleError);
    };
  }, [showVideo, videoState, handleIframeError, logVideoEvent]);

  const getVideoUrl = useCallback(() => {
    let url = `${VIDEO_URL}?sid=69a0ffbf-bd57-4e88-b9db-cbf819da21d3`;

    if (showVideo) {
      url += '&autoplay=1&hideEmbedTopBar=true';
    }

    if (retryCount.current > 0) {
      url += `&retry=${retryCount.current}`;
    }

    return url;
  }, [showVideo]);

  return (
    <div
      className={ctw(
        'flex flex-row justify-between gap-4 rounded-md border border-gray-300 bg-white px-6 py-4 shadow-sm',
        className,
      )}
    >
      <div className="flex w-1/2 flex-col justify-center space-y-2">
        <div className="flex items-center gap-2">
          <PlayCircleIcon className="text-primary d-7" />
          <h3 className="text-xl font-semibold">Welcome Video</h3>
        </div>
        <p className="text-sm text-gray-600">
          Watch this quick introduction to learn how to use Ballerine effectively.
        </p>
      </div>

      <div className="w-1/2">
        {!showVideo ? (
          <div
            className="relative cursor-pointer"
            onClick={handlePlayVideo}
            style={{ paddingBottom: '56.25%', height: 0 }}
          >
            <div className="absolute inset-0 flex items-center justify-center rounded-md bg-gray-100">
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-md bg-black/10">
                <PlayCircleIcon className="text-white drop-shadow-lg d-16" />
                <span className="mt-2 font-medium text-white drop-shadow-lg">Click to play</span>
              </div>
              <img
                src={THUMBNAIL_URL}
                alt="Video thumbnail"
                className="h-full w-full rounded-md object-cover"
                onError={() => logVideoEvent('thumbnail_error')}
              />
            </div>
          </div>
        ) : (
          <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
            {videoState === 'loading' && (
              <Skeleton className="absolute inset-0 size-full rounded-md" />
            )}

            {videoState === 'error' ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-md border border-red-200 bg-red-50 p-4">
                <AlertTriangleIcon className="mb-2 text-red-500 d-10" />
                <p className="mb-2 text-center font-medium text-red-700">Failed to load video</p>
                <p className="mb-4 text-center text-sm text-red-600">
                  {errorDetails || 'An unknown error occurred'}
                </p>
                <Button variant="outline" onClick={handleRetry} className="flex items-center gap-2">
                  <RefreshCwIcon className="d-4" />
                  Try Again
                </Button>
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                src={getVideoUrl()}
                frameBorder="0"
                allowFullScreen
                onLoad={handleIframeLoad}
                onError={() => handleIframeError('Iframe encountered an error')}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '0.375rem',
                }}
                title="Welcome to Ballerine"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
