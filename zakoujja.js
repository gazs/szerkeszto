var {point, line, createL, intersectionOf} =require("./szerkfunc")
import Vec2D from "./toxi/geom/Vec2D"
import mathUtils from "./toxi/math/mathUtils"
import getIntersections from "./geometricFunctions"

var zako = require('./zako')

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

	p[100] = new point();
	// ujjaszélesség
	p[101] = p[100].right(mb / 10 * 2.5 + 11)
	p[102] = p[100].right(l('100-101').length / 2)
	p[103] = p[100].right(l('100-102').length / 2 + 0.5)
	p[104] = p[102].right(l('100-102').length / 2 + 0.5)
	// hónaljmélység
	p[105] = p[100].down((lZ('11-18').length + lZ('66-82').length) / 2 - 3)
	p[106] = p[105].up(3) // illesztési pont
	p[107] = p[101].down(mb / 10 + 2.5) //könyökvarrás felső vége
	p[109] = p[107].right(1) // varrásszélesség
	p[110] = p[107].left(6) // alsóujja helye
	p[111] = p[110].left(1) // varrásszélesség
	p[112] = p[101].down(ujjahossza - vallszelesseg + 1 + 2)
	p[113] = intersectionOf(
		p[112].horizontalLine(),
		p[100].verticalLine()
	)
	p[114] = p[113].up(3.5) // ujjaferdülése

			function circleLineIntersect(line, circlecenter, radius, which) {
				which = which ||  'intersection2';
				var _p77 = getIntersections([line.a.x, line.a.y], [line.b.x, line.b.y], [circlecenter.x, circlecenter.y, radius]).points[which].coords;
				return new Vec2D(_p77[0], _p77[1]);
			}
	var aljaboseg = 14.5
	p[115] = new point(circleLineIntersect(
		l('113-112'),
		p[114],
		aljaboseg + 1
	))
	p[117] = p[114].up(l('114-105').length / 2 + 2) // 116-ot ír de szerintem ez lesz
	p[118] = intersectionOf(
		p[117].horizontalLine(),
		p[112].verticalLine()
	)
	p[119] = p[118].left(1)
	p[120] = p[118].left(5)
	// 110-115 = 119-115 - 0.5
	p[121] = p[117].left(1.5)
	p[122] = p[121].right(5.5)
	p[123] = p[105].right(mb / 10 * 2.5 - 0.5)
	p[124] = p[105].right(2)
	p['124a'] = p[124].up(1).right(1)
	p[125] = p[114].right(2)
	p[126] = p[114].left(2)
	p[127] = p[105].left(2)

	// wtfs
	p[108] = intersectionOf(p[107].verticalLine(), p[123].horizontalLine())
	p['108a'] = intersectionOf(p[110].verticalLine(), p[123].horizontalLine())

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
		M(125),
		L(122),
		L(124),
		L('124a'),
		Q(l('123-124').atDistance(l('123-124') * 2/3).perpendicularToLineWith(p[124], 4),111),
		//L(111),
		L(110),
		L('108a'),
		L(120),
		L(115),
		"Z"
	)
	
	ujjpaths.felso = path(
		M(126),
		L(121),
		L(127),
		C(p[127].right(l('127-105').length / 3), p[106].down(l('106-105').length/3), 106),
		//L(106),
		S(103,102),
		//L(102),
		S(104, 107),
		L(107),
		L(109),
		Q(l('119-115').closestPointTo(p[119]).perpendicularToLineWith(p[115], 3), 115),
		//L(119),
		//L(115),
		L(125),
		L(114),
		"Z"
	)

	return {points: p, paths: ujjpaths};
}

module.exports = render
