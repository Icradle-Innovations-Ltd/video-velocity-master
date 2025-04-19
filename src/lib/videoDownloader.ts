
import { VideoMetadata, VideoFormat, DownloadProgress } from '@/types/video';

/**
 * Download a video using the browser's fetch API
 */
export async function downloadVideo(
  video: VideoMetadata, 
  format: VideoFormat,
  onProgressUpdate: (progress: DownloadProgress) => void
): Promise<void> {
  try {
    // Create initial download progress object
    const downloadId = `download_${Date.now()}`;
    const total = format.filesize || 1000000; // Use filesize if available, or default
    
    const initialProgress: DownloadProgress = {
      videoId: video.id,
      progress: 0,
      downloaded: 0,
      total,
      speed: 0,
      eta: 0,
      status: 'downloading',
      formatId: format.id,
      chunks: Array.from({ length: 8 }, (_, i) => ({
        id: i,
        progress: 0,
        status: i === 0 ? 'downloading' : 'pending'
      }))
    };
    
    // Initial progress update
    onProgressUpdate(initialProgress);
    
    // In a real implementation, we would use a more sophisticated approach with
    // multiple connections, but for simplicity we'll use a single fetch request
    const response = await fetch(video.url);
    
    if (!response.ok) {
      throw new Error(`Failed to download: ${response.statusText}`);
    }
    
    // Get the total size from the Content-Length header if available
    const contentLength = response.headers.get('Content-Length');
    const totalSize = contentLength ? parseInt(contentLength, 10) : total;
    
    // Create a reader to read the stream
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Unable to create reader for response body');
    }
    
    let receivedLength = 0;
    let lastUpdate = Date.now();
    let lastBytes = 0;
    let chunks = initialProgress.chunks || [];
    
    // Read the data
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        // Download complete
        const finalProgress: DownloadProgress = {
          ...initialProgress,
          progress: 100,
          downloaded: totalSize,
          speed: 0,
          eta: 0,
          status: 'completed',
          chunks: chunks.map(c => ({ ...c, progress: 100, status: 'completed' }))
        };
        onProgressUpdate(finalProgress);
        
        // Create and trigger download of the file
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        
        // Use video title and format extension for filename
        const extension = format.extension || 'mp4';
        a.download = `${video.title}.${extension}`.replace(/[^a-z0-9.]/gi, '_');
        
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        break;
      }
      
      // Process the chunk data
      receivedLength += value.length;
      const progress = Math.round((receivedLength / totalSize) * 100);
      
      // Calculate speed (bytes per second)
      const now = Date.now();
      const timeDiff = (now - lastUpdate) / 1000; // in seconds
      
      // Only update speed if enough time has passed (e.g., 500ms)
      let speed = 0;
      if (timeDiff > 0.5) {
        const bytesDiff = receivedLength - lastBytes;
        speed = Math.round(bytesDiff / timeDiff);
        lastUpdate = now;
        lastBytes = receivedLength;
      }
      
      // Calculate ETA
      const remainingBytes = totalSize - receivedLength;
      const eta = speed > 0 ? Math.round(remainingBytes / speed) : 0;
      
      // Update chunks progress
      const activeChunkCount = Math.ceil((progress / 100) * chunks.length);
      chunks = chunks.map((chunk, index) => {
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
      const updatedProgress: DownloadProgress = {
        videoId: video.id,
        progress,
        downloaded: receivedLength,
        total: totalSize,
        speed,
        eta,
        status: 'downloading',
        formatId: format.id,
        chunks
      };
      
      onProgressUpdate(updatedProgress);
    }
  } catch (error) {
    console.error('Download error:', error);
    
    // Update with error status
    onProgressUpdate({
      videoId: video.id,
      progress: 0,
      downloaded: 0,
      total: format.filesize || 0,
      speed: 0,
      eta: 0,
      status: 'failed',
      formatId: format.id
    });
    
    throw error;
  }
}

/**
 * Fetch video metadata from a URL
 */
export async function fetchVideoMetadata(url: string): Promise<VideoMetadata[]> {
  try {
    // In a real app, this would make an API call to a backend service
    // For demonstration, we'll just log the URL and return mock data
    console.log('Fetching metadata for URL:', url);
    
    // For now we'll return mock data - in a real implementation
    // this would call your backend API to extract video information
    const videoId = `video_${Date.now()}`;
    
    // Create a basic video metadata object
    const video: VideoMetadata = {
      id: videoId,
      title: `Video from ${url}`,
      thumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&auto=format&fit=crop&w=1440&q=80',
      duration: 300, // 5 minutes
      url: url,
      formats: [
        {
          id: 'format_1080p',
          quality: '1080p',
          extension: 'mp4',
          resolution: '1920x1080',
          filesize: 50 * 1024 * 1024, // 50MB
          codec: 'h264'
        },
        {
          id: 'format_720p',
          quality: '720p',
          extension: 'mp4',
          resolution: '1280x720',
          filesize: 30 * 1024 * 1024, // 30MB
          codec: 'h264'
        },
        {
          id: 'format_480p',
          quality: '480p',
          extension: 'mp4',
          resolution: '854x480',
          filesize: 15 * 1024 * 1024, // 15MB
          codec: 'h264'
        },
        {
          id: 'format_audio',
          quality: 'High',
          extension: 'mp3',
          filesize: 5 * 1024 * 1024, // 5MB
          isAudioOnly: true,
          audioQuality: '128kbps'
        }
      ]
    };
    
    return [video];
  } catch (error) {
    console.error('Error fetching video metadata:', error);
    throw error;
  }
}

/**
 * Pause, resume, or cancel an active download
 */
export function controlDownload(
  downloadId: string, 
  action: 'pause' | 'resume' | 'cancel'
): void {
  // In a real implementation, this would interact with the download process
  console.log(`${action} download: ${downloadId}`);
  
  // This would be implemented with actual control of download streams
  // For now it's just a placeholder
}
