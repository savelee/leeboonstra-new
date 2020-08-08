# Setting up Hexo, with Travis CI & Firebase

## Hexo

Hexo is a site generator for Node.js.
A fast, simple & powerful blog framework.
https://hexo.io/

```
npm install -g hexo
hexo init
hexo generate
hexo deploy
hexo server / hexo serve
```

### Create a new post

`hexo new "My New Post"`

### Run server

`hexo server`

### Generate static files

`hexo generate`

### Deploy to remote sites

`hexo deploy`


## Firebase

Firebase is a mobile and web application development platform by Google.
We will use Firebase for static hosting.

### Setup Firebase Hosting

```
npm install -g firebase-tools
firebase login
Firebase login:ci
Firebase init (hosting; public)
```

## Github & Travis CI

We will need Github and Travis CI, to create a pipeline,
to automatically build the site, when pushing files to Github.

```
travis encrypt 'token'
```

Create in the project settings page the following 2 environment variables:
- FIREBASE_TOKEN
- FIREBASE_PROJECT

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
