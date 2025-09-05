const sass = require('sass');
const fs = require('fs');
const path = require('path');

// Input and output paths
const inputFile = path.join(__dirname, 'src', 'sass', 'main.scss');
const outputFile = path.join(__dirname, 'dist', 'main.css');

// Ensure dist directory exists
const distDir = path.dirname(outputFile);
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

try {
    console.log('Compiling Sass to CSS...');
    console.log('Input:', inputFile);
    console.log('Output:', outputFile);
    
    // Compile Sass to CSS
    const result = sass.compile(inputFile, {
        style: 'compressed', // Minified output
        sourceMap: true,
        sourceMapIncludeSources: true,
        loadPaths: [
            path.join(__dirname, 'node_modules'),
            path.join(__dirname, 'src', 'sass')
        ]
    });
    
    // Write CSS file
    fs.writeFileSync(outputFile, result.css);
    console.log('✅ CSS compiled successfully!');
    
    // Write source map if available
    if (result.sourceMap) {
        const sourceMapFile = outputFile + '.map';
        fs.writeFileSync(sourceMapFile, JSON.stringify(result.sourceMap, null, 2));
        console.log('✅ Source map generated:', sourceMapFile);
    }
    
} catch (error) {
    console.error('❌ Sass compilation failed:');
    console.error(error.message);
    process.exit(1);
}
