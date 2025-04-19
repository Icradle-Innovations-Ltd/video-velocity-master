export async function fetchVideoMetadata(url: string): Promise<any> {
  try {
    const response = await fetch('http://localhost:5000/metadata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch metadata');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching video metadata:', error);
    throw error;
  }
}

export { downloadVideo, controlDownload } from './downloadService';
