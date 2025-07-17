import React, {useState, useEffect} from 'react';

interface MediaRendererProps {
    src: string;
}

const MediaRenderer: React.FC<MediaRendererProps> = ({src}) => {
    const [media, setMedia] = useState<string>('');

    return (<div>foobar</div>);
};

export default MediaRenderer;
