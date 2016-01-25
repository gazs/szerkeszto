import zako from './zako';
import { SVGPathString, createL, point } from '../szerkfunc';

export default function render (m) {
	const zako_rendered = zako(m);
	const {testmagassag,
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
	const tm = testmagassag,
		mb = mellboseg / 2,
		db = derekboseg / 2,
		csb = csipoboseg / 2;

	const zako_points = zako_rendered.points
	const zako_paths = zako_rendered.paths;
	//let points = {}
	//
	const nyakszelesseg = mb / 10 + 3.5;
	var points = {
		'z83': zako_points[83],
		'z87': zako_points[87],
		'z85': zako_points[85],
		'z77': zako_points[77],
	}

	const p = points;
	const l = createL(p)
	const zP = zako_points;
	const zL = createL(zako_points);

	p[87] = zL('87-85').atDistance(3.5)
	p['87a'] = p[87].perpendicularToLineWith(zP[87], 0.6)

	const hata_nyakmagassag = mb / 10 * 0.5 + 1.5;
	const p1517 = document.createElementNS("http://www.w3.org/2000/svg", "path");
	p1517.setAttribute('d', `
										 M${zP[17].x},${zP[17].y}
										 A${nyakszelesseg},${hata_nyakmagassag} 0 0,0 ${zP[15].x},${zP[15].y}`);

										 console.log(p1517.getTotalLength(), zL('15-17').length)
	p[88] = zP[83].atAngleOf(zL('86-83'), p1517.getTotalLength())

	//p[88] = zP[83].atAngleOf(zL('85-83'), zL('15-17').length)

	//p[89] = p[88].perpendicularToLineWith(zP[85], (mb / 10 - 1))
	console.log(mb/10 -1 , 1.3)
	p[89] = p[88].perpendicularToLineWith(zP[85], 1.6) // Cabrera

	//p[90] = p[89].perpendicularToLineWith(zP[83], 3) // álló gallér
	
	p['90a'] = zP[77].atAngleOf(l('z83-89'), l('z83-89').length)
	p[90] = l('z77-90a').closestPointTo(p[89])

	//p[91] = p[89].perpendicularToLineWith(zP[83], 4, 'flip') // fekvő gallér
	p[91] = p[89].atAngleOf(l('90-89'), 3.8) // Cabrera
	p[92] = zP[83].atAngleOf(zL('77-83'), 4.5)

	p[93] = p[87].perpendicularToLineWith(zP[87], 3.5, 'flip')
	p[94] = p[93].perpendicularToLineWith(p[87], 2.5, 'flip')

	// find Schneidermeistersystem 'k'
	const z77z85 = document.createElementNS("http://www.w3.org/2000/svg", "path");
	z77z85.setAttribute('d', `
										 M${zP[77].x},${zP[77].y}
										 A${nyakszelesseg},${nyakszelesseg} 0 0,1 ${zP[85].x},${zP[85].y}`);
p['k'] = new point(z77z85.getPointAtLength(3.5))

	const paths = {
		'zakodarab': new SVGPathString(zako_points)
										.M(81)
										.L(77)
										//.L(85)
										.A(nyakszelesseg,nyakszelesseg,85)
										.L(87)
										.pathstring,
		'kihajtovonal': new SVGPathString(zako_points)
										.M(39)
										.L(85)
										.pathstring,
		'galler': new SVGPathString(points)
										.M(91)
										.L(90)
										//.L('z85')
										.L('z77')
										.A(nyakszelesseg,nyakszelesseg,'z85')
										.L('87a')
										.L(94)
										.L(92)
										.Z()

	}
	return {paths, points};
}
