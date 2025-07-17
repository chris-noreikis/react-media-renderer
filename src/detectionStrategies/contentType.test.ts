import { getMediaTypeFromContentType } from './contentType';

import { MediaType } from './fileExtension';

global.fetch = jest.fn();

describe('getMediaTypeFromContentType', () => {
  type SetupArgs = {
    url: string;
    contentType?: string | null;
    ok?: boolean;
    status?: number;
    shouldThrow?: boolean;
    error?: Error;
  };

  const setup = ({ url, contentType, ok = true, status = 200, shouldThrow = false, error }: SetupArgs) => {
    if (shouldThrow && error) {
      (global.fetch as jest.Mock).mockRejectedValue(error);
    } else {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok,
        status,
        headers: {
          get: (header: string) =>
            header === 'Content-Type' ? contentType : null,
        },
      });
    }
    return getMediaTypeFromContentType(url);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('when content type is image', () => {
    it('should return MediaType.image for image/png', async () => {
      const result = await setup({
        url: 'https://example.com/image.png',
        contentType: 'image/png'
      });
      expect(result).toBe(MediaType.image);
    });

    it('should return MediaType.image for image/jpeg', async () => {
      const result = await setup({
        url: 'https://example.com/image.jpg',
        contentType: 'image/jpeg'
      });
      expect(result).toBe(MediaType.image);
    });

    it('should return MediaType.image for any image/* content type', async () => {
      const result = await setup({
        url: 'https://example.com/image.webp',
        contentType: 'image/webp'
      });
      expect(result).toBe(MediaType.image);
    });
  });

  describe('when content type is video', () => {
    it('should return MediaType.video for video/mp4', async () => {
      const result = await setup({
        url: 'https://example.com/video.mp4',
        contentType: 'video/mp4'
      });
      expect(result).toBe(MediaType.video);
    });

    it('should return MediaType.video for video/webm', async () => {
      const result = await setup({
        url: 'https://example.com/video.webm',
        contentType: 'video/webm'
      });
      expect(result).toBe(MediaType.video);
    });

    it('should return MediaType.video for any video/* content type', async () => {
      const result = await setup({
        url: 'https://example.com/video.ogg',
        contentType: 'video/ogg'
      });
      expect(result).toBe(MediaType.video);
    });
  });

  describe('when content type is unsupported', () => {
    it('should return null and log error for unsupported content type', async () => {
      const result = await setup({
        url: 'https://example.com/document.pdf',
        contentType: 'application/pdf'
      });
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'Unsupported media type:',
        'application/pdf'
      );
    });

    it('should return null and log error when content type is null', async () => {
      const result = await setup({
        url: 'https://example.com/unknown',
        contentType: null
      });
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'Unsupported media type:',
        null
      );
    });
  });

  describe('when fetch fails', () => {
    it('should return null and log error when response is not ok', async () => {
      const result = await setup({
        url: 'https://example.com/notfound',
        ok: false,
        status: 404
      });
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'Failed to fetch content type:',
        404
      );
    });

    it('should return null and log error when fetch throws', async () => {
      const error = new Error('Network error');
      const result = await setup({
        url: 'https://example.com/error',
        shouldThrow: true,
        error
      });
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching content type:',
        error
      );
    });
  });

  describe('fetch call verification', () => {
    it('should call fetch with HEAD method', async () => {
      const src = 'https://example.com/image.png';
      await setup({
        url: src,
        contentType: 'image/png'
      });

      expect(global.fetch).toHaveBeenCalledWith(src, { method: 'HEAD' });
    });
  });
});
