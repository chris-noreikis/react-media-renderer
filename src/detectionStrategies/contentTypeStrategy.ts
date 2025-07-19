import { MediaType } from '../types';
import { getMediaTypeFromContentType } from '../utils';

export const contentTypeStrategy = async (
  src: string
): Promise<MediaType | null> => {
  try {
    const response = await fetch(src, { method: 'HEAD' });
    if (response.ok) {
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
