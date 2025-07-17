import React, { useState, useEffect } from 'react';
import { detectMediaType, DetectionStrategy } from './detectionStrategies';
import { MediaType } from './types';

interface MediaRendererProps extends React.HTMLAttributes<HTMLElement> {
  src: string;
  imageProps?: React.ImgHTMLAttributes<HTMLImageElement>;
  videoProps?: React.VideoHTMLAttributes<HTMLVideoElement>;
  detectionStrategy?: DetectionStrategy;
  renderImage?: (props: { src: string; imageProps?: React.ImgHTMLAttributes<HTMLImageElement>; [key: string]: any }) => React.ReactNode;
  renderVideo?: (props: { src: string; videoProps?: React.VideoHTMLAttributes<HTMLVideoElement>; [key: string]: any }) => React.ReactNode;
}

const MediaRenderer: React.FC<MediaRendererProps> = ({ 
  src, 
  imageProps, 
  videoProps, 
  detectionStrategy = 'fileExtension',
  renderImage,
  renderVideo,
  ...props 
}) => {
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
