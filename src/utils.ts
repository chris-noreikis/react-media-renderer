import { MediaType } from './types';

export const getMediaTypeFromContentType = (contentType: string | null): MediaType | null => {
  if (contentType?.startsWith('image/')) {
    return MediaType.image;
  } else if (contentType?.startsWith('video/')) {
    return MediaType.video;
  } else {
    console.error('Unsupported media type:', contentType);
    return null;
  }
};