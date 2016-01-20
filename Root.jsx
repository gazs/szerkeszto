import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, combineReducers, compose } from 'redux'
import { Provider } from 'react-redux'




import { mondvacsinaltApp } from './reducers'

//import DevTools from './devtools'
let store = createStore(mondvacsinaltApp)
//let store = compose( DevTools.instrument())(createStore)(reducers)
//let store = compose( DevTools.instrument())(createStore)(mondvacsinaltApp)
import Szerkesztes from './szerkesztes'
import MeasurementForm from './form'


import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'

var drafts_map = {
	'frakk': require('./drafts/frakk'),
	'frakkmelleny': require('./drafts/frakkmelleny'),
	'zako': require('./drafts/zako'),
	'zakoujja-konfekcio': require('./drafts/zakoujja-konfekcio'),
	'zakoujja': require('./drafts/zakoujja'),
	'nadrag': require('./drafts/nadrag')
}
class App extends React.Component {
	render() {
		return <div>
			{this.props.children}

			<List />
			<MeasurementForm />

			{/* <DevTools /> */}

		</div>
	}
}

class SzerkesztesWrap extends React.Component {
	render () {
		const szerkesztofunc = drafts_map[this.props.params.draftName];
		if (szerkesztofunc) {
		return ( <div>
			<h1>{this.props.params.draftName}</h1>
			<Szerkesztes szerkesztofunc={szerkesztofunc} />
		</div>)
		}
		else {
			return <h1>404, nincs ilyen minta :(</h1>
		}
	}
}

class List extends React.Component {
	render () {
	return 	<ul>
		{Object.keys(drafts_map).map( draftName =>
			<li key={draftName}>
			<Link to={`/${draftName}`}>{draftName}</Link>
			</li>
		)}
		</ul>
	}
}

import Print from './print'
import AddMeasurement from './AddMeasurement'

class Root extends React.Component {
	render () {
		return (
			<Provider store={store}>
				<Router history={browserHistory}>
					<Route path="/add" component={AddMeasurement} />
					<Route path="/" component={App}>
						<Route path=":draftName" component={SzerkesztesWrap} />
					</Route>
				</Router>
			</Provider>
		)
	}
}



ReactDOM.render(<Root />, document.querySelector('#app'));
