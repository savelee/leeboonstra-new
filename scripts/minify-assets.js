const fs = require('fs');
const path = require('path');
const { minify: minifyJS } = require('terser');
const CleanCSS = require('clean-css');

console.log('🔧 Starting asset minification...');

// Configuration
const config = {
  js: {
    inputDir: 'public/js',
    outputDir: 'public/js',
    files: [] // No unminified JS files to minify (prism.js was removed)
  },
  css: {
    inputDir: 'public/css',
    outputDir: 'public/css',
    files: ['prism-atom-dark.css', 'prism-line-numbers.css']
  }
};

// Minify JavaScript files
async function minifyJavaScript() {
  console.log('📦 Minifying JavaScript files...');
  
  for (const file of config.js.files) {
    const inputPath = path.join(config.js.inputDir, file);
    const outputPath = path.join(config.js.outputDir, file.replace('.js', '.min.js'));
    
    if (fs.existsSync(inputPath)) {
      try {
        const code = fs.readFileSync(inputPath, 'utf8');
        const result = await minifyJS(code, {
          compress: {
            drop_console: false, // Keep console logs for debugging
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug']
          },
          mangle: {
            toplevel: false // Don't mangle top-level names to avoid breaking Prism
          },
          format: {
            comments: false
          }
        });
        
        fs.writeFileSync(outputPath, result.code);
        console.log(`✅ Minified: ${file} → ${path.basename(outputPath)}`);
        
        // Show size reduction
        const originalSize = fs.statSync(inputPath).size;
        const minifiedSize = fs.statSync(outputPath).size;
        const reduction = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
        console.log(`   Size: ${(originalSize / 1024).toFixed(1)}KB → ${(minifiedSize / 1024).toFixed(1)}KB (${reduction}% reduction)`);
        
      } catch (error) {
        console.error(`❌ Error minifying ${file}:`, error.message);
      }
    } else {
      console.log(`⚠️ File not found: ${inputPath}`);
    }
  }
}

// Minify CSS files
function minifyCSS() {
  console.log('🎨 Minifying CSS files...');
  
  const cleanCSS = new CleanCSS({
    level: 2, // Advanced optimizations
    format: false, // Don't format output
    inline: false, // Don't inline @imports
    rebase: false // Don't rebase URLs
  });
  
  for (const file of config.css.files) {
    const inputPath = path.join(config.css.inputDir, file);
    const outputPath = path.join(config.css.outputDir, file.replace('.css', '.min.css'));
    
    if (fs.existsSync(inputPath)) {
      try {
        const css = fs.readFileSync(inputPath, 'utf8');
        const result = cleanCSS.minify(css);
        
        if (result.errors.length > 0) {
          console.error(`❌ CSS errors in ${file}:`, result.errors);
          continue;
        }
        
        fs.writeFileSync(outputPath, result.styles);
        console.log(`✅ Minified: ${file} → ${path.basename(outputPath)}`);
        
        // Show size reduction
        const originalSize = fs.statSync(inputPath).size;
        const minifiedSize = fs.statSync(outputPath).size;
        const reduction = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
        console.log(`   Size: ${(originalSize / 1024).toFixed(1)}KB → ${(minifiedSize / 1024).toFixed(1)}KB (${reduction}% reduction)`);
        
      } catch (error) {
        console.error(`❌ Error minifying ${file}:`, error.message);
      }
    } else {
      console.log(`⚠️ File not found: ${inputPath}`);
    }
  }
}

// Main execution
async function main() {
  try {
    await minifyJavaScript();
    minifyCSS();
    console.log('✅ Asset minification completed successfully!');
  } catch (error) {
    console.error('❌ Minification failed:', error.message);
    process.exit(1);
  }
}

main();
