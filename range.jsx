import React from "react";

class Measurement extends React.Component {
	constructor(props) {
		super(props);
		this.state = {value: 42};
	}

	handleChange (e) {
		this.setState({value: event.target.valueAsNumber});
	}

	render () {
		return <div><label>{this.props.name}<input type="range" value={this.state.value}  onChange={this.handleChange} /> {this.state.value}</label></div>
	}
}

class Formula extends React.Component {
	render () {
		return <div><label>{this.props.name}<input type="text" value={this.props.value}  onChange={this.handleChange} /></label></div>
	}
}

class Measurements extends React.Component {
	render () {
		var createItem = function(name) {
			var value =	this.props.items[name];
			return <Measurement name={name} value={value} key={name} />
		}.bind(this);
		return <ul>{Object.keys(this.props.items).map(createItem)}</ul>;
	}
}

class Formulas extends React.Component {
	render () {
		return <ul>{Object.keys(this.props.items).map(name =>
																									<Formula name={name} value={this.props.items[name]} key={name} />)}</ul>;
	}
}


module.exports = {Measurements, Formulas}
