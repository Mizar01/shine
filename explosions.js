Explosion = function(maxRadius, pos) {
	ACEX.Actor.call(this)
	this.radius = 3
	this.maxRadius = maxRadius || 15
	this.obj = new PIXI.Graphics()
	this.redraw()
	this.obj.position = pos.clone()
	this.speed = 2
	gameVars.cameraShake.refresh = true
}
Explosion.extends(ACEX.Actor, "Explosion")
Explosion.prototype.redraw = function() {
	this.obj.lineStyle(4, 0xffff00)
	this.obj.drawCircle(0, 0, this.radius)
}
Explosion.prototype.run = function() {
	this.radius += this.speed
	this.redraw(this.radius)
	this.obj.alpha = 1 - this.radius/this.maxRadius
	if (this.radius >= this.maxRadius) {
		this.setForRemoval()
	}
}
