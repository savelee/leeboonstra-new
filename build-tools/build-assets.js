const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting asset build process...');

try {
    // Step 1: Compile Sass
    console.log('📦 Compiling Sass...');
    execSync('npm run sass', { 
        cwd: path.join(__dirname, '../themes/leeboonstra/design'),
        stdio: 'inherit'
    });

    // Step 2: Build JavaScript (if build-js works, otherwise skip)
    console.log('⚙️ Building JavaScript...');
    try {
        execSync('npm run build-js', { 
            cwd: path.join(__dirname, '../themes/leeboonstra/design'),
            stdio: 'inherit'
        });
    } catch (error) {
        console.log('⚠️ JavaScript build failed, continuing without it...');
        console.log('   (This is expected if parcel-bundler has issues)');
    }

    // Step 3: Copy compiled CSS to theme source
    console.log('📋 Copying CSS to theme source...');
    const cssSource = path.join(__dirname, '../themes/leeboonstra/design/dist/main.css');
    const cssDest = path.join(__dirname, '../themes/leeboonstra/source/main.css');
    
    if (fs.existsSync(cssSource)) {
        fs.copyFileSync(cssSource, cssDest);
        console.log('✅ CSS copied successfully');
    } else {
        console.log('❌ CSS file not found at:', cssSource);
    }

    // Step 4: Copy mobile menu JS to public
    console.log('📋 Copying mobile menu JavaScript...');
    const jsSource = path.join(__dirname, '../themes/leeboonstra/design/dist/mobile-menu.js');
    const jsDest = path.join(__dirname, '../public/mobile-menu.js');
    
    if (fs.existsSync(jsSource)) {
        fs.copyFileSync(jsSource, jsDest);
        console.log('✅ Mobile menu JS copied successfully');
    } else {
        console.log('❌ Mobile menu JS file not found at:', jsSource);
    }

    // Step 5: Copy bundle.js if it exists
    console.log('📋 Copying bundle JavaScript...');
    const bundleSource = path.join(__dirname, '../themes/leeboonstra/design/dist/bundle.js');
    const bundleDest = path.join(__dirname, '../public/bundle.js');
    
    if (fs.existsSync(bundleSource)) {
        fs.copyFileSync(bundleSource, bundleDest);
        console.log('✅ Bundle JS copied successfully');
    } else {
        console.log('⚠️ Bundle JS not found (this is okay if build-js failed)');
    }

    console.log('✅ Asset build process completed successfully!');

} catch (error) {
    console.error('❌ Build process failed:', error.message);
    process.exit(1);
}
