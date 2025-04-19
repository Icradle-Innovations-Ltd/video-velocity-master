
import { VideoMetadata, DownloadProgress, DownloadHistoryItem } from '@/types/video';

// Mock video metadata for demonstration
export const mockVideos: VideoMetadata[] = [
  {
    id: 'video1',
    title: 'Amazing Nature Documentary - 4K Ultra HD',
    thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1440&q=80',
    duration: 3625, // 1:00:25
    url: 'https://example.com/video1',
    uploadDate: '2023-11-15',
    viewCount: 1250000,
    formats: [
      {
        id: 'format1',
        quality: '4K',
        extension: 'mp4',
        resolution: '3840x2160',
        fps: 60,
        filesize: 4500000000, // 4.5GB
        bitrate: 15000000,
        codec: 'h264',
        container: 'mp4',
        isAudioOnly: false
      },
      {
        id: 'format2',
        quality: '1080p',
        extension: 'mp4',
        resolution: '1920x1080',
        fps: 60,
        filesize: 1500000000, // 1.5GB
        bitrate: 8000000,
        codec: 'h264',
        container: 'mp4',
        isAudioOnly: false
      },
      {
        id: 'format3',
        quality: '720p',
        extension: 'mp4',
        resolution: '1280x720',
        fps: 30,
        filesize: 800000000, // 800MB
        bitrate: 5000000,
        codec: 'h264',
        container: 'mp4',
        isAudioOnly: false
      },
      {
        id: 'format4',
        quality: '480p',
        extension: 'mp4',
        resolution: '854x480',
        fps: 30,
        filesize: 400000000, // 400MB
        bitrate: 2500000,
        codec: 'h264',
        container: 'mp4',
        isAudioOnly: false
      },
      {
        id: 'format5',
        quality: 'High',
        extension: 'mp3',
        audioQuality: '128kbps',
        filesize: 45000000, // 45MB
        bitrate: 128000,
        isAudioOnly: true
      }
    ]
  },
  {
    id: 'video2',
    title: 'Programming Tutorial - Learn TypeScript in 2 Hours',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1440&q=80',
    duration: 7210, // 2:00:10
    url: 'https://example.com/video2',
    uploadDate: '2023-09-20',
    viewCount: 520000,
    formats: [
      {
        id: 'format1',
        quality: '1080p',
        extension: 'mp4',
        resolution: '1920x1080',
        fps: 30,
        filesize: 1200000000, // 1.2GB
        bitrate: 6000000,
        codec: 'h264',
        container: 'mp4',
        isAudioOnly: false
      },
      {
        id: 'format2',
        quality: '720p',
        extension: 'mp4',
        resolution: '1280x720',
        fps: 30,
        filesize: 600000000, // 600MB
        bitrate: 3000000,
        codec: 'h264',
        container: 'mp4',
        isAudioOnly: false
      },
      {
        id: 'format3',
        quality: '360p',
        extension: 'mp4',
        resolution: '640x360',
        fps: 30,
        filesize: 250000000, // 250MB
        bitrate: 1500000,
        codec: 'h264',
        container: 'mp4',
        isAudioOnly: false
      },
      {
        id: 'format4',
        quality: 'High',
        extension: 'mp3',
        audioQuality: '192kbps',
        filesize: 85000000, // 85MB
        bitrate: 192000,
        isAudioOnly: true
      }
    ]
  }
];

// Mock download progress
export const mockDownloads: DownloadProgress[] = [
  {
    videoId: 'video1',
    progress: 45,
    downloaded: 675000000,
    total: 1500000000,
    speed: 5242880, // 5MB/s
    eta: 180, // 3 minutes
    status: 'downloading',
    formatId: 'format2',
    chunks: [
      { id: 1, progress: 100, status: 'completed' },
      { id: 2, progress: 100, status: 'completed' },
      { id: 3, progress: 80, status: 'downloading' },
      { id: 4, progress: 40, status: 'downloading' },
      { id: 5, progress: 0, status: 'pending' },
      { id: 6, progress: 0, status: 'pending' },
      { id: 7, progress: 0, status: 'pending' },
      { id: 8, progress: 0, status: 'pending' }
    ]
  },
  {
    videoId: 'video2',
    progress: 100,
    downloaded: 600000000,
    total: 600000000,
    speed: 0,
    eta: 0,
    status: 'completed',
    formatId: 'format2'
  },
  {
    videoId: 'video3',
    progress: 75,
    downloaded: 300000000,
    total: 400000000,
    speed: 0,
    eta: 0,
    status: 'paused',
    formatId: 'format3'
  }
];

// Mock download history
export const mockHistory: DownloadHistoryItem[] = [
  {
    id: 'history1',
    videoId: 'video2',
    title: 'Programming Tutorial - Learn TypeScript in 2 Hours',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1440&q=80',
    url: 'https://example.com/video2',
    format: 'mp4',
    quality: '720p',
    filesize: 600000000,
    downloadDate: new Date('2023-12-25T14:30:00'),
    filepath: '/downloads/typescript-tutorial.mp4',
    duration: 7210,
    completionTime: 120,
    averageSpeed: 5000000
  },
  {
    id: 'history2',
    videoId: 'video3',
    title: 'Epic Space Documentary - Journey to the Stars',
    thumbnail: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&auto=format&fit=crop&w=1440&q=80',
    url: 'https://example.com/video3',
    format: 'mp4',
    quality: '1080p',
    filesize: 1800000000,
    downloadDate: new Date('2023-12-20T10:15:00'),
    filepath: '/downloads/space-documentary.mp4',
    duration: 5400,
    completionTime: 360,
    averageSpeed: 5000000
  },
  {
    id: 'history3',
    videoId: 'video4',
    title: 'Relaxing Music for Study and Focus - 3 Hours',
    thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1440&q=80',
    url: 'https://example.com/video4',
    format: 'mp3',
    quality: 'High',
    filesize: 150000000,
    downloadDate: new Date('2023-12-18T20:45:00'),
    filepath: '/downloads/study-music.mp3',
    duration: 10800,
    completionTime: 45,
    averageSpeed: 3333333
  }
];
