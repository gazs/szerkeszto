// az 1-2 szerkesztési ponttól a 30-31 pontig azonosan kell szerkeszteni a 45. ábra szerkesztésével


import Vec2D from "./toxi/geom/Vec2D"
import mathUtils from "./toxi/math/mathUtils"
import getIntersections from "./geometricFunctions"


var {point, line, createL, intersectionOf} =require("./szerkfunc")

export default function render (m, sz) {
	var {testmagassag,
				mellboseg,
				derekboseg,
				hataszelesseg,
				vallszelesseg,
				//hata_egyensulymeret, // nem használom ebben (még)!
				//eleje_egyensulymeret
	} = m;

	var tm = testmagassag,
	mb = mellboseg / 2,
	db = derekboseg / 2;
	//
	//
	var p = {};
	var l = createL(p);

	p[1] = new point();
	var kulcsszam = db / 10 + mb/10 * 0.5 - 5;
	p[2] = p[1].down(kulcsszam)
	
	p[3] = p[2].down(tm / 4); // derékhossza
	p[4] = p[2].down(l('2-3').length / 2);

	p[5] = p[2].down(l('2-4').length / 2);
	
	p[6] = p[3].down(9) // hosszabbítás

	p[7] = p[6].down(3)

	p[8] = p[3].left(3);
	p[10] = p[7].left(3);
	p[9] = intersectionOf(l('8-5'), p[4].horizontalLine())

	p[11] = p[1].left(mb / 10 + 3) // nyakszélesség
	p[12] = p[11].up(mb / 10 * 0.5);

	p[13] = p[2].left(hataszelesseg);
	p[14] = intersectionOf(p[13].verticalLine(), p[4].horizontalLine())
	p[15] = p[13].down(1) // zakó válltömésének magassága
	p['15a'] = l('12-15').atDistance(mb / 10 * 2 + 3);

	p[16] = p[9].left(mb/2 + 4);

	p['16a'] = p[16].down(3);

	p[17] = intersectionOf(p[16].verticalLine(), p[3].horizontalLine());
	p[18] = intersectionOf(p[16].verticalLine(), p[6].horizontalLine());

	p[19] = p[17].left(1);
	p[20] = p[17].right(1);

	p[21] = l('8-20').getMidPoint();

	p[22] = intersectionOf(p[21].verticalLine(), l('10-18'))
	p[23] = intersectionOf(p[21].verticalLine(), l('14-9'))

	p[24] = p[23].down(4);

	p[25] = p[14].left(mb/10 * 2.5 + 3)
	p[26] = intersectionOf(p[25].verticalLine(), p[13].horizontalLine())

	p[27] = p[26].down(l('1-2').length + 2)
	p[28] = p[9].left(mb + 6);
	p[29] = intersectionOf(p[28].verticalLine(), p[3].horizontalLine())
	p[30] = intersectionOf(p[28].verticalLine(), p[6].horizontalLine())

	// innen tér el
	p[31] = p[30].left(1.5);
	p[32] = p[28].left(1.5);

	p[33] = p[31].up(2) // az alsó gomb helye
	p[34] = p[30].down(6)
	p[35] = p[34].right(2)
	p[36] = p[28].right(db/10 + mb/10)
	p[37] = intersectionOf(p[36].verticalLine(), p[2].horizontalLine())
	p[38] = p[37].atAngle(l('27-37').angle, 1)

	p[39] = p[37].atAngle(l('38-27').angle, l('12-15a').length - 1)
	p[43] = p[29].down(l('1-2').length)

	p[44] = l('19-43').atDistance(4)
	p[45] = l('44-43').atDistance(13)


	p[46] = l('29-19').getMidPoint();
	p[47] = intersectionOf(p[46].verticalLine(), l('18-35'))
	p[48] = intersectionOf(p[46].verticalLine(), p[4].horizontalLine())
	p[49] = p[48].down(5)

	p['46a'] = p[46].left(0.8)
	p['46b'] = p[46].right(0.8)

	p['47a'] = p[47].left(0.5);
	p['47b'] = p[47].right(0.5);

	p['22a'] = p[22].left(0.5)
	p['22b'] = p[22].right(0.5)

	p['21a'] = p[21].left(0.8)
	p['21b'] = p[21].right(0.8)

	p[51] = p[33].up(13);
	p[52] = p[51].down(1.5) // felső gomb helye
	p[53] = p[28].right(5.5);
	p[54] = p[51].right(6);
	p['11a'] = p[37].up(l('1-12').length - 1)
	p['11b'] = p['11a'].left(mb/10 * 0.5)


	// ugh boilerplate
	function M(p_id) {
		let p1 = p[p_id];
		return `M${p1.x},${p1.y}`
	}
	function L(p_id) {
		let p1 = p[p_id];
		return `L${p1.x},${p1.y}`
	}
	function A(w, h, p_id) {
		return `A${w},${h} 0 0,1 ${p[p_id].x},${p[p_id].y}`
	}
	function Q(seged1, vegpont) {
		let x1 = p[seged1] ? p[seged1].x : seged1.x;
		let y1 = p[seged1] ? p[seged1].y : seged1.y;
		let x3 = p[vegpont] ? p[vegpont].x : vegpont.x;
		let y3 = p[vegpont] ? p[vegpont].y : vegpont.y;
		return `Q${x1},${y1} ${x3},${y3}`
	}
	function C(seged1, seged2, vegpont) {
		let x1 = p[seged1] ? p[seged1].x : seged1.x;
		let y1 = p[seged1] ? p[seged1].y : seged1.y;
		let x2 = p[seged2] ? p[seged2].x : seged2.x;
		let y2 = p[seged2] ? p[seged2].y : seged2.y;
		let x3 = p[vegpont] ? p[vegpont].x : vegpont.x;
		let y3 = p[vegpont] ? p[vegpont].y : vegpont.y;
		return `C${x1},${y1} ${x2},${y2} ${x3},${y3}`
	}
	var Z = "Z";

	function path() {
		return Array.prototype.join.call(arguments, " ")
	}
	var paths = {};
	var nyakszelesseg = mb / 10 + 3.5;
	var hata_nyakmagassag = eval(sz.hata_nyakmagassag);

	paths.hat= path(
		M(1),
		L(2),
		L(5),
		L(9),
		L(8),
		L(10),
		L('22b'),
		L('21b'),
		L(24),
		L('21a'),
		L('22a'),
		L('18'),
		L('20'),
		L('16a'),
		L('14'),
		L('15a'),
		L('12'),
		`A${nyakszelesseg},${hata_nyakmagassag} 0 0,0 ${p[1].x},${p[1].y}`,
		Z

	)
	paths.eleje= path(
		M('16a'),
		L(19),
		L(18),
		L('47b'),
		L('46b'),
		L('49'),
		L('46a'),
		L('47a'),
		L('35'),
		L('33'),
		L('52'),
		L('51'),
		Q(p[54].left(1), 53),
		//L('53'),
		L('38'),
		L('39'),
		//C(p[39].left(3).down(l('39-25').length*0.75), p[25].left(l('25-48').length/4).up(l('25-39').length/2), 25),
		L('25'),
		Z
	)
	paths.kihajto= path(
		M('51'),
		Q(p[54].left(1), 53),
		L('38'),
		L('11b'),
		L('11a'),
		C(p[38].right(5), p[36].up(20).right(2), '36'),
		C(p[36].down(15).left(2), p[54].right(3), 52),
		//L('52'),
		Z
	)

	return {paths: paths, points: p};
}
