
import { VideoMetadata } from '@/types/video';

/**
 * Fetch video metadata from a URL
 */
export async function fetchVideoMetadata(url: string): Promise<VideoMetadata[]> {
  try {
    // Log the URL for debugging
    console.log('Fetching metadata for URL:', url);
    
    // Create mock data - in a real implementation this would call your backend API
    const videoId = `video_${Date.now()}`;
    
    const video: VideoMetadata = {
      id: videoId,
      title: `Video from ${url}`,
      thumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&auto=format&fit=crop&w=1440&q=80',
      duration: 300,
      url: url,
      formats: [
        {
          id: 'format_1080p',
          quality: '1080p',
          extension: 'mp4',
          resolution: '1920x1080',
          filesize: 50 * 1024 * 1024,
          codec: 'h264'
        },
        {
          id: 'format_720p',
          quality: '720p',
          extension: 'mp4',
          resolution: '1280x720',
          filesize: 30 * 1024 * 1024,
          codec: 'h264'
        },
        {
          id: 'format_480p',
          quality: '480p',
          extension: 'mp4',
          resolution: '854x480',
          filesize: 15 * 1024 * 1024,
          codec: 'h264'
        },
        {
          id: 'format_audio',
          quality: 'High',
          extension: 'mp3',
          filesize: 5 * 1024 * 1024,
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
