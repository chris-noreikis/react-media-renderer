import { getMediaTypeFromExtension } from './fileExtension';
import { MediaType } from '../types';

describe('getMediaTypeFromExtension', () => {
  it.each(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'])(
    'should return MediaType.image for %s extension',
    extension => {
      const src = `https://example.com/image${extension}`;
      const result = getMediaTypeFromExtension(src);
      expect(result).toBe(MediaType.image);
    }
  );

  it.each(['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv', '.mkv'])(
    'should return MediaType.video for %s extension',
    extension => {
      const src = `https://example.com/video${extension}`;
      const result = getMediaTypeFromExtension(src);
      expect(result).toBe(MediaType.video);
    }
  );

  describe('for unsupported extensions', () => {
    it.each([
      ['unsupported file extension', 'https://example.com/document.pdf'],
      ['files without extension', 'https://example.com/document'],
      ['unknown extension', 'https://example.com/file.xyz'],
    ])('should return null for %s', (description, src) => {
      const result = getMediaTypeFromExtension(src);
      expect(result).toBeNull();
    });
  });

  describe('case insensitivity', () => {
    it.each([
      [
        'uppercase extensions',
        'https://example.com/image.JPG',
        MediaType.image,
      ],
      [
        'mixed case extensions',
        'https://example.com/video.Mp4',
        MediaType.video,
      ],
      [
        'all uppercase video extension',
        'https://example.com/video.WEBM',
        MediaType.video,
      ],
    ])('should handle %s', (description, src, expected) => {
      const result = getMediaTypeFromExtension(src);
      expect(result).toBe(expected);
    });
  });

  describe('URL parsing', () => {
    it.each([
      [
        'query parameters',
        'https://example.com/image.jpg?v=123&size=large',
        MediaType.image,
      ],
      ['hash fragments', 'https://example.com/video.mp4#t=30', MediaType.video],
      [
        'complex paths',
        'https://example.com/path/to/nested/folder/image.png',
        MediaType.image,
      ],
    ])('should work with %s', (description, src, expected) => {
      const result = getMediaTypeFromExtension(src);
      expect(result).toBe(expected);
    });
  });
});
