import { VideoFormat, VideoMetadata } from '@/types/video';
import { VideoMetadata } from '@/types/video';

/**
 * Fetch video metadata from a URL
 */
export async function fetchVideoMetadata(url: string): Promise<VideoMetadata[]> {
  try {
    const response = await fetch('http://localhost:5000/metadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch video metadata from backend');
    }

    const data = await response.json();
    if (!data || !data.title || !data.formats) {
      throw new Error('Invalid metadata received from backend');
    }

    const formats: VideoFormat[] = data.formats.map((f: any) => ({
      id: f.itag.toString(),
      quality: f.qualityLabel,
      extension: '', // You might need to determine this based on the format
      resolution: '', // You might need to determine this based on the format
      filesize: 0, // Not provided by the backend in this example
      mimeType: '', // Not provided by the backend in this example
      hasAudio: true,
      hasVideo: true,
    }));

    return [{
      id: Math.random().toString(36).substring(2, 15),
      title: data.title,
      formats: formats,
      url: url,
      thumbnail: '', // Not provided by the backend in this example
    }];
  } catch (error) {
    console.error('Error fetching video metadata:', error);
    throw error;
  }
}
