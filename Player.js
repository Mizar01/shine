Player = function() {
	ACEX.Actor.call(this);
	this.name = "Player One"
	this.life = 100
	this.damage = 1
	this.level = 1
	this.attackCooldown = 10
	this.obj = new PIXI.Graphics()
	this.obj.lineStyle(5, 0xaaaaff)
	this.obj.drawCircle(0, 0, 10)
	this.cooldown = new ACEX.CooldownTimer(4, false)
	this.speed = 2
	this.reaches = 0
	this.radialFire = null
}

Player.extends(ACEX.Actor, "Player")

Player.prototype.run = function() {
	if (targetCursor != null) {
		this.moveTowardTargetPoint()
	}
	if (this.radialFire == null && this.cooldown.trigger()) {
		this.radialFire = new RadialFire(this)
		this.addChild(this.radialFire)
		this.cooldown.restart()
	}
}

Player.prototype.moveTowardTargetPoint = function() {
	var p1 = this.obj.position
	var p2 = targetCursor.obj.position
	if (ACEX.Utils.pointDistance(p1, p2) <= this.speed) {
		targetCursor.setForRemoval()
		targetCursor = null
		this.reaches++
		if (this.reaches >= 3) {
			this.reaches = 0
			this.levelUp()
		}
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
	var x = ACEX.Utils.randInt(-10, wh[0] + 10)
	var y = -10
	if (!isTop) {
		y = ACEX.Utils.randInt(-10, wh[1] + 10)
	}
	this.obj.position.set(x, y)
}

Player.prototype.levelUp = function() {
	this.level++
	this.damage = this.level * 1.2
	this.speed = this.level * 1.3
	hudObjects.levelLabel.update()
}

Player.prototype.getDamage = function(d) {
	this.life -= d
	hudObjects.lifeLabel.update()
}

Player.prototype.upgradeRadialFireRate = function() {
	var mt = this.cooldown.maxTime
	mt -= 0.1
	this.cooldown.maxTime = Math.max(0.2, mt)
	console.log("Player upgraded radial fire")
}