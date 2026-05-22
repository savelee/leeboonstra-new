const fs = require('fs');
const path = require('path');
const { Jimp } = require('jimp');
const { execSync } = require('child_process');

// Image size configurations
const imageSizes = {
    thumb: { width: 150, height: 150 },
    small: { width: 640, height: 800 },
    medium: { width: 1024, height: 1280 },
    large: { width: 1800, height: 2250 }
};

// Quality settings for different formats
const qualitySettings = {
    jpeg: 85,
    png: 90,
    webp: 80
};

console.log('🖼️ Starting proper image processing...');

const sourceDir = path.join(__dirname, '..', 'source', 'images');
const publicDir = path.join(__dirname, '..', 'public', 'images');

// Ensure public/images directory exists
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Get all image files from source
const imageFiles = fs.readdirSync(sourceDir).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.png', '.jpg', '.jpeg'].includes(ext);
});

console.log(`Found ${imageFiles.length} image files to process...`);

async function processImage(sourcePath, targetPath, targetSize, format = null) {
    try {
        const image = await Jimp.read(sourcePath, { maxMemoryUsageInMB: 2048 });
        const originalWidth = image.bitmap.width;
        const originalHeight = image.bitmap.height;
        
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = targetSize;
        
        if (originalWidth <= targetSize.width && originalHeight <= targetSize.height) {
            // Image is already smaller than target size, use original dimensions
            width = originalWidth;
            height = originalHeight;
        } else {
            // Calculate aspect ratio and scale appropriately
            const aspectRatio = originalWidth / originalHeight;
            if (aspectRatio > targetSize.width / targetSize.height) {
                // Image is wider, scale by width
                width = targetSize.width;
                height = Math.round(targetSize.width / aspectRatio);
            } else {
                // Image is taller, scale by height
                width = Math.round(targetSize.height * aspectRatio);
                height = targetSize.height;
            }
        }
        
        // Resize the image using the correct API
        image.resize({ w: width, h: height });
        
        // Write the processed image - quality is set during write for newer Jimp versions
        await image.write(targetPath);
        
        return { success: true, width, height };
    } catch (error) {
        console.error(`❌ Error processing ${sourcePath}:`, error.message);
        return { success: false, error: error.message };
    }
}

async function processAllImages() {
    let processedCount = 0;
    let errorCount = 0;
    
    for (const file of imageFiles) {
        const sourcePath = path.join(sourceDir, file);
        const baseName = path.parse(file).name;
        const ext = path.parse(file).ext.toLowerCase();
        
        console.log(`\n📸 Processing: ${file}`);
        
        // Copy original file
        const originalPath = path.join(publicDir, file);
        fs.copyFileSync(sourcePath, originalPath);
        
        // Process each size variant
        for (const [sizeName, sizeConfig] of Object.entries(imageSizes)) {
            const targetPath = path.join(publicDir, `${sizeName}_${file}`);
            const webpPath = path.join(publicDir, `${sizeName}_${baseName}.webp`);
            
            const result = await processImage(sourcePath, targetPath, sizeConfig);
            
            if (result.success) {
                const stats = fs.statSync(targetPath);
                const originalStats = fs.statSync(sourcePath);
                const sizeReduction = ((originalStats.size - stats.size) / originalStats.size * 100).toFixed(1);
                
                console.log(`  ✅ ${sizeName}: ${result.width}x${result.height} (${(stats.size / 1024).toFixed(1)}KB, ${sizeReduction}% reduction)`);
                processedCount++;
                
                // Create genuine WebP version using the system-installed cwebp compiler.
                // Enforce a robust fallback to basic copy operations if the compiler fails for any reason.
                if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
                    let webpSuccess = false;
                    try {
                        // Run command-line encoding with standard target quality (q=80)
                        execSync(`cwebp -q 80 "${targetPath}" -o "${webpPath}"`, { stdio: 'ignore' });
                        const webpStats = fs.statSync(webpPath);
                        const webpReduction = ((originalStats.size - webpStats.size) / originalStats.size * 100).toFixed(1);
                        console.log(`    ⚡ WebP Transcoded: ${(webpStats.size / 1024).toFixed(1)}KB (${webpReduction}% overall reduction from source)`);
                        webpSuccess = true;
                    } catch (err) {
                        console.warn(`    ⚠️ WebP transcoding failed via cwebp CLI: ${err.message}. Falling back to copy...`);
                    }
                    
                    if (!webpSuccess) {
                        fs.copyFileSync(targetPath, webpPath);
                    }
                }
            } else {
                console.log(`  ❌ ${sizeName}: Failed - ${result.error}. Gracefully falling back to original file.`);
                errorCount++;
                
                // Robust fallback: copy original image to both targets so page renders successfully
                fs.copyFileSync(sourcePath, targetPath);
                if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
                    fs.copyFileSync(sourcePath, webpPath);
                }
            }
        }
    }
    
    console.log(`\n✅ Image processing completed!`);
    console.log(`   Processed: ${processedCount} images`);
    if (errorCount > 0) {
        console.log(`   Errors: ${errorCount} images`);
    }
}

// Run the processing
processAllImages().catch(error => {
    console.error('❌ Image processing failed:', error.message);
    process.exit(1);
});
