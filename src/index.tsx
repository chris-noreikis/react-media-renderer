import React, { useState, useEffect } from 'react';
import { detectMediaType, DetectionStrategy, MediaType } from './detectionStrategies';

export { DetectionStrategy, MediaType } from './detectionStrategies';

interface MediaRendererProps extends React.HTMLAttributes<HTMLElement> {
  src: string;
  imageProps?: React.ImgHTMLAttributes<HTMLImageElement>;
  videoProps?: React.VideoHTMLAttributes<HTMLVideoElement>;
  detectionStrategy?: DetectionStrategy;
}

const MediaRenderer: React.FC<MediaRendererProps> = ({ 
  src, 
  imageProps, 
  videoProps, 
  detectionStrategy = DetectionStrategy.fileExtension,
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
    return <img src={src} {...props} {...imageProps} />;
  } else if (mediaType === MediaType.video) {
    return <video src={src} {...props} {...videoProps} />;
  }
  return null;
};

export default MediaRenderer;
