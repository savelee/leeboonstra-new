'use strict';

const imagemin = require("imagemin");
const webp = require("imagemin-webp");
const webpconfig = hexo.config.webpconfig;

var webpSettings = {
  quality: 80,
  height: 0,
  width: 0   //if one of the parameters is 0 it scales automatically 
}

if (hexo.config.webpconfig) {
  webpSettings = {
    quality: (hexo.config.webpconfig.quality),
    height: (hexo.config.webpconfig.height),
    width: (hexo.config.webpconfig.width)
  }
}

hexo.extend.filter.register('after_post_render', data => {
    var regex = new RegExp(/(<img\b[^<>]*?src=['"].*?\/?.*?)([^.\/<>]*)(\.[^.\/<>]*?['"])([^><]*?\>)/igm);
    data.content = data.content.replace(regex, (_, start, name, ext, end) => {

      return `<picture type="image/webp">
        <source srcset="/images/large_${name}.webp" media="(min-width: 1000px)" type="image/webp">
        <source srcset="/images/medium_${name}.webp" media="(min-width: 500px)" type="image/webp">
        <source srcset="/images/small_${name}.webp " media="(max-width: 499px)" type="image/webp">
        <img src="/images/small_${name}${ext}" ${end}
        </picture>`;
    });
});

hexo.extend.filter.register('image_version', data => {
  (async () => {
    await imagemin(['./public/images/*.{jpg,png}'], {
      destination: 'public/images',
      plugins: [
        webp({
          quality: webpSettings.quality,
          resize: {
            width: webpSettings.width, 
            height: webpSettings.height 
          }
        })
      ]
    });
  
    console.log('Webp images created.');
  })();
}, 100);


