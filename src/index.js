'use strict';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import path from 'path';

export default class extends think.middleware.base {
    /**
     * 初始化
     * @return {undefined}
     */
    init(http) {
        super.init(http);
        let defaultConfig = {
            jsx: true,
            extension: '.jsx',
            root_path: 'component',
            lower_name: true,
            left_delimiter: '{',
            right_delimiter: '}'
        };

        this.config = think.extend(defaultConfig, think.config('react_render'));

        if (this.config.jsx) {
            require('node-jsx').install({extension: this.config.extension})
        }
    }

    /**
     * 将组件对象使用 React 渲染成 html 字符串
     * @param  {Object} component 组件对象
     * @return {String}           渲染结果
     */
    render(component) {
        if (component.attrs.children) {
            component.attrs.children = this.parse(component.attrs.children, );
        }

        var reactPath = path.join(this.config.root_path, component.name + this.config.extension);
        if (this.config.lower_name) {
            reactPath = path.join(this.config.root_path, component.name.toLowerCase() + this.config.extension);
        }

        var rootPath = path.resolve(think.config('view.root_path'), reactPath);

        // todo: 判断路径存在
        var app = React.createFactory(require(rootPath));
        var str = ReactDOMServer.renderToString(app(component.attrs));
        return str;
    }

    /**
     * 解析 content 字符串，返回渲染结果
     * @param  {String} content 渲染的字符串
     * @return {String}         react 渲染后的结果
     */
    parse(content) {
        var self = this;
        var doubleRegex = /<\s*([A-Z][a-zA-Z-]+)(\s+[^>]+?)?\s*>(.*?)<\s*\/\s*\1\s*>/g;
        var singleRegex = /<\s*([A-Z][a-zA-Z-]+)(\s+[^>]+?)?\s*\/\s*>/g;

        var replaceFn = function (full, app, attrs, children) {
            attrs = self.attrParse(attrs || '');

            if (children) {
                attrs.children = children;
            }

            return self.render({name: app, attrs});
        };

        return content.replace(singleRegex, replaceFn).replace(doubleRegex, replaceFn);
    }

    /**
     * 解析 component 的属性
     * @param  {String} attrStr 属性字符串
     * @return {Object} 解析后的属性对象
     */
    attrParse(attrStr) {
        var attrObj = {};
        var tVar = this.tVar;

        var encodeReg = str => str.replace(/([\*\.\?\+\$\^\[\]\(\)\{\}\|\\\/])/ig, match => '\\' + match);
        let leftDelimiter = encodeReg(this.config.left_delimiter);
        let rightDelimiter = encodeReg(this.config.right_delimiter);
        var delimiterRegex = new RegExp(`(^${leftDelimiter}\s*)|(\s*${rightDelimiter}$)`, 'g');

        var getValue = key => {
            if (/(^['"])|(['"]$)/g.test(key)) {
                return tVar[key.replace(/(^['"])|(['"]$)/g, '')];
            }

            var temp = tVar;
            key.split('.').forEach(item => {temp = temp[item]});
            return temp;
        }

        attrStr.split(/\s+/g).forEach(attr => {
            var key = attr.split('=')[0].trim();
            var tempVal = attr.split('=').slice(1).join('=');
            var value = false;

            if (tempVal) {
                if (delimiterRegex.test(tempVal)) {
                    value = getValue(tempVal.replace(delimiterRegex, '').trim());
                } else {
                    value = tempVal.replace(/(^['"])|(['"]$)/g, '');
                }
            }

            if (!attrObj[key]) {
                return attrObj[key] = value;
            }

            // todo: warning
        });

        return attrObj;
    }

    /**
     * middleware 入口
     * @param  {String} content 渲染后的页面字符串
     * @return {Promise} React 服务端渲染后的字符串
     */
    run(content) {
        this.tVar = this.http._view.tVar;
        return this.parse(content);
    }
}
