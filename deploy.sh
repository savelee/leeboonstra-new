#sudo apt-get install libpng-dev
#sudo apt-get install nasm
#npm install -g firebase-tools
#npm install -g webpack-cli
#npm install -g webpack
#npm install -g workbox-cli
#npm install -g hexo
npm install
hexo clean


npm run build # it will run hexo generate AND then automatically run the image copying script
hexo generate # it will generate the site, and then the image copying will happen automatically
#npm run server # it will also run the image copying as part of the build process

hexo deploy #This deploys to your configured deployment target
cd themes/leeboonstra/design
#npm install --force
cd ../../../
workbox generateSW workbox-config.js

#sudo npm install -g firebase-tools
firebase login --reauth
firebase deploy --only hosting --project leeboonstra-dev-7d578


#npm run server