'use strict';

var React = require('react');
module.exports = React.createClass({
    displayName: 'Nojsx',
    render: function render() {
        return React.createElement('div', {className: 'nojsx'}, 'this is children');
    }
});
