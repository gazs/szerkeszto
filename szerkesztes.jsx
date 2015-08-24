import React from "react";

class Szerkesztes extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.props;
	}

	componentDidMount () {
		var $0 = React.findDOMNode(this)
		var bbox = $0.getBBox();
		$0.setAttribute("viewBox", [bbox.x, bbox.y, bbox.width, bbox.height].join(" "));
	}


	render () {
		let {points, paths, lines} = this.props.szerkesztofunc(this.props.meretek, this.props.szamok)

		lines = lines || []

		return (
      <svg
        width="800"
        height="800">
				{Object.keys(paths).map (key =>
					<path d={paths[key]} key={'path_' + key}  />
				)}
				{lines.map (line =>
					<line x1={line.a.x} y1={line.a.y} x2={line.b.x} y2={line.b.y} />
				)}
				{Object.keys(points).map (key =>
					<g key={key}>
						<circle cx={points[key].x} cy={points[key].y} r={0.5} key={key}/>
						<text x={points[key].x} y={points[key].y} fontSize="2">{key}</text>
					</g>
				)}
			</svg>
		)
	}
}
module.exports = Szerkesztes
