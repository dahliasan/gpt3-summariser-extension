const path = require('path')
module.exports = {
  entry: {
    content: './public/scripts/content.js',
    background: './public/scripts/background.js',
  },
  output: {
    path: path.resolve(__dirname, '../extension/'),
    filename: '[name].bundle.js',
  },
  mode: 'production',
}
