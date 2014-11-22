ACEX.Window = function(title, w, h, wStyle) {
	ACEX.Actor.call(this)
	this.w = w
	this.h = h
	this.windowStyle = wStyle || {
		bgColor: "0x001100",
		borderColor : "0xffffff",
		borderWidth : 2,
	}
	this.obj = this.drawWindow(w, h)
	this.textActor = this.drawTitle(title)
	this.addChild(this.textActor)
}

ACEX.Window.extends(ACEX.Actor,  "ACEX.Window")

ACEX.Window.prototype.drawWindow = function(w, h) {
	var o = new PIXI.Graphics()
	var s = this.windowStyle
	o.beginFill(s.bgColor)
	o.lineStyle(s.borderWidth, s.borderColor)
	o.drawRect(0,0, w, h)
	o.endFill()
	return o
}

ACEX.Window.prototype.drawTitle = function(title) {
	var fsize = this.w/15
	var o = new ACEX.BText(title, 0xffaa00, 40, 40, null, false, {"size": fsize + "px", "font": "Impact"})
	return o
}

ACEX.Window.prototype.center = function(title) {
	this.getSuperClass().center.call(this)
	this.obj.position.x -= this.w/2
	this.obj.position.y -= this.h/2
}