import React, { useState } from 'react';
import { URLInput } from '@/components/URLInput';
import { NetworkStatus } from '@/components/NetworkStatus';
import { VideoMetadata, VideoFormat, DownloadProgress } from '@/types/video';
import { useToast } from '@/hooks/use-toast';
import { fetchVideoMetadata, downloadVideo } from '@/lib/videoDownloader';
import { VideoAnalysis } from '@/components/VideoAnalysis';
import { ActiveDownloads } from '@/components/ActiveDownloads';
import { OptimizationTips } from '@/components/OptimizationTips';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState<VideoMetadata[]>([]);
  const [activeDownloads, setActiveDownloads] = useState<DownloadProgress[]>([]);
  const { toast } = useToast();

  const handleFetchMetadata = async (url: string) => {
    setIsLoading(true);
    
    try {
      const fetchedVideos = await fetchVideoMetadata(url);
      setVideos(fetchedVideos);
      
      toast({
        title: "Video metadata fetched",
        description: `Successfully analyzed ${fetchedVideos.length} videos`,
      });
    } catch (error) {
      console.error("Error fetching metadata:", error);
      toast({
        title: "Error",
        description: "Failed to fetch video metadata. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
    
    // Start the actual download
    downloadVideo(video, format, (progress) => {
      setActiveDownloads(prev => 
        prev.map(d => 
          d.videoId === video.id ? progress : d
        )
      );
      
      if (progress.status === 'completed' && 
          !activeDownloads.some(d => d.videoId === video.id && d.status === 'completed')) {
        toast({
          title: "Download complete",
          description: `${video.title} has been downloaded successfully`,
        });
      }
      
      if (progress.status === 'failed' && 
          !activeDownloads.some(d => d.videoId === video.id && d.status === 'failed')) {
        toast({
          title: "Download failed",
          description: `Failed to download ${video.title}`,
          variant: "destructive",
        });
      }
    }).catch(error => {
      console.error("Download error:", error);
    });
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
    
    toast({
      title: "Download resumed",
      description: "Your download is continuing",
    });
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

  // Helper functions to get video details for downloads
  const getVideoTitles = () => {
    const titles: Record<string, string> = {};
    if (Array.isArray(videos)) {
      videos.forEach(v => {
        titles[v.id] = v.title;
      });
    }
    return titles;
  };

  const getVideoThumbnails = () => {
    const thumbnails: Record<string, string | undefined> = {};
    if (Array.isArray(videos)) {
      videos.forEach(v => {
        thumbnails[v.id] = v.thumbnail;
      });
    }
    return thumbnails;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Video Velocity Master</h1>
        <p className="text-muted-foreground">Download any video at maximum speed with advanced features</p>
      </div>
      
      <URLInput onFetchMetadata={handleFetchMetadata} isLoading={isLoading} />
      
      <VideoAnalysis 
        videos={videos}
        onDownload={handleDownload}
        onRemoveVideo={handleRemoveVideo}
      />
      
      <ActiveDownloads 
        downloads={activeDownloads}
        titles={getVideoTitles()}
        thumbnails={getVideoThumbnails()}
        onPause={handlePauseDownload}
        onResume={handleResumeDownload}
        onCancel={handleCancelDownload}
        onRemove={handleRemoveDownload}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <OptimizationTips />
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
