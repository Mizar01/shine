ACEX.Bar = function(px, py, w, h, updateFunction, colorFlux, refreshTime) {
	ACEX.Actor.call(this)
	this.refreshTimer = new ACEX.CooldownTimer(refreshTime || 0.25, true)
	this.updateFunction = updateFunction
	this.obj = new PIXI.Graphics()
	this.obj.position.set(px, py)
	this.w = w
	this.h = h
	this.alpha = 0.6
	this.color = 0x00FFFF
	this.colorFlux = colorFlux || false  //useful to shade from green to red (for life)
	this.partial = 1
	this.total = 1
}

ACEX.Bar.extends(ACEX.Actor, "ACEX.Bar")

ACEX.Bar.prototype.run = function() {
	if (this.refreshTimer.trigger()) {
		this.updateFunction()
		this.redraw()
	}
}

ACEX.Bar.prototype.updateFunction = function() {
	// must be implemented by the instance. 
	// It can use setPartialTotal to change values to draw
	// for example setPartialTotal(player.life, player.maxLife)
}

ACEX.Bar.prototype.setPartialTotal = function(p, t) {
	this.partial = p
	this.total = t
}

ACEX.Bar.prototype.redraw = function() {
	var p = this.partial
	var t = this.total
	var wp = ((this.w - 2)/ t) * p
	this.obj.clear()
	this.obj.beginFill(0x000000, this.alpha)
	this.obj.lineStyle(2, 0xffffaa)
	this.obj.drawRect(0, 0, this.w, this.h)
	this.obj.endFill()
	this.obj.lineStyle(0)
	var c = this.getColorFill(p, t)
	this.obj.beginFill(c, this.alpha)
	this.obj.drawRect(1,1, wp, this.h - 1)
	this.obj.endFill()
}

ACEX.Bar.prototype.getColorFill = function() {
	if (this.colorFlux) {
		return this.getColorFluxFill(this.partial, this.total)
	}else {
		return this.color

	}	
}

ACEX.Bar.prototype.getColorFluxFill = function() {
	var greenPercent = this.partial / this.total * 255
	var redPercent = 255 - greenPercent
	return Math.round(redPercent) * 255 * 255 + Math.round(greenPercent) * 255
}

ACEX.Bar.prototype.addPrePostText = function(tpre, tpost) {
	var tSize = this.h
	var w = this.w
	var tHeight = this.h - tSize
	var style = {"size": tSize + "px", "font": "Impact", "color" : "red"}
	if (tpre) {
		this.tpre = new ACEX.BText(tpre, 0xffaa00, - tSize / 2 * tpre.length, tHeight, false, false, style)
		this.addChild(this.tpre)
	}
	if (tpost) {
		this.tpost = new ACEX.BText(tpost, 0xffaa00, w + tSize / 2, tHeight, false, false, style)
		this.addChild(this.tpost)
	}
}