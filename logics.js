InteractLogic = function() {
	ACEX.Logic.call(this)
}
InteractLogic.extends(ACEX.Logic, "InteractLogic")

InteractLogic.prototype.run = function() {}

InteractLogic.prototype.setTarget = function(posdata) {
	if (targetCursor != null) {
		targetCursor.setForRemoval()
		targetCursor = null
	}
	targetCursor = new TargetCursor(acex.getMousePoint(gameLayer, posdata))
	gameLayer.addChild(targetCursor)
}

RandomEnemyGenerator = function() {
	ACEX.Logic.call(this)
	this.cooldown = new ACEX.CooldownTimer(1, true)
}
RandomEnemyGenerator.extends(ACEX.Logic, "RandomEnemyGenerator")

RandomEnemyGenerator.prototype.run = function() {
	if (this.cooldown.trigger()) {
		this.spawnEnemy()
	}
}

RandomEnemyGenerator.prototype.spawnEnemy = function() {
	//Spawn an enemy outside of the screen
	var w = acex.sw
	var h = acex.sh
	var d = w/2 + h/2
	var a = ACEX.Utils.randFloat(0, Math.PI * 2)
	rx = gameVars.player.obj.x + Math.cos(a) * d
	ry = gameVars.player.obj.y + Math.sin(a) * d
	var plevel = gameVars.player.level
	var lvl = ACEX.Utils.randInt(Math.max(1, plevel - 3), plevel + 1)
	// var lvl = 1
	var e = new Bug(lvl)
	e.obj.position.set(rx, ry)
	gameLayer.addChild(e)
}

CameraShakeLogic = function() {
	ACEX.Logic.call(this)
	this.refresh = false
	this.maxShakeRadius = 5
	this.shakeRadius = 0
}
CameraShakeLogic.extends(ACEX.Logic, "CameraShakeLogic")

CameraShakeLogic.prototype.run = function() {
	if (this.refresh) {
		this.rest()
	    this.shakeRadius = this.maxShakeRadius
	    this.refresh = false
	}
	if (this.shakeRadius > 0) {
		var m = this.shakeRadius % 2
		var dir = -1 
		if (m == 0) {
			dir = 1
		}
		this.shakeRadius--
		gameLayer.obj.position.x  += this.shakeRadius * dir
		//repositioning only once if necessary
		if (this.shakeRadius <= 0) {
			this.rest()
		}
	}
}

CameraShakeLogic.prototype.rest = function() {
	gameLayer.obj.position = gameVars.cameraMove.worldPosition.clone()
}

/**
* The camera will be moving the entire gameLayer whenever the player is 
* trespassing the thresholdbounds.
* The speed of movement is determined by the speed of the player going out 
* of these bounds.
*/
CameraMoveLogic = function() {
	ACEX.Logic.call(this)
	this.refresh = false
	this.absoluteCenter = new PIXI.Point(acex.sw/2, acex.sh/2)
	this.worldPosition = gameLayer.obj.position.clone() 
	this.boxSpan = new PIXI.Point(160, 120) //the thresholds of width and height
	this.speed = 0.02
	// this.drawTestBoundingBox()
}
CameraMoveLogic.extends(ACEX.Logic, "CameraMoveLogic")

CameraMoveLogic.prototype.run = function() {
	var diff = this.playerDiffs()
	//console.log(diff)
	if (Math.abs(diff.x) + Math.abs(diff.y) > this.speed * 4) {
		this.worldPosition.x -= diff.x * this.speed
		this.worldPosition.y -= diff.y * this.speed
		gameLayer.obj.position = this.worldPosition.clone()
	}
}

/**
* playerDiffs evaluates how far the player is going out of 
* the threshold box. If it's inside the box the diff is zero.
*/
CameraMoveLogic.prototype.playerDiffs = function() {
	var pp = gameVars.player.obj.position
	var b = this.boxSpan
	var c = this.worldPosition
	var absC = this.absoluteCenter
	var rx = pp.x + c.x - absC.x //in few words : relative to the center of the screen
	var ry = pp.y + c.y - absC.y
	// calculate x diff
	var xdiff = 0
	if (rx < -b.x) {
		xdiff = rx + b.x 
	}else if (rx > b.x) {
		xdiff = rx - b.x
	}
	var ydiff = 0
	if (ry < - b.y) {
		ydiff = ry + b.y 
	}else if (ry > b.y) {
		ydiff = ry - b.y
	}
	//console.log(xdiff, ydiff)
	return new PIXI.Point(xdiff, ydiff)
}

CameraMoveLogic.prototype.reset = function() {
	gameLayer.obj.position.set(0, 0)
}

CameraMoveLogic.prototype.drawTestBoundingBox = function() {
	var b = this.boxSpan
	var o = new PIXI.Graphics()
	o.lineStyle(2, 0xffff00)
	o.alpha = 0.2
	o.drawRect(-b.x, -b.y, b.x * 2, b.y * 2)
	o.position.set(acex.sw/2, acex.sh/2)
	acex.stageActor.obj.addChild(o)
}

QuestsLogic = function() {
	ACEX.Logic.call(this)
	this.quests = []
	this.eventsToCheck = [] //events in a single loop
}
QuestsLogic.extends(ACEX.Logic, "QuestsLogic")

QuestsLogic.prototype.addQuest = function(quest) {
	this.quests.push(quest)
	console.log("Initiated quest: " + quest.name + ": " + quest.action + " " + quest.targetQta + " " + quest.objType + "/s")
}

QuestsLogic.prototype.removeQuest = function(qId) {
	for (var i in this.quests) {
		var q = this.quests[i]
		if (q.id == qId) {
			this.quests.splice(i, 1)
			break
		}
	}
}

QuestsLogic.prototype.run = function() {
	if (this.eventsToCheck.length <= 0) {
		return
	}
	for (var i in this.quests) {
		var q = this.quests[i]
		if (q.check(this.eventsToCheck)) {
			this.quests.splice(i, 1)
		}
	}
	// clear events for the next loop
	this.eventsToCheck = []
}
QuestsLogic.prototype.addEvent = function(action, objType, objName, amount) {
	objName = objName || ""
	amount = amount || 1
	var t = new Date().getTime()
	this.eventsToCheck.push({
		time: t, 
		action: action, 
		objType: objType,
		objName: objName,
		amount: amount,
	})
}



// MissionLogic = function(missionId) {
// 	ACEX.Logic.call(this)
// 	this.id = missionId
// 	this.objToDestroy = null
// 	this.xpReward = missions[missionId].xpReward
// 	this.targetCursor = null
// 	this.generateMission = missions[missionId].generate
// 	this.init()
// }

// MissionLogic.extends(ACEX.Logic, "MissionLogic")

// MissionLogic.prototype.init = function() {
// 	this.generateMission()
// 	this.setObjectiveTarget()
// }

// MissionLogic.prototype.run = function() {
// 	if (this.objToDestroy == null || !this.objToDestroy.alive) {
// 		this.missionComplete()
// 		removeMission(this.id)
// 	}
// }
// MissionLogic.prototype.missionComplete = function() {
// 	gameVars.player.addXp(this.xpReward)
// 	this.showMessage("Mission Complete")
// }
// MissionLogic.prototype.showMessage = function(msg) {
// 	// TODO
// }
// MissionLogic.prototype.setObjectiveTarget = function() {
// 	// TODO : create a target object in the screen
// }

/**
 * Every n seconds this logic is going to generate a situation, 
 * like spawning a group of enemies with a boss , or simply a bunch of enemies
 * to permit grind.
 */
RandomSituationGenerator = function() {
	ACEX.Logic.call(this)
	this.cooldown = new ACEX.CooldownTimer(25, true)
	this.cooldown.time = 0.1 // make it trigger now
}

RandomSituationGenerator.extends(ACEX.Logic, "RandomSituationGenerator")

RandomSituationGenerator.prototype.run = function() {
	if (this.cooldown.trigger()) {
		this.generateSituation()
	}
}

RandomSituationGenerator.prototype.generateSituation = function() {
	// this.generateBossBase(10, 4)
	if (ACEX.Utils.chance(50)) {
		this.generateAssault(3)
	} else if (ACEX.Utils.chance(70)){
		this.generateAssault(9)
	} else if (ACEX.Utils.chance(80)) {
		this.generateBossBase(12, 2)
	}else {
		this.generateBossBase(15, 4)
	}
}
RandomSituationGenerator.prototype.generateAssault = function(n) {
	// generate 3 simple enemies outside the screen but around the player
	// These 3 enemies must be near each other
	var bp = this.getBasePoint()
	var pl = gameVars.player.level
	for (var i = 0; i < n; i++) {
		this.spawnEnemy(bp, "Bug", pl, AIModes.alwaysFollow) 
	}
	console.log("Generated assault from " + bp.x + "," + bp.y)
}
RandomSituationGenerator.prototype.generateBossBase = function(n, lev) {
	// generate a boss base where enemies stand waiting for the player
	// one of the enemies has a level that is player.level + n  (the boss)
	var bp = this.getBasePoint()
	var pl = gameVars.player.level
	for (var i = 0; i < n; i++) {
		this.spawnEnemy(bp, "Bug", pl, AIModes.protectBase) 
	}	
	this.spawnEnemy(bp, "Bug", pl + lev, AIModes.protectBase) 
	console.log("Generated boss base at " + bp.x + "," + bp.y)
}

RandomSituationGenerator.prototype.getBasePoint = function() {
	var w = acex.sw
	var h = acex.sh
	var d = Math.max(w, h) + 100
	var p = gameVars.player
	var a = ACEX.Utils.randFloat(0, Math.PI * 2)
	rx = p.obj.x + Math.cos(a) * d
	ry = p.obj.y + Math.sin(a) * d
	var g = gameVars.grid
	var disperseRadius = 30
	rx = ACEX.Utils.bound(rx, -g.w/2 + disperseRadius, g.w/2 - disperseRadius)
	ry = ACEX.Utils.bound(ry, -g.h/2 + disperseRadius, g.h/2 - disperseRadius)
	return {x: rx, y: ry}
}


RandomSituationGenerator.prototype.spawnEnemy = function(pos, enemyType, level, aiMode) {
	//Spawn an enemy outside of the screen
	var e = new window[enemyType](level)
	// decide a random position around the base
	e.obj.position.set(
		pos.x + ACEX.Utils.randInt(-30, 30), 
		pos.y + ACEX.Utils.randInt(-30, 30))
	e.AIMode = aiMode
	e.basePosition = pos
	gameLayer.addChild(e)
}