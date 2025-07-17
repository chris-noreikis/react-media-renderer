import React, { useState, useEffect } from 'react';

interface MediaRendererProps extends React.HTMLAttributes<HTMLElement> {
  src: string;
}

export enum MediaType {
  image = 'image',
  video = 'video',
}

const MediaRenderer: React.FC<MediaRendererProps> = ({ src, ...props }) => {
  const [mediaType, setMediaType] = useState<MediaType | null>(null);

  const fetchContentType = async () => {
    const response = await fetch(src, { method: 'HEAD' });
    if (response.ok) {
      const contentType = response.headers.get('Content-Type');
      if (contentType?.startsWith('image/')) {
        setMediaType(MediaType.image);
      } else if (contentType?.startsWith('video/')) {
        setMediaType(MediaType.video);
      } else {
        console.error('Unsupported media type:', contentType);
      }
    }
  };

  useEffect(() => {
    fetchContentType();
  }, [src]);

  if (mediaType === MediaType.image) {
    return <img src={src} {...props} />;
  } else if (mediaType === MediaType.video) {
    return <video src={src} {...props} />;
  }
  return null;
};

export default MediaRenderer;
