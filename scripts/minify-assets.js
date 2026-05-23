const fs = require('fs');
const path = require('path');
const { minify: minifyJS } = require('terser');
const CleanCSS = require('clean-css');

console.log('🔧 Starting asset minification...');

// Configuration
const config = {
  js: {
    inputDir: 'public',
    outputDir: 'public',
    files: [
      { input: 'js/prism.js', output: 'js/prism.min.js' },
      { input: 'mobile-menu.js', output: 'mobile-menu.min.js' }
    ]
  },
  css: {
    inputDir: 'public',
    outputDir: 'public',
    files: [
      { input: 'css/prism-atom-dark.css', output: 'css/prism-atom-dark.min.css' },
      { input: 'css/prism-line-numbers.css', output: 'css/prism-line-numbers.min.css' },
      { input: 'main.css', output: 'main.css' },
      { input: 'print.css', output: 'print.css' }
    ]
  }
};

// Minify JavaScript files
async function minifyJavaScript() {
  console.log('📦 Minifying JavaScript files...');
  
  for (const fileConfig of config.js.files) {
    const inputPath = path.join(config.js.inputDir, fileConfig.input);
    const outputPath = path.join(config.js.outputDir, fileConfig.output);
    
    if (fs.existsSync(inputPath)) {
      try {
        const code = fs.readFileSync(inputPath, 'utf8');
        const result = await minifyJS(code, {
          compress: {
            drop_console: true, // Remove console logs for production
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn', 'console.error']
          },
          mangle: {
            toplevel: false // Don't mangle top-level names to avoid breaking functionality
          },
          format: {
            comments: false
          }
        });
        
        fs.writeFileSync(outputPath, result.code);
        console.log(`✅ Minified: ${fileConfig.input} → ${fileConfig.output}`);
        
        // Show size reduction
        const originalSize = fs.statSync(inputPath).size;
        const minifiedSize = fs.statSync(outputPath).size;
        const reduction = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
        console.log(`   Size: ${(originalSize / 1024).toFixed(1)}KB → ${(minifiedSize / 1024).toFixed(1)}KB (${reduction}% reduction)`);
        
      } catch (error) {
        console.error(`❌ Error minifying ${fileConfig.input}:`, error.message);
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
  
  for (const fileConfig of config.css.files) {
    const inputPath = path.join(config.css.inputDir, fileConfig.input);
    const outputPath = path.join(config.css.outputDir, fileConfig.output);
    
    if (fs.existsSync(inputPath)) {
      try {
        const css = fs.readFileSync(inputPath, 'utf8');
        const result = cleanCSS.minify(css);
        
        if (result.errors.length > 0) {
          console.error(`❌ CSS errors in ${fileConfig.input}:`, result.errors);
          continue;
        }
        
        // Ensure destination directory path exists
        const outputFolder = path.dirname(outputPath);
        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder, { recursive: true });
        }
        
        fs.writeFileSync(outputPath, result.styles);
        console.log(`✅ Minified: ${fileConfig.input} → ${fileConfig.output}`);
        
        // Show size reduction
        const originalSize = fs.statSync(inputPath).size;
        const minifiedSize = fs.statSync(outputPath).size;
        const reduction = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
        console.log(`   Size: ${(originalSize / 1024).toFixed(1)}KB → ${(minifiedSize / 1024).toFixed(1)}KB (${reduction}% reduction)`);
        
      } catch (error) {
        console.error(`❌ Error minifying ${fileConfig.input}:`, error.message);
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
