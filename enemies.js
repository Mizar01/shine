EnemySpawner = function(x, y, num) {
	ACEX.Actor.call(this)
	this.thresholdDist = 250
	this.respawnTime = null
	this.resetTime = new ACEX.CooldownTimer(30, true)
	this.totalEnemies = num
	this.enemiesLeft = num
	this.draw(x, y)
}

EnemySpawner.extends(ACEX.Actor, "EnemySpawner")

EnemySpawner.prototype.run = function() {
	if (this.respawnTime == null && this.playerNear()) {
		this.respawnTime = new ACEX.CooldownTimer(4, true)
		this.respawnTime.time = 0.01
	}
	if (this.respawnTime != null) {
		if (this.respawnTime.trigger() && !this.empty()) {
			this.respawn()
		}
	}
	if (this.resetTime.trigger()) {
		this.reset()
	}
}

EnemySpawner.prototype.empty = function() {
	return (this.enemiesLeft <= 0)
}

EnemySpawner.prototype.reset = function() {
	this.enemiesLeft = this.totalEnemies
	this.respawnTime = null
}

EnemySpawner.prototype.respawn = function() {
	var a = ACEX.Utils.randFloat(0, Math.PI * 2)
	//TODO : make the enemy move first in the random angled point
	var e = new Bug(1)
	e.obj.position.set(this.obj.position.x, this.obj.position.y)
	gameLayer.addChild(e)
	this.enemiesLeft--
}

EnemySpawner.prototype.playerNear = function() {
	return ACEX.Utils.actorDistance(this, gameVars.player) < this.thresholdDist
}

EnemySpawner.prototype.draw = function(x, y) {
	this.obj = new PIXI.Graphics()
	var o = this.obj
	o.lineStyle(2, 0xffffff)
	o.beginFill(0xffff11)
	o.drawRect(-10, -10, 20, 20)
	o.endFill()
	o.rotation = Math.PI / 4
	o.position.set(x, y)
}






Enemy = function(level, name) {
	ACEX.Actor.call(this)
	this.level = level
	this.damage = this.level * 5
	this.name = name || "generic_enemy"
	this.life = this.level * 5
	this.maxLife = this.life
	this.speed = this.level * 0.2 + ACEX.Utils.randFloat(-0.1, 0.4)
}
Enemy.extends(ACEX.Actor, "Enemy")
Enemy.prototype.followPlayer = function() {
	this.followPoint(gameVars.player.obj.position, this.speed)
	this.radialFireDamageControl()
}
Enemy.prototype.radialFireDamageControl = function() {
	var pl = gameVars.player
	var rf = pl.radialFire
	if (rf != null) {
		var dp = ACEX.Utils.actorDistance(this, pl)
		if (Math.abs(dp - rf.radius) < 2) {
			this.takeDamage(rf.damage)
		}
	}
}
Enemy.prototype.takeDamage = function(d) {
	this.life -= d
	if (this.life <= 0) {
		this.addPlayerExperience()
		this.explode()
	}
}

Enemy.prototype.addPlayerExperience = function() {
	//Calculate experience
	var p = gameVars.player
	var xpGained = p.addXpFromEnemy(this)
	gameLayer.addChild(new Bubble("+" + xpGained, "0x00ff00", this.obj.position))
}

Enemy.prototype.playerProximityControl = function() {
	var pl = gameVars.player
	var d = ACEX.Utils.actorDistance(this, pl)
	if (d < 5) {
		gameVars.player.takeDamage(this.damage * 3)
		this.explode()
	}
	this.verifyNearestEnemy(d)
}

Enemy.prototype.verifyNearestEnemy = function(d) {
	var ne = gameVars.nearestEnemy
	var p = gameVars.player
	if (!ne || !ne.alive || (ne && gameVars.nearestEnemyDistance > d)) {
		gameVars.nearestEnemy = this
		gameVars.nearestEnemyDistance = d
	}
}

Enemy.prototype.explode = function() {
	gameLayer.addChild(new Explosion(20, this.obj.position))
	this.setForRemoval()
}

Enemy.prototype.run = function() {
	this.followPlayer()
	this.playerProximityControl()
}

Bug = function(level, name) {
	Enemy.call(this, level, name)
	this.obj = new PIXI.Graphics()
	this.obj.beginFill(0xff0005)
	this.obj.lineStyle(1, 0xaaaaff)
	this.obj.drawCircle(0, 0, 4 + level)
	this.obj.endFill()
}
Bug.extends(Enemy, "Bug")

Turret = function(level, x, y) {
	Enemy.call(this, 1, "generic_turret")
	this.obj = new PIXI.Graphics()
	this.cooldown = new ACEX.CooldownTimer(0.1, true)
	this.thresholdDist = 400  //if the target is far than that, don't shoot.
	this.redraw()
	this.obj.position.set(x, y)
	this.target = gameVars.player
} 

Turret.extends(Enemy, "Turret")

Turret.prototype.run = function() {
	if (this.cooldown.trigger()) {
		this.fire()
	}
	this.radialFireDamageControl()
	this.obj.rotation += 0.01
}

Turret.prototype.fire = function() {
	var d = ACEX.Utils.actorDistance(this, this.target)
	if (d < this.thresholdDist) {
		gameLayer.addChild(new Bullet(this, this.target))
	}
}

Turret.prototype.redraw = function() {
	var o = this.obj
	o.beginFill(0xff0000)
	o.drawRect(-10, -10, 20, 20)
	o.endFill()
}
