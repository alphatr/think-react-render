# think-react-render

thinkjs 中间件，使用 thinkjs 来做 React 服务端渲染

## 安装

```
npm install think-react-render
```

建议使用 npm.taobao.org 源来安装，详见 [npm.taobao.org](http://npm.taobao.org/)

## 在 thinkjs 中使用

编辑 `bootstrap/middleware.js`，注册中间件

```javascript
var reactRender = require('think-react-render');
think.middleware('react_render', reactRender);
```

编辑 `config/hook.js`，调用中间件

```javascript
module.exports = {
    'view_parse': ['append', 'react_render']
};
```

然后在模板文件中书写 component, 中间件会将首字母大写的标签识别为 component 并进行服务端渲染。

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
这里将会渲染 App 组件，它带有一个 name 的属性。name 的属性值这里沿用 React 的做法，appname 是一个变量名称，如果要使用直接的字符串，请使用 `name={"string"}` 或者 `name="string"` 这种形式。

在 controller 中使用 `this.assign()` 方法将数据 assign 到模板文件

```javascript
var Base = require('./base.js');

module.exports = think.controller(Base, {
    indexAction: function (self) {
        this.assign('appname', "think-react-render");
        return this.display();
    }
});
```

这里 assign 的 `appname` 将会被用到 上面的 `App` 组件中

在 `view/component` 目录下创建你的 component 文件，例如上面的 `app.jsx`:

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

最后渲染的结果就是这样子

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

## 配置选项

可以创建 `config/react_render.js` 配置文件：

```javascript
module.exports = {
    jsx: true, // 是否使用 jsx 语法，默认使用
    extension: '.jsx', // component 文件的后缀，默认是 jsx,
    root_path: 'component', // component 文件的路径，如果是相对地址，那就是相对于 view.root_path 的，同时支持绝对地址
    left_delimiter: '{', // 在模板文件中 component 属性的定界符 如 "name={appname}"，不对 component 中的有影响，当和模板的定界符冲突就需要更改
    right_delimiter: '}', // 同上
    lower_name: true // 是否 component 的文件名使用小写
};
```

## LICENSE

MIT
