
import React, { useState } from 'react';
import { URLInput } from '@/components/URLInput';
import { VideoCard } from '@/components/VideoCard';
import { DownloadItem } from '@/components/DownloadItem';
import { NetworkStatus } from '@/components/NetworkStatus';
import { mockVideos, mockDownloads } from '@/lib/mockData';
import { VideoMetadata, VideoFormat, DownloadProgress } from '@/types/video';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState<VideoMetadata[]>([]);
  const [activeDownloads, setActiveDownloads] = useState<DownloadProgress[]>(mockDownloads);
  const { toast } = useToast();

  const handleFetchMetadata = (url: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Use mock data for demonstration
      setVideos(mockVideos);
      setIsLoading(false);
      
      toast({
        title: "Video metadata fetched",
        description: `Successfully analyzed ${mockVideos.length} videos`,
      });
    }, 1500);
  };

  const handleDownload = (video: VideoMetadata, format: VideoFormat) => {
    // Create a new download progress object
    const newDownload: DownloadProgress = {
      videoId: video.id,
      progress: 0,
      downloaded: 0,
      total: format.filesize || 1000000,
      speed: 0,
      eta: 0,
      status: 'queued',
      formatId: format.id
    };
    
    setActiveDownloads(prev => [...prev, newDownload]);
    
    toast({
      title: "Download started",
      description: `Added "${video.title}" to download queue`,
    });
    
    // Simulate download progress
    simulateDownloadProgress(newDownload);
  };

  const simulateDownloadProgress = (download: DownloadProgress) => {
    // For demo purposes only - simulates download progress updates
    let progress = 0;
    const total = download.total;
    let speed = Math.random() * 10000000 + 2000000; // Random speed between 2-12 MB/s
    
    // Generate random chunks for visualization
    const chunks = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      progress: 0,
      status: i === 0 ? 'downloading' as const : 'pending' as const
    }));
    
    // Update download to start downloading
    setActiveDownloads(prev => 
      prev.map(d => 
        d.videoId === download.videoId ? 
        { 
          ...d, 
          status: 'downloading', 
          speed,
          chunks
        } : d
      )
    );
    
    const interval = setInterval(() => {
      progress += Math.random() * 5; // Random increment up to 5%
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Mark download as complete
        setActiveDownloads(prev => 
          prev.map(d => 
            d.videoId === download.videoId ? 
            { 
              ...d, 
              progress: 100,
              downloaded: total,
              speed: 0,
              eta: 0,
              status: 'completed',
              chunks: d.chunks?.map(c => ({ ...c, progress: 100, status: 'completed' }))
            } : d
          )
        );
        
        toast({
          title: "Download complete",
          description: "Your video has been downloaded successfully",
        });
        
        return;
      }
      
      // Calculate current downloaded bytes and ETA
      const downloaded = Math.floor((progress / 100) * total);
      const remaining = total - downloaded;
      const eta = remaining / speed;
      
      // Update chunks randomly to simulate parallel downloading
      const updatedChunks = chunks.map((chunk, index) => {
        // Determine how many chunks are active based on progress
        const activeChunkCount = Math.ceil((progress / 100) * chunks.length);
        
        if (index < activeChunkCount - 1) {
          // Completed chunks
          return { ...chunk, progress: 100, status: 'completed' as const };
        } else if (index === activeChunkCount - 1) {
          // Currently downloading chunk
          const chunkProgress = (progress % (100 / chunks.length)) * (chunks.length);
          return { 
            ...chunk, 
            progress: Math.min(chunkProgress, 100), 
            status: 'downloading' as const 
          };
        } else if (index === activeChunkCount) {
          // Next pending chunk
          return { ...chunk, status: 'pending' as const, progress: 0 };
        } else {
          // Future chunks
          return { ...chunk, status: 'pending' as const, progress: 0 };
        }
      });
      
      // Update download progress
      setActiveDownloads(prev => 
        prev.map(d => 
          d.videoId === download.videoId ? 
          { 
            ...d, 
            progress,
            downloaded,
            speed: speed * (0.8 + Math.random() * 0.4), // Vary speed slightly
            eta,
            chunks: updatedChunks
          } : d
        )
      );
    }, 500);
  };

  const handlePauseDownload = (videoId: string) => {
    setActiveDownloads(prev => 
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
    const download = activeDownloads.find(d => d.videoId === videoId);
    
    if (download) {
      setActiveDownloads(prev => 
        prev.map(d => 
          d.videoId === videoId ? 
          { 
            ...d, 
            status: 'downloading',
            speed: Math.random() * 10000000 + 2000000 // Random speed between 2-12 MB/s
          } : d
        )
      );
      
      // Continue simulating progress
      simulateDownloadProgress({
        ...download,
        status: 'downloading'
      });
      
      toast({
        title: "Download resumed",
        description: "Your download is continuing",
      });
    }
  };

  const handleCancelDownload = (videoId: string) => {
    setActiveDownloads(prev => 
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
    setActiveDownloads(prev => 
      prev.filter(d => d.videoId !== videoId)
    );
  };

  const handleRemoveVideo = (videoId: string) => {
    setVideos(prev => prev.filter(v => v.id !== videoId));
  };

  // Find video titles for downloads
  const getVideoTitle = (videoId: string) => {
    const video = mockVideos.find(v => v.id === videoId);
    return video?.title || 'Unknown Video';
  };

  const getVideoThumbnail = (videoId: string) => {
    const video = mockVideos.find(v => v.id === videoId);
    return video?.thumbnail;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Video Velocity Master</h1>
        <p className="text-muted-foreground">Download any video at maximum speed with advanced features</p>
      </div>
      
      <URLInput onFetchMetadata={handleFetchMetadata} isLoading={isLoading} />
      
      {videos.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Video Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map(video => (
              <VideoCard 
                key={video.id} 
                video={video} 
                onDownload={handleDownload} 
                onRemove={() => handleRemoveVideo(video.id)}
              />
            ))}
          </div>
        </div>
      )}
      
      {activeDownloads.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Active Downloads</h2>
          <div className="space-y-4">
            {activeDownloads.map(download => (
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
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Optimization Tips</h2>
          <div className="p-4 border rounded-lg bg-card">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white text-xs">1</div>
                <p>Use multi-threaded downloads for maximum speed</p>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white text-xs">2</div>
                <p>Enable proxy settings if you're on a restricted network</p>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white text-xs">3</div>
                <p>Schedule large downloads during off-peak hours</p>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white text-xs">4</div>
                <p>Convert videos to different formats for compatibility</p>
              </li>
            </ul>
          </div>
        </div>
        
        <div>
          <NetworkStatus 
            isConnected={true} 
            proxy={{ enabled: false }}
            speed={10485760} // 10 MB/s
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
