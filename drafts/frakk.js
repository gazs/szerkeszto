import Vec2D from "../toxi/geom/Vec2D"
import mathUtils from "../toxi/math/mathUtils"
import getIntersections from "../geometricFunctions"


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
			//
	var p = {};

	var l = createL(p);

	p[1] = new point();

	// HÁTA
	var hata_nyakmagassag = eval(sz.hata_nyakmagassag)

	// kulcsszám
	var kulcsszam = eval(sz.kulcsszam);

	p[2] = p[1].down(kulcsszam)

	var honaljmelyseg = eval(sz.honaljmelyseg);

	p[3] = p[2].down(honaljmelyseg);
	p[4] = p[2].down(honaljmelyseg / 2);
	p[5] = p[2].down(honaljmelyseg / 4);
	p[6] = p[1].down(derekhossza);

	//var csipomelyseg = tm / 10;
	var csipomelyseg = eval(sz.csipomelyseg);

	p[7] = p[6].down(csipomelyseg);

	var hatahossza = 102;
	var zakohossza = hatahossza; // hogy mégcopypastebb legyen

	p[8] = p[1].down(hatahossza);

	p[9] = p[2].left(hataszelesseg + 1);

	p[10] = intersectionOf(
		p[9].verticalLine(),
		p[4].horizontalLine()
	)

	p[11] = intersectionOf(
		p[9].verticalLine(),
		p[3].horizontalLine()
	)

	p[12] = p[10].up(1);
	

	p[15] = l('1-9').closestPointTo(p[5])
	//// nyakszélesség
	//var nyakszelesseg = mb / 10 + 3.5;
	var nyakszelesseg = eval(sz.nyakszelesseg);
	p[16] = l('1-9').atDistance(nyakszelesseg)
	
	var nyakmagassag = mb / 10 * 0.5 + 1.5;
	p[17] = p[16].up(nyakmagassag);

	// 17a
	// 17b

	p[18] = p[17].atAngleOf(l('17-9'), vallszelesseg + 1 + 0.5)

	//var derekbeallitas = 3;
	var derekbeallitas = eval(sz.derekbeallitas);
	p[19] = p[6].left(derekbeallitas);

	//var aljabeallitas = 4;
	var aljabeallitas = eval(sz.aljabeallitas);
	p[20] = p[8].left(aljabeallitas);


	p[24] = p[19].left(db / 10 + 1.5)
	p[21] = p[20].left(l('19-24').length + 1)

	p[22] = intersectionOf(
		l('21-24'),
		p[7].horizontalLine()
	)

	p[23] = intersectionOf(
		p[7].horizontalLine(),
		l('20-19')
	)
	p['3a'] = intersectionOf(
		l('19-4'),
		p[3].horizontalLine()
	)
	p[25] = p[24].right(1)

	p[26] = p['3a'].left(l('3a-11').length / 2)
	p[27] = p[26].left(1.5)

	p[28] = l('10-27').getMidPoint();
	p[29] = p[28].perpendicularToLineWith(p[27], 0.6)

	p[33] = p[3].left(mb +25)
	p[34] = p[6].left(mb +25)

	p[35] = p[34].down(8)
	p['35a'] = p[35].right(5)

	//var derekszelesseg = db / 10 * 5;
	var derekszelesseg = eval(sz.derekszelesseg);
	p[36] = p[33].right(db / 10 * 5)
	p[37] = p[36].up(kulcsszam);
	p[38] = p[36].left(derekszelesseg / 2 + kulcsszam / 2);
	p[39] = p[38].left(mb / 10 * 2) // ebben az esetben a 33 és a 39 pont megegyezik
	//var mellszelesseg = mb / 10 * 4 + 4;
	var mellszelesseg = eval(sz.mellszelesseg);

	p[40] = p[39].atAngleOf(l('39-37'), mellszelesseg)
	p[41] = intersectionOf(
		new line(p[40], p[40].perpendicularToLineWith(p[37], 10)),
		p[36].horizontalLine()
	)
	//
	p[42] = p[40].perpendicularToLineWith(p[39], 3, 'flip')
	p[43] = p[41].right(5)
	var honaljszelesseg = mb / 10 * 2.5 + 2;
	p[44] = p[41].right(honaljszelesseg);

	p[45] = p[44].right(3)
	p[46] = p[45].right(l('11-27').length + 1 + 3)

	p[47] = p[46].left(3)
	p[48] = intersectionOf(p[47].verticalLine(), p[6].horizontalLine())

	p[49] = p[48].down(1) // varrásszélesség
	p[50] = p[45].right(2)
	p[51] = intersectionOf(p[50].verticalLine(), p[12].horizontalLine())
	p[52] = l('46-51').getMidPoint()
	p['52a'] = p[52].perpendicularToLineWith(p[46], l('28-29').length + 2)

	p['44a'] = p[40].atAngle(l('33-40').angle, l('41-44').length)

	p[53] = intersectionOf(l('44a-44').copy().scale(3),
												 p[6].horizontalLine());
	p[54] = p[53].right(0.8)
	p[55] = l('53-44').atDistance(l('44a-44').length)
	p[56] = p['44a'].atAngle(l('44-44a').length, 4.5)
	p[57] = p[56].left(1)
	p[58] = p[45].up(l('44a-56').length)
	p[59] = p[58].right(1) // varrásszélesség
	p['43a'] = p[40].atAngle(l('33-40').angle, l('41-43').length)
	p[61] = intersectionOf(l('43a-43').copy().scale(3), l('34-55'))

	p[62] = p[34].up(7) // kihajtó alsó vége
	p[63] = p[62].right(1)
	p[64] = p['35a'].atAngle(l('35a-61').angle, l('35a-61').length / 2 + 1.5)
	p[65] = p[40].atAngle(l('40-33').angle, mb/10 *2 - 0.5)
	p[66] = l('65-64').atDistance(4)
	p['64a'] = intersectionOf(l('64-66'), l('34-6'))
	p[67] = p[64].atAngle(l('64-35').angle, 1.2)
	p[68] = p[64].atAngle(l('64-55').angle, 1.2)


	p[69] = intersectionOf(l('68-55'), l('43-61'))
	p[70] = p[69].atAngle(l('69-68').angle, 1)
	p[71] = p[69].atAngle(l('69-55').angle, 1)
	
	p[72] = p[39].up(kulcsszam / 2 + 0.8)
	p[73] = l('33-37').atDistance(l('33-38').length)
	//
	
	p['17b'] = intersectionOf(l('17-24'), p[3].horizontalLine())
	p[74] = p[73].perpendicularToLineWith(p[72],  (l('17-17b').length - 2), 'ugh flip')
	// nyakmélység
	var nyakmelyseg = mb / 10 + 3;
	p[75] = l('74-73').atDistance(nyakmelyseg)

	p[76] = l('74-65').atDistance(kulcsszam + 4)
	p[77] = p[74].circleLineIntersect(
		p[76].longlinePerpendicularToLineWith(p[74], 'flip'),
		l('17-18').length - 1
	)
	p[78] = l('77-40').atDistance(0.8)

	p[79] = p[74].atAngle(l('77-74').angle, 3) //állógallér szélessége
	p['79a'] = l('79-63').atDistance(l('74-75').length - 0.5)

	p[80] = l('79a-63').atDistance(4.5)
	p[81] = p[80].perpendicularToLineWith(p[79], 3.7)
	p[82] = p[80].perpendicularToLineWith(p[79], 8) // kihajtó szélessége
	p[83] = p[82].perpendicularToLineWith(p[80], 3.5)

	p[84] = p[33].down(mb/10 * 0.5)
	p[85] = l('40-33').atDistance(mb/10 -1)
	p[86] = l('85-84').atDistance(mb/10 + 6)

	p[90] = p[49].left(1)
	p[91] = p[90].down(tm/10 +1) // csíipővonal helye
	p[92] = p[91].right(2)
	p[93] = p[92].right(1.5) // csípődomborulatb
	p[94] = p[90].atAngle(l('90-92').angle, l('25-21').length + 1)
	p[95] = p[94].perpendicularToLineWith(p[92], csb / 10 * 2 + 1.6)
	p[96] = p[53].left(l('55-71').length + l('70-68').length -2)
	p[97] = p[96].atAngle(l('96-95').angle, l('44-44a').length + 1.5)
	p[98] = l('97-95').getMidPoint()
	p[99] = p[54].atAngle(l('44a-44').angle, 7)

	// ----
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

	paths.hatresz = path(
		M(12),
		//L(18),
		C(10, p[10].up(l('18-12').length/3), 18),
		//`A${honaljmelyseg/2},${ujjaszelesseg/2} 0 0,0 ${p[10].x},${p[10].y}`,
		//`A${honaljmelyseg/2},${ujjaszelesseg/2} 0 0,0 ${p[18].x},${p[18].y}`,
		L(17),
		`A${nyakszelesseg},${hata_nyakmagassag} 0 0,0 ${p[15].x},${p[15].y}`,
		L(15),
		L(5),
		L(4),
		L('3a'),
		L(19),
		L(23),
		L(20),
		L(21),
		L(22),
		L(25),
		L(24),
		C(p[26].down(1), p[26].up(1), 10),
		//L(27),
		//L(29),
		//L(10),
		Z)

	paths.oldalresz= path(
		M(51),
		Q(p[52].perpendicularToLineWith(p[46], l('28-29').length + 5), 46),
		C(p[46].down(8), p[48].up(8), 49),
		L(54),
		Q(l('54-58').getMidPoint().right(1), 58),
		//L(58),
		L(59),
		C(59, p[59].up(l('51-59').length/3).right(1.5), 51),
		Z
	)

	var sosz_origo_to_p90 = (new line(l('94-95').getMidPoint(), p[90])).length

	paths.sosz = path(
		M(90),
		Q(l('90-94').getMidPoint().perpendicularToLineWith(p[94], 4), 94),
		Q(95, 98),
		L(97),
		`A${sosz_origo_to_p90},${sosz_origo_to_p90} 0 0,1 ${p[53].x},${p[53].y}`,
		L(99),
		L(54),
		`A${sosz_origo_to_p90},${sosz_origo_to_p90} 0 0,1 ${p[90].x},${p[90].y}`,
		Z
	)

	paths.eleje = path(
		M(74),
		Q(l('74-77').atDistance(l('74-77').length * 0.8).perpendicularToLineWith(p[77], 1), 78),
		//L(78),
		C(p[42].left(4), p['40'].up(l('78-43a').length * 0.15), '43a'),
		//L(42),
		//L('43a'),
		Q(p['44a'].left(2), 57),
		L(57),
		L(56),
		L(44),
		Q(l('44-55').atDistance(l('44-55').length * 0.8).perpendicularToLineWith(p[44], 0.5), 55),
		//L(55),
		L(71),
		L(43),
		L(70),
		L(68),
		L(66),
		L(67),
		L('35a'),
		L(63),
		Q(l('63-83').getMidPoint().perpendicularToLineWith(p[83], 5), 83),
		L(81),
		L('79a'),
		Q(p[76].left(1).up(1), 74),
		Z
	)

	paths.szivarzseb = path(M('86'),
													L('85'),
													`L${p['85'].x},${p['85'].y-2}`,
													`L${p['86'].x},${p['86'].y-2}`,
													Z)

	return {paths: paths, points: p};

}
