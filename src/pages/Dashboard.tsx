import React, { useState } from 'react';
import { URLInput } from '@/components/URLInput';
import { VideoCard } from '@/components/VideoCard';
import { DownloadItem } from '@/components/DownloadItem';
import { NetworkStatus } from '@/components/NetworkStatus';
import { VideoMetadata, VideoFormat, DownloadProgress } from '@/types/video';
import { useToast } from '@/components/ui/use-toast';
import { fetchVideoMetadata, downloadVideo } from '@/lib/videoDownloader';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState<VideoMetadata[]>([]);
  const [activeDownloads, setActiveDownloads] = useState<DownloadProgress[]>([]);
  const { toast } = useToast();

  const handleFetchMetadata = async (url: string) => {
    setIsLoading(true);
    
    try {
      // Use our real metadata fetching function
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
      // Update download progress in state
      setActiveDownloads(prev => 
        prev.map(d => 
          d.videoId === video.id ? progress : d
        )
      );
      
      // Notify when download completes
      if (progress.status === 'completed' && 
          !activeDownloads.some(d => d.videoId === video.id && d.status === 'completed')) {
        toast({
          title: "Download complete",
          description: `${video.title} has been downloaded successfully`,
        });
      }
      
      // Notify if download fails
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
      
      // Already handled in the downloadVideo function
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

  // Find video titles for downloads
  const getVideoTitle = (videoId: string) => {
    const video = videos.find(v => v.id === videoId);
    return video?.title || 'Unknown Video';
  };

  const getVideoThumbnail = (videoId: string) => {
    const video = videos.find(v => v.id === videoId);
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
