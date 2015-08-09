var testmagassag = 170,
tm = testmagassag,
mellboseg = 100,
mb = mellboseg / 2,
derekboseg = 88,
db = derekboseg / 2,
csipoboseg = 106,
csb = csipoboseg / 2,
derekhossza = 44.5,
zakohossza = 76,
hataszelesseg = 22,
vallszelesseg = 15.5
ujjahossza = 78,

hata_egyensulymeret = 47,
eleje_egyensulymeret = 46;

var Vec2D = toxi.geom.Vec2D,
		Line2D = toxi.geom.Line2D,
		Ray2D = toxi.geom.Ray2D,
		Circle = toxi.geom.Circle;

var p1 = new Vec2D();

// HÁTA

// kulcsszám
var kulcsszam = db / 10 + ((mb / 10) * 0.5) - 5

var p2 = p1.add(0,  kulcsszam);

// hónaljmélység
var honaljmelyseg = tm / 10 + mb / 10

var p3 = p2.add(0,  honaljmelyseg);
var p4 = p2.add(0,  honaljmelyseg / 2);
var p5 = p2.add(0,  honaljmelyseg / 4);
var p6 = p1.add(0,  derekhossza);

// csipomelyseg
var csipomelyseg = tm / 10;

var p7 = p6.add(0,  csipomelyseg);
var p8 = p1.add(0,  zakohossza);

var p9 = p2.add(- (hataszelesseg + 1), 0);

var p10 = new Vec2D(p9.x, p4.y);
var p11 = new Vec2D(p9.x, p3.y);

var p12 = p10.add(0, 3); // háta illesztési pont
var p13 = p12.add(-1, 0); // varrásszélesség

var l_p1_p9 = new Line2D(p1, p9);
var p15 = l_p1_p9.closestPointTo(p5);

// nyakszélesség
var nyakszelesseg = mb / 10 + 3.5;
var p16 = p1.add(l_p1_p9.toRay2D().getPointAtDistance(nyakszelesseg));

var _p17a = p6.add(0, - (hata_egyensulymeret + 1));

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

var _p17b = perpendicularLine(l_p1_p9, p16);;
var l_p16_p17b = new Line2D(p16, _p17b);
var p17 = l_p16_p17b.closestPointTo(_p17a);


var p18 = new Line2D(p17, p9).toRay2D().getPointAtDistance(vallszelesseg + 1 + 0.5);

var derekbeallitas = 3;
var p19 = p6.add(- derekbeallitas, 0);

var aljabeallitas = 4;
var p20 = p8.add(- aljabeallitas, 0);

var aljaszelesseg = csb / 10 * 3.5;
var p21 = new Ray2D(p20.x, p20.y, new Line2D(p19, p20).getDirection().getRotated(toxi.math.mathUtils.radians(90))).getPointAtDistance(aljaszelesseg)
var p22 = new Line2D(p21, p21.add(new Line2D(p20, p21).getDirection().getRotated(toxi.math.mathUtils.radians(90)).scale(100))).intersectLine(new Line2D(p7, p7.add(-100,0))).pos;
var p23 = new Line2D(p20, p19).intersectLine(new Line2D(p7, p22)).pos;
var p24 = new Line2D(p21, p21.add(new Line2D(p20, p21).getDirection().getRotated(toxi.math.mathUtils.radians(90)).scale(100))).intersectLine(new Line2D(p6, p6.add(-100,0))).pos;
var p25 = p24.add(1, 0);
//
// ELEJE
var p33 = p3.add(- (mb + 25), 0);
var p34 = p6.add(- (mb + 25), 0);
var p35 = p7.add(- (mb + 25), 0);

var derekszelesseg = db / 10 * 5
var p36 = p33.add(derekszelesseg, 0);
var p37 = p36.add(0, - kulcsszam);
var p38 = p36.add(- (derekszelesseg / 2 + kulcsszam / 2), 0);
var p39 = p38.add(- (mb / 10 * 2), 0) // ebben az esetben a 33 és a 39 pont megegyezik

var mellszelesseg = mb / 10 * 4 + 4;
var p40 = new Ray2D(p39.x, p39.y, new Line2D(p39, p37).getDirection()).getPointAtDistance(mellszelesseg)

var p41 = new Line2D(p40, p40.add(new Line2D(p37, p40).getDirection().getRotated(toxi.math.mathUtils.radians(90)).scale(100))).intersectLine(new Line2D(p3, p36)).pos;

var p42 = new Ray2D(p40.x, p40.y, new Line2D(p37, p40).getDirection().getRotated(toxi.math.mathUtils.radians(-90))).getPointAtDistance(3) // ujja illeszkedési pont

var p43 = p41.add(5, 0); // kis oldalvarrás helye

var honaljszelesseg = mb / 10 * 2.5 + 3;
var p44 = p41.add(honaljszelesseg, 0);

// mellformázó varrás helye
var mellformazo_varras_helye = db / 10 * 2 + 6;
var p45 = p34.add(mellformazo_varras_helye, 0);

var p46 = new Vec2D(p45.x, p3.y);

var mellformazo_varras_felso_vege = 3;
var p47 = p46.add(0, mellformazo_varras_felso_vege);
var p48 = p47.add(-0.5, 0); // segédpont

var p49 = p47.add(0, (p8.y - p46.y) / 2 + 3);

var mellkivet = 3;
var p50 =p45.add(mellkivet, 0) // TODO FIXME ez valamilyen szögben van
var p51 = p49.add(mellkivet -2 + 0.3, 0);
var p52 = p49.add(- 2.5, 0);

var p53 = p35.add(mellkivet + kulcsszam / 4, 0 );

var csipomeret = csb + 7;
var p54 = p53.add(csipomeret - distance(p22, p23), 0);

var eleje_oldalvonal = new Line2D(p54, new Line2D( perpendicularLine(new Line2D(p20, p21), new Line2D(p20, new Line2D(p20, p21).toRay2D().getPointAtDistance(100)).closestPointTo(p54)), p54).toRay2D().getPointAtDistance(100));

var p55 = eleje_oldalvonal.intersectLine(new Line2D(p6, p34)).pos;
var p56 = eleje_oldalvonal.intersectLine(new Line2D(p3, p33)).pos;

//kihajtó
var p33a = p33.add(0, mb /10 * 0.5);
var p40a = new Line2D(p40, p39).toRay2D().getPointAtDistance(mb/10);
var p40b = new Line2D(p40, p39).toRay2D().getPointAtDistance(mb/10 + mb/10 + 6);


var p57 = eleje_oldalvonal.intersectLine((new Line2D(p12, p13)).copy().scale(100)).pos;

var p60 = p59 = p57;

var p58 = p55.add(-1, 0); // karcsúsítás TODO hiányzik a simából

var p61 = new Line2D(p58, p54).toRay2D().getPointAtDistance(distance(p21, p25)); 
var p62 = p43.add(distance(p44, p56), 0);
var p63 = p43.add(distance(p44, p56) / 3, 0);


var p64 = new Vec2D(p63.x, p6.y);
var p65 = new Vec2D(p63.x, p49.y);

var l_43_65 = new Line2D(p43, p65);
var l_65_62 = new Line2D(p65, p62);
var p64a = l_43_65.intersectLine(new Line2D(p6,p34)).pos;

var _temp_39_40 = (new Line2D(p39, p40)).copy().scale(3);
var _temp_43_65 = (new Line2D(p43, p65)).copy().scale(3);
var p66 = _temp_43_65.intersectLine(_temp_39_40).pos;

var p67 = l_65_62.intersectLine(new Line2D(p6,p34)).pos;

var p68 = new Line2D(p65, p43).toRay2D().getPointAtDistance(distance(p43,p66));
var p69 = new Line2D(p64a, p62).toRay2D().getPointAtDistance(distance(p43,p66));

// karcsúsítás
var p70 = new Line2D(p69, p50).toRay2D().getPointAtDistance(1);
var p71 = p67.add(1, 0);

var p72 = new Line2D(p65, p52).toRay2D().getPointAtDistance(distance(p35, p53));


var elejenyitas = kulcsszam / 2;
var p73 = p34.add(0, elejenyitas);
var p74 = p73.add(0, distance(p21,p25) +1);

var p72_bottom = intersection(new Line2D(p72, p72.add(0, 100)), new Line2D(p74, p61));

var p61a = new Line2D(p61, p74).intersectLine(_temp_43_65.copy().scale(10)).pos;


var mellnyitas = kulcsszam / 2 + 0.8;
var p75 = p33.add(0, - mellnyitas);


var p76 = p38; // TODO valójában tökre nem oda jelöli, cserébe nem magyarázza el hogy mi van.

var l_76 = perpendicularLine1(new Line2D(p75, p76), p76);

function circleLineIntersect(line, circlecenter, radius, which) {
	which = which ||  'intersection2';
	var _p77 = getIntersections([line.a.x, line.a.y], [line.b.x, line.b.y], [circlecenter.x, circlecenter.y, radius]).points[which].coords;
	return new Vec2D(_p77[0], _p77[1]);
}

// 45-től eleje-egyensúlyméret + 1 távolságra,
// a 76-ból induló merőlegest elmetszi valahol fent
var p77 = circleLineIntersect(new Line2D(p76, l_76), p45, eleje_egyensulymeret + 1);


// nyakmélység
var nyakmelyseg = mb / 10 + 3;
var p78 = new Line2D(p77, p76).toRay2D().getPointAtDistance(nyakmelyseg);

var l_79 = new Line2D(p78, perpendicularLine(new Line2D(p77, p76), p78));
var p79 = l_79.toRay2D().getPointAtDistance(distance(p15, p16) + 1);

var vallmagassag = kulcsszam + 4;
var p80 = new Line2D(p77, p45).toRay2D().getPointAtDistance(vallmagassag);

var vallszelesseg = distance(p17, p18) -1;
var l_80  = perpendicularLine1(new Line2D(p77, p80), p80).scale(10);
var p81 = circleLineIntersect(new Line2D(p80, l_80), p77, vallszelesseg, 'intersection1');

var segedpont_82 = 0.6;
var p82 =p81.add(0, 0.6);

var galler_szelesseg = 3;
var p83 = new Ray2D(p77, new Line2D(p81, p77).toRay2D().getDirection()).getPointAtDistance(galler_szelesseg);

var p85 = new Line2D(p83, p39).toRay2D().getPointAtDistance(distance(p77, p78) - 0.5);
var p86 = new Line2D(p85, p39).toRay2D().getPointAtDistance(4.5);


var p87 = new Line2D(p86, perpendicularLine1(new Line2D(p39, p83), p86)).toRay2D().getPointAtDistance(4.5) // hajtóka legszélesebb pontja



//-----
//
var p84 = p34.add(0, - 8); // felső gomblyuk helye

var p34a = p34.add(-1.5, 0);


//--------

var s = Snap('#drawing');


var point;
for (key in window) {
	if (window.hasOwnProperty(key) && key.match(/^p\d/)) {
		point = window[key];
		if (point) {
			s.group(
				s.circle(point.x, point.y, 0.1),
				s.text(point.x, point.y, key.replace('p',''))
			)
		}
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

connect(p15, p5, p4, p19, p23, p20, p21, p22, p25, p11, p13, p12, p10, p18, p17, p15)

connect(p65, p71, p62, p60, p59, p56, p58, p54, p61, p61a, p65)

connect(p77, p82, p42, p66, p70, p68, p51, p50, p48, p45, p49, p72, p72_bottom, p74, p35, p34a, p84.add(-1.5,0), p75, p87, p85, p77 )

function keyhole(point) {
	s.line(point.x, point.y, (point.x + 2), point.y).attr({strokeWidth: '0.1'})
}

function breastpocket(point1, point2) {
	var breaspocket_height = 1;
	connect(point1, point2, point2.add(0,-1), point1.add(0,-1)).attr({strokeWidth: 0.1});
}

keyhole(p84);
keyhole(p34);
keyhole(p34.add(0, 8));

breastpocket(p40a, p40b);

s.attr({viewBox: s.getBBox().vb});
