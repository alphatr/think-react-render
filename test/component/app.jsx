'use strict';

var React = require('react');
module.exports = React.createClass({
    displayName: 'App',
    render: function render() {
        var children = this.props.children;
        return (
            <div className="app">{children}</div>
        );
    }
});
