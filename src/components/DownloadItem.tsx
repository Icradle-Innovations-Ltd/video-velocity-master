
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Pause, Play, X, Trash2 } from 'lucide-react';
import { DownloadProgress } from '@/types/video';
import { formatFileSize, formatSpeed, formatTime } from '@/lib/formatters';

interface DownloadItemProps {
  download: DownloadProgress;
  videoTitle: string;
  thumbnail?: string;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
  onRemove: () => void;
}

export function DownloadItem({
  download,
  videoTitle,
  thumbnail,
  onPause,
  onResume,
  onCancel,
  onRemove,
}: DownloadItemProps) {
  const getStatusColor = () => {
    switch (download.status) {
      case 'downloading':
        return 'text-primary';
      case 'paused':
        return 'text-amber-500';
      case 'completed':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusText = () => {
    switch (download.status) {
      case 'queued':
        return 'Queued';
      case 'downloading':
        return `Downloading - ${formatSpeed(download.speed)}`;
      case 'paused':
        return 'Paused';
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      case 'canceled':
        return 'Canceled';
      default:
        return 'Unknown';
    }
  };

  const isActive = download.status === 'downloading' || download.status === 'paused';
  const isCompleted = download.status === 'completed';
  const isFailed = download.status === 'failed' || download.status === 'canceled';

  return (
    <div className="flex flex-col gap-3 p-4 border rounded-lg bg-card">
      <div className="flex items-center gap-3">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={videoTitle}
            className="w-12 h-12 rounded object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin"></div>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">{videoTitle}</h4>
          <div className="flex items-center gap-3 mt-1">
            <span className={`text-xs ${getStatusColor()}`}>{getStatusText()}</span>
            {download.status === 'downloading' && (
              <span className="text-xs text-muted-foreground">
                {formatFileSize(download.downloaded)} of {formatFileSize(download.total)} 
                {' '} • {' '}
                {formatTime(download.eta)}
              </span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          {isActive && (
            <>
              {download.status === 'downloading' ? (
                <Button variant="ghost" size="icon" onClick={onPause}>
                  <Pause className="h-4 w-4" />
                </Button>
              ) : (
                <Button variant="ghost" size="icon" onClick={onResume}>
                  <Play className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={onCancel}>
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
          {(isCompleted || isFailed) && (
            <Button variant="ghost" size="icon" onClick={onRemove}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {download.status !== 'completed' && (
        <Progress 
          value={download.progress} 
          max={100}
          className={
            download.status === 'downloading' 
              ? "h-2 progress-bar-animated" 
              : "h-2"
          }
        />
      )}
      
      {download.chunks && download.chunks.length > 0 && download.status === 'downloading' && (
        <div className="flex gap-1 h-1.5 mt-1">
          {download.chunks.map((chunk) => (
            <div 
              key={chunk.id}
              className="flex-1 rounded-full overflow-hidden"
            >
              <div 
                className={`h-full ${
                  chunk.status === 'completed' 
                    ? 'bg-primary' 
                    : chunk.status === 'downloading' 
                      ? 'bg-primary/70 animate-pulse-download' 
                      : 'bg-muted'
                }`}
                style={{ width: `${chunk.progress}%` }}
              ></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
