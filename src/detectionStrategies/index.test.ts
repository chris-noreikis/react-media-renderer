import { detectMediaType } from './index';
import { MediaType } from './fileExtension';
import { DetectionStrategy } from '../types';
import { getMediaTypeFromExtension } from './fileExtension';
import { getMediaTypeFromContentType } from './contentType';

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
      DetectionStrategy.fileExtension
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
      DetectionStrategy.contentType
    );

    expect(getMediaTypeFromContentType).toHaveBeenCalledWith(
      'https://example.com/media'
    );
    expect(result).toBe(MediaType.image);
  });

  it('should throw error for unknown detection method', async () => {
    const unknownMethod = 'unknownMethod' as DetectionStrategy;

    await expect(
      detectMediaType('https://example.com/media', unknownMethod)
    ).rejects.toThrow('Unknown detection method: unknownMethod');
  });
});
