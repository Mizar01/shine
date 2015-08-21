Npc = function(name, x, y) {
	ACEX.Actor.call(this)
	this.friendly = true
	this.invincible = true
	this.male = true
	this.name = name
	this.obj = new PIXI.Graphics()
	this.textObj = new PIXI.BitmapText("",  {font: "35px Impact"})
	this.redraw()
	this.setCircleHitArea(0, 0, 25)
	this.obj.position.set(x, y)
	this.hasActiveQuests = false
	this.hasNewQuests = true
}

Npc.extends(ACEX.Actor, "Npc")

Npc.prototype.mouseup = function() {
	hudLayer.addChild(new ACEX.SpeechText("Hello ! My name is " + this.name))
}

Npc.prototype.run = function() {
	this.refreshIndicator()
}

Npc.prototype.refreshIndicator = function() {
	var t = this.textObj.text
	var refreshText = true
	if (t == "" && !this.hasActiveQuests && this.hasNewQuests) {
		return
	}
	if (t != "?" && this.hasActiveQuests) {
		this.textObj.setText("?")
		return
	}
	if (t != "!" && this.hasNewQuests) {
		this.textObj.setText("!")
		return
	}
}

Npc.prototype.redraw = function() {
	this.obj.beginFill(0x0000AA)
	this.obj.lineStyle(1, 0xaaaaff)
	this.obj.drawCircle(0, 0, 25)
	this.obj.endFill()
	this.textObj.tint = 0xffff00
	this.textObj.position.set(-3, -20) 
	this.obj.addChild(this.textObj)
}

