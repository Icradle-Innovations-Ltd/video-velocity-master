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
    const response = await fetch('http://localhost:5000/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: video.url, format: format.id }),
    });

    if (!response.ok) {
      throw new Error('Failed to start download');
    }

    const result = await response.json();
    console.log('Download started:', result);
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
}

/**
 * Control active downloads (pause, resume, cancel)-/
 */
export function controlDownload(
  downloadId: string, 
  action: 'pause' | 'resume' | 'cancel'
): void {
  console.log(`${action} download: ${downloadId}`);
}
