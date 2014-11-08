TargetCursor = function(t) {
	ACEX.Actor.call(this);
	this.color = 0x006600
	this.obj = new PIXI.Graphics()
	this.redraw(0.5) //used because of the scaling problem, i need to redraw every time the circle.
	this.obj.position = t
	this.animFrame = 0
	this.animSpeed = 0.5
	this.frames = 20
}

TargetCursor.extends(ACEX.Actor, "TargetCursor")

TargetCursor.prototype.redraw = function(radius) {
	this.obj.clear()
	this.obj.lineStyle(3, this.color)
	this.obj.drawCircle(0, 0, radius)
}
TargetCursor.prototype.run = function() {
	var s = this.animFrame + 1
	this.redraw(0.5 * this.animFrame)
	this.obj.alpha = 1 - this.animFrame/20
	this.animFrame = (this.animFrame + this.animSpeed) % this.frames
}