Player = function() {
	ACEX.Actor.call(this);
	this.name = "Player"
	this.health = 100
	this.damage = 1
	this.level = 1
	this.attackCooldown = 10
	this.obj = new PIXI.Graphics()
	this.obj.lineStyle(5, 0xaaaaff)
	this.obj.drawCircle(0, 0, 10)
	this.cooldown = new ACEX.CooldownTimer(
		Math.max(0.02, 0.5),
		true)
	this.speed = 2
	this.center()
}

Player.extends(ACEX.Actor, "Player")

Player.prototype.run = function() {
	if (targetCursor != null) {
		this.moveTowardTargetPoint()
	}
	if (this.cooldown.trigger()) {
		this.addChild(new RadialFire(this))
	}
}

Player.prototype.moveTowardTargetPoint = function() {
	var p1 = this.obj.position
	var p2 = targetCursor.obj.position
	if (Utils.pointDistance(p1, p2) < 2) {
		targetCursor.setForRemoval()
		targetCursor = null
	}else {
		var angle = Math.atan2((p2.y - p1.y),(p2.x - p1.x))
	    this.obj.position.set(
	    	p1.x + Math.cos(angle) * this.speed,
	    	p1.y + Math.sin(angle) * this.speed
	    )
	}
}

Player.prototype.setRandomPosition = function(topPos) {
	var isTop = topPos || false
	var x = Utils.randInt(-10, wh[0] + 10)
	var y = -10
	if (!isTop) {
		y = Utils.randInt(-10, wh[1] + 10)
	}
	this.obj.position.set(x, y)
}
Player.prototype.center = function() {
	this.obj.position.set(wh[0]/2, wh[1]/2)
}