
var stage = null
var renderer = null

var player = null
var targetCursor = null
var plist = null
var setTargetRequested = false

var _acex_time = new ACEX.TimeManager()
var _acex_mgr = null // ActorManager

var wh = [1024, 768]

function init() {
	canvasInit()
	objectsInit()
	requestAnimFrame(_acex_run)
}

function _acex_run() {
	if (setTargetRequested) {
		setTarget()
		setTargetRequested = false
	}
	_acex_mgr.__run()
	_acex_time.run()
	renderer.render(stage)
	requestAnimFrame(_acex_run)
	
}

function canvasInit() {
	stage = new PIXI.Stage(0x000000)
	stage.mouseup = function(){setTargetRequested = true}
	renderer = PIXI.autoDetectRenderer(wh[0], wh[1])
	var cc = document.createElement("div")
	cc.id = "canvas_container"
	cc.align = "center"
	document.body.appendChild(cc)
	document.getElementById("canvas_container").appendChild(renderer.view)	
}

function objectsInit() {
	_acex_mgr = new ACEX.Actor()
	_acex_mgr.obj = stage
	player = new Player()
	_acex_mgr.addChild(player)
}

function setTarget() {
	if (targetCursor != null) {
		targetCursor.setForRemoval()
		targetCursor = null
	}
	targetCursor = new TargetCursor(stage.getMousePosition().clone())
	_acex_mgr.addChild(targetCursor)
}