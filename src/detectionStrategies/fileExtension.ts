export enum MediaType {
  image = 'image',
  video = 'video',
}

const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'];
const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv', '.mkv'];

export const getMediaTypeFromExtension = (src: string): MediaType | null => {
  const url = new URL(src);
  const pathname = url.pathname.toLowerCase();

  if (imageExtensions.some(ext => pathname.endsWith(ext))) {
    return MediaType.image;
  }

  if (videoExtensions.some(ext => pathname.endsWith(ext))) {
    return MediaType.video;
  }

  return null;
};