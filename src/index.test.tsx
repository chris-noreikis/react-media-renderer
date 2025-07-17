import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MediaRenderer from './index';

describe('MediaRenderer', () => {
  type SetupArgs = {
    src: string;
    contentType: string;
    props?: object;
  };

  const setup = ({ src, contentType, props }: SetupArgs) => {
    global.fetch = jest.fn().mockResolvedValue({
      headers: {
        get: (header: string) =>
          ({
            'Content-Type': contentType,
          })[header],
      },
      ok: true,
    });
    render(<MediaRenderer src={src} {...props} />);
  };

  const testProps = {
    id: 'some-html-id',
    className: 'video-class',
  };

  describe('when rendering images', () => {
    const imageSrc = 'https://image_src_1.com/';
    const contentType = 'image/png';

    it('should render an image when the result of HEAD is prefixed by image/', async () => {
      setup({ src: imageSrc, contentType: contentType });
      expect(await screen.findByRole('img')).toHaveProperty('src', imageSrc);
    });

    it('should spread additional props to img element', async () => {
      setup({ src: imageSrc, contentType: contentType, props: testProps });
      expect(await screen.findByRole('img')).toEqual(
        expect.objectContaining(testProps)
      );
    });
  });

  describe('when rendering videos', () => {
    const videoSrc = 'https://vide_src_1.com/';
    const videoContentType = 'video/mp4';

    it('should render a video when the result of HEAD is prefixed by video/', async () => {
      setup({ src: videoSrc, contentType: videoContentType });

      await waitFor(() =>
        expect(document.querySelector('video')).toBeInTheDocument()
      );
      expect(document.querySelector('video')).toHaveProperty('src', videoSrc);
    });

    it('should spread additional props to video element', async () => {
      setup({ src: videoSrc, contentType: videoContentType, props: testProps });

      await waitFor(() =>
        expect(document.querySelector('video')).toBeInTheDocument()
      );
      const video = document.querySelector('video');
      expect(video).toEqual(expect.objectContaining(testProps));
    });
  });

  describe('when handling unsupported content types', () => {
    it('should not render anything for unsupported content types', async () => {
      global.console.error = jest.fn();
      const contentType = 'application/pdf';
      setup({ src: 'https://example.com/document.pdf', contentType });
      await waitFor(() =>
        expect(console.error).toHaveBeenCalledWith(
          'Unsupported media type:',
          contentType
        )
      );
    });
  });
});
