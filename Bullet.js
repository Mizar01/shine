Bullet = function(shooter, target) {
	ACEX.Actor.call(this)
	this.shooter = shooter
	this.damage = shooter.damage
	this.target = target
	this.obj = new PIXI.Graphics()
	this.speed = 2
	this.timeToLive = new ACEX.CooldownTimer(10, false)
	this.redraw()
	this.obj.position = this.shooter.obj.position.clone()
	this.rotateToPoint(this.target.obj.position)
} 

Bullet.extends(ACEX.Actor, "Bullet")

Bullet.prototype.run = function() {
	if (this.timeToLive.trigger()) {
		this.setForRemoval()
	}
	this.moveForward(this.speed)
	this.targetControl()
}

Bullet.prototype.targetControl = function() {
	var d = ACEX.Utils.actorDistance(this, this.target)
	if (d < 5) {
		if (this.target.getDamage) {
			this.target.getDamage(this.damage)
		}else {
			console.warn("Non getDamage method for target class = " + this.target.type)
		}
		this.setForRemoval()
	}
}

Bullet.prototype.redraw = function() {
	var o = this.obj
	o.beginFill(0xffff00)
	o.drawCircle(0, 0, 2)
	o.endFill()
}