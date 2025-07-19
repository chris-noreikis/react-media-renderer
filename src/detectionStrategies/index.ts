import {getMediaTypeFromExtension} from './fileExtension';
import { DetectionStrategy, MediaType } from '../types';
import {getMediaTypeFromContentType} from "./contentType";
import {getMediaTypeFromZeroByteGet} from "./zeroByteGet";

const getMediaTypeByMethod = async (
    src: string,
    detectionStrategy: DetectionStrategy
): Promise<MediaType | null> => {
    if (detectionStrategy === 'fileExtension') {
        return getMediaTypeFromExtension(src);
    } else if (detectionStrategy === 'contentTypeHeader') {
        return getMediaTypeFromContentType(src);
    } else if (detectionStrategy === 'zeroByteGet') {
        return getMediaTypeFromZeroByteGet(src);
    } else {
        throw new Error(`Unknown detection method: ${detectionStrategy}`);
    }
};

export const detectMediaType = async (
    src: string,
    detectionStrategy: DetectionStrategy,
): Promise<MediaType | null> => {
    const type = await getMediaTypeByMethod(src, detectionStrategy);

    if (type) {
        return type;
    } else {
        console.error('Unable to determine media type from file extension:', src);
        return null;
    }
};
