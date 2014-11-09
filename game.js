
var player = null
var targetCursor = null
var setTargetRequested = false



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

	player = new Player()
	gameLayer.addChild(player)
	hudObjects.levelLabel = new ACEX.BText("Level 1", 0xffaa00)
	hudObjects.levelLabel.update = function() {
		this.updateText("Level " + player.level)
	}
	hudLayer.addChild(hudObjects["levelLabel"])

	acex.run()
}

