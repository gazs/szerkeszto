export const CHANGE_MEASUREMENT = 'CHANGE_MEASUREMENT';
export const CHANGE_CURRENT_NAME = 'CHANGE_CURRENT_NAME';
export const SAVE_CURRENT_PATTERN = 'ha';

export function changeMeasurement(name, value) {
	let payload = {};
	payload[name] = value;
	return {
		type: CHANGE_MEASUREMENT,
		payload
	}
}
export function changeCurrentName(payload) {
	return {
		type: CHANGE_CURRENT_NAME,
		payload
	}
}

export function saveCurrentPattern(payload) {
	return {
		type: SAVE_CURRENT_PATTERN,
		payload
	}
}
