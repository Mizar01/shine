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
	// colorBitmapText: function(btext, color) {
	// 	for (ci in btext.children) {
	// 		btext.children[ci].tint = color
	// 	}
	// },
}