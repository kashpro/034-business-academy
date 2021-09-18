const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
const filename = (ext = '[ext]') => isDev ? `[name]${ext}` : `[name].[contenthash]${ext}`;

const findHtmlTemplates = () => {
  const htmlFiles = glob.sync(__dirname + '/src/**/*.html');
  const configs = htmlFiles.map( htmlFile => { return {template: htmlFile, filename: path.parse(htmlFile).base};} );
  return configs.map( config => new HtmlWebpackPlugin(config) ); // Имена файлов html должны совпадать в папках src и dist
}

const findPugTemplates = () => {
  const pugFiles = glob.sync(__dirname + '/src/pug/*.pug');
  const configs = pugFiles.map( pugFile => { return {template: pugFile, filename: path.parse(pugFile).base.replace(/\.pug/,'.html')};} );
  return configs.map( config => new HtmlWebpackPlugin(config) ); // Имена файлов html должны совпадать в папках src и dist
}

module.exports = {
  target: 'web', // для dev-server, live-reload
  /*==============================================================================*/
  context: path.resolve(__dirname, 'src/'), // Для [path] у file-loader
  /*==============================================================================*/
  entry: {
    app: './js/main.js',
  },
  /*==============================================================================*/
  output: {
    path: path.resolve(__dirname, 'dist/'),
    // publicPath: process.env.NODE_PUBLIC_PATH,  // для дев-сервера (для несуществующих маршрутов): '/', в остальных случаях: './'
    publicPath: './',
    filename: `js/${filename('.js')}`,
  },
  /*==============================================================================*/
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
  }, 
  /*==============================================================================*/
  module: {
    rules: [
      /*---------------------------------------*/
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-proposal-class-properties'], // Для статических полей класса, стрелочных методов класса
            }, 
          },
        ],
      },
      /*---------------------------------------*/
      {
        test: /\.s?[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader, // Extract css into files (3)
            options: {
              publicPath: '../', // Добавляет ко всем url() в стилях путь '../'. см. https://stackoverflow.com/questions/53787506/url-loader-file-loader-breaking-relative-paths-in-css-output-using-webpack
            },
          },
          {
            loader: 'css-loader', // Translates CSS into CommonJS (2)
            options: {},
          },
          {
            loader: 'postcss-loader', // Autoprefixer (1)
            options: {},
          },
          {
            loader: 'sass-loader', // Compiles Sass to CSS (0)
            options: {},
          },
        ],
      },
      /*---------------------------------------*/
      {
        test: /\.(mp3|wav|ogg)$/i,
        type: 'asset/resource', // like file-loader, always file copy
        generator: {
          filename: `[path]${filename()}`,
        },
      },
      /*---------------------------------------*/
      {
        test: /\.(mp4|mpg|mov)$/i,
        type: 'asset/resource', // like file-loader, always file copy
        generator: {
          filename: `[path]${filename()}`,
        },
      },
      /*---------------------------------------*/
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource', // like file-loader, always file copy
        generator: {
          filename: `[path]${filename()}`,
        },
      },
      /*---------------------------------------*/
      {
        test: /\.(png|svg|jpg|gif|webp)$/i,
        type: 'asset', // resource + inline, 8k treshold
        generator: {
          filename: `[path]${filename()}`,
        },
      },
      /*---------------------------------------*/
      { 
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {},
          },
        ],
      },
      /*---------------------------------------*/
      { // нужен для обработки урлов в html
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {},
          }
        ],
      },
      /*---------------------------------------*/
      {
        test: /\.pug$/,
        oneOf: [
          {
            resourceQuery: /^\?vue/,
            use: [
              {
                loader: 'pug-plain-loader',
                options: {},
              },
            ],
          },
          {
            use: [
              {
                loader: 'pug-loader',
                options: {},
              },
            ],
          },
        ],
      },
      /*---------------------------------------*/
    ],
  },
  /*==============================================================================*/
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `css/${filename('.css')}`,
    }),
    new VueLoaderPlugin(),
    new CopyPlugin({
      patterns: [
        {from: './_public', to: '', noErrorOnMissing: true}, // для пустой папки _public
      ],
    }),
    new ImageMinimizerPlugin({
      minimizerOptions: {
        plugins: [
          // ['webp', {quality: 70}], // если включено - ВСЕ будет завернуто в webp (RIFF-контейнеры). Могут быть проблемы с отображением на iphone 12
          ['pngquant', {quality: [0.6, 0.8]}],
          ['mozjpeg', {quality: 80}],
          ['gifsicle', {interlaced: false, optimizationLevel: 3}],
          ['svgo', {}],
        ],
      },
    }),
    ...findHtmlTemplates(),
    ...findPugTemplates(),
  ],
};