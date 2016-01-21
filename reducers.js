import { CHANGE_MEASUREMENT, CHANGE_CURRENT_NAME } from './actions'

const initialState = {
	currentPattern: {
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
	},
	patterns: []
}

function merge(old, nnew) {
	return Object.assign({}, old, nnew);
}

export function changeCurrentPattern(state = initialState.currentPattern, action) {
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
