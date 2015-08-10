var testmagassag = 170,
//tm = testmagassag,
mellboseg = 100,
//mb = mellboseg / 2,
derekboseg = 88,
//db = derekboseg / 2,
csipoboseg = 106,
//csb = csipoboseg / 2,
derekhossza = 44.5,
zakohossza = 76,
hataszelesseg = 22,
vallszelesseg = 15.5,
ujjahossza = 78,

hata_egyensulymeret = 47,
eleje_egyensulymeret = 46;

var Vec2D = toxi.geom.Vec2D,
		Line2D = toxi.geom.Line2D,
		Ray2D = toxi.geom.Ray2D,
		Circle = toxi.geom.Circle;


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

p[9] = p[2].add(- (hataszelesseg + 1), 0);

p[10] = new Vec2D(p[9].x, p[4].y);
p[11] = new Vec2D(p[9].x, p[3].y);

p[12] = p[10].add(0, 3); // háta illesztési pont
p[13] = p[12].add(-1, 0); // varrásszélesség

var l_p1_p9 = new Line2D(p[1], p[9]);
p[15] = l_p1_p9.closestPointTo(p[5]);

// nyakszélesség
var nyakszelesseg = mb / 10 + 3.5;
//var p[16] = p[1].add(l_p[1]_p[9].toRay2D().getPointAtDistance(nyakszelesseg));
p[16] = new Line2D(p[1], p[9]).toRay2D().getPointAtDistance(nyakszelesseg);

var _p17a = p[6].add(0, - (hata_egyensulymeret + 1));

function perpendicularLine(line, pointOnLine) {
	return pointOnLine.add(line.getDirection().getRotated(toxi.math.mathUtils.radians(90)).scale(10))
}
function perpendicularLine1(line, pointOnLine) {
	return pointOnLine.add(line.getDirection().getRotated(toxi.math.mathUtils.radians(-90)).scale(10))
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

var _p17b = perpendicularLine(l_p1_p9, p[16]);
var l_p16_p17b = new Line2D(p[16], _p17b);
p[17] = l_p16_p17b.closestPointTo(_p17a);

p[18] = new Line2D(p[17], p[9]).toRay2D().getPointAtDistance(vallszelesseg + 1 + 0.5);

var derekbeallitas = 3;
p[19] = p[6].add(- derekbeallitas, 0);

var aljabeallitas = 4;
p[20] = p[8].add(- aljabeallitas, 0);

var aljaszelesseg = csb / 10 * 3.5;
p[21] = new Ray2D(p[20].x, p[20].y, new Line2D(p[19], p[20]).getDirection().getRotated(toxi.math.mathUtils.radians(90))).getPointAtDistance(aljaszelesseg)
p[22] = new Line2D(p[21], p[21].add(new Line2D(p[20], p[21]).getDirection().getRotated(toxi.math.mathUtils.radians(90)).scale(100))).intersectLine(new Line2D(p[7], p[7].add(-100,0))).pos;
p[23] = new Line2D(p[20], p[19]).intersectLine(new Line2D(p[7], p[22])).pos;
p[24] = new Line2D(p[21], p[21].add(new Line2D(p[20], p[21]).getDirection().getRotated(toxi.math.mathUtils.radians(90)).scale(100))).intersectLine(new Line2D(p[6], p[6].add(-100,0))).pos;
p[25] = p[24].add(1, 0);
//
// ELEJE
p[33] = p[3].add(- (mb + 25), 0);
p[34] = p[6].add(- (mb + 25), 0);
p[35] = p[7].add(- (mb + 25), 0);

var derekszelesseg = db / 10 * 5
p[36] = p[33].add(derekszelesseg, 0);
p[37] = p[36].add(0, - kulcsszam);
p[38] = p[36].add(- (derekszelesseg / 2 + kulcsszam / 2), 0);
p[39] = p[38].add(- (mb / 10 * 2), 0) // ebben az esetben a 33 és a 39 pont megegyezik

var mellszelesseg = mb / 10 * 4 + 4;
p[40] = new Ray2D(p[39].x, p[39].y, new Line2D(p[39], p[37]).getDirection()).getPointAtDistance(mellszelesseg)

p[41] = new Line2D(p[40], p[40].add(new Line2D(p[37], p[40]).getDirection().getRotated(toxi.math.mathUtils.radians(90)).scale(100))).intersectLine(new Line2D(p[3], p[36])).pos;

p[42] = new Ray2D(p[40].x, p[40].y, new Line2D(p[37], p[40]).getDirection().getRotated(toxi.math.mathUtils.radians(-90))).getPointAtDistance(3) // ujja illeszkedési pont

p[43] = p[41].add(5, 0); // kis oldalvarrás helye

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
p[50] =p[45].add(mellkivet, 0) // TODO FIXME ez valamilyen szögben van
p[51] = p[49].add(mellkivet -2 + 0.3, 0);
p[52] = p[49].add(- 2.5, 0);

p[53] = p[35].add(mellkivet + kulcsszam / 4, 0 );

var csipomeret = csb + 7;
p[54] = p[53].add(csipomeret - distance(p[22], p[23]), 0);

var eleje_oldalvonal = new Line2D(p[54], new Line2D( perpendicularLine(new Line2D(p[20], p[21]), new Line2D(p[20], new Line2D(p[20], p[21]).toRay2D().getPointAtDistance(100)).closestPointTo(p[54])), p[54]).toRay2D().getPointAtDistance(100));

p[55] = eleje_oldalvonal.intersectLine(new Line2D(p[6], p[34])).pos;
p[56] = eleje_oldalvonal.intersectLine(new Line2D(p[3], p[33])).pos;

//kihajtó
p['33a'] = p[33].add(0, mb /10 * 0.5);
p['40a'] = new Line2D(p[40], p[39]).toRay2D().getPointAtDistance(mb/10);
p['40b'] = new Line2D(p[40], p[39]).toRay2D().getPointAtDistance(mb/10 + mb/10 + 6);


p[57] = eleje_oldalvonal.intersectLine((new Line2D(p[12], p[13])).copy().scale(100)).pos;

p[60] = p[59] = p[57];

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


p[76] = p[38]; // TODO valójában tökre nem oda jelöli, cserébe nem magyarázza el hogy mi van.

var l_76 = perpendicularLine1(new Line2D(p[75], p[76]), p[76]);

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
var l_80  = perpendicularLine1(new Line2D(p[77], p[80]), p[80]).scale(10);
p[81] = circleLineIntersect(new Line2D(p[80], l_80), p[77], vallszelesseg, 'intersection1');

var segedpont_82 = 0.6;
p[82] =p[81].add(0, 0.6);

var galler_szelesseg = 3;
p[83] = new Ray2D(p[77], new Line2D(p[81], p[77]).toRay2D().getDirection()).getPointAtDistance(galler_szelesseg);

p[85] = new Line2D(p[83], p[39]).toRay2D().getPointAtDistance(distance(p[77], p[78]) - 0.5);
p[86] = new Line2D(p[85], p[39]).toRay2D().getPointAtDistance(4.5);


p[87] = new Line2D(p[86], perpendicularLine1(new Line2D(p[39], p[83]), p[86])).toRay2D().getPointAtDistance(4.5) // hajtóka legszélesebb pontja



//-----
//
p[84] = p[34].add(0, - 8); // felső gomblyuk helye

p['34a'] = p[34].add(-1.5, 0);

return p;

}

//--------

var s = Snap('#drawing');


function draw() {
s.clear();

var points = zako();
var p = points;

var point;
for (point in points) {
	if (points[point]) {
		var point = points[point];
		s.group(
			s.circle(point.x, point.y, 0.1)
			//s.text(point.x, point.y, key)
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

connect(p[15], p[5], p[4], p[19], p[23], p[20], p[21], p[22], p[25], p[11], p[13], p[12], p[10], p[18], p[17], p[15])

connect(p[65], p[71], p[62], p[60], p[59], p[56], p[58], p[54], p[61], p['61a'], p[65])

connect(p[77], p[82], p[42], p[66], p[70], p[68], p[51], p[50], p[48], p[45], p[49], p[72], p['72_bottom'], p[74], p[35], p['34a'], p[84].add(-1.5,0), p[75], p[87], p[85], p[77] )

function keyhole(point) {
	s.line(point.x, point.y, (point.x + 2), point.y).attr({strokeWidth: '0.1'})
}

function breastpocket(point1, point2) {
	var breaspocket_height = 1;
	connect(point1, point2, point2.add(0,-1), point1.add(0,-1)).attr({strokeWidth: 0.1});
}

keyhole(p[84]);
keyhole(p[34]);
keyhole(p[34].add(0, 8));

breastpocket(p['40a'], p['40b']);

s.attr({viewBox: s.getBBox().vb});
}

draw();

[].forEach.call(document.querySelectorAll('input'), function (input) {
	input.addEventListener('input', function () {
		window[input.id] = parseInt(input.value, 10);
		draw();
	});
});
