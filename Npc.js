// NOTES: an npc can propose a quest at a time to the player.
Npc = function(name, x, y) {
	ACEX.Actor.call(this)
	this.friendly = true
	this.invincible = true
	this.male = true
	this.name = name
	this.obj = new PIXI.Graphics()
	this.textObj = new PIXI.BitmapText("",  {font: "35px Impact"})
	this.questCount = 1
	this.setCircleHitArea(0, 0, 25)
	this.obj.position.set(x, y)
	this.hasActiveQuests = false
	this.hasNewQuests = true
	this.questQueueMax = 10
	this.currentQuest = new StandardKillQuest(this, "Bug", 100, 0, 10)
	this.redraw()
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
			txt += " Sorry. You have to complete the quest " + this.currentQuest.name + " before I can give you other tasks."
		}
		var newNpcDg = new NpcDialogContainer(txt, this)
		gameVars["npcDialogContainer"] = newNpcDg
		hudLayer.addChild(newNpcDg)
	}
}

Npc.prototype.run = function() {
}

Npc.prototype.refreshIndicator = function() {

	// this.textObj.setText("" + this.questCount)
	// this.textObj.tint = 0xffff00
	// if (this.hasActiveQuests) {
	// 	this.textObj.tint = 0x333333
	// }

	// if (t != "?" && this.hasActiveQuests) {
	// 	this.textObj.setText()
	// 	return
	// }
	// if (t != "!" && this.hasNewQuests) {
	// 	this.textObj.setText(this.questCount)
	// 	return
	// }
}

Npc.prototype.redraw = function() {

	var qc = "" + this.questCount
	this.obj.clear()
	this.obj.beginFill(0x006600)
	if (this.hasActiveQuests) {
		this.obj.lineStyle(2, 0x333333)
	}else {
		this.obj.lineStyle(2, 0xffff00)
	}
	this.obj.drawCircle(0, 0, 25)
	this.obj.endFill()
	this.textObj.setText(qc)
	this.textObj.tint = 0xffff00
	if (this.hasActiveQuests) {
		this.textObj.tint = 0x333333
	}
	this.textObj.position.set(-5 -  6 * (qc.length - 1), -20) 
	this.obj.addChild(this.textObj)



}

Npc.prototype.currentQuestAccepted = function() {
	this.hasActiveQuests = true
	this.hasNewQuests = false
	this.redraw()
}

Npc.prototype.currentQuestCompleted = function() {
console.log("*******currentQuestCompleted*********")
	this.hasActiveQuests = false
	this.hasNewQuests = true
	this.currentQuest = new StandardKillQuest(this, "Bug", 100, 0, 2)
	this.questCount++
	this.redraw()
}


NpcDialogContainer = function(txt, npc) {
	ACEX.Actor.call(this)
	this.npcId = npc.id
	this.proposedQuest = npc.currentQuest
	this.obj = new PIXI.DisplayObjectContainer()
	this.speechText = new ACEX.SpeechText(txt)
	this.speechText.mouseup = function() {
		gameVars.npcDialogContainer.close()
	}
	this.addChild(this.speechText)

	// The show quest button appears only if the character can give you a quest.
	if (npc.hasNewQuests && !npc.hasActiveQuests) {
		this.showQuestButton = new ACEX.BText("Show Quest", 0xffcc00, 
			this.speechText.obj.position.x, 
			this.speechText.obj.position.y + this.speechText.h + 20, null, clickable = true)
		this.showQuestButton.mouseup = function() {
			MenuTools.show("proposedQuestMenu")
		}
		this.addChild(this.showQuestButton)
	}	
}
NpcDialogContainer.extends(ACEX.Actor, "NpcDialogContainer")

NpcDialogContainer.prototype.close = function() {
	this.setForRemoval()
	gameVars["npcDialogContainer"] = null
}

