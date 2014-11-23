Npc = function(name, x, y) {
	ACEX.Actor.call(this)
	this.friendly = true
	this.invincible = true
	this.male = true
	this.name = name
	this.obj = new PIXI.Graphics()
	this.obj.beginFill(0x0000AA)
	this.obj.lineStyle(1, 0xaaaaff)
	this.obj.drawCircle(0, 0, 15)
	this.obj.endFill()
	this.setCircleHitArea(0, 0, 15)
	this.obj.position.set(x, y)
}

Npc.extends(ACEX.Actor, "Npc")

Npc.prototype.mouseup = function() {
	hudLayer.addChild(new ACEX.SpeechText("Hello ! My name is " + this.name))
}

