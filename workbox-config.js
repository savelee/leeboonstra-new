module.exports = {
  "globDirectory": "public/",
  "globPatterns": [
    "**/*.{js,css,ico,ttf,woff,svg,woff2}",
  ],
  "swDest": "public/serviceworker.js",
  // Define runtime caching rules.
  "runtimeCaching": [{
    // Match any request that ends with .png, .jpg, .jpeg or .svg.
    "urlPattern": /\.(?:webp)$/,

    // Apply a cache-first strategy.
    "handler": 'CacheFirst',

    "options": {
      // Use a custom cache name.
      "cacheName": 'images',

      // Only cache 10 images.
      "expiration": {
        "maxEntries": 50
      },
    },
  }]
};