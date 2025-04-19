
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
    
    const response = await fetch('http://localhost:5000/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: video.url, format: format.id }),
    });

    if (!response.ok) {
      throw new Error('Failed to start download');
    }

    // Simulate download progress on the client-side for simplicity
    const simulateDownload = async () => {
      let currentProgress = initialProgress;
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate time delay
        const received = Math.round(total * (i / 100));
        currentProgress = updateDownloadProgress(currentProgress, received, total, Date.now(), received);
        onProgressUpdate(currentProgress);
      }
      const completedProgress = createCompletedProgress(video.id, format.id, total);
      onProgressUpdate(completedProgress);
    };

    simulateDownload();

  } catch (error) {
    console.error('Download error:', error);
    
    onProgressUpdate(createFailedProgress(video.id, format.id, format.filesize || 0));
    throw error;
  }
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
