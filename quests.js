// These are function missions used by MissionLogic
// var missions = []
// missions["FirstMission"] = {
// 	generate: function() {
// 		var p = gameVars.player
// 		var x = p.obj.position.x + 200
// 		var y = p.obj.position.y - 30
// 		var b = new Bug(1)
// 		b.obj.position.set(x, y)
// 		gameLayer.addChild(b)
// 		this.objToDestroy = b
// 	},
// 	xpReward: 300
// }

Quest = function(giver, name, desc, action, objType, xpReward, diamondsReward, objName, targetQta)  {
	this.id = "QUEST_" + name + "_" + ACEX.Utils.randInt(100, 999) + ACEX.Utils.randInt(100, 999)
	this.name = name
	this.currentObjective = "" // textual representation of the action that player must actually take at every quest step.
	this.desc = desc
	this.action = action
	this.objType = objType
	this.objName = objName || ""
	this.targetQta = targetQta || 1
	this.currentQta = 0
	this.xpReward = xpReward
	this.diamondsReward = diamondsReward || 0
	this.completed = false
	this.binding = giver
	gameVars.globalQuestList.push(this)
}

Quest.prototype.activate = function() {
	if (this.binding != null) {
		this.binding.hasActiveQuests = true
	}
}
/** 
 * This function can be overwritten.
 * It must collect the progress from the passed events and return true only in case of quest completed.
 * Some implementations could not base their progress on passed events but on other custom situations, like
 * for example : the player reaches 10.000 diamonds or 100 kills in total or player lose 30% of life, or 
 * some quests could be so detailed on special objects like : collect the specific object, kill the enemy with name
 * 'xxxx yyy' etc.
 */
Quest.prototype.check = function(events) {
	if (!this.completed) {
		console.log(this.action + "," + this.objType +","+ this.objName)
		for (var i in events) {
			var e  = events[i]
			//console.log(e)
			if (e.action == this.action &&
				e.objType == this.objType &&
				(this.objName == "" || e.objName == this.objName)) {
				this.currentQta += e.amount
				console.log("Quest " + this.name + ": progress : " + this.currentQta + "/" + this.targetQta)
			}
		}
		if (this.currentQta >= this.targetQta) {
			this.completeQuest()
			return true
		}
	}
	return this.completed
}


Quest.prototype.completeQuest = function() {
	this.completed = true
	console.log("Quest " + this.name + " is complete. Earned " + this.xpReward + "xp and " + this.diamondsReward + " diamonds")
	gameVars.player.addXp(this.xpReward)
	gameVars.player.diamonds += this.diamondsReward
	if (this.binding) {
		this.binding.currentQuestCompleted()
	}
}

Quest.prototype.bindNpc = function(npc) {
	this.binding = npc
}

Quest.prototype.accept = function() {
	if (this.binding) {
		this.binding.currentQuestAccepted()
	}
	gameVars.questsLogic.addQuest(this)
}

Quest.prototype.abandon = function() {
	if (this.binding) {
		this.binding.hasNewQuests = true
		this.binding.hasActiveQuests = false
	}

	gameVars.questsLogic.removeQuest(this.id)
}


StandardKillQuest = function(giver, objType, xpReward, diamondsReward, qta) {
	var nameDesc = _polygen.generateKillQuestNameDesc()
	Quest.call(this, giver, nameDesc[0], nameDesc[1], "kill", objType, xpReward, diamondsReward, "", qta)
	this.currentObjective = "Kill " + qta + " " + objType + ((qta > 1) ? "s": "")
}
StandardKillQuest.extends(Quest, "StandardKillQuest")



