import React from 'react';
import ReactDOM from 'react-dom';

import szerk from './szerk.pegjs';
import mathUtils from "./toxi/math/mathUtils"

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

15 = [1-9].closestPointTo 5

var nyakszelesseg = mb / 10 + 3.5cm
15-16 = angleOf [15-9] nyakszelesseg

6-__17a =up hata_egyensulymeret + 1
17 = intersect __17a.horizontal 16.perpendicularWith [1-16]
17-18 = angleOf [17-9] vallszelesseg + 1 + 0.5cm

6-19 = left 3cm
8-20 = left 4cm

20-21 = perpendicularTo [19-20]  csb / 10 * 3.5

22 = intersect 21.perpendicularWith [21-20] 7.horizontal

23 = intersect 7.horizontal [19-20]
//24-25 = right 1
// TODO FIXME

var eleje_tavolsag = 25cm

3-33 = left mb + eleje_tavolsag
6-34 = left mb + eleje_tavolsag
7-35 = left mb + eleje_tavolsag

var derekszelesseg = db / 10 * 5
33-36 = right derekszelesseg
36-37 = up kulcsszam
36-38 = left derekszelesseg / 2 + kulcsszam / 2
38-39 = left mb / 10 * 2

var mellszelesseg = mb / 10 * 4 + 4cm
39-40 = angleOf [39-37] mellszelesseg
41 = intersect 36.horizontal 40.perpendicularWith [40-37]
40-42 = angleOf [41-40] 3cm

41-43 = right 5cm

var honaljszelesseg = mb / 10 * 2.5 + 3cm
41-44 = right honaljszelesseg
34-45 = right db / 10 * 2 + 6cm // mellformázó varrás helye
46 = intersect 45.vertical 3.horizontal
46-47 = down 3cm
47-48 = left 0.5cm
46-49 = down [8-46].length / 2 + 3cm
	`};
}
	componentDidUpdate () {
		this.zoom();
	}
	componentDidMount () {
		this.zoom();
	}
	zoom () {
		let $0 = ReactDOM.findDOMNode(this).querySelector('svg')
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


		var Interpreters = {
			line: function (lineObject) {
				let l;
				switch (lineObject.type) {
					case "simpleLine":
						l = new line(points[lineObject.id1], points[lineObject.id2])
						break;
					case "verticalLine":
						l = points[lineObject.id].verticalLine();
						break;
					case "horizontalLine":
						l = points[lineObject.id].horizontalLine();
						break;
					case "perpendicular":
						let other = this['line'](lineObject.line)
						l = new line(points[lineObject.id],
												 points[lineObject.id].atAngle(other.angle + mathUtils.radians(90), 100))
						break;

					default:
						console.warn('unkown line type', lineObject.type);
				}
				return l;
			},
			angle: function (angleObject) {
				let angle;
				switch (angleObject.type) {
					case "angle":
						angle =  mathUtils.radians(angleObject.deg)
						break;
					case "angleOf":
						angle = this['line'](angleObject.line).angle
						break;
					case "perpendicularTo":
						angle = this['line'](angleObject.line).angle + mathUtils.radians(90)
				}
				return angle;
			}

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
							points[command.id] = points[startingpoint].atAngle(Interpreters['angle'](direction), distance);
							break;
						case "intersection":
							let {line1, line2} = command;
							points[command.id] = intersectionOf(Interpreters['line'](line1), Interpreters['line'](line2));
							break;
						case "closestPointTo":
							let line = Interpreters['line'](command.line);
							points[command.id] = line.closestPointTo(points[command.point]);
							break;
						default:
							console.warn('unsupported', command);
					}
			})
		console.log(points)
		return <div>
			<svg
				width="800"
				height="800">
				{Object.keys(points).filter(x=> !x.startsWith("__")).map (key =>
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

ReactDOM.render(
	<Playground />,
	document.querySelector('#main'));
