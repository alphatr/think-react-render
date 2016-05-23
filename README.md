# Think-react-render

react server side rendering for thinkjs 2.x

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]

[中文文档](https://github.com/AlphaTr/think-react-render/blob/master/README_zh-CN.md)

## Install

```
npm install think-react-render
```

## How to use in thinkjs

open the middleware configuration file `bootstrap/middleware.js`, and add this content as follows for register middleware:

```javascript
var reactRender = require('think-react-render');
think.middleware('react_render', reactRender);
```

edit the hook configuration file `config/hook.js`, edit the configuration properties, it can auto executes in each request and after the view parse.

```javascript
module.exports = {
    'view_parse': ['append', 'react_render']
};
```

write React component in the view files, the middleware will capitalize the first letter of the tag identified as a React component and rendering in service side.

this is a part of JSX Syntax. doesn't support child component, so you can use it as a entrance.

```
<!doctype html>
<html>
<head>
    <meta charset="UTF-8">
    <title>React</title>
</head>
<body>
    <App name={appname}></App>
</body>
</html>
```

use `this.assign()` method in controller to assign the data to view files.

```javascript
var Base = require('./base.js');

module.exports = think.controller(Base, {
    indexAction: function (self) {
        this.assign('appname', "think-react-render");
        return this.display();
    }
});
```

create your self component files in the `view/component` directory, such as the follows `app.jsx`:

```javascript
var React = require('react');

module.exports = React.createClass({
    render: function () {
        return (
            <div id="app">{this.props.name}</div>
        );
    }
});
```

Here are the results rendered

```
<!doctype html>
<html>
<head>
    <meta charset="UTF-8">
    <title>React</title>
</head>
<body>
    <div id="app" data-reactid=".2cj2burx62o" data-react-checksum="-459794789">think-react-render</div>
</body>
</html>
```

## Configuration

you can create `config/react_render.js` configuration file as follow:

```javascript
module.exports = {
    jsx: true, // use jsx syntax? default is true
    extension: '.jsx', // The extension of component files, default is .jsx,
    root_path: 'component', // Component file path, the path relative for `view.root_path`, and this support absolute path.
    left_delimiter: '{', // The delimiter of component arrribute in view files, such as "name={appname}", this configuration doesn't work for react component file, you can change it when the default value conflict with view file syntax.
    right_delimiter: '}', // such as the above
    lower_name: true // is the component use lower case filename.
};
```

## LICENSE

MIT
