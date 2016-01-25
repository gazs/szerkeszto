import React from 'react';
import { connect } from 'react-redux';
class ListMeasurements extends React.Component {
	render () {
		const measurements = this.props.patterns;
		return 	<ul className="col-md-4 list-unstyled">
			{measurements.map( measurement =>
				<li key={measurement.name}>{measurement.name}
				</li>
			)}
			</ul>
	}
}
function selector(state) {
	return state; //.patterns;
}

export default connect(selector)(ListMeasurements)
