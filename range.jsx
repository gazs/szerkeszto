import React from "react";

class Dropdown extends React.Component {
	handleChange (e) {
		this.props.model.set({preset: e.target.value});
	}
	render () {
		return (
			<select className="form-control" value={this.props.selected} onChange={this.handleChange.bind(this)}>
				{Object.keys(this.props.options).map( name =>
					<option key={name} value={name} >{name}</option>
				) }
			</select>
		)
	}
}

class Measurement extends React.Component {

	render () {
		var inputType = (typeof this.props.value) === 'number' ? 'number' : 'text';
		var pattern;
		if (inputType == 'number') {
			pattern="[0-9]*"
		}

		return (
			<div>
				<label
					className="control-label col-sm-6"
					htmlFor={this.props.name}>{this.props.name}</label>
<div className="col-sm-6">
				<input
					className="form-control"
					name={this.props.name}
					id={this.props.name}
					type={inputType}
					pattern={pattern}
					value={this.props.value}
					onChange={this.props.onChange.bind(this)} />
					</div>
			</div>
		)
	}
}


class Measurements extends React.Component {
	constructor(props) {
		super(props);
		this.state = {items: this.props.items};
	}

	handleChange (e) {
		var value = isNaN(e.target.valueAsNumber) ? e.target.value : e.target.valueAsNumber;
    var name = e.target.name
    var state = this.state
    state.items[name] = value
    this.setState(state)
		this.props.model.set(state.items);
	}
	render () {
		return (
			<div className="form-group">{Object.keys(this.props.items).map(name =>
				<Measurement name={name} value={this.state.items[name]} key={name} onChange={this.handleChange.bind(this)} />)}
			</div>)
	}
}


module.exports = {Dropdown, Measurements}
