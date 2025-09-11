const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🖼️ Starting image resizing with external tools...');

// Image size configurations
const imageSizes = {
    thumb: { width: 150, height: 150, quality: 80 },
    small: { width: 640, height: 800, quality: 85 },
    medium: { width: 1024, height: 1280, quality: 90 },
    large: { width: 1800, height: 2250, quality: 95 }
};

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

// Check if ImageMagick is available
function checkImageMagick() {
    try {
        execSync('magick -version', { stdio: 'ignore' });
        return true;
    } catch (error) {
        return false;
    }
}

// Check if FFmpeg is available (can handle images too)
function checkFFmpeg() {
    try {
        execSync('ffmpeg -version', { stdio: 'ignore' });
        return true;
    } catch (error) {
        return false;
    }
}

// Resize image using ImageMagick
function resizeWithImageMagick(sourcePath, targetPath, width, height, quality) {
    try {
        const command = `magick "${sourcePath}" -resize ${width}x${height}> -quality ${quality} "${targetPath}"`;
        execSync(command, { stdio: 'ignore' });
        return true;
    } catch (error) {
        return false;
    }
}

// Resize image using FFmpeg
function resizeWithFFmpeg(sourcePath, targetPath, width, height, quality) {
    try {
        const command = `ffmpeg -i "${sourcePath}" -vf "scale=${width}:${height}:force_original_aspect_ratio=decrease" -q:v ${Math.round((100-quality)/10)} -y "${targetPath}"`;
        execSync(command, { stdio: 'ignore' });
        return true;
    } catch (error) {
        return false;
    }
}

// Fallback: Simple file copy with size info
function fallbackCopy(sourcePath, targetPath, sizeName) {
    try {
        fs.copyFileSync(sourcePath, targetPath);
        const stats = fs.statSync(sourcePath);
        console.log(`  ⚠️ ${sizeName}: Copied original (${(stats.size / 1024).toFixed(1)}KB) - no resize tool available`);
        return true;
    } catch (error) {
        console.log(`  ❌ ${sizeName}: Failed to copy - ${error.message}`);
        return false;
    }
}

// Process a single image
function processImage(file) {
    const sourcePath = path.join(sourceDir, file);
    const baseName = path.parse(file).name;
    const ext = path.parse(file).ext.toLowerCase();
    
    console.log(`\n📸 Processing: ${file}`);
    
    // Copy original file
    const originalPath = path.join(publicDir, file);
    fs.copyFileSync(sourcePath, originalPath);
    
    const originalStats = fs.statSync(sourcePath);
    console.log(`  📄 Original: ${(originalStats.size / 1024).toFixed(1)}KB`);
    
    // Process each size variant
    for (const [sizeName, sizeConfig] of Object.entries(imageSizes)) {
        const targetPath = path.join(publicDir, `${sizeName}_${file}`);
        
        let success = false;
        
        // Try ImageMagick first
        if (checkImageMagick()) {
            success = resizeWithImageMagick(sourcePath, targetPath, sizeConfig.width, sizeConfig.height, sizeConfig.quality);
            if (success) {
                const stats = fs.statSync(targetPath);
                const reduction = ((originalStats.size - stats.size) / originalStats.size * 100).toFixed(1);
                console.log(`  ✅ ${sizeName}: ${sizeConfig.width}x${sizeConfig.height} (${(stats.size / 1024).toFixed(1)}KB, ${reduction}% reduction) [ImageMagick]`);
            }
        }
        
        // Try FFmpeg if ImageMagick failed
        if (!success && checkFFmpeg()) {
            success = resizeWithFFmpeg(sourcePath, targetPath, sizeConfig.width, sizeConfig.height, sizeConfig.quality);
            if (success) {
                const stats = fs.statSync(targetPath);
                const reduction = ((originalStats.size - stats.size) / originalStats.size * 100).toFixed(1);
                console.log(`  ✅ ${sizeName}: ${sizeConfig.width}x${sizeConfig.height} (${(stats.size / 1024).toFixed(1)}KB, ${reduction}% reduction) [FFmpeg]`);
            }
        }
        
        // Fallback to copy if no tools available
        if (!success) {
            fallbackCopy(sourcePath, targetPath, sizeName);
        }
        
        // Create WebP version (copy as PNG for now)
        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
            const webpPath = path.join(publicDir, `${sizeName}_${baseName}.webp`);
            if (fs.existsSync(targetPath)) {
                fs.copyFileSync(targetPath, webpPath);
            }
        }
    }
}

// Main processing function
function processAllImages() {
    // Check for available tools
    const hasImageMagick = checkImageMagick();
    const hasFFmpeg = checkFFmpeg();
    
    if (!hasImageMagick && !hasFFmpeg) {
        console.log('⚠️ No image processing tools found (ImageMagick or FFmpeg)');
        console.log('   Will copy original files with size information');
        console.log('   To enable proper resizing, install ImageMagick or FFmpeg');
    } else {
        if (hasImageMagick) console.log('✅ ImageMagick found - will use for resizing');
        if (hasFFmpeg) console.log('✅ FFmpeg found - will use as fallback');
    }
    
    let processedCount = 0;
    let errorCount = 0;
    
    for (const file of imageFiles) {
        try {
            processImage(file);
            processedCount++;
        } catch (error) {
            console.error(`❌ Error processing ${file}:`, error.message);
            errorCount++;
        }
    }
    
    console.log(`\n✅ Image processing completed!`);
    console.log(`   Processed: ${processedCount} images`);
    if (errorCount > 0) {
        console.log(`   Errors: ${errorCount} images`);
    }
    
    if (!hasImageMagick && !hasFFmpeg) {
        console.log(`\n💡 To enable proper image resizing:`);
        console.log(`   - Install ImageMagick: https://imagemagick.org/script/download.php#windows`);
        console.log(`   - Or install FFmpeg: https://ffmpeg.org/download.html`);
    }
}

// Run the processing
processAllImages();
