
// TODO : BText need an auto refresh timer. It's too complicated call this object from other entities and 
// track where I am using it. It's better to go like ACEX.Bar with a refreshTimer (and eventually stop the timer)

ACEX.BText = function(text, color, px, py, icon, clickable, style) {
	ACEX.Actor.call(this);
	this.obj = new PIXI.DisplayObjectContainer()
	this.obj.position.set(px, py)
	this.style = style || {
		"size": "35px",
		"font": "Impact",
	}
	this.textObj = this.drawText(text, color)
	this.obj.addChild(this.textObj)
	this.refreshTimer = new ACEX.CooldownTimer(0.5, true)
	if (icon) {
		this.iconObj = this.drawIcon(icon)
		this.obj.addChild(this.iconObj)
	}
	if (this.icon) {
		this.drawIcon()
	}
	test_var = this
	if (clickable) {
		// TODO : set the click area size based on the button/text dimensions
		this.setRectHitArea(0, 0, text.length * 30, 40, true)
		// 
		// this.obj.buttonMode = true
		// this.obj.interactive = true
		// this.obj.hitArea = new PIXI.Rectangle(0, 0, 40, 40)
		// this.obj.mouseup = function(){this._acex_actor.onMouseUp()}
	}

}

ACEX.BText.extends(ACEX.Actor, "ACEX.BText")

ACEX.BText.prototype.run = function() {
	if (this.refreshTimer.trigger()) {
		this.update()
	}
}

ACEX.BText.prototype.updateText = function(text) {
	this.textObj.setText(text)
}

ACEX.BText.prototype.update = function() {}

ACEX.BText.prototype.mouseup = function() {
	console.warn("The Object is set to clickable, but you must write your own mouseup behavior", this)
}

ACEX.BText.prototype.drawText = function(text, color) {
	var s = this.style
	var o = new PIXI.BitmapText("",  {font: s.size + " " + s.font, align: "right", })
	o.tint = color
	o.setText(text)
	return o
}

ACEX.BText.prototype.drawIcon = function(icon) {
	var t = new PIXI.Texture.fromImage(icon)
	var ic = new PIXI.Sprite(t)
	return ic
}	