
import React from 'react';
import { VideoCard } from '@/components/VideoCard';
import { VideoMetadata, VideoFormat } from '@/types/video';

interface VideoAnalysisProps {
  videos: VideoMetadata[];
  onDownload: (video: VideoMetadata, format: VideoFormat) => void;
  onRemoveVideo: (videoId: string) => void;
}

export function VideoAnalysis({ videos, onDownload, onRemoveVideo }: VideoAnalysisProps) {
  if (!videos.length) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Video Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map(video => (
          <VideoCard 
            key={video.id} 
            video={video} 
            onDownload={onDownload} 
            onRemove={() => onRemoveVideo(video.id)}
          />
        ))}
      </div>
    </div>
  );
}
