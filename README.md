# PostCSS Modules Tilda [![Build Status][ci-img]][ci]

[PostCSS] plugin to restore the way to resolve modules CSS Modules values paths that css-loader [used to do before 2.0].

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/princed/postcss-modules-tilda.svg
[ci]:      https://travis-ci.org/princed/postcss-modules-tilda
[used to do before 2.0]:      https://github.com/webpack-contrib/css-loader/blob/master/CHANGELOG.md#breaking-changes-1

Before:

```css
@value module from "module/module.css";
a {
  composes: module; 
  composes: selector from "module/module.css";
}
```

After:

```css
@value module from "~module/module.css";
a { 
  composes: module;
  composes: selector from "~module/module.css";
}

```

## Usage

```js
postcss([ require('postcss-modules-tilda') ])
```

See [PostCSS] docs for examples for your environment.
