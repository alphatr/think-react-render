'use strict';

var assert = require('chai').assert;
var path = require('path');
var http = require('http');
var jsDom = require('jsdom');

var Thinkjs = require('thinkjs');
var instance = new Thinkjs();
instance.load();

var ReactRender = require('../lib/index.js');

var component = path.resolve(__dirname, 'component');

var getHttp = function getHttp(options) {
    var req = new http.IncomingMessage();
    req.headers = {
        'host': 'www.thinkjs.org',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_0) AppleWebKit'
    };
    req.method = 'GET';
    req.httpVersion = '1.1';
    req.url = '/index/index';

    var res = new http.ServerResponse(req);
    res.write = function write() {
        return true;
    };

    return think.http(req, res).then(function setOption(http) {
        http._view = {};
        http._view.tVar = options._val || {};
        http.assign = function assign() {
            return http._view.tVar;
        };

        if (options) {
            for (var key in options) {
                http[key] = options[key];
            }
        }
        return http;
    });
};

var execMiddleware = function execMiddleware(options, content) {
    return getHttp(options).then(function runMiddleWare(http) {
        var instance = new ReactRender(http);
        return instance.run(content);
    });
};

describe('react component parse', function reactRender() {
    it('<App/>(self-closing tag without any arrtibutes and space)', function test() {
        execMiddleware({
            _config: {'react_render': {'root_path': component}}
        }, '<App/>').then(function render(data) {
            jsDom.env(data, function domParse(err, window) {
                var app = window.document.querySelector('.app');
                assert.isNull(err);
                assert.equal(app.nodeType, window.Node.ELEMENT_NODE);
                assert.equal(app.innerHTML, '');
            });
        });
    });

    it('< App / >(self-closing tag with space)', function test() {
        execMiddleware({
            _config: {'react_render': {'root_path': component}}
        }, '< App / >').then(function render(data) {
            jsDom.env(data, function domParse(err, window) {
                var app = window.document.querySelector('.app');
                assert.isNull(err);
                assert.equal(app.nodeType, window.Node.ELEMENT_NODE);
                assert.equal(app.innerHTML, '');
            });
        });
    });

    it('<App></App>(tag pairs without any arrtibutes and space)', function test() {
        execMiddleware({
            _config: {'react_render': {'root_path': component}}
        }, '<App></App>').then(function render(data) {
            jsDom.env(data, function domParse(err, window) {
                var app = window.document.querySelector('.app');
                assert.isNull(err);
                assert.equal(app.nodeType, window.Node.ELEMENT_NODE);
                assert.equal(app.innerHTML, '');
            });
        });
    });

    it('<App>children</App>(tag pairs with children text)', function test() {
        execMiddleware({
            _config: {'react_render': {'root_path': component}}
        }, '<App>children</App>').then(function render(data) {
            jsDom.env(data, function domParse(err, window) {
                var app = window.document.querySelector('.app');
                assert.isNull(err);
                assert.equal(app.nodeType, window.Node.ELEMENT_NODE);
                assert.equal(app.innerHTML, 'children');
            });
        });
    });

    it('< App > < / App >(tag pairs with space)', function test() {
        execMiddleware({
            _config: {'react_render': {'root_path': component}}
        }, '< App > < / App >').then(function render(data) {
            jsDom.env(data, function domParse(err, window) {
                var app = window.document.querySelector('.app');
                assert.isNull(err);
                assert.equal(app.nodeType, window.Node.ELEMENT_NODE);
                assert.equal(app.innerHTML, ' ');
            });
        });
    });
});

describe('react attributes parse', function reactRender() {
    it('<Attr name={name}/>(self-closing tag with one arrtibute)', function test() {
        var tVar = {
            name: 'attributes name'
        };

        execMiddleware({
            _config: {'react_render': {'root_path': component}},
            _view: {tVar: tVar}
        }, '<Attr name={name}/>').then(function render(data) {
            jsDom.env(data, function domParse(err, window) {
                var app = window.document.querySelector('.attr');
                assert.isNull(err);
                assert.equal(app.getAttribute('name'), tVar.name);
            });
        });
    });

    it('<Attr name={name}></Attr>(tag pairs with arrtibutes)', function test() {
        var tVar = {
            name: 'attributes name'
        };

        execMiddleware({
            _config: {'react_render': {'root_path': component}},
            _view: {tVar: tVar}
        }, '<Attr name={name}></Attr>').then(function render(data) {
            jsDom.env(data, function domParse(err, window) {
                var app = window.document.querySelector('.attr');
                assert.isNull(err);
                assert.equal(app.getAttribute('name'), tVar.name);
            });
        });
    });


    it('<Attr name={name} type={type}/>(tag with multiple arrtibutes)', function test() {
        var tVar = {
            name: 'attributes name',
            type: 'input'
        };

        execMiddleware({
            _config: {'react_render': {'root_path': component}},
            _view: {tVar: tVar}
        }, '<Attr name={name} type={type}/>').then(function render(data) {
            jsDom.env(data, function domParse(err, window) {
                var app = window.document.querySelector('.attr');
                assert.isNull(err);
                assert.equal(app.getAttribute('name'), tVar.name);
                assert.equal(app.getAttribute('type'), tVar.type);
            });
        });
    });

    it('<Attr name={name} \\n type={type} />(tag with arrtibutes and new line)', function test() {
        var tVar = {
            name: 'attributes name',
            type: 'input'
        };

        execMiddleware({
            _config: {'react_render': {'root_path': component}},
            _view: {tVar: tVar}
        }, '<Attr name={name} \n type={type} />').then(function render(data) {
            jsDom.env(data, function domParse(err, window) {
                var app = window.document.querySelector('.attr');
                assert.isNull(err);
                assert.equal(app.getAttribute('name'), tVar.name);
                assert.equal(app.getAttribute('type'), tVar.type);
            });
        });
    });

    it('<Attr name="name"/>(string attribute value)', function test() {
        var tVar = {
            name: 'attributes'
        };

        execMiddleware({
            _config: {'react_render': {'root_path': component}},
            _view: {tVar: tVar}
        }, '<Attr name="name"/>').then(function render(data) {
            jsDom.env(data, function domParse(err, window) {
                var app = window.document.querySelector('.attr');
                assert.isNull(err);
                assert.equal(app.getAttribute('name'), 'name');
            });
        });
    });

    it('<Attr name={"name"}/>(other type string attribute value)', function test() {
        var tVar = {
            name: 'attributes',
            type: 'input'
        };

        execMiddleware({
            _config: {'react_render': {'root_path': component}},
            _view: {tVar: tVar}
        }, '<Attr name={"name"}/>').then(function render(data) {
            jsDom.env(data, function domParse(err, window) {
                var app = window.document.querySelector('.attr');
                assert.isNull(err);
                assert.equal(app.getAttribute('name'), 'name');
            });
        });
    });

    it('<Attr name={obj.name}/>(arrtibutes value is a object arrtibute)', function test() {
        var tVar = {
            obj: {
                name: 'obj-name'
            }
        };

        execMiddleware({
            _config: {'react_render': {'root_path': component}},
            _view: {tVar: tVar}
        }, '<Attr name={obj.name}/>').then(function render(data) {
            jsDom.env(data, function domParse(err, window) {
                var app = window.document.querySelector('.attr');
                assert.isNull(err);
                assert.equal(app.getAttribute('name'), tVar.obj.name);
            });
        });
    });
});

describe('options', function reactRender() {
    it('root_path test', function test() {
        var appPath = path.resolve(__dirname, 'app');

        execMiddleware({
            _config: {'react_render': {'root_path': appPath}}
        }, '<App/>').then(function render(data) {
            jsDom.env(data, function domParse(err, window) {
                var app = window.document.querySelector('.other-app');
                assert.isNull(err);
                assert.equal(app.innerHTML, 'other-app');
            });
        });
    });

    it('jsx options', function test() {
        execMiddleware({
            _config: {
                'react_render': {
                    'jsx': false,
                    'root_path': component
                }
            }
        }, '<Nojsx/>').then(function render(data) {
            jsDom.env(data, function domParse(err, window) {
                var app = window.document.querySelector('.nojsx');
                assert.isNull(err);
                assert.equal(app.innerHTML, 'this is children');
            });
        });
    });

    it('delimiter options', function test() {
        var tVar = {
            name: 'attributes name'
        };

        execMiddleware({
            _config: {
                'react_render': {
                    'left_delimiter': '[',
                    'right_delimiter': ']',
                    'root_path': component
                }
            },
            _view: {tVar: tVar}
        }, '<Attr name=[name]></Attr>').then(function render(data) {
            jsDom.env(data, function domParse(err, window) {
                var app = window.document.querySelector('.attr');
                assert.isNull(err);
                assert.equal(app.getAttribute('name'), tVar.name);
            });
        });
    });
});
