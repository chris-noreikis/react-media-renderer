import React, { useState, useEffect } from 'react';
import { detectMediaType } from './detectionStrategies';
import { DetectionStrategy, MediaType } from './types';

interface MediaRendererProps extends React.HTMLAttributes<HTMLElement> {
  src: string;
  imageProps?: React.ImgHTMLAttributes<HTMLImageElement>;
  videoProps?: React.VideoHTMLAttributes<HTMLVideoElement>;
  detectionStrategy?: DetectionStrategy;
  renderImage?: (props: { src: string; imageProps?: React.ImgHTMLAttributes<HTMLImageElement>; [key: string]: any }) => React.ReactNode;
  renderVideo?: (props: { src: string; videoProps?: React.VideoHTMLAttributes<HTMLVideoElement>; [key: string]: any }) => React.ReactNode;
}

/**
 * A React component that automatically detects and renders media files as either images or videos.
 *
 * @param {string} src - The source URL of the media file to be rendered
 * @param {React.ImgHTMLAttributes<HTMLImageElement>} imageProps - Additional props to pass to the img element when rendering images
 * @param {React.VideoHTMLAttributes<HTMLVideoElement>} videoProps - Additional props to pass to the img element when rendering videos
 * @param {DetectionStrategy} detectionStrategy - Choose how to detect whether src is an image or video.  One of {fileExtension, contentType}.  Defaults to 'fileExtension'.
 * @param {function} renderImage - Custom render function for images. Receives {@link MediaRendererProps}
 * @param {function} renderVideo - Custom render function for videos. Receives {@link MediaRendererProps}
 * @param {React.HTMLAttributes<HTMLElement>} props - Arbitrary HTMLElement props spread to underlying element
 * @returns A rendered media element (img or video) or null if media type cannot be determined
 */
const MediaRenderer: React.FC<MediaRendererProps> = ({
  src,
  imageProps,
  videoProps,
  detectionStrategy = 'fileExtension',
  renderImage,
  renderVideo,
  ...props
}: MediaRendererProps) => {
  const [mediaType, setMediaType] = useState<MediaType | null>(null);

  useEffect(() => {
    const detectAndSetMediaType = async () => {
      const type = await detectMediaType(src, detectionStrategy);
      setMediaType(type);
    };

    detectAndSetMediaType();
  }, [src, detectionStrategy]);

  if (mediaType === MediaType.image) {
    if (renderImage) {
      return renderImage({ src, imageProps, ...props });
    }
    return <img src={src} {...props} {...imageProps} />;
  } else if (mediaType === MediaType.video) {
    if (renderVideo) {
      return renderVideo({ src, videoProps, ...props });
    }
    return <video src={src} {...props} {...videoProps} />;
  }
  return null;
};

export default MediaRenderer;
export { MediaType } from './types';
