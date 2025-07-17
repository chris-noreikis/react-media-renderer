import React from 'react';
import {render, screen} from '@testing-library/react';
import MediaRenderer from './index';

describe('MediaRenderer', () => {
    describe('Loading an image', () => {
        it('should render an image when the result of HEAD is prefixed by image/', async () => {
            const mockFetch = jest.fn().mockResolvedValue({
                headers: {
                    get: (header: string) => ({
                        'Content-Type': 'image/jpeg'
                    })[header]
                },
                ok: true,
            });
            global.fetch = mockFetch;
            const imageSrc = "https://image_src_1.com/";
            render(<MediaRenderer src={imageSrc}/>);
            expect(await screen.findByRole('img')).toHaveProperty('src', imageSrc);
        });
    });
});