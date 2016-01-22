'use strict';

var React = require('react');
module.exports = React.createClass({
    displayName: 'Attr',
    render: function render() {
        return (
            <div className="attr" name={this.props.name} type={this.props.type}></div>
        );
    }
});
