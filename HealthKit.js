HealthKit = function(pos) {
	ACEX.Actor.call(this)
	this.obj = null
	this.draw()
	this.obj.position = pos.clone()
}

HealthKit.extends(ACEX.Actor, "HealthKit")

HealthKit.prototype.run = function() {
	this.obj.rotation += 0.025
	if (ACEX.Utils.actorDistance(this, gameVars.player) < 18) {
		gameVars.player.addHealthPerc(25)
		this.setForRemoval()
	}
}

HealthKit.prototype.draw = function() {
	var cw = 20
	var pd = 2
	var iw = cw/5
	var o = new PIXI.Graphics()
	var size = 20
	o.beginFill(0xffffff)
	o.drawRect(-10, -10, cw, cw)
	o.endFill()
	o.beginFill(0xff0000)
	o.drawRect(-iw, -10 + pd , iw*2, cw - pd * 2)
	o.endFill()	
	o.beginFill(0xff0000)
	o.drawRect(-10 + pd, -iw, cw - pd * 2, iw*2)
	o.endFill()
	this.obj = o
}