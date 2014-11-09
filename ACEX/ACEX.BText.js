ACEX.BText = function(text, color) {
	ACEX.Actor.call(this);
	this.obj = new PIXI.BitmapText("",  {font: "35px Impact", align: "right", })
	this.obj.tint = color
	this.obj.setText(text)
	this.angle = ACEX.Utils.randFloat(0, Math.PI * 2)
	this.obj.position.set(40, 40)
}

ACEX.BText.extends(ACEX.Actor, "ACEX.BText")

ACEX.BText.prototype.run = function() {}

ACEX.BText.prototype.updateText = function(text) {
	this.obj.setText(text)
}

ACEX.BText.prototype.update = function() {}