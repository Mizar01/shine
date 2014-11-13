InGameMouseLogic = function() {
	ACEX.Logic.call(this)
}
InGameMouseLogic.extends(ACEX.Logic, "InGameMouseLogic")

InGameMouseLogic.prototype.run = function() {
	if (acex.getEvent("mouseup")) {
	    this.setTarget()
	}
}

InGameMouseLogic.prototype.setTarget = function() {
	if (targetCursor != null) {
		targetCursor.setForRemoval()
		targetCursor = null
	}
	targetCursor = new TargetCursor(acex.getMouseCoords())
	gameLayer.addChild(targetCursor)
}


RandomEnemyGenerator = function() {
	ACEX.Logic.call(this)
	this.cooldown = new ACEX.CooldownTimer(5, true)
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
	rx = w/2 + Math.cos(a) * d
	ry = h/2 + Math.sin(a) * d
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
		gameLayer.obj.position.x  = this.shakeRadius * dir
		console.log(gameLayer.obj.position.x)
		//repositioning only once if necessary
		if (this.shakeRadius <= 0) {
			this.rest()
		}
	}
}

CameraShakeLogic.prototype.rest = function() {
	gameLayer.obj.position.set(0, 0)
}

