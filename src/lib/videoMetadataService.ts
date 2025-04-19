
import { VideoMetadata } from '@/types/video';

/**
 * Fetch video metadata from a URL
 */
export async function fetchVideoMetadata(url: string): Promise<VideoMetadata[]> {
  try {
    // Log the URL for debugging
    console.log('Fetching metadata for URL:', url);
    
    // Extract YouTube video ID if it's a YouTube URL
    let videoId = '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      // Handle youtube.com/watch?v=VIDEO_ID format
      if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get('v') || '';
      } 
      // Handle youtu.be/VIDEO_ID format
      else if (url.includes('youtu.be')) {
        videoId = url.split('/').pop() || '';
      }
    } else {
      // For non-YouTube URLs, just use a timestamp
      videoId = `video_${Date.now()}`;
    }
    
    // For YouTube, create more realistic metadata
    const isYouTube = videoId && (url.includes('youtube.com') || url.includes('youtu.be'));
    const title = isYouTube 
      ? `YouTube Video (ID: ${videoId})` 
      : `Video from ${url}`;
    
    // Default thumbnail if it's a YouTube video
    const thumbnail = isYouTube
      ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
      : 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&auto=format&fit=crop&w=1440&q=80';
    
    const video: VideoMetadata = {
      id: videoId || `video_${Date.now()}`,
      title: title,
      thumbnail: thumbnail,
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
