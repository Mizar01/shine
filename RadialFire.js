RadialFire = function(owner) {
	ACEX.Actor.call(this);
	this.damage = owner.damage
	this.maxRadius = owner.level * 36
	this.radius = 3
	this.obj = new PIXI.Graphics()
	this.redraw(5)
	this.speed = 1
}

RadialFire.extends(ACEX.Actor, "RadialFire")

RadialFire.prototype.redraw = function(radius) {
	this.obj.clear()
	this.obj.lineStyle(3, 0xffaa00)
	this.obj.drawCircle(0, 0, radius)
}
RadialFire.prototype.run = function() {
	this.radius += this.speed
	this.redraw(this.radius)
	this.obj.alpha = 1 - this.radius/this.maxRadius
	if (this.radius >= this.maxRadius) {
		this.setForRemoval()
	}
}
RadialFire.prototype.removeSelf = function() {
	this.owner.radialFire = null
}