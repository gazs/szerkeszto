var draw = SVG('drawing').size(300, 300)

require("js-2dmath").globalize(window);


// vars



//
var testmagassag = 170,
tm = testmagassag,
mellboseg = 100,
mb = mellboseg / 2,
derekboseg = 88,
db = derekboseg / 2,
csipoboseg = 106,
derekhossza = 44.5,
zakohossza = 76,
hataszelesseg = 22,
vallaszelesseg = 15.5
ujjahossza = 78,

hata_egyensulymeret = 47,
eleje_egyensulymeret = 46;

var _points = 0;

function Point(x, y) {
	this.id = ++_points;
	console.log('#' + this.id, x, y);
	this.x = x;
	this.y = y;
}

Point.prototype.down = function (distance) {
	return new Point(this.x, this.y + distance);
};

Point.prototype.left = function (distance) {
	return new Point(this.x - distance, this.y);
};

Point.prototype.toString = function () {
	return [this.x, this.y]
};

var p1 = new Point(0,0);

// HÁTA

// kulcsszám
var kulcsszam = db / 10 + ((mb / 10) * 0.5) - 5
var p2 = p1.down(kulcsszam);

// hónaljmélység
var honaljmelyseg = tm / 10 + mb / 10

var p3 = p2.down(honaljmelyseg);
var p4 = p2.down(honaljmelyseg / 2);
var p5 = p2.down(honaljmelyseg / 4);
var p6 = p1.down(derekhossza);

// csipomelyseg
var csipomelyseg = tm / 10;

var p7 = p6.down(csipomelyseg);
var p8 = p1.down(zakohossza);

var p9 = p2.left(hataszelesseg + 1);

var p10 = new Point(p9.x, p2.y);
var p11 = new Point(p9.x, p3.y);

var p12 = p10.down(3); // háta illesztési pont
var p13 = p12.left(1); // varrásszélesség

