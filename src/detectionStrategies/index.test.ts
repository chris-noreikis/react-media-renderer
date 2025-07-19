import { detectMediaType } from './index';
import { DetectionStrategy, MediaType } from '../types';
import { getMediaTypeFromExtension } from './fileExtension';
import { getMediaTypeFromContentType } from './contentType';
import { getMediaTypeFromZeroByteGet } from './zeroByteGet';

jest.mock('./fileExtension', () => ({
  MediaType: {
    image: 'image',
    video: 'video',
  },
  getMediaTypeFromExtension: jest.fn(),
}));

jest.mock('./contentType', () => ({
  getMediaTypeFromContentType: jest.fn(),
}));

jest.mock('./zeroByteGet', () => ({
  getMediaTypeFromZeroByteGet: jest.fn(),
}));

describe('detectMediaType', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call getMediaTypeFromExtension and return result', async () => {
    (getMediaTypeFromExtension as jest.Mock).mockReturnValue(MediaType.image);

    const result = await detectMediaType(
      'https://example.com/image.jpg',
      "fileExtension" as DetectionStrategy
    );

    expect(getMediaTypeFromExtension).toHaveBeenCalledWith(
      'https://example.com/image.jpg'
    );
    expect(result).toBe(MediaType.image);
  });

  it('should call getMediaTypeFromContentType and return result', async () => {
    (getMediaTypeFromContentType as jest.Mock).mockResolvedValue(
      MediaType.image
    );

    const result = await detectMediaType(
      'https://example.com/media',
      "contentTypeHeader"
    );

    expect(getMediaTypeFromContentType).toHaveBeenCalledWith(
      'https://example.com/media'
    );
    expect(result).toBe(MediaType.image);
  });

  it('should call getMediaTypeFromZeroByteGet and return result', async () => {
    (getMediaTypeFromZeroByteGet as jest.Mock).mockResolvedValue(
      MediaType.video
    );

    const result = await detectMediaType(
      'https://example.com/media',
      "zeroByteGet"
    );

    expect(getMediaTypeFromZeroByteGet).toHaveBeenCalledWith(
      'https://example.com/media'
    );
    expect(result).toBe(MediaType.video);
  });

  it('should throw error for unknown detection method', async () => {
    const unknownMethod = 'unknownMethod' as DetectionStrategy;

    await expect(
      detectMediaType('https://example.com/media', unknownMethod)
    ).rejects.toThrow('Unknown detection method: unknownMethod');
  });
});
