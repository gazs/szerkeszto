function M(p_id) {
	let p = points[p_id];
	return `M${p.x},${p.y}`
}
function L(p_id) {
	let p = points[p_id];
	return `L${p.x},${p.y}`
}
function path() {
	return Array.prototype.join.call(arguments)
}

module.exports = {M, L, path}
