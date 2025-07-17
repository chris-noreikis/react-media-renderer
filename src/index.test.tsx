import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import MediaRenderer from './index';

describe('MediaRenderer', () => {
    type SetupArgs = {
        src: string;
        contentType: string;
    }
    const setup = ({src, contentType}: SetupArgs) => {
        global.fetch = jest.fn().mockResolvedValue({
            headers: {
                get: (header: string) => ({
                    'Content-Type': contentType
                })[header]
            },
            ok: true,
        });
        render(<MediaRenderer src={src}/>);
    }
    it('should render an image when the result of HEAD is prefixed by image/', async () => {
        const src = "https://image_src_1.com/";
        setup({src, contentType: "image/png"});
        expect(await screen.findByRole('img')).toHaveProperty('src', src);
    });

    it('should render a video when the result of HEAD is prefixed by video/', async () => {
        const src = "https://vide_src_1.com/";
        setup({src, contentType: "video/mp4"});

        await waitFor(() => expect(document.querySelector('video')).toBeInTheDocument());
        expect(document.querySelector('video')).toHaveProperty('src', src);
    });

    it('should not render anything for unsupported content types', async () => {
        global.console.error = jest.fn();
        const contentType = "application/pdf";
        setup({src: "https://example.com/document.pdf", contentType});
        await waitFor(() => expect(console.error).toHaveBeenCalledWith('Unsupported media type:', contentType));
    });
});
