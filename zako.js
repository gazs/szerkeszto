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
	//honaljmelyseg: '(distance(p[11], p[18]) + distance(p[66], p[82]))/ 2 - 3'
}



var React = require('react');
var {Measurements, Formulas} = require('./range.jsx');
var Zako = require('./zako.jsx');


class Main extends React.Component {
	render () {
		return <div>
		<Zako meretek={this.props.meretek} />
		<Measurements meretek={this.props.meretek} />
		<Formulas items={this.props.szamok} />
		</div>
	}
}

React.render(React.createElement(Main, {meretek: meretek.normal, szamok: szamok}), document.querySelector('#gombok2'));

