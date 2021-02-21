'use strict';

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
