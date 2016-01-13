import React from "react";
import ReactDOM from "react-dom";
import { connect } from 'react-redux';

//import svgPanZoom from "svg-pan-zoom"

class SaveElement extends React.Component {
	render () {
		return (
			<a download="szerk.svg"
				href="data:image/svg+xml;utf8,">
				💾
			</a>
		)
	}
}

class Szerkesztes extends React.Component {

	componentDidMount () {
		var $0 = this.svgElement;
		var bbox = $0.getBBox();
		//svgPanZoom($0, {controlIconsEnabled: true})
		//
		$0.setAttribute('xmlns', "http://www.w3.org/2000/svg");

		$0.setAttribute("width", bbox.width + "cm")
		$0.setAttribute("height", bbox.height+ "cm")
		$0.setAttribute("viewBox", [bbox.x, bbox.y, bbox.width, bbox.height].join(" "));

		// ugh WHY DO YOU HATE ME REACTJS?
		$0.setAttribute('xmlns:inkscape', 'http://www.inkscape.org/namespaces/inkscape');
		$0.setAttribute('xmlns:sodipodi', 'http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd')
		var namedView = document.createElement('sodipodi:namedview');
		namedView.setAttribute("inkscape:document-units", "mm");
		$0.appendChild(namedView);
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
				height="800"
				units="mm"
				>
				{Object.keys(paths).map (key =>
					<path d={paths[key]} key={'path_' + key}  style={{fill:"none", stroke:"#000000", strokeWidth:"0.1px"}} />
				)}
				{lines.map (line =>
					<line x1={line.a.x} y1={line.a.y} x2={line.b.x} y2={line.b.y} />
				)}
				{Object.keys(points).map (key =>
					<g key={key}>
						<circle cx={points[key].x} cy={points[key].y} r={0.2} key={key}/>
						<text x={points[key].x} y={points[key].y} fontSize="2">{key}</text>
					</g>
				)}
			</svg>
			<button onClick={this.download.bind(this)}>💾</button>
			</div>
		)
	}
}

function selector(state) {
	return state //.foo;
}

export default connect(selector)(Szerkesztes)
