Enemy = function(level, name) {
	ACEX.Actor.call(this)
	this.level = level
	this.damage = this.level * 5
	this.name = name || "generic_enemy"
	this.life = this.level * 7
	this.speed = this.level * 0.2 + ACEX.Utils.randFloat(-0.1, 0.4)
}
Enemy.extends(ACEX.Actor, "Enemy")
Enemy.prototype.followPlayer = function() {
	this.followPoint(player.obj.position, this.speed)
	this.radialFireDamageControl()
}
Enemy.prototype.radialFireDamageControl = function() {
	var rf = player.radialFire
	if (rf != null) {
		var dp = ACEX.Utils.actorDistance(this, player)
		if (Math.abs(dp - rf.radius) < 2) {
			this.takeDamage(rf.damage)
		}
	}
}
Enemy.prototype.takeDamage = function(d) {
	this.damage -= d
	if (this.damage <= 0) {
		gameLayer.addChild(new Explosion(20, this.obj.position))
		this.setForRemoval()
	}
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
Bug.prototype.run = function() {
	this.followPlayer()
	
}

