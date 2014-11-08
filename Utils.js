Utils = {
	randInt: function(min, max) {
		var rnd = min + Math.random() * (max - min)
		return Math.round(rnd)
	},
	getRandomColor: function() {
    	v = Math.floor(Math.random() * 16777216)
    	return v
	},
	pointDistance: function(p1, p2) {
		return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
	},
}