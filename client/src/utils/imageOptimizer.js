

/**
 * Optimizes Cloudinary image URLs with transformations
 * @param {string} url - Original image URL
 * @param {object} options - Optimization options
 * @returns {string} - Optimized image URL
 */
export const optimizeCloudinaryImage = (url, options = {}) => {
    if (!url || !url.includes('cloudinary.com')) {
        return url;
    }

    const {
        width = 800,
        quality = 'auto:eco',
        format = 'webp',
        crop = 'fill',
        gravity = 'auto',
    } = options;

    // Split URL at '/upload/' to insert transformations
    const parts = url.split('/upload/');
    if (parts.length !== 2) return url;

    // Build transformation string
    const transformations = [
        `w_${width}`,
        `q_${quality}`,
        `f_${format}`,
        `c_${crop}`,
        `g_${gravity}`,
        'dpr_auto', // Automatic device pixel ratio
    ].join(',');

    // Reconstruct URL with transformations
    return `${parts[0]}/upload/${transformations}/${parts[1]}`;
};

/**
 * Gets optimized image URL for different sizes
 * @param {string} url - Original image URL
 * @param {string} size - Size preset (thumb, small, medium, large)
 * @returns {string} - Optimized image URL
 */
export const getOptimizedImageUrl = (url, size = 'medium') => {
    if (!url) return '';

    const sizePresets = {
        thumb: { width: 200, quality: 'auto:eco', format: 'webp' },
        small: { width: 400, quality: 'auto:good' },
        medium: { width: 800, quality: 'auto:good' },
        large: { width: 1200, quality: 'auto:best' },
        card: { width: 500, quality: 'auto:good', crop: 'fill', gravity: 'auto' },
        hero: { width: 1400, quality: 'auto:best', crop: 'fill' },
    };

    const preset = sizePresets[size] || sizePresets.medium;

    // Optimize Cloudinary images
    if (url.includes('cloudinary.com')) {
        return optimizeCloudinaryImage(url, preset);
    }

    // For Unsplash images, add width parameter
    if (url.includes('unsplash.com')) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}w=${preset.width}&q=80&fm=webp&fit=crop`;
    }

    return url;
};

/**
 * Generates srcset for responsive images
 * @param {string} url - Original image URL
 * @returns {string} - srcset string
 */
export const generateSrcSet = (url) => {
    if (!url || !url.includes('cloudinary.com')) {
        return '';
    }

    const widths = [400, 600, 800, 1000, 1200];
    const srcset = widths
        .map((width) => {
            const optimizedUrl = optimizeCloudinaryImage(url, {
                width,
                quality: 'auto:good',
                format: 'auto',
            });
            return `${optimizedUrl} ${width}w`;
        })
        .join(', ');

    return srcset;
};

/**
 * Returns a blur placeholder data URL
 * @returns {string} - Blur placeholder data URL
 */
export const getBlurPlaceholder = () => {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+';
};
