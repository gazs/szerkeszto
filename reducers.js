import { CHANGE_MEASUREMENT } from './actions'

const initialState = {
	meretek: {
		"testmagassag": 178,
		"mellboseg": 94,
		"derekboseg": 84,
		"csipoboseg": 93,
		//"hataszelesseg": 39,
		"derekhossza":47,
		"zakohossza":78,
		"hataszelesseg":22,
		"vallszelesseg":14,
		"ujjahossza":71,
		"hata_egyensulymeret": 47,
		"eleje_egyensulymeret":45
	},
	szamok: {
		gombok: 2,
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
		mellszelesseg : 'mb / 10 * 4 + 4',
		kis_oldalvarras : 5,
		honaljszelesseg : 'mb / 10 * 2.5 + 3',
		mellformazo_varras_helye: 'db / 10 * 2 + 6',
		mellformazo_varras_felso_vege: 3,
		mellkivet: 3,
		csipomeret: 'csb + 7',
		elejenyitas: 'kulcsszam / 2',
		mellnyitas: 'kulcsszam / 2 + 0.8',
		nyakmelyseg: 'mb / 10 + 3',
		vallmagassag: 'kulcsszam + 4',
		galler_szelesseg: 3,
		kihajto_szelesseg: 'mb / 10 + 3',
		hata_nyakmagassag: 'mb / 10 * 0.5 + 1.5',
		ujjaszelesseg: 'mb / 10 * 2.5 + 11',
	}
}

export function mondvacsinaltApp(state = initialState,  action) {
	switch (action.type) {
		case CHANGE_MEASUREMENT:
			return Object.assign({}, {
					szamok: state.szamok,
					meretek: Object.assign({}, state.meretek, action.payload)
		});
			break
		default:
			console.log('default', action.type)
			return state;
	}
}
