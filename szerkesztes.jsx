import React from "react";
import svgPanZoom from "svg-pan-zoom"


class Szerkesztes extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.props;
	}

	componentDidMount () {
		var $0 = React.findDOMNode(this)
		var bbox = $0.getBBox();
		//svgPanZoom($0, {controlIconsEnabled: true})

		$0.setAttribute("width", bbox.width + "cm")
		$0.setAttribute("height", bbox.height+ "cm")
		$0.setAttribute("viewBox", [bbox.x, bbox.y, bbox.width, bbox.height].join(" "));
	}

	render () {
		let {points, paths, lines} = this.props.szerkesztofunc(this.props.meretek, this.props.szamok)

		lines  = lines || []
		paths = paths || {}

		return (
			<svg
				width="800"
				height="800">
				{Object.keys(paths).map (key =>
					<path d={paths[key]} key={'path_' + key}  fill="rgba(0,0,0,0.2)" stroke="rgba(0,0,0,0.6)" strokeWidth="0.4px" />
				)}
				{lines.map (line =>
					<line x1={line.a.x} y1={line.a.y} x2={line.b.x} y2={line.b.y} />
				)}
				{Object.keys(points).map (key =>
					<g key={key}>
						<circle cx={points[key].x} cy={points[key].y} r={0.2} key={key}/>
						{ /* <text x={points[key].x} y={points[key].y} fontSize="2">{key}</text> */ }
					</g>
				)}
			</svg>
		)
	}
}
module.exports = Szerkesztes
