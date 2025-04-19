
import React from 'react';
import { DownloadItem } from '@/components/DownloadItem';
import { DownloadProgress } from '@/types/video';

interface ActiveDownloadsProps {
  downloads: DownloadProgress[];
  titles: Record<string, string>;
  thumbnails: Record<string, string | undefined>;
  onPause: (videoId: string) => void;
  onResume: (videoId: string) => void;
  onCancel: (videoId: string) => void;
  onRemove: (videoId: string) => void;
}

export function ActiveDownloads({ 
  downloads, 
  titles, 
  thumbnails,
  onPause, 
  onResume, 
  onCancel, 
  onRemove 
}: ActiveDownloadsProps) {
  if (!downloads.length) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Active Downloads</h2>
      <div className="space-y-4">
        {downloads.map(download => (
          <DownloadItem 
            key={download.videoId}
            download={download}
            videoTitle={titles[download.videoId]}
            thumbnail={thumbnails[download.videoId]}
            onPause={() => onPause(download.videoId)}
            onResume={() => onResume(download.videoId)}
            onCancel={() => onCancel(download.videoId)}
            onRemove={() => onRemove(download.videoId)}
          />
        ))}
      </div>
    </div>
  );
}
