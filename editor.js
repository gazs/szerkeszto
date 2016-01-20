import React from 'react';
import ReactDOM from 'react-dom';

import szerk from './szerk.pegjs';
import mathUtils from "./toxi/math/mathUtils"

import {point, line, intersectionOf} from './szerkfunc';

import zako_szerk from './drafts/zako.szerk'

console.log(zako_szerk)

class Playground extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			points: {},
			text: zako_szerk
		};
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
