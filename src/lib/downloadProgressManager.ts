
import { VideoFormat, DownloadProgress } from '@/types/video';

export function createInitialProgress(
  videoId: string, 
  formatId: string, 
  total: number
): DownloadProgress {
  return {
    videoId,
    progress: 0,
    downloaded: 0,
    total,
    speed: 0,
    eta: 0,
    status: 'downloading',
    formatId,
    chunks: Array.from({ length: 8 }, (_, i) => ({
      id: i,
      progress: 0,
      status: i === 0 ? 'downloading' : 'pending'
    }))
  };
}

export function updateDownloadProgress(
  progress: DownloadProgress,
  receivedLength: number,
  totalSize: number,
  lastUpdate: number,
  lastBytes: number
): DownloadProgress {
  const now = Date.now();
  const timeDiff = (now - lastUpdate) / 1000;
  const currentProgress = Math.round((receivedLength / totalSize) * 100);
  
  let speed = 0;
  if (timeDiff > 0.5) {
    const bytesDiff = receivedLength - lastBytes;
    speed = Math.round(bytesDiff / timeDiff);
  }
  
  const remainingBytes = totalSize - receivedLength;
  const eta = speed > 0 ? Math.round(remainingBytes / speed) : 0;
  
  // Update chunks progress
  const chunks = progress.chunks || [];
  const activeChunkCount = Math.ceil((currentProgress / 100) * chunks.length);
  
  const updatedChunks = chunks.map((chunk, index) => {
    if (index < activeChunkCount - 1) {
      return { ...chunk, progress: 100, status: 'completed' as const };
    } else if (index === activeChunkCount - 1) {
      const chunkProgress = (currentProgress % (100 / chunks.length)) * (chunks.length);
      return { 
        ...chunk, 
        progress: Math.min(chunkProgress, 100), 
        status: 'downloading' as const 
      };
    } else if (index === activeChunkCount) {
      return { ...chunk, status: 'pending' as const, progress: 0 };
    } else {
      return { ...chunk, status: 'pending' as const, progress: 0 };
    }
  });
  
  return {
    ...progress,
    progress: currentProgress,
    downloaded: receivedLength,
    total: totalSize,
    speed,
    eta,
    chunks: updatedChunks
  };
}

export function createCompletedProgress(
  videoId: string,
  formatId: string,
  total: number,
  chunks: number = 8
): DownloadProgress {
  return {
    videoId,
    progress: 100,
    downloaded: total,
    total,
    speed: 0,
    eta: 0,
    status: 'completed',
    formatId,
    chunks: Array.from({ length: chunks }, () => ({
      id: 0,
      progress: 100,
      status: 'completed'
    }))
  };
}

export function createFailedProgress(
  videoId: string,
  formatId: string,
  total: number
): DownloadProgress {
  return {
    videoId,
    progress: 0,
    downloaded: 0,
    total,
    speed: 0,
    eta: 0,
    status: 'failed',
    formatId
  };
}
