module.exports = {
  "globDirectory": "public/",
  "globPatterns": [
    "**/*.{js,ico,ttf,woff,svg,woff2}"
  ],
  "globIgnores": [
    "**/node_modules/**/*",
    "serviceworker.js",
    "workbox-*.js",
    "**/main.css*", // Exclude main.css from precaching
    "**/mobile-menu.js*" // Exclude mobile-menu.js from precaching
  ],
  "swDest": "public/serviceworker.js",
  // Define runtime caching rules.
  "runtimeCaching": [
    {
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
    },
    {
      // Match CSS files with version parameters
      "urlPattern": /\.(?:css)$/,
      
      // Apply a stale-while-revalidate strategy for CSS
      "handler": 'StaleWhileRevalidate',
      
      "options": {
        "cacheName": 'css-cache',
        "expiration": {
          "maxEntries": 10,
          "maxAgeSeconds": 60 * 60 * 24 // 1 day
        },
      },
    },
    {
      // Match JS files with version parameters
      "urlPattern": /\.(?:js)$/,
      
      // Apply a stale-while-revalidate strategy for JS
      "handler": 'StaleWhileRevalidate',
      
      "options": {
        "cacheName": 'js-cache',
        "expiration": {
          "maxEntries": 10,
          "maxAgeSeconds": 60 * 60 * 24 // 1 day
        },
      },
    }
  ]
};