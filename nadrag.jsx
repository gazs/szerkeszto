render (m, sz) {

		let {testmagassag,
			derekboseg,
			csipoboseg,
			nadrag_kulso_hossza,
			nadrag_belso_hossza,
			nadrag_aljaboseg} = m;

		let db = derekboseg / 2,
			csb = csipoboseg / 2,
			tm = testmagassag;


		class p {
			constructor (x, y) {
				this.vec = new Vec2D(x, y);
			}

			get x() { return this.vec.x}
			get y() { return this.vec.y}

			atAngle (rad, distance) {
				let v = new Vec2D(0, distance).rotate(rad)
				return new p(this.vec.add(v.x, v.y))
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

			perpendicularToLineWith (p2, distance) {
				return this.atAngle((new Line2D(this.vec, p2.vec).getTheta()) + mathUtils.radians(180), distance)
			}


			horizontalLine () {
				return new Line2D(this.vec, this.left(1).vec).copy().scale(100)
			}

			verticalLine () {
				return new Line2D(this.vec, this.up(1).vec).copy().scale(100)
			}

			longlinePerpendicularToLineWith (p2) {
				let p3 = this.perpendicularToLineWith(p2, 20)
				return new Line2D(this.vec, p3.vec);
			}
		}

		let lines = []

		class line {
			constructor(p1, p2) {
				this.line = new Line2D(p1, p2).copy()
			}
			atDistance (distance) {
				let vec2d = this.line.toRay2D().getPointAtDistance(distance);
				return new p(vec2d.x, vec2d.y);
			}
			get a() { return this.line.a}
			get b() { return this.line.b}
		}

		
		function l(str) {
			let [p1, p2] = str.split('-')
			let l = new Line2D(points[p1].vec, points[p2].vec).copy()
			return l

		}

		// intersectionOf(l('11-12'), l('13-14'))
		function intersectionOf(line1, line2) {
				//lines.push(line1)
				//lines.push(line2)
			let pos = line1.copy().scale(2).intersectLine(line2.copy().scale(2)).pos;
			if (pos) {
			return new p(pos.x, pos.y)
			} else {
			}
		}


		let points = {};

		points[1] = new p();
		// 1-2 = nadrag_kulso_hossza + 1cm;
		points[2] = points[1].up(nadrag_kulso_hossza + 1)
		//// 1-3 = nadrag_belso_hossza + 1cm;
		points[3] = points[1].up(nadrag_belso_hossza + 1)
		//// 1-4 = (1-3) / 2 + 5cm;
		points[4] = points[1].up((nadrag_belso_hossza + 1) / 2)
		//// 3-5 = ferde combvonal helye = csb / 10 * 5
		points[5] = points[3].up((csb / 10) * 0.5)
		//// 2-6 = csipovonal = tm / 10
		points[6] = points[2].down(tm/10)
		//// 3-7 = segedbpont = 0.8
		points[7] = points[3].left(0.8)
		//// 7-8 = combboseg = csb / 10 * 5
		points[8] = points[7].left(csb / 10 * 5)
		// 8-9 = alamanet_szelessege = csb / 10
		points[9] = points[8].left(csb /10)
		// 9-9a = jobb_szar_keskenyites = 1.5
		points['9a'] = points[9].right(1.5)
		// 9-10 = 9-7 távolság fele
		points[10] = points[9].right(points[9].distance(points[7]) / 2)
		// 11, 12, 13 = vonalérintkezés, ill vonalkeresztezés
		points[11] = new p(points[10].x, points[2].y)
		points[12] = new p(points[10].x, points[4].y)
		points[13] = new p(points[10].x, points[1].y)
		// 13-14 és 13-15 = aljaboseg / 4
		points[14] = points[13].right(nadrag_aljaboseg / 4)
		points[15] = points[13].left(nadrag_aljaboseg / 4)
		// 13-16 = segédpont = 1
		points[16] = points[13].up(1)
		// 14-14a = 15-15a = 7cm
		points['14a'] = points[14].perpendicularToLineWith(points[16], 7);
		points['15a'] = points[15].perpendicularToLineWith(points[16], 7);
		// 17-18 vonalkeresztezés
		points['17'] = intersectionOf(l('4-12').scale(5), l('15a-9').scale(5))
		points['18'] = intersectionOf(l('4-12').scale(5), l('14a-6').scale(5))
		 //6a-19 vonalérintkezés ill vonalkeresztezés
		 points['6a'] = intersectionOf(
											 points[6].horizontalLine(),
											 points[8].longlinePerpendicularToLineWith(points[5])
										 )
		points[19] = intersectionOf(
											 points[2].horizontalLine(),
											 points[8].longlinePerpendicularToLineWith(points[5])
										 )
		// 19-20 = derékbőség = db / 10 * 5 + 3
		points[20] = points[19].right(db / 10 * 5 + 3)
		points[21] = points[11].right(l('11-20').getLength() / 2)
		// 11-21=11-20 / 2
		// 22 = vonalérintkezés
		points[22] = intersectionOf(points[21].verticalLine(),
															 points[6].horizontalLine())	//new p(points[21].x, points[6].y)
		// 22-23 = 4cm
		points[23] = points[22].up(4);
		// 21-14 = 21-15 = formázóvarrás / 2 = 3/2
		points[24] = points[21].left(3 / 2)
		points[25] = points[21].right(3 / 2)
		// 19-26 = derékvonal
		points[26] = points[19].down(0.6)
		//
		////
		function M(p_id) {
			let p = points[p_id];
			return `M${p.x},${p.y}`
		}
		function L(p_id) {
			let p = points[p_id];
			return `L${p.x},${p.y}`
		}
		function path() {
			return Array.prototype.join.call(arguments, " ")
		}
		var paths = {}
		paths.eleje = path(
			M(6),
			L(7),
			L(14),
			L(16),
			L(15),
			L(9),
			L('6a'), // TODO ív
			L(26),
			L(24),
			L(23),
			L(25),
			L(20),
			"Z")

		paths.eleje_keskenyebb = path(
			M(6),
			L(7),
			L(14),
			L(16),
			L(15),
			L('9a'),
			L('6a'), // TODO kicsit arrébb
			L(26),
			L(24),
			L(23),
			L(25),
			L(20),
			"Z")

	return {points, paths, lines}
}

module.exports = render
