Player = function() {
	ACEX.Actor.call(this);
	this.name = "Player One"
	this.life = 100
	this.maxLife = this.life
	this.damage = 1
	this.level = 1
	this.xp = 0
	this.nextLevelXp = 100
	this.attackCooldown = 10
	this.obj = new PIXI.Graphics()
	this.obj.lineStyle(3, 0xaaaaff)
	this.obj.drawCircle(0, 0, 10)
	this.cooldown = new ACEX.CooldownTimer(2, true)
	this.radialCooldown = new ACEX.CooldownTimer(30, false)
	this.speed = 1.5
	this.reaches = 0 //only for test and fast level advance
	this.radialFire = null
	this.shootRadius = 100
}

Player.extends(ACEX.Actor, "Player")

Player.prototype.run = function() {
	if (targetCursor != null) {
		this.moveTowardTargetPoint()
	}
	if (this.radialFire == null && this.radialCooldown.trigger()) {
		this.radialFire = new RadialFire(this)
		this.addChild(this.radialFire)
		this.radialCooldown.restart()
	}

	if (this.cooldown.trigger() && 
		gameVars.nearestEnemy != null &&
		gameVars.nearestEnemy.alive &&
		gameVars.nearestEnemyDistance <= this.shootRadius) {
		gameLayer.addChild(new Bullet(this, gameVars.nearestEnemy))
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
			//this.levelUp()
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
	// NOTE : you cannot use level as the sole parameter determining
	// the progress of each property, or you lose the manual upgrades
	// For this reason the properties are determined by their current values. 
	this.level++
	this.damage += this.level * 1.2

	this.upgradeProperty("damage", "add", 1.2, 400, false)
	this.upgradeProperty("speed", "add", 0.8, 3.5, false)	
	this.upgradeProperty("shootRadius", "add", 1.1, 500)
	this.upgradeProperty("maxLife", "add", 1.2, 10000)
	this.upgradeProperty("cooldown.maxTime", "sub", 0.05, 0.2)
	this.upgradeProperty("radialCooldown.maxTime", "sub", 0.05, 0.2)
	//Refill life
	this.life = this.maxLife
	//Determine next level xp
	this.nextLevelXp = 100 + this.level * 155
	// hudObjects.xpLabel.update()
}

Player.prototype.takeDamage = function(d) {
	this.life = Math.max(0, this.life - d)
	// hudObjects.lifeLabel.update()
}

/**
* if absolute = true  the levelFactor is a fixed value to add/subtract from the property.
* if absolute = false (default) the levelFactor is multiplied by the level.
*/
Player.prototype.upgradeProperty = function(propPath, opType, levelFactor, limit, absolute) {
	// Retrieve the path and find the most nested object (for example cooldown.maxTime)
	var pV = propPath.split(".")
	var qta = this.level * levelFactor
	if (absolute) {
		qta = this.levelFactor  //no based on level
	}
	var innerProp = this
	for (var pvi = 0; pvi < pV.length; pvi++) {
		if (pvi == pV.length - 1) {
			var currentValue = innerProp[pV[pvi]]
			if (opType == "add") {
				innerProp[pV[pvi]] = Math.min(limit, currentValue + qta)
			}else if(opType == "sub") {
				innerProp[pV[pvi]] = Math.max(limit, currentValue - qta) 
			}
			console.log(innerProp, pV[pvi]) 
			break
		}else {
			innerProp = innerProp[pV[pvi]]
		}
	}
}

Player.prototype.upgradeRadialFireCooldown = function() {
	var mt = this.radialCooldown.maxTime
	mt = ACEX.Utils.roundFloat(mt - 0.3, 2)
	this.radialCooldown.maxTime = Math.max(0.2, mt)
	//console.log("Player upgraded radial cooldown: maxTime = ", mt)
}

Player.prototype.addXp = function(xp) {
	this.xp += xp
	// hudObjects.xpLabel.update()
	if (this.xp >= this.nextLevelXp) {
		this.xp = 0
		this.levelUp()
	}
}

Player.prototype.addXpFromEnemy = function(e) {
	//Logic of gaining experience is based on some properties of 
	//the enemy and the player level. The more the player 
	//is high on level in comparison, the less he gains.
	var xp = e.level * 3 + e.damage * 1.1 + e.maxLife / 20
	var diffLvl = (this.level - e.level) * 0.1
	xp = xp * (1 - diffLvl)  //In case p.level is < e.level the xp is raising. Good !
	xp = Math.max(0, Math.round(xp))
	this.addXp(xp)
	// The return is used by the enemy to spawn a bubble message with the gained xp for player.
	return xp

}