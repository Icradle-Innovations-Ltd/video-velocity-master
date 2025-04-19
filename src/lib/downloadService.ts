
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

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;

    const title = video.title.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${title}.${format.extension || 'mp4'}`;
    a.download = filename;

    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    const completedProgress = createCompletedProgress(video.id, format.id, total);
    onProgressUpdate(completedProgress);

  } catch (error) {
    console.error('Download error:', error);

    onProgressUpdate(createFailedProgress(video.id, format.id, format.filesize || 0));
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
