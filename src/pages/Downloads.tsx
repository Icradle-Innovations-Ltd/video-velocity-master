
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DownloadItem } from '@/components/DownloadItem';
import { mockDownloads } from '@/lib/mockData';
import { DownloadProgress } from '@/types/video';
import { RefreshCw, Pause, Play, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Downloads = () => {
  const [downloads, setDownloads] = useState<DownloadProgress[]>(mockDownloads);
  const { toast } = useToast();

  // Get mock video data (in a real app, this would be from a store or context)
  const getVideoTitle = (videoId: string) => {
    const titles: Record<string, string> = {
      'video1': 'Amazing Nature Documentary - 4K Ultra HD',
      'video2': 'Programming Tutorial - Learn TypeScript in 2 Hours',
      'video3': 'Epic Space Documentary - Journey to the Stars',
    };
    return titles[videoId] || 'Unknown Video';
  };

  const getVideoThumbnail = (videoId: string) => {
    const thumbnails: Record<string, string> = {
      'video1': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1440&q=80',
      'video2': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1440&q=80',
      'video3': 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&auto=format&fit=crop&w=1440&q=80',
    };
    return thumbnails[videoId];
  };

  const handlePauseDownload = (videoId: string) => {
    setDownloads(prev => 
      prev.map(d => 
        d.videoId === videoId ? { ...d, status: 'paused', speed: 0 } : d
      )
    );
    
    toast({
      title: "Download paused",
      description: "You can resume this download anytime",
    });
  };

  const handleResumeDownload = (videoId: string) => {
    setDownloads(prev => 
      prev.map(d => 
        d.videoId === videoId ? 
        { 
          ...d, 
          status: 'downloading',
          speed: Math.random() * 10000000 + 2000000 // Random speed between 2-12 MB/s
        } : d
      )
    );
    
    toast({
      title: "Download resumed",
      description: "Your download is continuing",
    });

    // In a real app, you would restart the download process here
  };

  const handleCancelDownload = (videoId: string) => {
    setDownloads(prev => 
      prev.map(d => 
        d.videoId === videoId ? { ...d, status: 'canceled', speed: 0 } : d
      )
    );
    
    toast({
      title: "Download canceled",
      description: "Your download has been canceled",
      variant: "destructive",
    });
  };

  const handleRemoveDownload = (videoId: string) => {
    setDownloads(prev => 
      prev.filter(d => d.videoId !== videoId)
    );
  };

  const handlePauseAll = () => {
    setDownloads(prev => 
      prev.map(d => 
        d.status === 'downloading' ? { ...d, status: 'paused', speed: 0 } : d
      )
    );
    
    toast({
      title: "All downloads paused",
      description: "You can resume them anytime",
    });
  };

  const handleResumeAll = () => {
    setDownloads(prev => 
      prev.map(d => 
        d.status === 'paused' ? 
        { 
          ...d, 
          status: 'downloading',
          speed: Math.random() * 10000000 + 2000000
        } : d
      )
    );
    
    toast({
      title: "All downloads resumed",
      description: "Your downloads are continuing",
    });
  };

  const handleClearCompleted = () => {
    setDownloads(prev => 
      prev.filter(d => d.status !== 'completed' && d.status !== 'canceled' && d.status !== 'failed')
    );
    
    toast({
      title: "Cleared completed downloads",
      description: "All completed, canceled, and failed downloads have been removed",
    });
  };

  // Count downloads by status
  const activeCount = downloads.filter(d => d.status === 'downloading').length;
  const pausedCount = downloads.filter(d => d.status === 'paused').length;
  const completedCount = downloads.filter(d => d.status === 'completed').length;
  const queuedCount = downloads.filter(d => d.status === 'queued').length;
  const failedCount = downloads.filter(d => d.status === 'failed' || d.status === 'canceled').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Downloads</h1>
        <p className="text-muted-foreground">Manage your current and queued downloads</p>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handlePauseAll}
          disabled={activeCount === 0}
        >
          <Pause className="mr-2 h-4 w-4" />
          Pause All
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleResumeAll}
          disabled={pausedCount === 0}
        >
          <Play className="mr-2 h-4 w-4" />
          Resume All
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleClearCompleted}
          disabled={completedCount + failedCount === 0}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear Completed
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-card rounded-lg border p-4 text-center">
          <p className="text-2xl font-bold text-primary">{downloads.length}</p>
          <p className="text-sm text-muted-foreground">Total</p>
        </div>
        
        <div className="bg-card rounded-lg border p-4 text-center">
          <p className="text-2xl font-bold text-green-500">{activeCount}</p>
          <p className="text-sm text-muted-foreground">Active</p>
        </div>
        
        <div className="bg-card rounded-lg border p-4 text-center">
          <p className="text-2xl font-bold text-amber-500">{pausedCount}</p>
          <p className="text-sm text-muted-foreground">Paused</p>
        </div>
        
        <div className="bg-card rounded-lg border p-4 text-center">
          <p className="text-2xl font-bold text-gray-500">{queuedCount}</p>
          <p className="text-sm text-muted-foreground">Queued</p>
        </div>
        
        <div className="bg-card rounded-lg border p-4 text-center">
          <p className="text-2xl font-bold text-red-500">{failedCount}</p>
          <p className="text-sm text-muted-foreground">Failed</p>
        </div>
      </div>
      
      {downloads.length > 0 ? (
        <div className="space-y-4">
          {downloads.map(download => (
            <DownloadItem 
              key={download.videoId}
              download={download}
              videoTitle={getVideoTitle(download.videoId)}
              thumbnail={getVideoThumbnail(download.videoId)}
              onPause={() => handlePauseDownload(download.videoId)}
              onResume={() => handleResumeDownload(download.videoId)}
              onCancel={() => handleCancelDownload(download.videoId)}
              onRemove={() => handleRemoveDownload(download.videoId)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/50 rounded-lg border">
          <h3 className="text-xl font-medium mb-2">No downloads</h3>
          <p className="text-muted-foreground mb-4">You don't have any downloads in progress or queued</p>
          <Button variant="default" onClick={() => window.location.href = '/'}>
            Download a video
          </Button>
        </div>
      )}
    </div>
  );
};

export default Downloads;
