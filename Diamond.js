Diamond = function(pos) {
	ACEX.Actor.call(this)
	this.obj = null
	this.draw()
	this.obj.position = pos.clone()
}

Diamond.extends(ACEX.Actor, "Diamond")

Diamond.prototype.run = function() {
	this.obj.rotation += 0.05
	if (ACEX.Utils.actorDistance(this, gameVars.player) < 8) {
		gameVars.player.addDiamond()
		this.setForRemoval()
	}
}

Diamond.prototype.draw = function() {
	var o = new PIXI.Graphics()
	var size = 20
	o.beginFill(0x00ff00)
	o.drawRect(-10, -10, 20, 20)
	o.endFill()
	this.obj = o
}