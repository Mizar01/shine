
var targetCursor = null
var setTargetRequested = false

var gameVars = []
gameVars.cameraShake = null
gameVars.player = null
gameVars.cameraShake = null


var gameView
var gameLayer = null // ActorManager
var hudLayer = null

gameObjects = [] //globally accessible storage for some variable and objects
hudObjects = []  //globally accessible storage for some variables and objects

var pippo

function init() {
	new ACEX(1024, 768, ['resources/impact.fnt'], "define_game")
}

function define_game() {
	// Main game View (composite of game layer plus HUD layer)
	gameView = new ACEX.ContainerActor()
	gameLayer = new ACEX.ContainerActor()
	hudLayer = new ACEX.ContainerActor()
	acex.stageActor.addChild(gameView)
	gameView.addChild(gameLayer)
	gameView.addChild(hudLayer)
	gameView.addLogic(new InGameMouseLogic())
	gameView.addLogic(new RandomEnemyGenerator())
	gameView.addLogic(gameVars.cameraShake = new CameraShakeLogic())

	gameVars.player = new Player()
	gameLayer.addChild(gameVars.player)
	hudObjects.levelLabel = new ACEX.BText("Level 1", 0xffaa00, 40, 40)
	hudObjects.levelLabel.update = function() {
		this.updateText("Level " + gameVars.player.level)
	}
	hudObjects.lifeLabel = new ACEX.BText("Life " + gameVars.player.life, 0xffcc00, 200, 40)
	hudObjects.lifeLabel.update = function() {
		this.updateText("Life " + gameVars.player.life)
	}
	hudLayer.addChild(hudObjects.levelLabel)
	hudLayer.addChild(hudObjects.lifeLabel)

	acex.run()
}

