import Vec2D from "../toxi/geom/Vec2D"
import mathUtils from "../toxi/math/mathUtils"
import getIntersections from "../geometricFunctions"

import zako from ./"zako"

var {point, line, createL, intersectionOf} =require("../szerkfunc")


export default function render (m, sz) {
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
	const zp = zako(m,sz).points;
	// 77, 83, 85, 86
	let p = {
		'g77': zp[77],
		'g83': zp[83],
		'z85': zp[85],
		'g85': zp[86],
		'g86': zp[87]
	}
	var l = createL(p);
	var lZ = createL(zp);

	p['g87'] = lZ('87-85').atDistance(3.5)
	
		var nyakszelesseg = eval(sz.nyakszelesseg);
		var hata_nyakmagassag = eval(sz.hata_nyakmagassag)
		var p1517 = document.createElementNS("http://www.w3.org/2000/svg", "path");
		p1517.setAttribute('d', `
											 M${zp[17].x},${zp[17].y}
											 A${nyakszelesseg},${hata_nyakmagassag} 0 0,0 ${zp[15].x},${zp[15].y}`);
	p['g88'] = zp[83].atAngleOf(lZ('84a-86'), p1517.getTotalLength())

	p['g89'] = p['g88'].perpendicularToLineWith(p['g85'], mb/10)
	p['g90'] = p['g89'].perpendicularToLineWith(p['g83'], 3)
	p['g91'] = p['g89'].perpendicularToLineWith(p['g83'], 4, 'flip')
	p['g92'] = p['g83'].atAngleOf(l('g77-g83'), 4.5)
	p['g93'] = p['g87'].perpendicularToLineWith(p['g87'], 2)
	p['g94'] = p['g93'].perpendicularToLineWith(p['g87'], 2.5, 'flip')




	//

	function M(p_id) {
		let p1 = p[p_id];
		return `M${p1.x},${p1.y}`
	}
	function L(p_id) {
		let p1 = p[p_id];
		return `L${p1.x},${p1.y}`
	}
	function A(w, h, p_id) {
		return `A${w},${h} 0 0,1 ${zp[p_id].x},${zp[p_id].y}`
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

	var paths = {}
	paths.galler = path(M('g91'),
										 L('g90'),
										 L('g77'),
										 //`C${p[77].x},${p[77].y} ${p[77].x},${p[77].y} ${p[77].x + 1},${p[77].y + 1}`,
										A(nyakszelesseg, nyakszelesseg, '85'),
										//`L${zp[85].x},${zp[85].y}`,
										 L('g87'),
										 L('g94'),
										 //L(92),
										 Z)

	return {points: p, paths:paths}
}
