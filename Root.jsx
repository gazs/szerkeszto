import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, combineReducers, compose } from 'redux'
import { Provider } from 'react-redux'

import DevTools from './devtools'


import { mondvacsinaltApp } from './reducers'

//import {reducer as formReducer} from 'redux-form';

//const reducers = combineReducers({
	//foo: mondvacsinaltApp,
	////form: formReducer
//})

//let store = compose( DevTools.instrument())(createStore)(reducers)
let store = compose( DevTools.instrument())(createStore)(mondvacsinaltApp)

import Szerkesztes from './szerkesztes.jsx'
import MeasurementForm from './form.jsx'

import nadrag_sz from './drafts/nadrag.js'
import zako_sz from './drafts/zako.js'
import zako_magas_hajlott_sz from './drafts/zako_magashajlott.js'
//import galler_sz from './drafts/galler.js'

import zakoujja from './drafts/zakoujja.js'
import zakoujja_k from './drafts/zakoujja-konfekcio.js'

import frakkmelleny from './drafts/frakkmelleny.js'
import frakk from './drafts/frakk.js'

class Root extends React.Component {
	render () {
		const to_render = [
			//frakkmelleny,
			frakk,
			//zako_sz,
			//zako_magas_hajlott_sz,
			//zakoujja_k,
			//zakoujja,
			//nadrag_sz
		]
		return (
			<Provider store={store}>
				<div>
				{/* <Print /> */}
					{to_render.map ((to_render,i) =>
						<Szerkesztes
							szerkesztofunc={to_render}
							key={i}
						/>
					)}
					<MeasurementForm fields={['testmagassag']}/>

					<DevTools />

				</div>
			</Provider>
		)
	}
}



ReactDOM.render(<Root />, document.querySelector('#gombok2'));
