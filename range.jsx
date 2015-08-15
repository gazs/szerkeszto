import React from "react";

class Measurement extends React.Component {
	constructor(props) {
		super(props);
		this.state = {value: this.props.value};
	}

	handleChange (e) {
		this.setState({value: event.target.valueAsNumber});
	}

	render () {
		return <div><label>{this.props.name}<input type="range" value={this.state.value} onChange={this.handleChange.bind(this)} /> {this.state.value}</label></div>
	}
}

class Formula extends React.Component {
	constructor(props) {
		super(props);
		this.state = {value: this.props.value};
	}
	handleChange (e) {
		this.setState({value: event.target.value});
	}
	render () {
		return <div><label>{this.props.name}<input type="text" value={this.state.value}  onChange={this.handleChange.bind(this)} /></label></div>
	}
}

class Measurements extends React.Component {
	render () {
		var createItem = function(name) {
			var value =	this.props.meretek[name];
			return <Measurement name={name} value={value} key={name} />
		}.bind(this);
		return <ul>{Object.keys(this.props.meretek).map(createItem)}</ul>;
	}
}

class Formulas extends React.Component {
	render () {
		return <ul>{Object.keys(this.props.items).map(name =>
								<Formula name={name} value={this.props.items[name]} key={name} />)}</ul>;
	}
}


module.exports = {Measurements, Formulas}
