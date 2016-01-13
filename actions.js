export const CHANGE_MEASUREMENT = 'CHANGE_MEASUREMENT';

export function changeMeasurement(name, value) {
	let payload = {};
	payload[name] = value;
	return {
		type: CHANGE_MEASUREMENT,
		payload
	}
}
