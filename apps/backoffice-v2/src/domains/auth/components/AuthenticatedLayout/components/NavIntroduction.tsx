import { PlayCircleIcon } from 'lucide-react';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { Skeleton } from '@ballerine/ui';

export const NavIntroduction = () => {
  const { data: customer } = useCustomerQuery();

  // Only show the introduction in demo accounts
  if (!customer?.config?.isDemoAccount) {
    return null;
  }

  return (
    <div className="mb-6 px-2 transition-opacity group-data-[collapsible=icon]:opacity-0">
      <div className="rounded-lg border bg-white p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-2/3">
            <h3 className="text-sm font-bold">Introduction</h3>
            <p className="text-xs text-gray-700">
              Watch this quick introduction to learn how to use Ballerine effectively.
            </p>
          </div>
          <div className="relative w-3/4 overflow-hidden rounded-md">
            {/* Video player with thumbnail and iframe */}
            <div className="relative">
              {/* Thumbnail with play button */}
              <button
                className="group relative w-full"
                onClick={() => {
                  const thumbnail = document.getElementById('video-thumbnail');
                  const iframe = document.getElementById('video-iframe');

                  if (thumbnail && iframe) {
                    thumbnail.style.display = 'none';
                    iframe.style.display = 'block';

                    // Update iframe src to autoplay
                    const iframeElement = iframe.querySelector('iframe');
                    if (iframeElement) {
                      const currentSrc = iframeElement.src;
                      iframeElement.src = currentSrc + '&autoplay=true';
                    }
                  }
                }}
                id="video-thumbnail"
              >
                <img
                  src="https://cdn.loom.com/sessions/thumbnails/7cd69b5e2db24e81ace760cc38b3d7dc-8dd5afc805842339-full-play.gif"
                  alt="Introduction video thumbnail"
                  className="w-full rounded-md"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <PlayCircleIcon className="h-10 w-10 text-white opacity-80 transition-opacity group-hover:opacity-100" />
                </div>
              </button>

              {/* Video iframe (hidden initially) */}
              <div
                id="video-iframe"
                style={{
                  position: 'relative',
                  paddingBottom: '56.25%',
                  height: 0,
                  display: 'none',
                }}
              >
                <Skeleton className="absolute inset-0 size-full" />
                <iframe
                  src="https://www.loom.com/embed/7cd69b5e2db24e81ace760cc38b3d7dc?sid=69a0ffbf-bd57-4e88-b9db-cbf819da21d3&hideEmbedTopBar=true"
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
      </div>
    </div>
  );
};
