// These are function missions used by MissionLogic
var missions = []
missions["FirstMission"] = {
	generate: function() {
		var p = gameVars.player
		var x = p.obj.position.x + 200
		var y = p.obj.position.y - 30
		var b = new Bug(1)
		b.obj.position.set(x, y)
		gameLayer.addChild(b)
		this.objToDestroy = b
	},
	xpReward: 300
}

Quest = function(name, desc, action, objType, xpReward, diamondsReward, objName, targetQta)  {
	this.name = name
	this.desc = desc
	this.action = action
	this.objType = objType
	this.objName = objName || ""
	this.targetQta = targetQta || 1
	this.currentQta = 0
	this.xpReward = xpReward
	this.diamondsReward = diamondsReward || 0
	this.nextTime = new Date().getTime()
	this.completed = false
	this.generate()
}

Quest.prototype.generate = function() {}
Quest.prototype.check = function() {
	if (!this.completed) {
		// console.log("eventLog.checkEvents(" + this.nextTime + "," + this.action + "," + this.objType +","+ this.objName + ")")
		var r = eventLog.checkEvents(this.nextTime, this.action, this.objType, this.objName)
		this.currentQta += r.n
		if (r.n > 0) {
			console.log("currentTime = " + this.nextTime + "," + r)
			console.log("Quest " + this.name + ": progress : " + this.currentQta + "/" + this.targetQta)
		}
		this.nextTime = r.nextTime + 1
		if (this.currentQta >= this.targetQta) {
			this.completed = true
			this.complete()
		}
	}
}

Quest.prototype.complete = function() {
	gameVars.player.addXp(this.xpReward)
	gameVars.player.diamonds += this.diamondsReward
}

StandardKillQuest = function(name, desc, objType, xpReward, diamondsReward, qta) {
	Quest.call(this, name, desc, "kill", objType, xpReward, diamondsReward, "", qta)
}
StandardKillQuest.extends(Quest, "StandardKillQuest")



