
import { VideoMetadata, VideoFormat, DownloadProgress } from '@/types/video';
import { 
  createInitialProgress, 
  updateDownloadProgress, 
  createCompletedProgress,
  createFailedProgress 
} from './downloadProgressManager';

/**
 * Download a video using the browser's fetch API
 */
export async function downloadVideo(
  video: VideoMetadata, 
  format: VideoFormat,
  onProgressUpdate: (progress: DownloadProgress) => void
): Promise<void> {
  try {
    const total = format.filesize || 1000000;
    const initialProgress = createInitialProgress(video.id, format.id, total);
    onProgressUpdate(initialProgress);
    
    const response = await fetch(video.url);
    if (!response.ok) {
      throw new Error(`Failed to download: ${response.statusText}`);
    }
    
    const contentLength = response.headers.get('Content-Length');
    const totalSize = contentLength ? parseInt(contentLength, 10) : total;
    
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Unable to create reader for response body');
    }
    
    let receivedLength = 0;
    let lastUpdate = Date.now();
    let lastBytes = 0;
    let currentProgress = initialProgress;
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        const finalProgress = createCompletedProgress(video.id, format.id, totalSize);
        onProgressUpdate(finalProgress);
        
        await saveDownloadedFile(response, video.title, format.extension || 'mp4');
        break;
      }
      
      receivedLength += value.length;
      
      currentProgress = updateDownloadProgress(
        currentProgress,
        receivedLength,
        totalSize,
        lastUpdate,
        lastBytes
      );
      
      // Update timing values for next iteration
      const now = Date.now();
      if (now - lastUpdate > 500) {
        lastUpdate = now;
        lastBytes = receivedLength;
      }
      
      onProgressUpdate(currentProgress);
    }
  } catch (error) {
    console.error('Download error:', error);
    
    onProgressUpdate(createFailedProgress(video.id, format.id, format.filesize || 0));
    throw error;
  }
}

async function saveDownloadedFile(
  response: Response, 
  title: string, 
  extension: string
): Promise<void> {
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  
  const filename = `${title}.${extension}`.replace(/[^a-z0-9.]/gi, '_');
  a.download = filename;
  
  document.body.appendChild(a);
  a.click();
  
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

/**
 * Control active downloads (pause, resume, cancel)
 */
export function controlDownload(
  downloadId: string, 
  action: 'pause' | 'resume' | 'cancel'
): void {
  console.log(`${action} download: ${downloadId}`);
}
