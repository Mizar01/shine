ACEX.Utils = {
	randInt: function(min, max) {
		var rnd = min + Math.random() * (max - min)
		return Math.round(rnd)
	},
	randFloat: function(min, max) {
		return min + Math.random() * (max - min)
	},
	getRandomColor: function() {
    	v = Math.floor(Math.random() * 16777216)
    	return v
	},
	pointDistance: function(p1, p2) {
		return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
	},
	actorDistance: function(a1, a2) {
		return ACEX.Utils.pointDistance(a1.obj.position, a2.obj.position)
	},
	angleToPoint: function(p1, p2) {
		return Math.atan2((p2.y - p1.y),(p2.x - p1.x))
	},
	/**
	*	Returns a float number with a maximum of decimals limited by precision.
	*   For example n = 2.345533 and precision = 2 will return: 2.35
	*/
	roundFloat: function(n, precision) {
		var p = Math.pow(10, precision)
		return Math.round(n * p) / p
	},
	chance: function(perc) {
		return ACEX.Utils.randInt(0, 100) < perc
	},
	// colorBitmapText: function(btext, color) {
	// 	for (ci in btext.children) {
	// 		btext.children[ci].tint = color
	// 	}
	// },
}