# Build Scripts

This directory contains optional build scripts that are NOT automatically executed by Hexo.

## Why this directory exists

In Hexo, any JavaScript files placed in the root `scripts/` directory are automatically loaded and executed during `hexo generate` and `hexo server` operations. This was causing performance issues as image processing scripts were running on every startup.

## Available Scripts

### Image Processing Scripts

These scripts are available as npm commands but do NOT run automatically:

- **`npm run copy-images`** - Copies images and creates size variants (fast, no actual resizing)
- **`npm run resize-images`** - Resizes images using ImageMagick/FFmpeg (slow, high quality)  
- **`npm run process-images`** - Resizes images using Jimp (requires `npm install jimp`)

### When to use

- **For development**: You typically don't need to run these - the theme works with placeholder images
- **For production**: Run `npm run copy-images` or `npm run resize-images` before deploying
- **For optimization**: Run `npm run resize-images` when you add new images to `source/images/`

### Theme Compatibility

The theme expects images in these formats:
- `original.jpg` - Original image
- `thumb_original.jpg` - Thumbnail version
- `small_original.jpg` - Small version  
- `medium_original.jpg` - Medium version
- `large_original.jpg` - Large version
- `thumb_original.webp` - WebP versions (optional)

If these don't exist, the `copy-images.js` script creates them by copying the original (no actual resizing).
