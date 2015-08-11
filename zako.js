var testmagassag = 170,
mellboseg = 100,
derekboseg = 88,
csipoboseg = 106,
derekhossza = 44.5,
zakohossza = 76,
hataszelesseg = 22,
vallszelesseg = 15.5,
ujjahossza = 78,
hata_egyensulymeret = 47,
eleje_egyensulymeret = 46;

var meretek = {
	normal: {
		testmagassag: 170,
		mellboseg: 100,
		derekboseg:88,
		csipoboseg: 106,
		derekhossza: 44.5,
		zakohossza: 76,
		hataszelesseg: 22,
		vallszelesseg: 15.5,
		ujjahossza: 78,
		hata_egyensulymeret: 47,
		eleje_egyensulymeret: 46
	},

	alacsony: {
		testmagassag: 160,
		mellboseg: 100,
		derekboseg: 88,
		csipoboseg: 106,
		derekhossza: 41.5,
		zakohossza: 72,
		hataszelesseg: 21,
		vallszelesseg: 15.5,
		ujjahossza: 78,
		hata_egyensulymeret: 44.7,
		eleje_egyensulymeret: 44.7
	},

	// telt (korpulens)
	telt: {
		testmagassag: 170,
		mellboseg: 106,
		derekboseg: 106,
		csipoboseg: 106,
		derekhossza: 46.5,
		zakohossza: 76,
		hataszelesseg: 23, // hátahossza-nak írva
		vallszelesseg: 16,
		ujjahossza: 78,
		hata_egyensulymeret: 49,
		eleje_egyensulymeret: 48.3
	},

	nagyhasu: {
		testmagassag: 170,
		mellboseg: 128,
		derekboseg: 136,
		csipoboseg: 140,
		derekhossza: 47.5,
		zakohossza: 76,
		hataszelesseg: 25.5,
		vallszelesseg: 17.5,
		ujjahossza: 79,
		hata_egyensulymeret: 49.2,
		eleje_egyensulymeret: 49.7
	},


	// karcsú, sportos
	sportos: {
		testmagassag: 180,
		mellboseg: 100,
		derekboseg: 80,
		csipoboseg: 106,
		derekhossza: 46.5,
		zakohossza: 81,
		hataszelesseg: 22.5,
		vallszelesseg: 16,
		ujjahossza: 81,
		hata_egyensulymeret: 49.2,
		eleje_egyensulymeret: 49.2
	},

	// magas, kissé hajlott
	magas_kisse_hajlott: {
		testmagassag: 180,
		mellboseg: 100,
		derekboseg: 88,
		csipoboseg: 106,
		derekhossza: 47.4,
		zakohossza: 81,
		hataszelesseg: 23,
		vallszelesseg: 16,
		ujjahossza: 81,
		hata_egyensulymeret: 49.8,
		eleje_egyensulymeret: 47.8
	},

	// magas, hosszú és vékony nyakú, csapott vállú
	magas_hosszu_vekony_nyaku_csaputt_vallu: {
		testmagassag: 190,
		mellboseg: 98,
		derekboseg: 90,
		csipoboseg: 104,
		derekhossza: 49.5,
		zakohossza: 85.5, // "hátahossza"
		hataszelesseg: 22.5,
		vallszelesseg: 16.5,
		ujjahossza: 85.5,
		hata_egyensulymeret: 51.5,
		eleje_egyensulymeret: 50
	},


	// erősen feszes
	erosen_feszes: {
		testmagassag: 166,
		mellboseg: 110,
		derekboseg: 98,
		csipoboseg: 110,
		derekhossza: 41.5,
		zakohossza: 75, // "hátahossza"
		hataszelesseg: 22.2,
		vallszelesseg: 16,
		ujjahossza: 77.5,
		hata_egyensulymeret: 44.5,
		eleje_egyensulymeret: 47.5
	},

	// beesett derekú hajlott
	beesett_dereku_hajlott: {
		testmagassag: 174,
		mellboseg: 92,
		derekboseg: 80,
		csipoboseg: 100,
		derekhossza: 48,
		zakohossza: 78, // "hátahossza"
		hataszelesseg: 21.5,
		vallszelesseg: 15.5,
		ujjahossza: 79,
		hata_egyensulymeret: 49.5,
		eleje_egyensulymeret: 47.5
	},

	// púpos
	pupos: {
		testmagassag: 172,
		mellboseg: 94,
		derekboseg: 86,
		csipoboseg: 102,
		derekhossza: 50.5,
		zakohossza: 77, // "hátahossza"
		hataszelesseg: 21.5 + 1.5,
		vallszelesseg: 15.5,
		ujjahossza: 78,
		hata_egyensulymeret: 50.5,
		eleje_egyensulymeret: 45.5
	}
}

var szamok = {
	kulcsszam: 'db / 10 + ((mb / 10) * 0.5) - 5',
	honaljmelyseg : 'tm / 10 + mb / 10',
	csipomelyseg : 'tm / 10',
	nyakszelesseg : 'mb / 10 + 3.5',
	derekbeallitas : 3,
	aljabeallitas : 4,
	aljaszelesseg : 'csb / 10 * 3.5',
	hat_karcsusitas : 1,
	eleje_tavolsag : 25,
	derekszelesseg : 'db / 10 * 5',
	mellszelesseg : 'db / 10 * 5',
	kis_oldalvarras : 5,
	honaljszelesseg : 'mb / 10 * 2.5 + 3',
	mellformazo_varras_helye: 'db / 10 * 2 + 6',
	mellformazo_varras_felso_vege: 3,
	// segédpont
	// p49 zsebvonal helye
	zsebvonal_helye: 'p[47].add(0, (p[8].y - p[46].y) / 2 + 3)',
	elejenyitas: 'kulcsszam / 2',
	mellynitas: 'kulcsszam / 2 + 0.8',
	nyakmelyseg: 'mb / 10 + 3',
	vallmagassag: 'kulcsszam + 4',
	//vallszelsseg1 ,??
	galler_szelesseg: 3,
	hajtoka_szelesseg: 'mb / 10 + 3',
	ujjaszelesseg: 'mb / 10 * 2.5 + 11',
	honaljmelyseg: '(distance(p[11], p[18]) + distance(p[66], p[82]))/ 2 - 3'
}

var Vec2D = toxi.geom.Vec2D,
		Line2D = toxi.geom.Line2D,
		Ray2D = toxi.geom.Ray2D,
		Circle = toxi.geom.Circle;

function drawLine(line) {
	s.line(line.a.x, line.a.y, line.b.x, line.b.y);
}

function perpendicularLine(line, pointOnLine) {
	return pointOnLine.add(line.getDirection().getRotated(toxi.math.mathUtils.radians(90)).scale(10))
}

function distance(point1, point2) {
	return new Line2D(point1, point2).getLength();
}

function intersection(line1, line2) {
	return line1.intersectLine(line2).pos;
}

function lineRight(point, distance) {
	distance = distance || 100;
	return new Line2D(point, point.add(distance, 0));
}

function zako() {
var tm = testmagassag,
mb = mellboseg / 2,
db = derekboseg / 2,
csb = csipoboseg / 2;
	//
var p = [];

p[1] = new Vec2D();

// HÁTA

// kulcsszám
var kulcsszam = db / 10 + ((mb / 10) * 0.5) - 5
// alacsony = db /10 + mb/10 *0.5 - 1.5
// nagyhasú = db /10 + mb/10*0.5 - 5
// sportos = db /10 + mb/10*0.5 - 5
// magas, kissé hajlott = db /10 + mb/10*0.5 - 5 + 1.5
//

p[2] = p[1].add(0,  kulcsszam);

// hónaljmélység
var honaljmelyseg = tm / 10 + mb / 10

p[3] = p[2].add(0,  honaljmelyseg);
p[4] = p[2].add(0,  honaljmelyseg / 2);
p[5] = p[2].add(0,  honaljmelyseg / 4);
p[6] = p[1].add(0,  derekhossza);


// csipomelyseg
var csipomelyseg = tm / 10;

p[7] = p[6].add(0,  csipomelyseg);
p[8] = p[1].add(0,  zakohossza);

l3 = new Line2D(p[3], p[3].add(-100,0));
l6 = new Line2D(p[6], p[6].add(-100, 0));
l7 = new Line2D(p[7], p[7].add(-100, 0))

p[9] = p[2].add(- (hataszelesseg + 1), 0);

p[10] = new Vec2D(p[9].x, p[4].y);
p[11] = new Vec2D(p[9].x, p[3].y);

p[12] = p[10].add(0, 3); // háta illesztési pont
p[13] = p[12].add(-1, 0); // varrásszélesség

var l_p1_p9 = new Line2D(p[1], p[9]);
p[15] = l_p1_p9.closestPointTo(p[5]);

// nyakszélesség
var nyakszelesseg = mb / 10 + 3.5;
p[16] = new Line2D(p[1], p[9]).toRay2D().getPointAtDistance(nyakszelesseg);

var _p17a = p[6].add(0, - (hata_egyensulymeret + 1));


var _p17b = perpendicularLine(l_p1_p9, p[16]);
var l_p16_p17b = new Line2D(p[16], _p17b);
p[17] = l_p16_p17b.closestPointTo(_p17a);

p[18] = new Line2D(p[17], p[9]).toRay2D().getPointAtDistance(vallszelesseg + 1 + 0.5);

var derekbeallitas = 3;
p[19] = p[6].add(- derekbeallitas, 0);

var aljabeallitas = 4;
p[20] = p[8].add(- aljabeallitas, 0);

var aljaszelesseg = csb / 10 * 3.5;


function perpendicularRay(line_part_1, line_part_2, point_on_line) {
	return new Line2D(point_on_line, perpendicularLine(new Line2D(line_part_1, line_part_2), point_on_line)).toRay2D();
}
// merőleges a 20-19 szakaszra, a 20 pontból, `aljaszelesseg` hosszú

p[21] = perpendicularRay(p[19], p[20], p[20]).getPointAtDistance(aljaszelesseg);


l22 = perpendicularRay(p[20], p[21], p[21]).toLine2DWithPointAtDistance(100);

p[22] = intersection(l7, l22);

p[23] = intersection(new Line2D(p[20], p[19]), l7);



p[24] = intersection(l6, l22);

var hat_karcsusitas = 1;
p[25] = p[24].add(hat_karcsusitas, 0);
//
// ELEJE

var eleje_tavolsag = 25;
p[33] = p[3].add(- (mb + eleje_tavolsag), 0);
p[34] = p[6].add(- (mb + eleje_tavolsag), 0);
p[35] = p[7].add(- (mb + eleje_tavolsag), 0);

var derekszelesseg = db / 10 * 5;
p[36] = p[33].add(derekszelesseg, 0);
p[37] = p[36].add(0, - kulcsszam);
p[38] = p[36].add(- (derekszelesseg / 2 + kulcsszam / 2), 0);
p[39] = p[38].add(- (mb / 10 * 2), 0) // ebben az esetben a 33 és a 39 pont megegyezik

var mellszelesseg = mb / 10 * 4 + 4;
p[40] = new Line2D(p[39], p[37]).toRay2D().getPointAtDistance(mellszelesseg);

p[41] = new Line2D(p[40], p[40].add(new Line2D(p[37], p[40]).getDirection().getRotated(toxi.math.mathUtils.radians(90)).scale(100))).intersectLine(new Line2D(p[3], p[36])).pos;

p[42] = new Ray2D(p[40].x, p[40].y, new Line2D(p[37], p[40]).getDirection().getRotated(toxi.math.mathUtils.radians(-90))).getPointAtDistance(3) // ujja illeszkedési pont

var kis_oldalvarras = 5;
p[43] = p[41].add(kis_oldalvarras, 0);
var honaljszelesseg = mb / 10 * 2.5 + 3;
p[44] = p[41].add(honaljszelesseg, 0);

// mellformázó varrás helye
var mellformazo_varras_helye = db / 10 * 2 + 6;
p[45] = p[34].add(mellformazo_varras_helye, 0);

p[46] = new Vec2D(p[45].x, p[3].y);

var mellformazo_varras_felso_vege = 3;
p[47] = p[46].add(0, mellformazo_varras_felso_vege);
p[48] = p[47].add(-0.5, 0); // segédpont

p[49] = p[47].add(0, (p[8].y - p[46].y) / 2 + 3);

var mellkivet = 3;
p[50] =p[45].add(mellkivet - 2, 0) // TODO FIXME ez valamilyen szögben van


p[51] = p[49].add(mellkivet - 2 + 0.3, 0);
p[52] = p[49].add(- 2.5, 0);

p[53] = p[35].add(mellkivet + kulcsszam / 4, 0 );

var csipomeret = csb + 7;
p[54] = p[53].add(csipomeret - distance(p[22], p[23]), 0);


p61a = (new Line2D(p[20], p[21]).copy().scale(10)).closestPointTo(p[54]);
var eleje_oldalvonal = new Line2D(p61a, p[54]).copy().scale(10);

p[55] = eleje_oldalvonal.intersectLine(l6).pos;
p[56] = eleje_oldalvonal.intersectLine(l3).pos;

//kihajtó
p['33a'] = p[33].add(0, mb /10 * 0.5);
p['40a'] = new Line2D(p[40], p[39]).toRay2D().getPointAtDistance(mb/10);
p['40b'] = new Line2D(p[40], p[39]).toRay2D().getPointAtDistance(mb/10 + mb/10 + 6);


p[57] = eleje_oldalvonal.intersectLine((new Line2D(p[12], p[13])).copy().scale(1000)).pos;

p[59] = p[57].add(0.5, 0);
p[60] = p[57].add(-0.5, 0);

p[58] = p[55].add(-1, 0); // karcsúsítás TODO hiányzik a simából

p[61] = new Line2D(p[58], p[54]).toRay2D().getPointAtDistance(distance(p[21], p[25]));
p[62] = p[43].add(distance(p[44], p[56]), 0);
p[63] = p[43].add(distance(p[44], p[56]) / 3, 0);


p[64] = new Vec2D(p[63].x, p[6].y);
p[65] = new Vec2D(p[63].x, p[49].y);

var l_43_65 = new Line2D(p[43], p[65]);
var l_65_62 = new Line2D(p[65], p[62]);
p['64a'] = l_43_65.intersectLine(new Line2D(p[6],p[34])).pos;

var _temp_39_40 = (new Line2D(p[39], p[40])).copy().scale(3);
var _temp_43_65 = (new Line2D(p[43], p[65])).copy().scale(3);
p[66] = _temp_43_65.intersectLine(_temp_39_40).pos;

p[67] = l_65_62.intersectLine(new Line2D(p[6],p[34])).pos;

p[68] = new Line2D(p[65], p[43]).toRay2D().getPointAtDistance(distance(p[43],p[66]));
p[69] = new Line2D(p['64a'], p[62]).toRay2D().getPointAtDistance(distance(p[43],p[66]));

// karcsúsítás
p[70] = new Line2D(p[69], p[50]).toRay2D().getPointAtDistance(1);
p[71] = p[67].add(1, 0);

p[72] = new Line2D(p[65], p[52]).toRay2D().getPointAtDistance(distance(p[35], p[53]));

var elejenyitas = kulcsszam / 2;
p[73] = p[34].add(0, elejenyitas);
p[74] = p[73].add(0, distance(p[21],p[25]) +1);

p['72_bottom'] = intersection(new Line2D(p[72], p[72].add(0, 100)), new Line2D(p[74], p[61]));

p['61a'] = new Line2D(p[61], p[74]).intersectLine(_temp_43_65.copy().scale(10)).pos;


var mellnyitas = kulcsszam / 2 + 0.8;
p[75] = p[33].add(0, - mellnyitas);


p[76] = p[38].add(0, -1.5); // TODO valójában tökre nem oda jelöli, cserébe nem magyarázza el hogy mi van.

var l_76 = perpendicularLine(new Line2D(p[76], p[75]), p[76]);

function circleLineIntersect(line, circlecenter, radius, which) {
	which = which ||  'intersection2';
	var _p77 = getIntersections([line.a.x, line.a.y], [line.b.x, line.b.y], [circlecenter.x, circlecenter.y, radius]).points[which].coords;
	return new Vec2D(_p77[0], _p77[1]);
}

// 45-től eleje-egyensúlyméret + 1 távolságra,
// a 76-ból induló merőlegest elmetszi valahol fent
p[77] = circleLineIntersect(new Line2D(p[76], l_76), p[45], eleje_egyensulymeret + 1);


// nyakmélység
var nyakmelyseg = mb / 10 + 3;
p[78] = new Line2D(p[77], p[76]).toRay2D().getPointAtDistance(nyakmelyseg);

var l_79 = new Line2D(p[78], perpendicularLine(new Line2D(p[77], p[76]), p[78]));
p[79] = l_79.toRay2D().getPointAtDistance(distance(p[15], p[16]) + 1);

var vallmagassag = kulcsszam + 4;
p[80] = new Line2D(p[77], p[45]).toRay2D().getPointAtDistance(vallmagassag);

var vallszelesseg1 = vallszelesseg + 1 + 0.5 -1; //distance(p[17], p[18]) -1;
var l_80  = perpendicularLine(new Line2D(p[80], p[77]), p[80]).scale(10);
p[81] = circleLineIntersect(new Line2D(p[80], l_80), p[77], vallszelesseg, 'intersection1');

var segedpont_82 = 0.6;
p[82] =p[81].add(0, 0.6);

var galler_szelesseg = 3;
p[83] = new Ray2D(p[77], new Line2D(p[81], p[77]).toRay2D().getDirection()).getPointAtDistance(galler_szelesseg);

var hajtoka_szelesseg = mb / 10 + 3;
var kihajto_alja = p[39];

p[85] = new Line2D(p[83], kihajto_alja).toRay2D().getPointAtDistance(distance(p[77], p[78]) - 0.5);
p[86] = new Line2D(p[85], kihajto_alja).toRay2D().getPointAtDistance(4.5);


p[87] = perpendicularRay(p[83], kihajto_alja, p[86]).getPointAtDistance(hajtoka_szelesseg) // hajtóka legszélesebb pontja
p['87b'] = perpendicularRay(kihajto_alja, p[83], p[86]).getPointAtDistance(hajtoka_szelesseg) // hajtóka legszélesebb pontja


p[84] = p[34].add(0, - 8); // felső gomblyuk helye

p['34a'] = p[34].add(-1.5, 0);


/// GALLÉR


////

var ujjaszelesseg = mb / 10 * 2.5 + 11;
var honaljmelyseg = (distance(p[11], p[18]) + distance(p[66], p[82]))/ 2 - 3;


// első rész
s.path(`M${p[66].x},${p[66].y}
			 A${honaljmelyseg/2},${ujjaszelesseg/2} 25 0,1 ${p[82].x},${p[82].y}
			 L${p[77].x},${p[77].y}
			 L${p[85].x},${p[85].y} // TODO nyakív
			 L${p[87].x},${p[87].y}
			 ${ '' /* L${p[84].x -1.5},${p[84].y} */ }
			 L${p['34a'].x},${p['34a'].y}
			 L${p[35].x},${p[35].y}
			 C${p[74].x + 3},${p[74].y + 2},${p[74].x},${p[74].y},${p['72_bottom'].x},${p['72_bottom'].y}
			 L${p[72].x},${p[72].y}
			 L${p[49].x},${p[49].y}
			 L${p[48].x},${p[48].y}
			 L${p[51].x},${p[51].y}
			 L${p[68].x},${p[68].y}
			 L${p[70].x},${p[70].y}
			 L${p[66].x},${p[66].y}

			 `)
s.path(`
			 M${p[85].x},${p[85].y}
			 ${ '' /* L${p[84].x -1.5},${p[84].y} */}
			 L${p['34a'].x},${p['34a'].y}
			 L${p['87b'].x},${p['87b'].y}
			 L${p[85].x},${p[85].y}
`)

// oldalrész
s.path(`M${p[62].x},${p[62].y} A${honaljmelyseg/2},${ujjaszelesseg/2} 25 0,0 ${p[60].x},${p[60].y}
			 L${p[59].x},${p[59].y}
			 L${p[56].x},${p[56].y}
			 L${p[58].x},${p[58].y}
			 L${p[54].x},${p[54].y}
			 L${p[61].x},${p[61].y}
			 L${p['61a'].x},${p['61a'].y}
			 L${p[65].x},${p[65].y}
			 L${p[71].x},${p[71].y}
			 L${p[62].x},${p[62].y}
			 `).attr({fill:'rgba(0,0,0,0.2)', stroke:'rgba(0,0,0,0.2)'})


// hát
s.path(`M${p[12].x},${p[12].y} A${honaljmelyseg/2},${ujjaszelesseg/2} 25 0,0 ${p[18].x},${p[18].y}
			 L${p[17].x},${p[17].y}
			 L${p[15].x},${p[15].y} // TODO nyakív
			 L${p[5].x},${p[5].y}
			 L${p[4].x},${p[4].y}
			 L${p[19].x},${p[19].y}
			 L${p[23].x},${p[23].y}
			 L${p[20].x},${p[20].y}
			 L${p[21].x},${p[21].y}
			 L${p[22].x},${p[22].y}
			 L${p[25].x},${p[25].y}
			 L${p[11].x},${p[11].y}
			 L${p[13].x},${p[13].y}
			 L${p[12].x},${p[12].y}
			 `).attr({fill:'rgba(0,0,0,0.2)', stroke:'rgba(0,0,0,0.2)'})

//-----
//

return p;

}

//--------

var s = Snap('#drawing');


function draw() {
s.clear();

var points = zako();
var p = points;
window.p = points;

var point;
for (key in points) {
	if (points[key]) {
		var point = points[key];
		s.group(
			s.circle(point.x, point.y, 0.1),
			s.text(point.x, point.y, key)
		)
	}
}
var flatten = function(a, b) {
  return a.concat(b);
};

function drawLine(line) {
	s.line(line.a.x, line.a.y, line.b.x, line.b.y);
}

function connect() {
	return s.polyline(Array.prototype.slice.call(arguments).map(function (v) {return [v.x, v.y]}).reduce(flatten)).attr({fill:'rgba(0,0,0,0.2)', stroke:'rgba(0,0,0,0.2)'});
}



function keyhole(point) {
	s.line(point.x, point.y, (point.x + 2), point.y).attr({strokeWidth: '0.1'})
}

function breastpocket(point1, point2) {
	var breaspocket_height = 1;
	connect(point1, point2, point2.add(0,-2), point1.add(0,-2)).attr({strokeWidth: 0.1});
}



var button1 = p[84];
var button3 = new Vec2D(p[34].x, p[49].y);
var button2 = (new Line2D(button1, button3)).getMidPoint();

keyhole(button1);
keyhole(button2);
keyhole(button3);

breastpocket(p['40a'], p['40b']);

s.attr({viewBox: s.getBBox().vb});
}

draw();

[].forEach.call(document.querySelectorAll('input'), function (input) {
	input.addEventListener('input', function () {
		var value = parseInt(input.value, 10);
		window[input.id] = value;
		input.parentNode.querySelector('span').innerHTML = value;
		draw();
	});
});


