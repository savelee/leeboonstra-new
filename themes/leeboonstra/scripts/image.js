const image_version = hexo.extend.helper.get('image_version');


hexo.extend.filter.register('after_post_render', data => {
    var regex = new RegExp(/(<img\b[^<>]*?src=['"].*?\/?.*?)([^.\/<>]*)(\.[^.\/<>]*?['"])([^><]*?\>)/igm);
    data.content = data.content.replace(regex, (_, start, name, ext, end) => {
      return `<picture>
        <source media="(min-width: 36em)"
        srcset="/images/large_${name}${ext} 1024w,
                /images/medium_${name}${ext} 640w,
                /images/small_${name}${ext}  320w"
            sizes="33.3vw" />
        <img src="/images/small_${name}${ext}" ${end}
        </picture>`;
    });
});

