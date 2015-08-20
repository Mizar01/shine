
// closures
AIModes = []
AIModes.alwaysFollow = function() {
	this.followPlayer()
}

AIModes.protectBase = function() {
	var pPos = gameVars.player.obj.position
	var oPos = this.obj.position
	var bp = this.basePosition
	var dPlayerToBase = ACEX.Utils.pointDistance(pPos, bp)
	if (dPlayerToBase < 400) {
		this.followPlayer()
	}else {
		var dEnemyToBase = ACEX.Utils.pointDistance(this.obj.position, bp)
		if (dEnemyToBase > 40) {
			this.followPoint(bp, this.speed)
		}
	}
}


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
	this.AIMode = AIModes.alwaysFollow
	this.basePosition = null
	this.collisionRange =  4 + this.level
	this.rotateOnFollow = false
	this.keepDistance = false
	// this.farLimit = 100  //how much an enemy go far from it's base
}
Enemy.extends(ACEX.Actor, "Enemy")
Enemy.prototype.followPlayer = function() {
	var follow = true
	if (this.keepDistance) {
		var d = ACEX.Utils.actorDistance(this, gameVars.player)
		if (d < this.collisionRange * 3) {
			follow = false
		}
	}
	if (follow) {
		this.followPoint(gameVars.player.obj.position, this.speed, this.rotateOnFollow)
	}
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
	if (this.alive) {
		this.life -= d
		if (this.life <= 0) {
			this.setForRemoval()
			this.setLoot()
			this.addPlayerExperience()
			this.explode()
		}
	}
}

Enemy.prototype.setLoot = function() {
	// chance to leave a diamond 30%
	if (ACEX.Utils.chance(10)) {
		gameLayer.addChild(new Diamond(this.obj.position))
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
	// if (!ne || !ne.alive || (ne && gameVars.nearestEnemyDistance > d)) {
	// 	gameVars.nearestEnemy = this
	// 	gameVars.nearestEnemyDistance = d
	// }
	if (ne && ne.alive) {
		var neDist = ACEX.Utils.actorDistance(ne, gameVars.player)
		if (neDist > d) {
			gameVars.nearestEnemy = this
		}
	}else {
		gameVars.nearestEnemy = this
	}
}

Enemy.prototype.explode = function() {
	gameLayer.addChild(new Explosion(20, this.obj.position))
}

Enemy.prototype.run = function() {
	this.AIMode()
	this.playerProximityControl()
}

Bug = function(level, name) {
	Enemy.call(this, level, name)
	this.obj = new PIXI.Graphics()
	this.redraw()
}
Bug.extends(Enemy, "Bug")

Bug.prototype.redraw = function() {
	var o = this.obj
	o.beginFill(0xff0005)
	o.lineStyle(1, 0xaaaaff)
	o.drawCircle(0, 0, this.collisionRange)
	o.endFill()
}

OverBoss = function(level, name) {
	Enemy.call(this, level, name)
	this.speed = Math.min(0.5, this.speed)
	this.life *= 3
	this.rotateOnFollow = true
	this.obj = new PIXI.Graphics()
	// this.cannon1 = new PIXI.Graphics()
	// this.cannon2 = new PIXI.Graphics()
	this.collisionRange = (10 + this.level * 5) / 2
	this.redraw()
	this.turret1 = new Turret(level, 0, -this.collisionRange/2)
	this.turret2 = new Turret(level, 0, +this.collisionRange/2)
	this.addChild(this.turret1)
	this.addChild(this.turret2)
	this.target = gameVars.player
	this.keepDistance = true
}
OverBoss.extends(Enemy, "OverBoss")

OverBoss.prototype.run = function() {
	this.AIMode()
	this.playerProximityControl()
	// this.cannon1.rotation = ACEX.Utils.angleToActor(this, this.target)
	// this.cannon2.rotation = ACEX.Utils.angleToActor(this, this.target)
}

OverBoss.prototype.redraw = function() {
	var o = this.obj; var c1 = this.cannon1; var c2 = this.cannon2;
	var s = this.collisionRange * 2.4
	o.beginFill(0xff5505)
	o.lineStyle(1, 0xaaaaff)
	o.drawRect(-s/2, -s/2, s, s)
	o.endFill()
	// cannons
	// c1.beginFill(0xaaaaff)
	// c1.drawRect(-1, -2.5, 15, 5)
	// c1.endFill()
	// o.addChild(c1)
	// c1.position.set(0, -s/4)
	// c2.beginFill(0xaaaaff)
	// c2.drawRect(-1, -2.5, 15, 5)
	// c2.endFill()
	// o.addChild(c2)
	// c2.position.set(0, s/4)

}


Turret = function(level, x, y) {
	Enemy.call(this, 1, "generic_turret")
	this.obj = new PIXI.Graphics()
	this.cannon = new PIXI.Graphics()
	this.cooldown = new ACEX.CooldownTimer(1, true)
	this.cooldown.time = 0.1
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
	// This is a bad way to fix relative angle when targeting the player and 
	// the turret is in another rotated reference system like a bigger enemy (see Overboss)
	// This is bad because it does consider only one level of sub rotations.
	// TODO: decide what is the best way to code the correct API for the actors or objects to rotate
	// with relative rotations.
	this.cannon.rotation = ACEX.Utils.angleToActor(this, this.target) - this.obj.parent.rotation
	
}

Turret.prototype.fire = function() {
	var d = ACEX.Utils.actorDistance(this, this.target)
	if (d < this.thresholdDist) {
		gameLayer.addChild(new LaserBullet(this, this.target))
	}
}

Turret.prototype.redraw = function() {
	var o = this.obj
	o.beginFill(0xffff11); 
	o.drawCircle(-10, -10, 4)
	o.drawCircle(10, -10, 4)
	o.drawCircle(10, 10, 4)
	o.drawCircle(-10, 10, 4)
	o.endFill()
	o.beginFill(0xff0000)
	o.drawRect(-10, -10, 20, 20)
	o.endFill()
	c = this.cannon
	c.beginFill(0xaaaaff)
	c.drawRect(-1, -2.5, 15, 5)
	c.endFill()
	o.addChild(c)
}
