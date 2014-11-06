
var stage = null
var renderer = null

var player = null
var targetCursor = null
var plist = null

var wh = [1024, 768]

function init() {
	canvasInit();
	objectsInit();
	requestAnimFrame(update)
}

function update() {

	player.run()
	if (targetCursor) { 
		targetCursor.run()
	}

	renderer.render(stage)
	requestAnimFrame(update)
}

function canvasInit() {
	stage = new PIXI.Stage(0x000000)
	stage.mouseup = controls_click_stage
	renderer = PIXI.autoDetectRenderer(wh[0], wh[1])
	var cc = document.createElement("div")
	cc.id = "canvas_container"
	cc.align = "center"
	document.body.appendChild(cc)
	document.getElementById("canvas_container").appendChild(renderer.view)	
}

function objectsInit() {
	player = new Player()
	player.center()
}

function controls_click_stage() {
	if (targetCursor != null) {
		stage.removeChild(targetCursor.obj)
		targetCursor = null
	}
	targetCursor = new TargetCursor(stage.getMousePosition().clone())
}

function Player() {
	this.health = 100
	this.damage = 1
	this.attackCooldown = 10
	this.obj = new PIXI.Graphics()
	this.obj.lineStyle(5, 0xaaaaff)
	this.obj.drawCircle(0, 0, 10)
	this.setRandomPosition()
	stage.addChild(this.obj)
	this.speed = 2
}

Player.prototype.run = function() {
	if (targetCursor != null) {
		this.moveTowardTargetPoint()
	}
}

Player.prototype.moveTowardTargetPoint = function() {
	var p1 = this.obj.position
	var p2 = targetCursor.obj.position
	if (Utils.pointDistance(p1, p2) < 2) {
		stage.removeChild(targetCursor.obj)
		targetCursor = null
	}else {
		var angle = Math.atan2((p2.y - p1.y),(p2.x - p1.x))
	    this.obj.position.set(
	    	p1.x + Math.cos(angle) * this.speed,
	    	p1.y + Math.sin(angle) * this.speed
	    )
	}
}

Player.prototype.setRandomPosition = function(topPos) {
	var isTop = topPos || false
	var x = Utils.randInt(-10, wh[0] + 10)
	var y = -10
	if (!isTop) {
		y = Utils.randInt(-10, wh[1] + 10)
	}
	this.obj.position.set(x, y)
}
Player.prototype.center = function() {
	this.obj.position.set(wh[0]/2, wh[1]/2)
}

TargetCursor = function(t) {
	this.color = 0x006600
	this.obj = new PIXI.Graphics()
	this.redraw(0.5) //used because of the scaling problem, i need to redraw every time the circle.
	this.obj.position = t
	this.animFrame = 0
	this.animSpeed = 0.5
	this.frames = 20
	stage.addChild(this.obj)
}
TargetCursor.prototype.redraw = function(radius) {
	this.obj.clear()
	this.obj.lineStyle(3, this.color)
	this.obj.drawCircle(0, 0, radius)
}
TargetCursor.prototype.run = function() {
	var s = this.animFrame + 1
	this.redraw(0.5 * this.animFrame)
	this.obj.alpha = 1 - this.animFrame/20
	this.animFrame = (this.animFrame + this.animSpeed) % this.frames
}

Utils = {
	randInt: function(min, max) {
		var rnd = min + Math.random() * (max - min)
		return Math.round(rnd)
	},
	getRandomColor: function() {
    	v = Math.floor(Math.random() * 16777216)
    	return v
	},
	pointDistance: function(p1, p2) {
		return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
	},
}