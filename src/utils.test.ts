import { getMediaTypeFromContentType } from './utils';
import { MediaType } from './types';

describe('getMediaTypeFromContentType', () => {
  it('should return MediaType.image for image content types', () => {
    expect(getMediaTypeFromContentType('image/png')).toBe(MediaType.image);
    expect(getMediaTypeFromContentType('image/jpeg')).toBe(MediaType.image);
    expect(getMediaTypeFromContentType('image/gif')).toBe(MediaType.image);
  });

  it('should return MediaType.video for video content types', () => {
    expect(getMediaTypeFromContentType('video/mp4')).toBe(MediaType.video);
    expect(getMediaTypeFromContentType('video/webm')).toBe(MediaType.video);
    expect(getMediaTypeFromContentType('video/avi')).toBe(MediaType.video);
  });

  it('should return null for unsupported content types', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    expect(getMediaTypeFromContentType('text/plain')).toBe(null);
    expect(getMediaTypeFromContentType('application/json')).toBe(null);
    expect(getMediaTypeFromContentType(null)).toBe(null);
    
    expect(consoleSpy).toHaveBeenCalledWith('Unsupported media type:', 'text/plain');
    expect(consoleSpy).toHaveBeenCalledWith('Unsupported media type:', 'application/json');
    expect(consoleSpy).toHaveBeenCalledWith('Unsupported media type:', null);
    
    consoleSpy.mockRestore();
  });
});