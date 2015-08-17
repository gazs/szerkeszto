import React from "react";

import Vec2D from "./toxi/geom/Vec2D"
import Line2D from "./toxi/geom/Line2D"
import Ray2D from "./toxi/geom/Ray2D"
import Circle from "./toxi/geom/Circle"
import mathUtils from "./toxi/math/mathUtils"
import getIntersections from "./geometricFunctions"



class Zako extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.props;
	}

	render () {

		function perpendicularLine(line, pointOnLine) {
			return pointOnLine.add(line.getDirection().getRotated(mathUtils.radians(90)).scale(10))
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

		function zako(m, sz) {
			var testmagassag = m.testmagassag,
			mellboseg = m.mellboseg,
			derekboseg = m.derekboseg,
			csipoboseg = m.csipoboseg,
			derekhossza = m.derekhossza,
			zakohossza = m.zakohossza,
			hataszelesseg = m.hataszelesseg,
			vallszelesseg = m.vallszelesseg,
			ujjahossza = m.ujjahossza,
			hata_egyensulymeret = m.hata_egyensulymeret,
			eleje_egyensulymeret = m.eleje_egyensulymeret,

			tm = testmagassag,
			mb = mellboseg / 2,
			db = derekboseg / 2,
			csb = csipoboseg / 2;
			//
			var p = [];

			p[1] = new Vec2D();

			// HÁTA

			// kulcsszám
			//var kulcsszam = db / 10 + ((mb / 10) * 0.5) - 5
			var kulcsszam = eval(sz.kulcsszam);
			// alacsony = db /10 + mb/10 *0.5 - 1.5
			// nagyhasú = db /10 + mb/10*0.5 - 5
			// sportos = db /10 + mb/10*0.5 - 5
			// magas, kissé hajlott = db /10 + mb/10*0.5 - 5 + 1.5
			//

			p[2] = p[1].add(0,  kulcsszam);

			// hónaljmélység
			//var honaljmelyseg = tm / 10 + mb / 10
			var honaljmelyseg = eval(sz.honaljmelyseg);

			p[3] = p[2].add(0,  honaljmelyseg);
			p[4] = p[2].add(0,  honaljmelyseg / 2);
			p[5] = p[2].add(0,  honaljmelyseg / 4);
			p[6] = p[1].add(0,  derekhossza);


			// csipomelyseg
			//var csipomelyseg = tm / 10;
			var csipomelyseg = eval(sz.csipomelyseg);

			p[7] = p[6].add(0,  csipomelyseg);
			p[8] = p[1].add(0,  zakohossza);

			var l3 = new Line2D(p[3], p[3].add(-100,0));
			var l6 = new Line2D(p[6], p[6].add(-100, 0));
			var l7 = new Line2D(p[7], p[7].add(-100, 0))

			p[9] = p[2].add(- (hataszelesseg + 1), 0);

			p[10] = new Vec2D(p[9].x, p[4].y);
			p[11] = new Vec2D(p[9].x, p[3].y);

			p[12] = p[10].add(0, 3); // háta illesztési pont
			p[13] = p[12].add(-1, 0); // varrásszélesség

			var l_p1_p9 = new Line2D(p[1], p[9]);
			p[15] = l_p1_p9.closestPointTo(p[5]);

			// nyakszélesség
			//var nyakszelesseg = mb / 10 + 3.5;
			var nyakszelesseg = eval(sz.nyakszelesseg);
			p[16] = new Line2D(p[1], p[9]).toRay2D().getPointAtDistance(nyakszelesseg);

			var hata_nyakmagassag = eval('mb / 10 * 0.5 + 1.5')

			var _p17a = p[6].add(0, - (hata_egyensulymeret + 1));


			var _p17b = perpendicularLine(l_p1_p9, p[16]);
			var l_p16_p17b = new Line2D(p[16], _p17b);
			p[17] = l_p16_p17b.closestPointTo(_p17a);

			p[18] = new Line2D(p[17], p[9]).toRay2D().getPointAtDistance(vallszelesseg + 1 + 0.5);

			//var derekbeallitas = 3;
			var derekbeallitas = eval(sz.derekbeallitas);
			p[19] = p[6].add(- derekbeallitas, 0);

			//var aljabeallitas = 4;
			var aljabeallitas = eval(sz.aljabeallitas);
			p[20] = p[8].add(- aljabeallitas, 0);

			//var aljaszelesseg = csb / 10 * 3.5;
			var aljaszelesseg = eval(sz.aljaszelesseg);


			function perpendicularRay(line_part_1, line_part_2, point_on_line) {
				return new Line2D(point_on_line, perpendicularLine(new Line2D(line_part_1, line_part_2), point_on_line)).toRay2D();
			}
			// merőleges a 20-19 szakaszra, a 20 pontból, `aljaszelesseg` hosszú

			p[21] = perpendicularRay(p[19], p[20], p[20]).getPointAtDistance(aljaszelesseg);


			var l22 = perpendicularRay(p[20], p[21], p[21]).toLine2DWithPointAtDistance(100);

			p[22] = intersection(l7, l22);

			p[23] = intersection(new Line2D(p[20], p[19]), l7);



			p[24] = intersection(l6, l22);

			//var hat_karcsusitas = 1;
			var hat_karcsusitas= eval(sz.hat_karcsusitas);
			p[25] = p[24].add(hat_karcsusitas, 0);
			//
			// ELEJE

			//var eleje_tavolsag = 25;
			var eleje_tavolsag = eval(sz.eleje_tavolsag);
			p[33] = p[3].add(- (mb + eleje_tavolsag), 0);
			p[34] = p[6].add(- (mb + eleje_tavolsag), 0);
			p[35] = p[7].add(- (mb + eleje_tavolsag), 0);

			//var derekszelesseg = db / 10 * 5;
			var derekszelesseg = eval(sz.derekszelesseg);
			p[36] = p[33].add(derekszelesseg, 0);
			p[37] = p[36].add(0, - kulcsszam);
			p[38] = p[36].add(- (derekszelesseg / 2 + kulcsszam / 2), 0);
			p[39] = p[38].add(- (mb / 10 * 2), 0) // ebben az esetben a 33 és a 39 pont megegyezik

			//var mellszelesseg = mb / 10 * 4 + 4;
			var mellszelesseg = eval(sz.mellszelesseg);

			p[40] = new Line2D(p[39], p[37]).toRay2D().getPointAtDistance(mellszelesseg);

			p[41] = new Line2D(p[40], p[40].add(new Line2D(p[37], p[40]).getDirection().getRotated(mathUtils.radians(90)).scale(100))).intersectLine(new Line2D(p[3], p[36])).pos;

			p[42] = new Ray2D(p[40].x, p[40].y, new Line2D(p[37], p[40]).getDirection().getRotated(mathUtils.radians(-90))).getPointAtDistance(3) // ujja illeszkedési pont

			//var kis_oldalvarras = 5;
			var kis_oldalvarras= eval(sz.kis_oldalvarras);

			p[43] = p[41].add(kis_oldalvarras, 0);

			//var honaljszelesseg = mb / 10 * 2.5 + 3;
			var honaljszelesseg= eval(sz.honaljszelesseg);

			p[44] = p[41].add(honaljszelesseg, 0);

			// mellformázó varrás helye
			//var mellformazo_varras_helye = db / 10 * 2 + 6;
			var mellformazo_varras_helye = eval(sz.mellformazo_varras_helye);;

			p[45] = p[34].add(mellformazo_varras_helye, 0);

			p[46] = new Vec2D(p[45].x, p[3].y);

			//var mellformazo_varras_felso_vege = 3;
			var mellformazo_varras_felso_vege= eval(sz.mellformazo_varras_felso_vege);

			p[47] = p[46].add(0, mellformazo_varras_felso_vege);
			p[48] = p[47].add(-0.5, 0); // segédpont

			p[49] = p[47].add(0, (p[8].y - p[46].y) / 2 + 3);

			//var mellkivet = 3;
			var mellkivet = eval(sz.mellkivet);
			p[50] =p[45].add(mellkivet - 2, 0) // TODO FIXME ez valamilyen szögben van


			p[51] = p[49].add(mellkivet - 2 + 0.3, 0);
			p[52] = p[49].add(- 2.5, 0);

			p[53] = p[35].add(mellkivet + kulcsszam / 4, 0 );

			//var csipomeret = csb + 7;
			var csipomeret = eval(sz.csipomeret);
			p[54] = p[53].add(csipomeret - distance(p[22], p[23]), 0);


			var p61a = (new Line2D(p[20], p[21]).copy().scale(10)).closestPointTo(p[54]);
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

			//var elejenyitas = kulcsszam / 2;
			var elejenyitas = eval(sz.elejenyitas);
			p[73] = p[34].add(0, elejenyitas);
			p[74] = p[73].add(0, distance(p[21],p[25]) +1);

			p['72_bottom'] = intersection(new Line2D(p[72], p[72].add(0, 100)), new Line2D(p[74], p[61]));

			p['61a'] = new Line2D(p[61], p[74]).intersectLine(_temp_43_65.copy().scale(10)).pos;


			//var mellnyitas = kulcsszam / 2 + 0.8;
			var mellnyitas = eval(sz.mellnyitas);
			p[75] = p[33].add(0, - mellnyitas);


			//p[76] = p[38].add(0, -1.5); // TODO valójában tökre nem oda jelöli, cserébe nem magyarázza el hogy mi van.

			// a konfekciós részben így számolja a p[76]-ot (ott p[43])
			var hasszelesseg = db / 10 * 5;
			//hasszelesseg / 2 + kulcsszam / 2
			p[76] = new Line2D(p[40], p[33]).toRay2D().getPointAtDistance(hasszelesseg / 2 + kulcsszam + 2);

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
			//var nyakmelyseg = mb / 10 + 3;
			var nyakmelyseg = eval(sz.nyakmelyseg);
			p[78] = new Line2D(p[77], p[76]).toRay2D().getPointAtDistance(nyakmelyseg);

			var l_79 = new Line2D(p[78], perpendicularLine(new Line2D(p[77], p[76]), p[78]));
			p[79] = l_79.toRay2D().getPointAtDistance(distance(p[15], p[16]) + 1);

			//var vallmagassag = kulcsszam + 4;
			var vallmagassag = eval(sz.vallmagassag);
			p[80] = new Line2D(p[77], p[45]).toRay2D().getPointAtDistance(vallmagassag);

			var vallszelesseg1 = vallszelesseg + 1 + 0.5 -1; //distance(p[17], p[18]) -1;
			var l_80  = perpendicularLine(new Line2D(p[80], p[77]), p[80]).scale(10);
			p[81] = circleLineIntersect(new Line2D(p[80], l_80), p[77], vallszelesseg, 'intersection1');

			var segedpont_82 = 0.6;
			p[82] =p[81].add(0, 0.6);

			//var galler_szelesseg = 3;
			var galler_szelesseg = eval(sz.galler_szelesseg);
			p[83] = new Ray2D(p[77], new Line2D(p[81], p[77]).toRay2D().getDirection()).getPointAtDistance(galler_szelesseg);

			//var hajtoka_szelesseg = mb / 10 + 3;
			var hajtoka_szelesseg = eval(sz.hajtoka_szelesseg);
			var kihajto_alja = p[39];

			p[85] = new Line2D(p[83], kihajto_alja).toRay2D().getPointAtDistance(distance(p[77], p[78]) - 0.5);
			p[86] = new Line2D(p[85], kihajto_alja).toRay2D().getPointAtDistance(4.5);


			p[87] = perpendicularRay(p[83], kihajto_alja, p[86]).getPointAtDistance(hajtoka_szelesseg) // hajtóka legszélesebb pontja
			p['87b'] = perpendicularRay(kihajto_alja, p[83], p[86]).getPointAtDistance(hajtoka_szelesseg) // hajtóka legszélesebb pontja


			p[84] = p[34].add(0, - 8); // felső gomblyuk helye

			p['34a'] = p[34].add(-1.5, 0);


			/// GALLÉR


			////

			//var ujjaszelesseg = mb / 10 * 2.5 + 11;
			var ujjaszelesseg = eval(sz.ujjaszelesseg);
			//var honaljmelyseg = (distance(p[11], p[18]) + distance(p[66], p[82]))/ 2 - 3;


			var paths = {};

			// első rész
			paths.elso = (`M${p[66].x},${p[66].y}
								 A${honaljmelyseg/2},${ujjaszelesseg/2} 25 0,1 ${p[42].x},${p[42].y}
								 A${honaljmelyseg/2},${ujjaszelesseg/2} 25 0,1 ${p[82].x},${p[82].y}
								 L${p[77].x},${p[77].y}
								 A${nyakszelesseg},${nyakszelesseg} 0  0, 1 ${p[85].x},${p[85].y}
								 L${p[85].x},${p[85].y}
								 L${p[87].x},${p[87].y}
								 ${ '' /* L${p[84].x -1.5},${p[84].y} */ }
								 L${p['34a'].x},${p['34a'].y}
								 L${p[35].x},${p[35].y}
								 C${p[74].x + 3},${p[74].y + 2},${p[74].x},${p[74].y},${p['72_bottom'].x},${p['72_bottom'].y}
								 L${p[72].x},${p[72].y}
								 L${p[49].x},${p[49].y}
								 L${p[48].x},${p[48].y}
								 L${p[50].x},${p[50].y}
								 L${p[51].x},${p[51].y}
								 L${p[68].x},${p[68].y}
								 L${p[70].x},${p[70].y}
								 L${p[66].x},${p[66].y}

								 `)
			 paths.kihajto_dup = (`
									M${p[85].x},${p[85].y}
									${ '' /* L${p[84].x -1.5},${p[84].y} */ }
									L${p['34a'].x},${p['34a'].y}
									L${p['87b'].x},${p['87b'].y}
									L${p[85].x},${p[85].y}
									`)

				// oldalrész
				paths.oldalresz = (`M${p[62].x},${p[62].y}
									 A${honaljmelyseg/2},${ujjaszelesseg/2} 25 0,0 ${p[60].x},${p[60].y}
									 L${p[59].x},${p[59].y}
									 L${p[56].x},${p[56].y}
									 L${p[58].x},${p[58].y}
									 L${p[54].x},${p[54].y}
									 L${p[61].x},${p[61].y}
									 L${p['61a'].x},${p['61a'].y}
									 L${p[65].x},${p[65].y}
									 L${p[71].x},${p[71].y}
									 L${p[62].x},${p[62].y}
									 `)
				 // hát
				 paths.hatresz = (`M${p[12].x},${p[12].y}
										A${honaljmelyseg/2},${ujjaszelesseg/2} 0 0,0 ${p[10].x},${p[10].y}
										A${honaljmelyseg/2},${ujjaszelesseg/2} 0 0,0 ${p[18].x},${p[18].y}
										L${p[17].x},${p[17].y}
										A${nyakszelesseg},${hata_nyakmagassag} 0 0,0 ${p[15].x},${p[15].y}
										L${p[15].x},${p[15].y}
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
										`)
										//-----
			//
			paths.szivarzseb = (`M${p['40a'].x},${p['40a'].y}
													L${p['40b'].x},${p['40b'].y}
													L${p['40b'].x},${p['40b'].y-2}
													L${p['40a'].x},${p['40a'].y-2}
													L${p['40a'].x},${p['40a'].y}
			`)

			return {paths: paths, points: p};

		}

		//--------


		function draw() {
			//function keyhole(point) {
			//s.line(point.x, point.y, (point.x + 2), point.y).attr({strokeWidth: '0.1'})
			//}


			//var button1 = p[84];
			//var button3 = new Vec2D(p[34].x, p[49].y);
			//var button2 = (new Line2D(button1, button3)).getMidPoint();

			//keyhole(button1);
			//keyhole(button2);
			//keyhole(button3);


		//}


		}
		var {paths, points}= zako(this.state.meretek, this.state.szamok);
		var p = points;
		var viewBox = `${p[87].x} ${p[83].y -5} ${Math.abs(p[87].x-p[5].x)}  ${Math.abs(p[17].y-p[74].y - 8)}` // TODO: automatic viewbox calc

		return (
      <svg
        viewBox={viewBox}
        width="800"
        height="800"
        fill="currentcolor">
				{Object.keys(paths).map (key =>
					<path d={paths[key]} key={'path_' + key}/>
				)}
				{Object.keys(points).map (key =>
					<circle cx={points[key].x} cy={points[key].y} r={0.5} key={key}/>
				)}
			</svg>
		)
	}
}

module.exports = Zako;
