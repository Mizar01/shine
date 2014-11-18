ACEX.BText = function(text, color, px, py, icon, clickable) {
	ACEX.Actor.call(this);
	this.obj = new PIXI.DisplayObjectContainer()
	this.obj.position.set(px, py)
	this.textObj = this.drawText(text, color)
	this.obj.addChild(this.textObj)
	if (icon) {
		this.iconObj = this.drawIcon(icon)
		this.obj.addChild(this.iconObj)
	}
	if (this.icon) {
		this.drawIcon()
	}
	test_var = this
	if (clickable) {
		this.setHitArea(0, 0, 40, 40, true, 
			function(){this._acex_actor.onMouseUp()}
		)
		// 
		// this.obj.buttonMode = true
		// this.obj.interactive = true
		// this.obj.hitArea = new PIXI.Rectangle(0, 0, 40, 40)
		// this.obj.mouseup = function(){this._acex_actor.onMouseUp()}
	}
}

ACEX.BText.extends(ACEX.Actor, "ACEX.BText")

ACEX.BText.prototype.run = function() {}

ACEX.BText.prototype.updateText = function(text) {
	this.textObj.setText(text)
}

ACEX.BText.prototype.update = function() {}

ACEX.BText.prototype.onMouseUp = function() {
	console.log("No event defined for ", this)
}

ACEX.BText.prototype.drawText = function(text, color) {
	var o = new PIXI.BitmapText("",  {font: "35px Impact", align: "right", })
	o.tint = color
	o.setText(text)
	return o
}

ACEX.BText.prototype.drawIcon = function(icon) {
	var t = new PIXI.Texture.fromImage(icon)
	var ic = new PIXI.Sprite(t)
	return ic
}	