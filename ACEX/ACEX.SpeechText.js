ACEX.SpeechText = function(text) {
	ACEX.Actor.call(this)
	this.text = text
	this.tIndex = 0
	this.finished = false
	this.refreshTimer = new ACEX.CooldownTimer(0.02, true)
	this.w = acex.sw * 0.90
	this.h = acex.sh * 0.1
	this.obj = new PIXI.Graphics()
	this.drawBackground()
	this.textActor = new ACEX.BText(
		this.text.substring(0, 1), 0xff0000, 10, 5,
		null, false, {size: "20px", font: "Impact"}
		)
	this.addChild(this.textActor)
	this.setRectHitArea(0, 0, this.w, this.h, true)
}

ACEX.SpeechText.extends(ACEX.Actor, "ACEX.SpeechText")

ACEX.SpeechText.prototype.run = function() {
	if (!this.printFinished && this.refreshTimer.trigger()) {
		this.textActor.updateText(this.text.substring(0, this.tIndex + 1))
		if (this.tIndex >= this.text.length) {
			this.printFinished = true
		}
		this.tIndex++
	}
}

ACEX.SpeechText.prototype.drawBackground = function() {
	var o = this.obj
	o.beginFill(0x000000)
	o.lineStyle(2, 0xffffff)
	o.drawRect(0, 0, this.w, this.h)
	o.endFill()
	o.position.set(acex.sw * 0.05, acex.sh * 0.7)
}

ACEX.SpeechText.prototype.mouseup = function() {
	this.setForRemoval()
}

