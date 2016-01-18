import React from "react";
import ReactDOM from "react-dom";
import { connect } from 'react-redux';


class Szerkesztes extends React.Component {
	constructor () {
		super();
		this.state = {
			showLabels: false,
		}
	}

	componentDidMount () {
		this.zoomSVG();
		const $0 = this.svgElement;

		// ugh WHY DO YOU HATE ME REACTJS?
		$0.setAttribute('xmlns:inkscape', 'http://www.inkscape.org/namespaces/inkscape');
		$0.setAttribute('xmlns:sodipodi', 'http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd')
		const namedView = document.createElement('sodipodi:namedview');
		namedView.setAttribute("inkscape:document-units", "mm");
		$0.appendChild(namedView);
	}

	componentDidUpdate () {
		this.zoomSVG();
	}
	zoomSVG () {
		const $0 = this.svgElement;
		const bbox = $0.getBBox();

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
		let {points, paths, lines} = this.props.szerkesztofunc(this.props.meretek)

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
						{this.state.showLabels ? <text x={points[key].x} y={points[key].y} fontSize="2">{key}</text> : null }
					</g>
				)}
			</svg>
			<div>
				<label><input type="checkbox" checked={this.state.showLabels} onChange={ () => this.setState({showLabels: !this.state.showLabels})}/> 🔢</label>
			</div>
			<div>
				<button onClick={this.download.bind(this)}>💾</button>
			</div>
		</div>
		)
	}
}

function selector(state) {
	return state //.foo;
}

export default connect(selector)(Szerkesztes)
