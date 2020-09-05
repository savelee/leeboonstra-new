module.exports = {
  "globDirectory": "/",
  "globPatterns": [
    "**/*.{js,css,xml,json,txt}"
  ],
  "swDest": "themes/leeboonstra/source/sw.js",
  // Define runtime caching rules.
  "runtimeCaching": [{
    // Match any request ends with .png, .jpg, .jpeg or .svg.
    "urlPattern": /\.(?:png|gif|woff|woff2|ttf|eot|pdf|ico|jpg|jpeg|svg)$/,

    // Apply a cache-first strategy.
    "handler": 'cacheFirst',

    "options": {
      // Use a custom cache name.
      "cacheName": 'images',

      // Only cache 15 images.
      "expiration": {
        "maxEntries": 15
      }
    }
  }]
};
