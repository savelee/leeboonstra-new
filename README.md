# Setting up Hexo, with Travis CI & Firebase

## Sass

```
cd themes/leeboonstra/design
npm run watch
```

## Hexo

Hexo is a site generator for Node.js.
A fast, simple & powerful blog framework.
https://hexo.io/

```
npm install -g hexo
hexo init
hexo clean
hexo generate
hexo deploy
npm run serviceWorker
hexo server / hexo serve
```

### Create a new post

`hexo new "My New Post"`

### Run server

`hexo server`

### Generate static files

`hexo clean && hexo generate`

### Deploy to remote sites

`hexo deploy`

## Workbox Service Worker

```
npm i workbox-cli
workbox wizard 
workbox generateSW workbox-config.js
```

The serviceworker should be generated in public/serviceworker.js based on the public folder.
And the themes/leeboonstra/design/js/index.js will need to be modified to load the service worker.

Manually force the css, by updating the version number in:
themes/leeboonstra/layout/_partial/head.ejb
public/serviceworker.js & map

npm run serviceWorker


```hexo clean & hexo generate```
Modify workbox-config.js, it should point to the public folder.


## Deploy to Firebase

Firebase is a mobile and web application development platform by Google.
We will use Firebase for static hosting.

```
hexo deploy
firebase login -reauth
firebase deploy --only hosting
```
