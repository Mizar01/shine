
var targetCursor = null
var setTargetRequested = false

var gameVars = []
gameVars.cameraShake = null
gameVars.player = null
gameVars.cameraShake = null


var gameView
var hitAreaLayer
var gameLayer // ActorManager
var hudLayer
var gameMenuView
//var gameMenuLayer

gameObjects = [] //globally accessible storage for some variable and objects
hudObjects = []  //globally accessible storage for some variables and objects


function init() {
	assets = [
		'resources/impact.fnt',
		'resources/options.png'
	]
	new ACEX(1024, 768, assets, "define_game")
}

function define_game() {

	//Basic Structure 
	//	gameView (containerActors and logics)
	//      |----- mapHitAreaLayer (a single actor for a generic and fixed hit area layer)
	//		|----- gameLayer  (actors and logics)
	//		|----- hudLayer   (actors and logics)
	//	inGameMenuView ...
	//      |----- menuLayer 

	// Main game View (composite of game layer plus HUD layer)
	gameView = new ACEX.ContainerActor()
	hitAreaLayer = new ACEX.ContainerActor()
	// var o = new PIXI.Graphics()
	// o.beginFill(0xff0000)
	// o.drawRect(0,0, acex.sw, acex.sh)
	// o.endFill()
	// hitAreaLayer.obj.addChild(o)
	hitAreaLayer.setHitArea(0, 0, acex.sw, acex.sh, false,
		function(){
			if (!gameView.paused) {
				gameVars.inGameMouse.setTarget()
			}
		}
	)
	gameLayer = new ACEX.ContainerActor()
	//put gameLayer in center position
	gameLayer.center()
	hudLayer = new ACEX.ContainerActor()
	acex.stageActor.addChild(gameView)
	gameView.addChild(hitAreaLayer)
	gameView.addChild(gameLayer)
	gameView.addChild(hudLayer)


	gameView.addLogic(gameVars.inGameMouse = new InGameMouseLogic())
	gameView.addLogic(new RandomEnemyGenerator())
	gameView.addLogic(gameVars.cameraShake = new CameraShakeLogic())
	gameView.addLogic(gameVars.cameraMove = new CameraMoveLogic())


	//Adding a background grid
	gameLayer.addChild(gameVars.grid = new Grid(100))
	gameLayer.addChild(gameVars.player = new Player())

	//Adding some random turrets in the map
	setRandomTurrets()
	setupHudLayer()

	// //In Game Menu View
	// gameMenuView = new ACEX.ContainerActor()
	// gameMenuView.hideOnPause = true
	// gameMenuLayer = new ACEX.ContainerActor()
	// acex.stageActor.addChild(gameMenuView)
	// gameMenuView.addChild(gameMenuLayer)
	// setupGameMenus()

	//Repositioning html menus
	MenuTools.center("gameMenu")

	gameView.play()
	// gameMenuView.pause()

	acex.run()
}

function setupHudLayer() {
	hudObjects.levelLabel = new ACEX.BText("Level " + gameVars.player.level, 0xffaa00, 40, 40)
	hudObjects.levelLabel.update = function() {
		this.updateText("Level " + gameVars.player.level)
	}
	hudObjects.lifeLabel = new ACEX.BText("Life " + gameVars.player.life, 0xffcc00, 200, 40)
	hudObjects.lifeLabel.update = function() {
		this.updateText("Life " + gameVars.player.life)
	}
	hudObjects.optionsIcon = new ACEX.BText("", 0xffcc00, 40, acex.sh - 100, 
		'resources/options.png', clickable = true)
	hudObjects.optionsIcon.onMouseUp = function() {
		if (gameView.paused) {
			//gameMenuView.pause()
			MenuTools.hideGameMenu()
			gameView.play()

		}else {
			gameView.pause()
			MenuTools.showGameMenu()

		}
	}

	hudLayer.addChild(hudObjects.optionsIcon)
	hudLayer.addChild(hudObjects.levelLabel)
	hudLayer.addChild(hudObjects.lifeLabel)



}

function setRandomTurrets() {
	var g = gameVars.grid
	for (var i = 0; i < 50; i++) {
		var rx = ACEX.Utils.randInt(-g.w / 2, g.w / 2)
		var ry = ACEX.Utils.randInt(-g.h / 2, g.h / 2)
		var lvl = ACEX.Utils.randInt(1, 4)
		gameLayer.addChild(new Turret(lvl, rx, ry))
	}
}

// function setupGameMenus() {
// 	gameVars.gameMenu = new ACEX.Window("Game Menu", 400,  300)
// 	gameVars.gameMenu.center()
// 	gameMenuLayer.addChild(gameVars.gameMenu)
// }

