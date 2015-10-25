import React from 'react';

import szerk from './szerk2.pegjs';

import {point, line, intersectionOf} from './szerkfunc';
import _ from 'underscore';

class Playground extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			points: {},
			text: `// zakó
var testmagassag = 170cm
var mellboseg = 100cm
var derekboseg = 88cm
var csipoboseg = 106cm
var derekhossza = 44.5cm
var zakohossza = 76cm
var hataszelesseg = 22cm
var vallszelesseg = 15.5cm
var ujjahossza = 78cm
var hata_egyensulymeret = 47cm
var eleje_egyensulymeret = 46cm

var tm = testmagassag
var mb = mellboseg / 2
var db = derekboseg / 2
var csb = csipoboseg / 2

// HÁTA
var kulcsszam = db / 10 + ((mb / 10) * 0.5) - 5cm

var honaljmelyseg = tm / 10 + mb / 10
1 = start
1-2 = down kulcsszam
1-3 = down honaljmelyseg
2-4 = down honaljmelyseg / 2
2-5 = down honaljmelyseg / 4
1-6 = down derekhossza

var csipomelyseg = tm / 10
6-7 = down csipomelyseg
1-8 = down zakohossza
2-9 = left hataszelesseg + 1cm

10 = intersect 4.horizontal 9.vertical
11 = intersect 3.horizontal 9.vertical

10-12 = down 3cm
12-13 = left 1cm

////15 = [1-9].closestPointTo 5
////
//var nyakszelesseg = mb / 10 + 3.5cm
////16 = [1-9].atDistance nyakszelesseg

	`};
}
	componentDidUpdate () {
		this.zoom();
	}
	componentDidMount () {
		this.zoom();
	}
	zoom () {
		let $0 = React.findDOMNode(this).querySelector('svg')
		let bbox = $0.getBBox();
		$0.setAttribute("viewBox", [bbox.x, bbox.y, bbox.width, bbox.height].join(" "));
	}
	onTextareaChange (e) {
		this.setState({text: e.target.value});
	}
	render () {
		let points = {};
		let value = []
		try {
			value = szerk.parse(this.state.text);
		} catch (e) {
			value = []
		}


		function parseLine(lineObject) {
			let line;
			switch (lineObject.type) {
				case "simpleLine":
					line = new line(points[lineObject.id1], points[lineObject.id2])
					break;
				case "verticalLine":
					line = points[lineObject.id].verticalLine();
					break;
				case "horizontalLine":
					line = points[lineObject.id].horizontalLine();
					break;
				default:
					console.warn('unkown line type');
			}
			return line;
		}

			value.map(command => {
					switch (command.type) {
						case "variable":
							break;
						case "comment":
							//console.log('comment', command.value)
							break;
						case "newpoint":
							points[command.id] = new point(0,0);
							break;
						case "pointFromOtherPoint":
							let {startingpoint, direction, distance} = command;
							points[command.id] = points[startingpoint][direction](distance);
							break;
						case "intersection":
							let {line1, line2} = command;
							points[command.id] = intersectionOf(parseLine(line1), parseLine(line2));
							console.warn("intersection TKTKTK");
							console.log(command)
							break;
						default:
							console.warn('unsupported', command.type);
					}
			})
		console.log(points)
		return <div>
			<svg
				width="800"
				height="800">
				{Object.keys(points).map (key =>
					<g key={key}>
						<circle cx={points[key].x} cy={points[key].y} r={2} key={key}/>
						<text x={points[key].x} y={points[key].y} fontSize="20">{key}</text>
					</g>
				)}
			</svg>
			<textarea cols="80" rows="10" value={this.state.text} onChange={this.onTextareaChange.bind(this)}/>
		</div>
	}
}

React.render(
	<Playground />,
	document.querySelector('#main'));
