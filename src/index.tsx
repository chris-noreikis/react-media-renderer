import React, {useState, useEffect} from 'react';

interface MediaRendererProps {
    src: string;
}

export enum MediaType {
    image = "image",
    video = "video"
}

const MediaRenderer: React.FC<MediaRendererProps> = ({src}) => {
    const [mediaType, setMediaType] = useState<MediaType | null>(null);

    const checkMediaAvailability = async () => {
        try {
            const response = await fetch(src, {method: 'HEAD'});
            console.log('HEAD response:', response.headers.get('Content-Type'));
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentType = response.headers.get('Content-Type');
            if (contentType?.startsWith('image/')) {
                setMediaType(MediaType.image);
            } else if (contentType?.startsWith('video/')) {
                setMediaType(MediaType.video);
            } else {
                console.error('Unsupported media type:', contentType);
            }
        } catch (err) {
            console.error(`Failed to load mediaType ${src}`);
        }
    };

    useEffect(() => {
        checkMediaAvailability();
    }, [src]);


    return mediaType === MediaType.image && <img src={src}/>
};

export default MediaRenderer;
