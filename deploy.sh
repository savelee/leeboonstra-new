#sudo apt-get install libpng-dev
#sudo apt-get install nasm
#npm install -g firebase-tools
#npm install -g webpack-cli
#npm install -g webpack
#npm install -g workbox-cli
#npm install -g hexo
npm install

hexo clean
hexo generate
hexo deploy
cd themes/leeboonstra/design
#npm install --force
cd ../../../
workbox generateSW workbox-config.js

firebase login --reauth
firebase deploy --only hosting