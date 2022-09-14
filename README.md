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


## Firebase

Firebase is a mobile and web application development platform by Google.
We will use Firebase for static hosting.

### Setup Firebase Hosting

```
npm install -g firebase-tools
firebase login
firebase login:ci
firebase init (hosting; public)
```

When problems with pushing to firebase, refresh
the token with firebase login:ci
add it to travis repo settings.
and update the .travis.yml

https://medium.com/@bartwijnants/continuous-deployment-to-firebase-hosting-using-travis-ci-e7d9c798ead4


### Setup Github Repo

```
git init
git add README.md
git commit -m "first commit"
git remote add origin https://github.com/<myrepo>/<myrepo>.git
git push -u origin master
```

### Setup Travis CI

1. https://www.travis-ci.com/

1. Activate access to Github repositories

1. Add the FIREBASE_TOKEN environment variable to the Travis CLI settings page.

## Github & Travis CI

We will need Github and Travis CI, to create a pipeline,
to automatically build the site, when pushing files to Github.

```
travis encrypt 'token' --repo=gituser/gitrepo
```

Create in the project settings page the following 2 environment variables:
- FIREBASE_TOKEN
- FIREBASE_PROJECT



TOOD problem with travis, when i change the firebase.json public path to root
travis will deploy. but than in firebase i cant find the files.

## UTM
?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_