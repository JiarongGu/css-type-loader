# css-type-loader
[![npm version](https://badge.fury.io/js/css-type-loader.svg)](https://www.npmjs.com/package/css-type-loader)
css type loader for genrate .d.ts file for css module.  

## Installation
```npm install css-type-loader```

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
              modules: true,
              camelCase: true // this is required for convert dashs to camelCase
            }
          }
        ]
      }
    ]
  }
};
```

## Propose of this repo
1. To generate types thats vaild syntax in Typescirpt
2. To sync with the newest css-loader


## Thanks for
- [typings-for-css-modules-loader](https://github.com/Jimdo/typings-for-css-modules-loader)
- [css-modules-typescript-loader](https://github.com/seek-oss/css-modules-typescript-loader)
