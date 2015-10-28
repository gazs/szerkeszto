var szamok = {
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
	hajtoka_szelesseg: 'mb / 10 + 3',
	hata_nyakmagassag: 'mb / 10 * 0.5 + 1.5',
	ujjaszelesseg: 'mb / 10 * 2.5 + 11',
}


var React = require('react');
var {Measurements} = require('./range.jsx');

var Szerkesztes = require('./szerkesztes.jsx');
//var nadrag_sz = require('./nadrag.js')
//var zako_sz = require('./zako.js')
//var galler_sz= require('./galler.js')

//var zakoujja = require('./zakoujja.js');
//var zakoujja_k = require('./zakoujja-konfekcio.js');

var frakkmelleny = require('./drafts/frakkmelleny.js')
var frakk = require('./drafts/frakk.js')

var BBModel = require('backbone-model').Model;

//var Print = require('./print.jsx')



class Main extends React.Component {
	constructor(props) {
		super(props);

		this.meretekmodel = new BBModel(this.props.meretek)
		this.szamokmodel = new BBModel(this.props.szamok)
		this.presetmodel = new BBModel({preset: 'normal'})

		this.state = {
			meretek: this.meretekmodel.toJSON(),
			szamok: this.szamokmodel.toJSON(),
		};
	}
	componentDidMount () {
		this.meretekmodel.on('change', this._onChange.bind(this))
		this.szamokmodel.on('change', this._onChange.bind(this))
	}
	_onChange () {
		this.setState({meretek: this.meretekmodel.toJSON(), szamok: this.szamokmodel.toJSON()});
	}
	render () {
		var to_render = [
			frakkmelleny,
			frakk,
			//zako_sz,
			//zakoujja_k,
			//zakoujja,
			//nadrag_sz
		]
		return (
			<div>
			{/* <Print /> */}
				{to_render.map (szerkfunc =>
					<Szerkesztes
						meretek={this.state.meretek}
						szamok={this.state.szamok}
						szerkesztofunc={szerkfunc}
					/>
				)}

				<div className="configs col-xs-12 col-md-4 col-md-offset-8">
					<form className="form-horizontal">
						<Measurements items={this.state.meretek} model={this.meretekmodel}/>
						<Measurements items={this.state.szamok} model={this.szamokmodel}/>
					</form>
				</div>
			</div>
		)
	}
}

fetch('sizes/normal.json')
	.then(response => response.json())
	.then(json => {
		 React.render(
			 <Main meretek={json} szamok={szamok} />,
			 document.querySelector('#gombok2'));
	})

