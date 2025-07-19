import { MediaType } from '../types';
import { getMediaTypeFromContentType } from '../utils';

export const zeroByteGet = async (
  src: string
): Promise<MediaType | null> => {
  try {
    const response = await fetch(src, { 
      method: 'GET',
      headers: {
        'Range': 'bytes=0-0'
      }
    });
    const partialObjectStatusCode = 206;
    if (response.ok || response.status === partialObjectStatusCode) {
      const contentType = response.headers.get('Content-Type');
      return getMediaTypeFromContentType(contentType);
    } else {
      console.error('Failed to fetch content type:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Error fetching content type:', error);
    return null;
  }
};
