import multer from 'multer';
import path from 'path';
import sharp from 'sharp';

// Use memory storage to keep files in buffer
const storage = multer.memoryStorage();

// File filter - only allow images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files (JPEG, JPG, PNG, WEBP) are allowed!'));
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // Increased to 10MB to accept larger files before compression
    },
    fileFilter: fileFilter,
});

// Middleware to compress images using Sharp (fast C++ library)
export const compressImages = async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return next();
    }

    try {
        console.log(`Compressing ${req.files.length} images...`);
        const compressionStart = Date.now();

        // Compress all images in parallel using Sharp
        const compressionPromises = req.files.map(async (file) => {
            try {
                const compressedBuffer = await sharp(file.buffer)
                    .resize(1920, 1920, { 
                        fit: 'inside', // Maintain aspect ratio
                        withoutEnlargement: true // Don't enlarge smaller images
                    })
                    .jpeg({ 
                        quality: 80, // Good balance between quality and size
                        progressive: true, // Progressive JPEG for better web loading
                        mozjpeg: true // Use mozjpeg for better compression
                    })
                    .toBuffer();
                
                const originalSize = (file.size / 1024 / 1024).toFixed(2);
                const compressedSize = (compressedBuffer.length / 1024 / 1024).toFixed(2);
                console.log(`✓ Compressed ${file.originalname}: ${originalSize}MB → ${compressedSize}MB`);
                
                // Update file buffer and size
                file.buffer = compressedBuffer;
                file.size = compressedBuffer.length;
                file.mimetype = 'image/jpeg'; // All compressed to JPEG
                return file;
            } catch (error) {
                console.error(`Error compressing ${file.originalname}:`, error);
                // Return original file if compression fails
                return file;
            }
        });

        await Promise.all(compressionPromises);
        
        const compressionTime = Date.now() - compressionStart;
        console.log(`✓ All images compressed in ${compressionTime}ms`);
        
        next();
    } catch (error) {
        console.error('Image compression error:', error);
        // Continue even if compression fails
        next();
    }
};

export default upload;
