module.exports = {
  parser: false,
  plugins: loader => [
    require('autoprefixer')()
  ]
};
