
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

    return [{
      title: data.title,
      formats: data.formats,
      url: url,
    } as VideoMetadata];
  } catch (error) {
    console.error('Error fetching video metadata:', error);
    throw error;
  }
}
