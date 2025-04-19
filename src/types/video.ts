
export interface VideoMetadata {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  formats: VideoFormat[];
  url: string;
  uploadDate?: string;
  viewCount?: number;
}

export interface VideoFormat {
  id: string;
  quality: string; // e.g., "1080p", "720p", "360p"
  extension: string; // e.g., "mp4", "webm"
  resolution?: string; // e.g., "1920x1080"
  fps?: number;
  audioQuality?: string;
  filesize?: number; // in bytes
  bitrate?: number; // in bps
  codec?: string;
  container?: string;
  isAudioOnly?: boolean;
}

export interface DownloadProgress {
  videoId: string;
  progress: number; // 0-100
  downloaded: number; // bytes downloaded
  total: number; // total bytes
  speed: number; // bytes per second
  eta: number; // seconds remaining
  status: DownloadStatus;
  formatId: string;
  chunks?: {
    id: number;
    progress: number;
    status: "pending" | "downloading" | "completed" | "failed";
  }[];
}

export type DownloadStatus = 
  | "queued" 
  | "downloading" 
  | "paused" 
  | "completed" 
  | "failed" 
  | "canceled";

export interface DownloadSettings {
  maxConcurrentDownloads: number;
  threadsPerDownload: number;
  chunkSize: number; // in bytes
  defaultSaveLocation: string;
  bandwidthLimit: number; // percentage of total bandwidth
  proxyEnabled: boolean;
  proxyAddress?: string;
  proxyPort?: number;
  proxyUsername?: string;
  proxyPassword?: string;
  preferredQuality: "highest" | "medium" | "lowest" | "custom";
  preferredFormat: string;
  downloadThumbnail: boolean;
  useSystemProxy: boolean;
  autoConvertFormat: boolean;
  targetFormat?: string;
}

export interface DownloadHistoryItem {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  url: string;
  format: string;
  quality: string;
  filesize: number;
  downloadDate: Date;
  filepath: string;
  duration: number;
  completionTime: number; // Time it took to download (seconds)
  averageSpeed: number; // Average download speed (bytes/second)
}
