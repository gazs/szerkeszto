import React from "react";
import ReactDOM from "react-dom";
import svgPanZoom from "svg-pan-zoom"


class Szerkesztes extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.props;
	}

	componentDidMount () {
		var $0 = this.svgElement;
		var bbox = $0.getBBox();
		//svgPanZoom($0, {controlIconsEnabled: true})
		//
		$0.setAttribute('xmlns', "http://www.w3.org/2000/svg");

		$0.setAttribute("width", bbox.width + "cm")
		$0.setAttribute("height", bbox.height+ "cm")
		$0.setAttribute("viewBox", [bbox.x, bbox.y, bbox.width, bbox.height].join(" "));

	}

	download () {
		let link = document.createElement('a');
		link.download = "szerk.svg";
		link.href = `data:image/svg+xml;utf8,${this.svgElement.outerHTML}`;
		link.click();
	}

	render () {
		let {points, paths, lines} = this.props.szerkesztofunc(this.props.meretek, this.props.szamok)

		lines  = lines || []
		paths = paths || {}

		return (
			<div>
			<svg
				ref={(ref) => this.svgElement = ref}
				width="800"
				height="800">
				{Object.keys(paths).map (key =>
					<path d={paths[key]} key={'path_' + key}  fill="rgba(0,0,0,0.2)" stroke="rgba(0,0,0,0.6)" strokeWidth="0.2px" />
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
			<button onClick={this.download.bind(this)}>💾</button>
			</div>
		)
	}
}
module.exports = Szerkesztes
