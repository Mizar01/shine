Grid = function(res) {
	ACEX.Actor.call(this)
	this.w = getAcex().sw * 10
	this.h = getAcex().sh * 10
	this.res = res
	this.obj = new PIXI.Graphics()
	this.redraw()
}

Grid.extends(ACEX.Actor, "Grid")

Grid.prototype.run = function() {}

Grid.prototype.redraw = function() {
	var o = this.obj
	var wspan = this.w/2
	var hspan = this.h/2
	o.alpha = 0.1
	o.lineStyle(1, 0xAAAAAA);
	//v lines
	for (var x = -wspan; x < wspan; x+= this.res) {
		o.moveTo(x,-hspan)
		o.lineTo(x, hspan)
	}
	for (var y = -hspan; y < hspan; y+= this.res) {
		o.moveTo(-wspan, y)
		o.lineTo(wspan, y)
	}
}