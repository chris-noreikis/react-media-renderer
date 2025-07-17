import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MediaRenderer, { DetectionStrategy } from './index';

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
    render(
      <MediaRenderer
        src={src}
        detectionStrategy={DetectionStrategy.contentType}
        {...props}
      />
    );
  };

  const testProps = {
    id: 'some-html-id',
    className: 'video-class',
  };

  describe('when rendering images', () => {
    const imageSrc = 'https://image_src_1.com/';
    const contentType = 'image/png';
    const imageProps = { alt: 'test image', loading: 'lazy' as const };

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

    it('should apply imageProps to img element', async () => {
      setup({ src: imageSrc, contentType: contentType, props: { imageProps } });
      const img = await screen.findByRole('img');
      expect({
        alt: img.getAttribute('alt'),
        loading: img.getAttribute('loading'),
      }).toEqual(imageProps);
    });

    it('should apply both general props and imageProps to img element', async () => {
      const imageProps = { alt: 'test image' };
      const generalProps = { className: 'general-class' };
      setup({
        src: imageSrc,
        contentType: contentType,
        props: { ...generalProps, imageProps },
      });
      const img = await screen.findByRole('img');
      expect(img).toEqual(
        expect.objectContaining({ ...generalProps, ...imageProps })
      );
    });

    describe('when using a render prop for image', () => {
      let renderImage: jest.Mock;
      beforeEach(() => {
        renderImage = jest
          .fn()
          .mockReturnValue(<div data-testid="custom-image">Custom Image</div>);
        setup({
          src: imageSrc,
          contentType: contentType,
          props: { renderImage, imageProps, ...testProps },
        });
      });

      it('should render the custom prop', async () => {
        expect(await screen.findByTestId('custom-image')).toBeInTheDocument();
      });

      it('should not render the original image tag', () => {
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
      });

      it('should pass imageProps and other props to renderImage', async () => {
        expect(renderImage).toHaveBeenCalledWith({
          src: imageSrc,
          imageProps,
          ...testProps,
        });
      });
    });
  });

  describe('when rendering videos', () => {
    const videoSrc = 'https://vide_src_1.com/';
    const videoContentType = 'video/mp4';
    const videoProps = { controls: true };

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

    it('should apply videoProps to video element', async () => {
      const videoProps = { controls: true, autoPlay: true };
      setup({
        src: videoSrc,
        contentType: videoContentType,
        props: { videoProps },
      });

      await waitFor(() =>
        expect(document.querySelector('video')).toBeInTheDocument()
      );
      const video = document.querySelector('video');
      expect({
        controls: video?.controls,
        autoPlay: video?.autoplay,
      }).toEqual(videoProps);
    });

    it('should apply both general props and videoProps to video element', async () => {
      const generalProps = { className: 'general-class' };
      setup({
        src: videoSrc,
        contentType: videoContentType,
        props: { ...generalProps, videoProps },
      });

      await waitFor(() =>
        expect(document.querySelector('video')).toBeInTheDocument()
      );
      const video = document.querySelector('video');
      expect(video).toEqual(
        expect.objectContaining({ ...generalProps, ...videoProps })
      );
    });

    describe('when using a render prop for video', () => {
      let renderVideo: jest.Mock;
      beforeEach(() => {
        renderVideo = jest
          .fn()
          .mockReturnValue(<div data-testid="custom-video">Custom Video</div>);
        setup({
          src: videoSrc,
          contentType: videoContentType,
          props: { renderVideo, ...testProps, videoProps },
        });
      });

      it('should render the custom element', async () => {
        expect(await screen.findByTestId('custom-video')).toBeInTheDocument();
      });

      it('should not render the original video tag', () => {
        expect(document.querySelector('video')).not.toBeInTheDocument();
      });

      it('should call the video render prop with all props to the original component', async () => {
        await waitFor(() =>
          expect(renderVideo).toHaveBeenCalledWith({
            src: videoSrc,
            videoProps: videoProps,
            ...testProps,
          })
        );
      });
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

  describe('integration with detection methods', () => {
    it('should use file extension detection by default', async () => {
      const src = 'https://example.com/image.jpg';
      render(<MediaRenderer src={src} />);
      expect(await screen.findByRole('img')).toHaveProperty('src', src);
    });

    it('should use content type detection when explicitly specified', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        headers: {
          get: () => 'video/mp4',
        },
        ok: true,
      });
      render(
        <MediaRenderer
          src="https://example.com/media"
          detectionStrategy={DetectionStrategy.contentType}
        />
      );
      await waitFor(() =>
        expect(document.querySelector('video')).toBeInTheDocument()
      );
    });

    it('should render image when using file extension detection', async () => {
      const src = 'https://example.com/image.jpg';
      render(
        <MediaRenderer
          src={src}
          detectionStrategy={DetectionStrategy.fileExtension}
        />
      );
      expect(await screen.findByRole('img')).toHaveProperty('src', src);
    });

    it('should render video when using file extension detection', async () => {
      const src = 'https://example.com/video.mp4';
      render(
        <MediaRenderer
          src={src}
          detectionStrategy={DetectionStrategy.fileExtension}
        />
      );
      await waitFor(() =>
        expect(document.querySelector('video')).toBeInTheDocument()
      );
      expect(document.querySelector('video')).toHaveProperty('src', src);
    });
  });
});
