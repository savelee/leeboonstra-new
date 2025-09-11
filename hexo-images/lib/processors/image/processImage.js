const fs = require('fs');
const path = require('path');
const os = require('os');

// Platform detection
const isWindowsARM64 = os.platform() === 'win32' && os.arch() === 'arm64';

// Try to require sharp and smartcrop, but handle failures gracefully
let sharp, smartcrop, imagemin, imageminOptipng, imageminPngquant, imageminAdvpng, 
    imageminPngout, imageminMozJpg, imageminJpegRecompress, imageminGuetzli, imageminWebp;

try {
    sharp = require('sharp');
    smartcrop = require('smartcrop-sharp');
    imagemin = require('imagemin');
    imageminOptipng = require('imagemin-optipng');
    imageminPngquant = require('imagemin-pngquant');
    imageminAdvpng = require('imagemin-advpng');
    imageminPngout = require('imagemin-pngout');
    imageminMozJpg = require('imagemin-mozjpeg');
    imageminJpegRecompress = require('imagemin-jpeg-recompress');
    imageminGuetzli = require('imagemin-guetzli');
    imageminWebp = require('imagemin-webp');
} catch (error) {
    console.warn('Some image processing dependencies are not available:', error.message);
    console.warn('Falling back to basic image copying...');
}

const processImage = (imageCacheDir, file, targetFileName, originalType, type, scalePrefix, targetSize) => {
    const { size: originalFileSize } = fs.statSync(file);
    const targetFilePath = path.join(imageCacheDir, targetFileName);

    // Fallback for platforms where sharp is not available (like Windows ARM64)
    if (!sharp || !smartcrop || isWindowsARM64) {
        console.log(`Image processing not available on this platform. Copying original file: ${targetFileName}`);
        return new Promise((resolve, reject) => {
            try {
                fs.copyFileSync(file, targetFilePath);
                resolve(targetFilePath);
            } catch (error) {
                reject(error);
            }
        });
    }

    // Full processing for platforms that support it (Mac, Linux, Windows x64)
    return smartcrop
        .crop(file, { width: targetSize.width, height: targetSize.height })
        .then(({ topCrop: crop }) => {
            const image = sharp(file)
                .extract({ width: crop.width, height: crop.height, left: crop.x, top: crop.y })
                .resize(targetSize.width, targetSize.height);

            if (type === 'webp') {
                return image.webp({ lossless: originalType === 'png' }).toBuffer();
            } else {
                return image.toBuffer();
            }
        })
        .then((buffer) => {
            const writeTargetFile = (optimized) => {
                if (scalePrefix === '2x' && originalType === type && optimized.length > originalFileSize) {
                    /**
                     * Use original file (without scaling/optimization) in case of
                     * optimized file is bigger than original one, target type is the same as original
                     * and scale prefix is 2x.
                     */
                    fs.copyFileSync(file, targetFilePath);
                } else {
                    /**
                     * Write optimized file
                     */
                    fs.writeFileSync(targetFilePath, optimized);
                }
                return targetFilePath;
            };

            const imageMinPlugins = [];

            if (type === 'png') {
                if (imageminOptipng) imageMinPlugins.push(imageminOptipng());
                if (imageminPngquant) imageMinPlugins.push(imageminPngquant());
                if (imageminAdvpng) imageMinPlugins.push(imageminAdvpng());
                if (imageminPngout) imageMinPlugins.push(imageminPngout());
            } else if (type === 'jpg' || type === 'jpeg') {
                if (imageminMozJpg) {
                    imageMinPlugins.push(
                        imageminMozJpg({
                            quality: 75
                        })
                    );
                }
                if (imageminJpegRecompress) {
                    imageMinPlugins.push(
                        imageminJpegRecompress({
                            quality: 'medium'
                        })
                    );
                }
                if (imageminGuetzli) {
                    imageMinPlugins.push(
                        imageminGuetzli({
                            quality: 85
                        })
                    );
                }
            } else if (type === 'webp') {
                if (imageminWebp) {
                    imageMinPlugins.push(
                        imageminWebp({
                            quality: 75,
                            preset: originalType === 'jpg' || originalType === 'jpeg' ? 'photo' : 'picture',
                            lossless: originalType === 'png'
                        })
                    );
                }
            }

            if (imageMinPlugins.length > 0 && imagemin) {
                return imagemin
                    .buffer(buffer, {
                        plugins: imageMinPlugins
                    })
                    .then(writeTargetFile);
            } else {
                return writeTargetFile(buffer);
            }
        });
};

module.exports = { processImage };
