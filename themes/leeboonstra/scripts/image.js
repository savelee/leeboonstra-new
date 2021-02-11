const image_version = hexo.extend.helper.get('image_version');


hexo.extend.filter.register('after_post_render', data => {
    var regex = new RegExp(/(<img\b[^<>]*?src=['"].*?\/?.*?)([^.\/<>]*)(\.[^.\/<>]*?['"])([^><]*?\>)/igm);
    data.content = data.content.replace(regex, (_, start, name, ext, end) => {
      return `<picture>
        <source srcset="/images/large_${name}${ext}" media="(min-width: 1000px)">
        <source srcset="/images/medium_${name}${ext}" media="(min-width: 500px)">
        <source srcset="/images/small_${name}${ext} " media="(max-width: 499px)">
        <img src="/images/small_${name}${ext}" ${end}
        </picture>`;
    });
});



