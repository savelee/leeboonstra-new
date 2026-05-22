module.exports = {
  "globDirectory": "public/",
  "globPatterns": [
    "**/*.{js,ico,ttf,woff,svg,woff2}",
    "404.html"
  ],
  "skipWaiting": true,
  "clientsClaim": true,
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
      // Match navigation / page requests
      "urlPattern": ({ request }) => request.mode === 'navigate',
      "handler": 'NetworkFirst',
      "options": {
        "cacheName": 'pages-cache',
        "expiration": {
          "maxEntries": 50,
          "maxAgeSeconds": 60 * 60 * 24 * 7 // 7 days
        }
      }
    },
    {
      // Match any request that ends with images.
      "urlPattern": /\.(?:png|jpg|jpeg|svg|gif|webp)$/,

      // Apply a cache-first strategy.
      "handler": 'CacheFirst',

      "options": {
        // Use a custom cache name.
        "cacheName": 'images',

        // Only cache 50 images.
        "expiration": {
          "maxEntries": 50
        },
      },
    },
    {
      // Match CSS files with optional version/cache-busting parameters
      "urlPattern": /\.(?:css)(?:\?.*)?$/,
      
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
      // Match JS files with optional version/cache-busting parameters
      "urlPattern": /\.(?:js)(?:\?.*)?$/,
      
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