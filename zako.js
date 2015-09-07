import Vec2D from "./toxi/geom/Vec2D"
import mathUtils from "./toxi/math/mathUtils"
import getIntersections from "./geometricFunctions"


var {point, line, createL, intersectionOf} =require("./szerkfunc")




function render (m, sz) {
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
	var p = [];

	var l = createL(p);

	p[1] = new point();

	// HÁTA

	// kulcsszám
	var kulcsszam = eval(sz.kulcsszam);

	p[2] = p[1].down(kulcsszam)

	//var honaljmelyseg = tm / 10 + mb / 10
	var honaljmelyseg = eval(sz.honaljmelyseg);

	//p[3] = p[2].add(0,  honaljmelyseg);
	p[3] = p[2].down(honaljmelyseg);
	p[4] = p[2].down(honaljmelyseg / 2);
	p[5] = p[2].down(honaljmelyseg / 4);
	p[6] = p[1].down(derekhossza);

	//var csipomelyseg = tm / 10;
	var csipomelyseg = eval(sz.csipomelyseg);

	p[7] = p[6].down(csipomelyseg);

	p[8] = p[1].down(zakohossza);

	p[9] = p[2].left(hataszelesseg + 1);

	p[10] = intersectionOf(
		p[9].verticalLine(),
		p[4].horizontalLine()
	)

	p[11] = intersectionOf(
		p[9].verticalLine(),
		p[3].horizontalLine()
	)
	p[12] = p[10].down(3);
	p[13] = p[12].left(1);

	p[15] = l('1-9').closestPointTo(p[5])

	//// nyakszélesség
	//var nyakszelesseg = mb / 10 + 3.5;
	var nyakszelesseg = eval(sz.nyakszelesseg);
	p[16] = l('1-9').atDistance(nyakszelesseg)


	var _p17a = p[6].up((hata_egyensulymeret + 1));

	var l17b = new line(p[16], p[16].perpendicularToLineWith(p[1], 10))
	p[17] = intersectionOf(
		_p17a.horizontalLine(),
		l17b
	)

	p[18] = p[17].atAngleOf(l('17-9'), vallszelesseg + 1 + 0.5)

	//var derekbeallitas = 3;
	var derekbeallitas = eval(sz.derekbeallitas);
	p[19] = p[6].left(derekbeallitas);

	//var aljabeallitas = 4;
	var aljabeallitas = eval(sz.aljabeallitas);
	p[20] = p[8].left(aljabeallitas);

	//var aljaszelesseg = csb / 10 * 3.5;
	var aljaszelesseg = eval(sz.aljaszelesseg);
	p[21] = p[20].perpendicularToLineWith(p[19], aljaszelesseg);



	p[22] = intersectionOf(
		new line(p[21], p[21].perpendicularToLineWith(p[20], 100)),
		p[7].horizontalLine()
	)

	p[23] = intersectionOf(
		p[7].horizontalLine(),
		l('20-19')
	)

	p[24] = intersectionOf(
		new line(p[21], p[21].perpendicularToLineWith(p[20], 100)),
		p[6].horizontalLine()
	)


	//var hat_karcsusitas = 1;
	var hat_karcsusitas= eval(sz.hat_karcsusitas);
	p[25] = p[24].right(hat_karcsusitas);

	p['21a'] =intersectionOf(
		l('21-20'),
		l('25-22').line.copy().scale(5)
	)
	//
			//// ELEJE

			////var eleje_tavolsag = 25;
	var eleje_tavolsag = eval(sz.eleje_tavolsag);
	p[33] = p[3].left(mb + eleje_tavolsag);
	p[34] = p[6].left(mb + eleje_tavolsag);
	p[35] = p[7].left(mb + eleje_tavolsag);

	//var derekszelesseg = db / 10 * 5;
	var derekszelesseg = eval(sz.derekszelesseg);
	p[36] = p[33].right(derekszelesseg);
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
	p[42] = p[40].perpendicularToLineWith(p[37], 3, 'flip')

	//var kis_oldalvarras = 5;
	var kis_oldalvarras= eval(sz.kis_oldalvarras);

	p[43] = p[41].right(kis_oldalvarras);

	//var honaljszelesseg = mb / 10 * 2.5 + 3;
	var honaljszelesseg= eval(sz.honaljszelesseg);

	p[44] = p[41].right(honaljszelesseg);

	// mellformázó varrás helye
	//var mellformazo_varras_helye = db / 10 * 2 + 6;
	var mellformazo_varras_helye = eval(sz.mellformazo_varras_helye);;

	p[45] = p[34].right(mellformazo_varras_helye);

	p[46] = intersectionOf(
		p[45].verticalLine(),
		p[3].horizontalLine()
	)

	//var mellformazo_varras_felso_vege = 3;
	var mellformazo_varras_felso_vege= eval(sz.mellformazo_varras_felso_vege);

	p[47] = p[46].down(mellformazo_varras_felso_vege);
	p[48] = p[47].left(0.5); // segédpont

	p[49] = p[46].down((p[8].y - p[46].y) / 2 + 3)

	//var mellkivet = 3;
	var mellkivet = eval(sz.mellkivet);
	p[50] = p[45].right(mellkivet - 2) // TODO FIXME ez valamilyen szögben van


	p[51] = p[49].right(mellkivet - 2 + 0.3);
	p[52] = p[49].left(2.5);

	p[53] = p[35].right(mellkivet + kulcsszam / 4);

	//var csipomeret = csb + 7;
	var csipomeret = eval(sz.csipomeret);
	p[54] = p[53].right(csipomeret - l('22-23').length);


	var p61a = new point(l('20-21').line.copy().scale(10).closestPointTo(p[54].vec))

	var eleje_oldalvonal = new line(p61a, p[54]).line.copy().scale(10)
	p[55] = intersectionOf(eleje_oldalvonal, p[6].horizontalLine())
	p[56] = intersectionOf(eleje_oldalvonal, p[3].horizontalLine())

			////kihajtó
	p['33a'] = p[33].down(mb /10 * 0.5);
	p['40a'] = p[40].atAngleOf(l('37-33a'), mb/10);
	p['40b'] = p['40a'].atAngleOf(l('37-33a'), mb/10 + 6);


	p[57] = intersectionOf(eleje_oldalvonal, p[12].horizontalLine());
	p[59] = p[57].right(0.5)
	p[60] = p[57].left(0.5)


	p[58] = p[55].left(1); // karcsúsítás TODO hiányzik a simából

	p[61] = p[58].atAngleOf(l('58-54'), l('21-25').length)
	p[62] = p[43].right(l('44-56').length)
	p[63] = p[43].right(l('44-56').length / 3)

	p[64] = intersectionOf(
		p[63].verticalLine(),
		p[6].horizontalLine()
	)

	p[65] = intersectionOf(
		p[63].verticalLine(),
		p[49].horizontalLine()
	)


	p['64a'] = intersectionOf(
		l('43-65'),
		p[58].horizontalLine()
	)

	p[66] = intersectionOf(
		l('39-40'),
		l('43-65')
	)

	p['67'] = intersectionOf(
		l('62-65'),
		p[58].horizontalLine()
	)


	p[68] = p[65].atAngleOf(l('65-66'), l('43-66').length)
	p[69] = p['64a'].atAngleOf(l('65-66'), l('43-66').length)

	// karcsúsítás
	p[70] = p[69].atAngleOf(l('69-50'), 1)
	p[71] = p[67].right(1);

	p[72] = p[65].left(l('35-53').length)

			////var elejenyitas = kulcsszam / 2;
	var elejenyitas = eval(sz.elejenyitas);
	p[73] = p[34].down(0);
	p[74] = p[73].down(l('21-25').length + 1)

	p['72_bottom'] = intersectionOf(
		p[72].verticalLine(),
		l('74-61')
	)

	p['65a'] = intersectionOf(
		p[65].verticalLine(),
		p[54].horizontalLine()
	)

	p['61a'] = intersectionOf(
		p[65].verticalLine(),
		l('74-61')
	)

	p['61b'] = intersectionOf(
		l('74-61'),
		l('58-54').line.copy().scale(5)
	)



	////var mellnyitas = kulcsszam / 2 + 0.8;
	var mellnyitas = eval(sz.mellnyitas);
	//p[75] = p[33].up(mellnyitas);
	p[75] = p[33].atAngle(mathUtils.radians(190), mellnyitas); // egy picit jobbra boruljon, a 39-79 az amúgy 187 fok lenne


	p[76] = p[33].atAngleOf(l('33-40'), l('33-38').length)
	//p[76] = p[38].add(0, -1.5); // TODO valójában tökre nem oda jelöli, cserébe nem magyarázza el hogy mi van.

	//// a konfekciós részben így számolja a p[76]-ot (ott p[43])
	//var hasszelesseg = db / 10 * 5;
	////hasszelesseg / 2 + kulcsszam / 2
	////p[76] = new Line2D(p[40], p[33]).toRay2D().getPointAtDistance(hasszelesseg / 2 + kulcsszam + 2);



	// 45-től eleje-egyensúlyméret + 1 távolságra,
	// a 76-ból induló merőlegest elmetszi valahol fent
	p[77] = p[45].circleLineIntersect(
		p[76].longlinePerpendicularToLineWith(p[75], 'flip'),
		eleje_egyensulymeret + 1
	)

	// nyakmélység
	//var nyakmelyseg = mb / 10 + 3;
	var nyakmelyseg = eval(sz.nyakmelyseg);

	p[78] = p[77].atAngleOf(l('77-76'), nyakmelyseg)
	p[79] = p[78].perpendicularToLineWith(p[77], l('15-16').length + 1)


	//var vallmagassag = kulcsszam + 4;
	var vallmagassag = eval(sz.vallmagassag);
	p[80] = p[77].atAngleOf(l('77-45'), vallmagassag)

	//var vallszelesseg1 = vallszelesseg + 1 + 0.5 -1; //distance(p[17], p[18]) -1;
	var vallszelesseg1 = l('17-18').length - 1;
	p[81] = p[77].circleLineIntersect(
		p[80].longlinePerpendicularToLineWith(p[77], 'flip'),
		vallszelesseg1
	)

			//var segedpont_82 = 0.6;
	p[82] =p[81].atAngle(mathUtils.radians(30), 0.6);

	//var galler_szelesseg = 3;
	var galler_szelesseg = eval(sz.galler_szelesseg);
	p[83] = p[77].atAngleOf(l('81-77'), galler_szelesseg)

	////var hajtoka_szelesseg = mb / 10 + 3;
	var hajtoka_szelesseg = eval(sz.hajtoka_szelesseg);
	//var kihajto_alja = p[39];

	p[85] = p[83].atAngleOf(l('83-39'), l('77-78').length -0.5)
	p[86] = p[85].atAngleOf(l('83-39'), 4.5)


	p[87] = p[86].perpendicularToLineWith(p[85], hajtoka_szelesseg)
	p['87b'] = p[86].perpendicularToLineWith(p[85], hajtoka_szelesseg, 'flip')


	var gombok = sz.gombok;
	//var gombok = 3;

	if (gombok === 1) {
		p[84] = p[34];
		p['84a'] = p[84].left(1.5);
	}
	if (gombok === 2) {
		//p[84] = p[34] //p[33].down(16);
		p[84] = p[33].down(16);
		p['84a'] = p[84].left(1.5);
	} else if (gombok === 3) {
		p['84'] = p[34].up(8); // felső gomblyuk helye
		p['84a'] = p[84].left(1.5);
	}

	p['34a'] = p[34].left(1.5);



	///// GALLÉR
//77, 83, 85, 86
//77, 83, 85, 87
	
var galler_variansok = {
	'1x3_csapott': {
	},
	'1x5_csapott': {},
	'1x2_sarkos': {
		'87-87g': 4,
		'88-89': mb / 10 - 1,
		'87-93': 2,

	},
	'1x1_sarkos': {},
}

	var hata_nyakmagassag = eval(sz.hata_nyakmagassag)
	var ujjaszelesseg = eval(sz.ujjaszelesseg);

var galler_varians = galler_variansok['1x2_sarkos']

// pontok  | 1x3 gomb csapott | 1x5 csapott | 1x2 sarkos angol | 1x1 sarkos
// 87-87g  | 3.5              | 4           | 4                | 4.2
// 83-88   | l('15-17')       | l('15-17')  | l('15-17')       | l('15-17')
// 88-89   | mb/10            | mb/10 - 0.5 | mb/10 - 1        | mb/10 - 1.5
// 89-90   | 3                | 3           | 3                | 3
// 89-91   | 4                | 4           | 4                | 4
// 83-92   | 4.5              | 4.5         | 4.5              | 4.5
// 87-93   | 3.5              | 4           | 2                | X
// 93-94   | 2.5              | 2           | X                | X
// 87-94   | X                | X           | 4                | 5
p['87g'] = l('87-85').atDistance(galler_varians['87-87g']);


var p1517 = document.createElementNS("http://www.w3.org/2000/svg", "path");
p1517.setAttribute('d', `M${p[17].x},${p[17].y} 	A${nyakszelesseg},${hata_nyakmagassag} 0 0,0 ${p[15].x},${p[15].y}`);
p[88] = p[83].atAngleOf(l('85-83'), p1517.getTotalLength())

p[89] = p[88].perpendicularToLineWith(p[83], galler_varians['88-89'])
p[90] = p[89].perpendicularToLineWith(p[83], 3)
p[91] = p[89].perpendicularToLineWith(p[83], 4, 'flip')
p[92] = p[83].atAngleOf(l('77-83'), 4.5)
p[93] = p['87g'].perpendicularToLineWith(p[87], 3.5, 'flip')
p[94] = p[93].perpendicularToLineWith(p['87g'], 2.5, 'flip')




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

	function path() {
		return Array.prototype.join.call(arguments, " ")
	}
	var paths = {};


	let kihajto;
	if (gombok === 3 || gombok == 2 || gombok == 1) {
		kihajto = path(
			L(85),
			L(87),
			Q(p[87].atAngleOf(l('87-84a'), l('87-84a').length / 2).perpendicularToLineWith(p['87'], 1), '84a')
			//L('84a')
		)
		paths.kihajto_dup = path(
			M(85),
			L('87b'),
			Q(p['87b'].atAngleOf(l('87b-84a'), l('87b-84a').length / 2).perpendicularToLineWith(p['84a'], 1), '84a'),
			'Z')
	}

			//// első rész
	paths.elso = path(
		M(66),
		C(40, p['40a'].up(l('66-82').length * 0.3), 82),
		//A(honaljmelyseg/2, ujjaszelesseg/2, 42),
		//A(honaljmelyseg/2, ujjaszelesseg/2, 82),
		Q(81, l('77-81').line.getMidPoint(), 77),
		L(77),
		A(nyakszelesseg, nyakszelesseg, 85),
		kihajto,
		//Q(35),
		L('34a'),
		L('35'),
		`C${p[74].x + 3},${p[74].y + 2},${p[74].x},${p[74].y},${p['72_bottom'].x},${p['72_bottom'].y}`,
		L(72),
		L(49),
		L(48),
		L(50),
		L(51),
		L(68),
		L(70),
		"Z");



	//// oldalrész
	paths.oldalresz = path(
		M(62),
		`A${honaljmelyseg/2},${ujjaszelesseg/2} 25 0,0 ${p[60].x},${p[60].y}`,
		L(59),
		L(56),
		L(58),
		L(54),
		L('61b'),
		L('61a'),
		L('65a'),
		Q(65, 71),
		'Z')
	//// hát
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
		L(19),
		L(23),
		L(20),
		//L(21),
		L('21a'),
		L(22),
		L(25),
		L(11),
		L(13),
		'Z')

	paths.galler = path(
		M(94),
		L(92),
		L(88),
		L(91),
		L(89),
		L(90),
		L(77),
		A(nyakszelesseg, nyakszelesseg, 85),
		L('87g'),
		'Z')


			////
	paths.szivarzseb = path(M('40a'),
													L('40b'),
													`L${p['40b'].x},${p['40b'].y-2}`,
													`L${p['40a'].x},${p['40a'].y-2}`,
													'Z')

	return {paths: paths, points: p};

}
module.exports = render
