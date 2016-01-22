import { CHANGE_MEASUREMENT, CHANGE_CURRENT_NAME, SAVE_CURRENT_PATTERN } from './actions'

import { combineReducers } from 'redux'

const initialCurrentPattern = {
		name: '',
		meretek:	{
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
}
const initialPatterns = [];

function merge(oldState, newState) {
	return Object.assign({}, oldState, newState);
}

function currentPattern(state = initialCurrentPattern, action) {
	switch (action.type) {
		case CHANGE_MEASUREMENT:
			return merge(state, {
				meretek: merge(state.meretek, action.payload)});
		case CHANGE_CURRENT_NAME:
			return merge(state, {name: action.payload});
		default:
			return state;
	}
}
function patterns(state = initialPatterns, action) {
	switch (action.type) {
		case SAVE_CURRENT_PATTERN:
			return [...state, action.payload]
		default:
			return state;
	}
}

export default combineReducers({
	currentPattern,
	patterns
})
