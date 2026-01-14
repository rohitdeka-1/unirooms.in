import multer from 'multer';
import path from 'path';
import sharp from 'sharp';

 
const storage = multer.memoryStorage();

 
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
 
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024,  
    },
    fileFilter: fileFilter,
});

 export const compressImages = async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return next();
    }

    try {
        console.log(`Compressing ${req.files.length} images...`);
        const compressionStart = Date.now();

         const compressionPromises = req.files.map(async (file) => {
            try {
                const compressedBuffer = await sharp(file.buffer)
                    .resize(1920, 1920, { 
                        fit: 'inside', 
                        withoutEnlargement: true 
                    })
                    .jpeg({ 
                        quality: 80,  
                        progressive: true, 
                        mozjpeg: true  
                    })
                    .toBuffer();
                
                const originalSize = (file.size / 1024 / 1024).toFixed(2);
                const compressedSize = (compressedBuffer.length / 1024 / 1024).toFixed(2);
                console.log(`✓ Compressed ${file.originalname}: ${originalSize}MB → ${compressedSize}MB`);
                
                 file.buffer = compressedBuffer;
                file.size = compressedBuffer.length;
                file.mimetype = 'image/jpeg';  
                return file;
            } catch (error) {
                console.error(`Error compressing ${file.originalname}:`, error);
                 return file;
            }
        });

        await Promise.all(compressionPromises);
        
        const compressionTime = Date.now() - compressionStart;
        console.log(`✓ All images compressed in ${compressionTime}ms`);
        
        next();
    } catch (error) {
        console.error('Image compression error:', error);
         next();
    }
};

export default upload;
