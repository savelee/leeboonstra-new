const fs = require('fs');
const path = require('path');

// Simple image copying script for Windows ARM64 compatibility
// This creates the expected image naming convention without requiring sharp

const sourceDir = path.join(__dirname, '..', 'source', 'images');
const publicDir = path.join(__dirname, '..', 'public', 'images');

// Ensure public/images directory exists
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Get all image files from source
const imageFiles = fs.readdirSync(sourceDir).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.png', '.jpg', '.jpeg', '.webp'].includes(ext);
});

console.log(`Found ${imageFiles.length} image files to process...`);

imageFiles.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const baseName = path.parse(file).name;
    const ext = path.parse(file).ext;
    
    // Copy original file
    const originalPath = path.join(publicDir, file);
    fs.copyFileSync(sourcePath, originalPath);
    
    // Create thumb, small, medium, large versions (just copy the original for now)
    // This ensures the theme templates work without actual image processing
    const sizes = ['thumb', 'small', 'medium', 'large'];
    
    sizes.forEach(size => {
        const targetPath = path.join(publicDir, `${size}_${file}`);
        fs.copyFileSync(sourcePath, targetPath);
        
        // Also create webp versions (copy as png for now)
        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
            const webpPath = path.join(publicDir, `${size}_${baseName}.webp`);
            fs.copyFileSync(sourcePath, webpPath);
        }
    });
    
    console.log(`Processed: ${file}`);
});

console.log('Image copying completed!');
