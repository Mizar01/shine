InGameMouseLogic = function() {
	ACEX.Logic.call(this)
}
InGameMouseLogic.extends(ACEX.Logic, "InGameMouseLogic")

InGameMouseLogic.prototype.run = function() {}

InGameMouseLogic.prototype.setTarget = function() {
	if (targetCursor != null) {
		targetCursor.setForRemoval()
		targetCursor = null
	}
	targetCursor = new TargetCursor(acex.getMousePoint(gameLayer))
	gameLayer.addChild(targetCursor)
}


RandomEnemyGenerator = function() {
	ACEX.Logic.call(this)
	this.cooldown = new ACEX.CooldownTimer(0.5, true)
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
	var lvl = ACEX.Utils.randInt(1, 6)
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
	// this.drawTestBoundingBox()
}
CameraMoveLogic.extends(ACEX.Logic, "CameraMoveLogic")

CameraMoveLogic.prototype.run = function() {
	var diff = this.playerDiffs()
	//console.log(diff)
	if (diff.x != 0 || diff.y != 0) {
		this.worldPosition.x -= diff.x * 0.02
		this.worldPosition.y -= diff.y * 0.02
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

CameraMoveLogic.prototype.rest = function() {
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