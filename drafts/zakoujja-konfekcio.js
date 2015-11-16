var {point, line, createL, intersectionOf} =require("../szerkfunc")
import Vec2D from "../toxi/geom/Vec2D"
import mathUtils from "../toxi/math/mathUtils"
import getIntersections from "../geometricFunctions"

var zako = require('./zako')

function circleLineIntersect(line, circlecenter, radius, which) {
	which = which ||  'intersection2';
	var _p77 = getIntersections([line.a.x, line.a.y], [line.b.x, line.b.y], [circlecenter.x, circlecenter.y, radius]).points[which].coords;
	return new Vec2D(_p77[0], _p77[1]);
}

function render (m, sz) {
	let {points, paths, lines} = zako(m,sz)
	let p = {};

	var l = createL(p);
	var lZ = createL(points);

	var {testmagassag,
				mellboseg,
				csipoboseg,
				derekhossza,
				derekboseg,
				zakohossza,
				hataszelesseg,
				vallszelesseg,
				ujjahossza,
				hata_egyensulymeret,
				eleje_egyensulymeret} = m;

	var tm = testmagassag,
	mb = mellboseg / 2,
	db = derekboseg / 2,
	csb = csipoboseg / 2;

	p[1] = new point();
	p[2] = p[1].left(mb / 10 * 3 + 5);
	p[3] = p[2].right(l('1-2').length / 2 - 1)
	p[4] = p[3].right(l('1-3').length / 2);
	p[5] = p[2].down(mb /10 * 0.5 + 5);
	// hónaljmélység
	p[6] = p[1].down(tm / 10 + mb / 10 * 0.5 - 2)
	p[7] = p[6].up(3); // illesztési pont
	p[8] = intersectionOf(
		l('4-7'),
		p[5].horizontalLine()
	);
	p[9] = p[8].atAngleOf(l('8-7'), 2);
	p[10] = l('3-8').getMidPoint();
	p[11] = p[10].perpendicularToLineWith(p[8], l('3-8').length / 10 + 0.3)
	p[12] = p[5].left(3);
	p[13] = l('3-12').getMidPoint();
	p[14] = p[13].perpendicularToLineWith(p[3], l('3-12').length / 10 + 0.8)
	p[15] = p[5].right(l('5-12').length)
	p[16] = p[15].left(1);
	p[17] = p[12].left(1);
	p[18] = p[6].left(mb / 10 * 3 + 1 - 2); // kész hónaljszélesség
	p[19] = p[18].up(lZ('11-12').length - 1)
	p[20] = p[1].down(ujjahossza - vallszelesseg + 3)
	p[21] = p[20].up(3) // aljaferdülés
	p[22] = p[21].up(l('6-21').length / 2 + 2)
	p[23] = p[22].right(1.5) // vájolás
	p[24] = p[23].left(3) // aláfordulás
	p[25] = p[24].left(1.0) // alsóujja varrásvonala
	p[26] = p[6].right(3) // aláfordulás
	p[27] = p[6].left(1) // alsóujja varrásvonala
	p[28] = p[27].left(1)
	p[29] = p[28].up(1)
	p[30] = p[27].up(0.3)
	p[31] = p[21].right(3);
	var aljaboseg = 29;
	p[32] = new point(circleLineIntersect(
		p[20].horizontalLine(),
		p[21],
		aljaboseg / 2 + 1
	))
	p[33] = l('21-32').atDistance(1)
	p[34] = p[24].left(l('21-32').length + 5.5)
	p[35] = p[34].right(1)




	let ujjpaths = {}
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
	function S(seged1, vegpont) {
		let x1 = p[seged1] ? p[seged1].x : seged1.x;
		let y1 = p[seged1] ? p[seged1].y : seged1.y;
		let x3 = p[vegpont] ? p[vegpont].x : vegpont.x;
		let y3 = p[vegpont] ? p[vegpont].y : vegpont.y;
		return `S${x1},${y1} ${x3},${y3}`
	}
	function path() {
		return Array.prototype.join.call(arguments, " ")
	}

	ujjpaths.also = path(
		M(32),
		L(35),
		L(16),
		L(15),
		//L(19),
		Q(l('18-29').getMidPoint().down(3),29),
		//L(29),
		L(30),
		L(25),
		L(33),
		'Z'
	)
	
	ujjpaths.felso = path(
		M(32),
		L(34),
		//L(36),
		L(17),
		L(12),
		L(14),
		L(3),
		L(11),
		L(8),
		L(7),
		L(26),
		L(23),
		L(31),
		L(33),
		'Z'
	)

	return {points: p, paths: ujjpaths};
}

module.exports = render
