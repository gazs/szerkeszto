import React from "react";

class Measurement extends React.Component {
	render () {
		return <div><label>{this.props.name}<input type="range" value={this.props.value} /> {this.props.value}</label></div>
	}
}

class Measurements extends React.Component {
	render () {
		var createItem = function(name) {
			var value =	this.props.items[name];
			return <Measurement name={name} value={value} />
		}.bind(this);
		return <ul>{Object.keys(this.props.items).map(createItem)}</ul>;
	}
}

module.exports = Measurements
