const path = require('path')

function webp(oldPath, options) {
  var base = path.basename(oldPath)
  const dir = path.dirname(oldPath)

  base = base.split('.')[0];

  if (dir === '.') {
    return options.prefix + '_' + base + '.webp';
  }

  return dir + '/' + options.prefix + '_' + base + '.webp';
}

module.exports = webp
