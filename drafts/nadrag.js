var {point, line, createL, intersectionOf} =require("../szerkfunc")
import mathUtils from "../toxi/math/mathUtils"

function render (m, sz) {

		let {testmagassag,
			derekboseg,
			csipoboseg,
			nadrag_kulso_hossza,
			nadrag_belso_hossza,
			nadrag_aljaboseg} = m;

		let db = derekboseg / 2,
			csb = csipoboseg / 2,
			tm = testmagassag;



		let lines = []
		let points = {};


		let l = createL(points)

		points[1] = new point();
		points[2] = points[1].up(nadrag_kulso_hossza + 1)
		points[3] = points[1].up(nadrag_belso_hossza + 1)
		points[4] = points[1].up((nadrag_belso_hossza + 1) / 2 + 5)
		points[5] = points[3].up((csb / 10) * 0.5)
		points[6] = points[2].down(tm/10)
		points[7] = points[3].left(0.8)
		points[8] = points[7].left(csb / 10 * 5)
		points[9] = points[8].left(csb /10)
		points['9a'] = points[9].right(1.5)
		points[10] = points[9].right(points[9].distance(points[7]) / 2)
		points[11] = intersectionOf(
			points[10].verticalLine(),
			points[2].horizontalLine()
		)
		points[12] = intersectionOf(
			points[10].verticalLine(),
			points[4].horizontalLine()
		)
		points[13] = intersectionOf(
			points[10].verticalLine(),
			points[1].horizontalLine()
		)
		points[14] = points[13].right(nadrag_aljaboseg / 4)
		points[15] = points[13].left(nadrag_aljaboseg / 4)
		points[16] = points[13].up(1)
		points['14a'] = points[14].perpendicularToLineWith(points[16], 7, 'otherside');
		points['15a'] = points[15].perpendicularToLineWith(points[16], 7);
		points['17'] = intersectionOf(
			points[4].horizontalLine(),
			l('15a-9')
		)
		points['18'] = intersectionOf(
			points[4].horizontalLine(), l('14a-6')
		)
		points['6a'] = intersectionOf(
			points[6].horizontalLine(),
			points[8].longlinePerpendicularToLineWith(points[3])
		)
		points[19] = intersectionOf(
			points[2].horizontalLine(),
			points[8].longlinePerpendicularToLineWith(points[3])
		)
		points[20] = points[19].right((db / 10) * 5 + 3)
		points[21] = points[11].right(l('11-20').length / 2)
		points[22] = intersectionOf(
			points[21].verticalLine(),
			points[6].horizontalLine()
		)
		points[23] = points[22].up(4);
		points[24] = points[21].left(3 / 2)
		points[25] = points[21].right(3 / 2)
		points[26] = points[19].down(0.6)


		/// NADRÁG HÁTSÓ RÉSZE

		points['10a'] = points[10].down(3);
		points['30'] = points['10a'].left(1); // hasasodás esetén + a haskülönbözet két tizede
		points['12a'] = intersectionOf(
			points[12].horizontalLine(),
			l('16-30')
		)
		points[31] = points[14].atAngle(l('16-14').angle, 2)
		points[32] = points[15].atAngle(l('16-15').angle, 2)
		points[33] = points[13].down(1)
		points[34] = points[17].left(3 + 0.5)
		points[35] = points[18].right(3 - 0.5)
		points[36] = points[30].right(csb / 10 * 4 + 1) // ha bővebb nadrágot készítünk akkor +2 vagy + 3 cm
		points[37] = points[30].left(csb / 10 * 4 + 1)
		points[38] = points[34].atAngle(l('34-37').angle, l('17-9').length) // nem pont ott, hanem kicsit ívesebben!
		points[39] = points[37].right(csb / 10 * 3) // alámenet szélessége

		points[40] = points[19].right(csb / 10)
		points[41] = points[40].right(csb / 10 * 5 + 4)
		points[42] = points[35].atAngle(l('35-36').angle, l('18-20').length) // TODO ez egy ív hosszát akarja egy másik ívre rámérni!!!
		points['40a'] = intersectionOf(
			points['6a'].horizontalLine(),
			l('39-40')
		)

		points[43] = new point(l('40a-40').line.copy().scale(2).closestPointTo(points[42].vec))
		//points[43] = l('40a-40').closestPointTo(points[42])
		//console.warn(l('40-43').length, csb / 10 * 0.5, '40-43 == csb / 10 * 0.5 ellenőrzőméret')

		//// with line(42-43)
		var l42_43 = l('42-43') //new line(points[42], points[43])
		var l43_42 = l('43-42') // new line(points[43], points[42])
		points[44] = points[43].atAngle(l42_43.angle, 0.5)
		points[45] = points[44].atAngle(l42_43.angle, 2.5)
		points[46] = points[40].left(2.5)
		points[48] = points['40a'].left(1.5)
		points[49] = points['40a'].right(csb + 3 /*a varrásra*/ + 0.5 - l('6-6a').length)
		points[50] = points[44].atAngle(l43_42.angle, db / 10 * 5 + 4)
		points[51] = points[44].atAngle(l43_42.angle, l('44-42').length / 3 + 2)
		var hatso_formazovarras1_szelessege = l('50-42').length / 10 * 6;
		points[52] = points[51].atAngle(l42_43.angle, hatso_formazovarras1_szelessege / 2)
		points[53] = points[51].atAngle(l43_42.angle, hatso_formazovarras1_szelessege / 2)
		points[54] = points[51].atAngle(l42_43.angle + mathUtils.radians(270), 14)

		points[55] = points[52].atAngle(l43_42.angle, l('52-42').length / 2)
		var hatso_formazovarras2_szelessege = l('50-42').length / 10 * 4 / 2
		points[56] = points[55].atAngle(l42_43.angle, hatso_formazovarras2_szelessege)
		points[57] = points[55].atAngle(l43_42.angle, hatso_formazovarras2_szelessege)
		points[58] = points[55].atAngle(l42_43.angle + mathUtils.radians(270), 11)


		class SVGPathString {
			constructor(points) {
				this.points = points;
				this.pathstring = '';
			}
			M (p_id) {
				let p = points[p_id];
				this.pathstring += `M${p.x},${p.y} `
				return this;
			}
			L (p_id) {
				let p = points[p_id];
				this.pathstring += `L${p.x},${p.y} `
				return this;
			}
			Z () {
				this.pathstring += `Z`
				return this.pathstring;
			}
			A(w, h, p_id) {
				let p = points[p_id];
				this.pathstring += `A${w},${h} 0 0,1 ${p[p_id].x},${p[p_id].y}`
				return this;
			}
			Q(seged1, vegpont) {
				let p = points;
				let x1 = p[seged1] ? p[seged1].x : seged1.x;
				let y1 = p[seged1] ? p[seged1].y : seged1.y;
				let x3 = p[vegpont] ? p[vegpont].x : vegpont.x;
				let y3 = p[vegpont] ? p[vegpont].y : vegpont.y;
				this.pathstring += `Q${x1},${y1} ${x3},${y3}`
				return this;
			}
			C(seged1, seged2, vegpont) {
				let p = points;
				let x1 = p[seged1] ? p[seged1].x : seged1.x;
				let y1 = p[seged1] ? p[seged1].y : seged1.y;
				let x2 = p[seged2] ? p[seged2].x : seged2.x;
				let y2 = p[seged2] ? p[seged2].y : seged2.y;
				let x3 = p[vegpont] ? p[vegpont].x : vegpont.x;
				let y3 = p[vegpont] ? p[vegpont].y : vegpont.y;
				this.pathstring += `C${x1},${y1} ${x2},${y2} ${x3},${y3}`
				return this;
			}
			add(str) {
				this.pathstring += str;
			}
		}

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
		paths.eleje = new SVGPathString(points)
			.M(6)
			.L(7)
			.L(14)
			.L(16)
			.L(15)
			.L(9)
			.L('6a') // TODO ív
			.L(26)
			.L(24)
			.L(23)
			.L(25)
			.L(20)
			.Z()

		paths.eleje_keskenyebb = new SVGPathString(points)
			.M(6)
			.L(7)
			.L(14)
			.L(16)
			.L(15)
			.L('9a')
			.L('6a') // TODO kicsit arrébb
			.L(26)
			.L(24)
			.L(23)
			.L(25)
			.L(20)
			.Z()

			paths.hata = new SVGPathString(points)
				.M(36)
				.L(35)
				.L(31)
				.L(33)
				.L(32)
				.L(34)
				.L(37)
				.L(38)
				.L(8)
				.L('40a')
				.L('43')
				.L('53')
				.L('54')
				.L('52')
				.L('56')
				.L('58')
				.L('57')
				.L('42')
				.L('49')
				.Z()


	return {points, paths, lines}
}

module.exports = render
