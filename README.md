# css-type-loader
css type loader for genrate .d.ts file for css module.  

<strong>module idea from:</strong>
- [typings-for-css-modules-loader](https://github.com/Jimdo/typings-for-css-modules-loader)
- [css-modules-typescript-loader](https://github.com/seek-oss/css-modules-typescript-loader)

## How to use
Add css-type-loader directly after css-loader in your webpack config.
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'css-type-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
      }
    ]
  }
};
```