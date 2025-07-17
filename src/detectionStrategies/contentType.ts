import { MediaType } from '../types';

export const getMediaTypeFromContentType = async (
  src: string
): Promise<MediaType | null> => {
  try {
    const response = await fetch(src, { method: 'HEAD' });
    if (response.ok) {
      const contentType = response.headers.get('Content-Type');
      if (contentType?.startsWith('image/')) {
        return MediaType.image;
      } else if (contentType?.startsWith('video/')) {
        return MediaType.video;
      } else {
        console.error('Unsupported media type:', contentType);
        return null;
      }
    } else {
      console.error('Failed to fetch content type:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Error fetching content type:', error);
    return null;
  }
};
