import Vec2D from "./toxi/geom/Vec2D"
import Line2D from "./toxi/geom/Line2D"
import Ray2D from "./toxi/geom/Ray2D"
import Circle from "./toxi/geom/Circle"
import mathUtils from "./toxi/math/mathUtils"
import getIntersections from "./geometricFunctions"

class point {
	constructor (x, y) {
		this.vec = new Vec2D(x, y);
	}

	get x() { return this.vec.x}
	get y() { return this.vec.y}

	atAngle (rad, distance) {
		let v = new Vec2D(0, distance).rotate(rad)
		return new point(this.vec.add(v.x, v.y))
	}

	atAngleOf(line, distance) {
		return this.atAngle(line.angle, distance)
	}


	left (distance) {
		return this.atAngle(mathUtils.radians(90), distance)
	}

	right (distance) {
		return this.atAngle(mathUtils.radians(270), distance)
	}

	up (distance) {
		return this.atAngle(mathUtils.radians(180), distance)
	}

	down (distance) {
		return this.atAngle(0, distance)
	}

	distance (p2) {
		return new Line2D(this.vec, p2.vec).getLength();
	}

	perpendicularToLineWith (p2, distance, flip) {
		if (!p2) {
			debugger
		}
		let currentAngle = Math.atan2(p2.y - this.vec.y, p2.x - this.vec.x)
		return this.atAngle(currentAngle + mathUtils.radians(flip ? 0 : 180), distance)
	}


	horizontalLine () {
		return new Line2D(this.vec, this.left(1).vec).copy().scale(100)
	}

	verticalLine () {
		return new Line2D(this.vec, this.up(1).vec).copy().scale(100)
	}

	longlinePerpendicularToLineWith (p2, flip) {
		let p3 = this.perpendicularToLineWith(p2, 20, flip)
		return new Line2D(this.vec, p3.vec);
	}

	circleLineIntersect (line, radius, which = 'intersection2') {
		var circlecenter = this;
		var _p77 = getIntersections([line.a.x, line.a.y], [line.b.x, line.b.y], [circlecenter.x, circlecenter.y, radius]).points[which].coords;
		return new point(_p77[0], _p77[1]);
	}

}

class line {
			constructor(p1, p2) {
				if (!p1) {
					throw new Error("p1 is falsy")
				}
				if (!p2) {
					throw new Error("p2 is falsy")
				}
				this.line = new Line2D(p1.vec, p2.vec).copy()
			}
			atDistance (distance) {
				let vec2d = this.line.toRay2D().getPointAtDistance(distance);
				return new point(vec2d.x, vec2d.y);
			}
			get angle() {
				return Math.atan2(this.line.b.y - this.line.a.y, this.line.b.x - this.line.a.x)+ mathUtils.radians(270) ///// W T F
			}
			get length() {
				return this.line.getLength();
			}

			closestPointTo (p) {
				return new point(this.line.closestPointTo(p.vec));
			}

			getMidPoint() {
				return new point(this.line.getMidPoint())
			}

			copy () {
				return this.line.copy()
			}
			get a() { return this.line.a}
			get b() { return this.line.b}
		}

function createL(points) {
	return function l(str) {
		let [p1, p2] = str.split('-')
		return new line(points[p1],points[p2])
	}
}

function intersectionOf(line1, line2) {
	let pos = line1.copy().scale(20).intersectLine(line2.copy().scale(20)).pos;
	if (pos) {
		return new point(pos.x, pos.y)
	} else {
		throw Error('!!! points dont intersect', line1, line2)
	}
}

module.exports = {
	point,
	line,
	createL,
	intersectionOf
}
