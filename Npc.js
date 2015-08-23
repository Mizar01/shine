// NOTES: an npc can propose a quest at a time to the player.
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
	this.speechText = null
	this.questQueueMax = 10
	this.currentQuest = new StandardKillQuest("test quest kill", "desc kill !!!", "Bug", 100, 0, 2)
	this.currentQuest.bindNpc(this)
}

Npc.extends(ACEX.Actor, "Npc")

Npc.prototype.mouseup = function() {
	if (this.speechText == null || !this.speechText.alive) {
		var txt = "Hello ! My name is " + this.name + "."
		if (this.hasActiveQuests && !this.currentQuest.completed) {
			txt += " Sorry. You have to complete the quest " + this.currentQuest + " before I can give you other tasks."
		}
		this.speechText = new ACEX.SpeechText(txt)
		var showQuestButton = new ACEX.BText("Show Quest", 0xffcc00, 
			0, 
			this.speechText.h + 20, null, clickable = true)
		showQuestButton.mouseup = function() {
			gameView.pause()
			MenuTools.showQuestMenu(this.currentQuest.name)
		}
		this.speechText.addChild(showQuestButton)
		hudLayer.addChild(this.speechText)
	}
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

