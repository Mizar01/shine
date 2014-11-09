Enemy = function(level, name) {
	ACEX.Actor.call(this)
	this.level = level
	this.damage = this.level * 5
	this.name = name || "generic_enemy"
	this.life = this.level * 10
	this.speed = this.level * 0.6 + ACEX.Utils.randFloat(-0.1, 0.4)
}
Enemy.extends(ACEX.Actor, "Enemy")
Enemy.prototype.followPlayer = function() {
	this.followPoint(player.obj.position, this.speed)
}




Bug = function(level, name) {
	Enemy.call(this, level, name)
	this.obj = new PIXI.Graphics()
	this.obj.beginFill(0xff0005)
	this.obj.lineStyle(1, 0xaaaaff)
	this.obj.drawCircle(0, 0, 5)
	this.obj.endFill()
}
Bug.extends(Enemy, "Bug")
Bug.prototype.run = function() {
	this.followPlayer()
	
}

