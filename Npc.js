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
	this.questQueueMax = 10
	this.currentQuest = new StandardKillQuest("test quest kill", "desc kill !!!", "Bug", 100, 0, 2)
	this.currentQuest.bindNpc(this)
}

Npc.extends(ACEX.Actor, "Npc")

Npc.prototype.mouseup = function() {
	// if a dialog is already opened for another npc, it closes that one and open this.
	var forceOpen = false
	var npcDg = gameVars["npcDialogContainer"]
	if (npcDg != null && npcDg.npcId != this.id) {
		npcDg.close()
		forceOpen = true
	}
	if (npcDg == null || forceOpen) {
		var txt = "Hello ! My name is " + this.name + "."
		if (this.hasActiveQuests && !this.currentQuest.completed) {
			txt += " Sorry. You have to complete the quest " + this.currentQuest + " before I can give you other tasks."
		}
		var newNpcDg = new NpcDialogContainer(txt, this)
		gameVars["npcDialogContainer"] = newNpcDg
		hudLayer.addChild(newNpcDg)
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


NpcDialogContainer = function(txt, npc) {
	ACEX.Actor.call(this)
	this.npcId = npc.id
	this.obj = new PIXI.DisplayObjectContainer()
	this.speechText = new ACEX.SpeechText(txt)
	this.speechText.mouseup = function() {
		gameVars.npcDialogContainer.close()
	}
	this.showQuestButton = new ACEX.BText("Show Quest", 0xffcc00, 
		this.speechText.obj.position.x, 
		this.speechText.obj.position.y + this.speechText.h + 20, null, clickable = true)
	this.showQuestButton.mouseup = function() {
// console.log(this.textObj.textWidth)
// console.log (this.textObj)
		gameView.pause()
		//MenuTools.showQuestMenu(this.currentQuest.name)
	}
	this.addChild(this.speechText)
	this.addChild(this.showQuestButton)		
}
NpcDialogContainer.extends(ACEX.Actor, "NpcDialogContainer")

NpcDialogContainer.prototype.close = function() {
	this.setForRemoval()
	gameVars["npcDialogContainer"] = null
}

