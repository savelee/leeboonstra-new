---
title: Make your mobile webapp work offline with application cache
description: This tutorial will help you to put your mobile webapp offline.
tags:
  - Application Cache
  - JavaScript
  - Offline Apps
  - App Cache
  - Caching Web Applications
categories:
  - App Cache
alias: /developer/make-your-mobile-webapp-work-offline-with-application-cache/
date: 2012-11-11 09:33:34
---

This tutorial will help you to put your mobile webapp offline.

<!--more-->

**1. create your cache manifest file**  
create a file yourappname.appcache in your application root.  
In the file enter all files you have to cache to make your app working offline.

For example the app.appcache file looks like this:

```
CACHE MANIFEST
#rev2

# Explicitly cached entries
CACHE:
index.html

img/icon.png
img/phone_startup.png
img/tablet_startup.png
img/main-image.png

css/ext-touch.css
css/default.css

js/ext-touch-debug.js
js/ext-touch.js
js/index.js

# Resources that require the user to be online.
NETWORK:
js/twitter.js

#If source in inaccessible serve other file. for example: /index.php /index.html
FALLBACK:
```

**2. Add your manifest to your application .html file header**  
In your html file:

```
<html manifest="app.appcache">
  ...
</html>
```


**3. Create a .htaccess file and add expire configuration for your *.manifest file to your app root.**

```
ExpiresActive On
ExpiresDefault "access"
```

**4. Add type manifest to your apache config (apache.conf / vhost.conf or .htaccess file)**

```
AddType text/cache-manifest .appcache
```

That's it, now your app should work offline. You should know that, as soon as the manifest file fails with caching the files. It stops. That means that the files will not be updated.

Use this code to check/swap cache via code:

``` JavaScript
var i = -1;

// Convenience array of status values
var cacheStatusValues = [];
cacheStatusValues[0] = 'uncached';
cacheStatusValues[1] = 'idle';
cacheStatusValues[2] = 'checking';
cacheStatusValues[3] = 'downloading';
cacheStatusValues[4] = 'updateready';
cacheStatusValues[5] = 'obsolete';

// Listeners for all possible events
var cache = window.applicationCache;
cache.addEventListener('cached', logEvent, false);
cache.addEventListener('checking', logEvent, false);
cache.addEventListener('downloading', logEvent, false);
cache.addEventListener('error', logEvent, false);
cache.addEventListener('noupdate', logEvent, false);
cache.addEventListener('obsolete', logEvent, false);
cache.addEventListener('progress', logEvent, false);
cache.addEventListener('updateready', logEvent, false);

// Log every event to the console
function logEvent(e) {
i=i+1;
var online, status, type, message;
online = (isOnline()) ? 'yes' : 'no';
status = cacheStatusValues[cache.status];
type = e.type;
message = 'online: ' + online;
message+= ', event: ' + type;
message+= ', status: ' + status;
if (type == 'error' && navigator.onLine) {
message+= ' There was an unknown error, check your Cache Manifest.';
}
log(i + ' ' + message);
}

function log(s) {
//alert(s);
console.log(s);
}

function isOnline() {
return navigator.onLine;
}

if (!$('html').attr('manifest')) {
log('No Cache Manifest listed on the tag.')
}

// Swap in newly download files when update is ready
cache.addEventListener('updateready', function(e){
// Don't perform "swap" if this is the first cache
if (cacheStatusValues[cache.status] != 'idle') {
cache.swapCache();
log('Swapped/updated the Cache Manifest.');
}
}
, false);

// These two functions check for updates to the manifest file
function checkForUpdates(){
cache.update();
}
function autoCheckForUpdates(){
setInterval(function(){cache.update()}, 10000);
}
```

More info's, can be found here:  
[http://developer.apple.com/library/safari/#documentation/iPhone/Conceptual/SafariJSDatabaseGuide/OfflineApplicationCache/OfflineApplicationCache.html](http://developer.apple.com/library/safari/#documentation/iPhone/Conceptual/SafariJSDatabaseGuide/OfflineApplicationCache/OfflineApplicationCache.html)