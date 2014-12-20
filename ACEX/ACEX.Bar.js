ACEX.Bar = function(px, py, w, h, updateFunction, colorFlux, refreshTime) {
	ACEX.Actor.call(this)
	this.tIndex = 0
	this.finished = false
	this.refreshTimer = new ACEX.CooldownTimer(refreshTime || 0.5, true)
	this.updateFunction = updateFunction
	this.obj = new PIXI.Graphics()
	this.obj.position.set(px, py)
	this.w = w
	this.h = h
	this.alpha = 0.6
	this.colorFlux = colorFlux || false
}

ACEX.Bar.extends(ACEX.Actor, "ACEX.Bar")

ACEX.Bar.prototype.run = function() {
	if (this.refreshTimer.trigger()) {
		var partialTotal = this.updateFunction()
		this.redraw(partialTotal)
	}
}

ACEX.Bar.prototype.redraw = function(partialTotal) {
	var p = partialTotal[0]
	var t = partialTotal[1]
	var wp = ((this.w - 2)/ t) * p
	this.obj.clear()
	this.obj.beginFill(0x000000, this.alpha)
	this.obj.lineStyle(2, 0xffffaa)
	this.obj.drawRect(0, 0, this.w, this.h)
	this.obj.endFill()
	this.obj.lineStyle(0)
	if (this.colorFlux) {
		greenPercent = p / t * 255
		redPercent = 255 - greenPercent
		this.obj.beginFill(Math.round(redPercent) * 255 * 255 + Math.round(greenPercent) * 255, this.alpha)
	}else {
		this.obj.beginFill(0x55ff55, this.alpha)
	}
	this.obj.drawRect(1,1, wp, this.h - 1)
	this.obj.endFill()
}