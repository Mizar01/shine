
var targetCursor = null
var setTargetRequested = false

var gameVars = []
gameVars.cameraShake = null
gameVars.player = null
gameVars.cameraShake = null
gameVars.activeMissions = []
gameVars.globalQuestList = []


var gameView
var hitAreaLayer
var gameLayer // ActorManager
var hudLayer
var gameMenuView
//var gameMenuLayer

gameObjects = [] //globally accessible storage for some variable and objects
hudObjects = []  //globally accessible storage for some variables and objects

var testObject = null


function init() {
	assets = [
		'resources/impact.fnt',
		'resources/options.png'
	]
	new ACEX(1860, 900, assets, "define_game")
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
	hitAreaLayer.setRectHitArea(0, 0, acex.sw, acex.sh, false)
	hitAreaLayer.mouseup = function(posdata) {
			if (!gameView.paused) {
				gameVars.interactLogic.setTarget(posdata)
			}		
	}

	gameLayer = new ACEX.ContainerActor()
	//put gameLayer in center position
	gameLayer.center()
	hudLayer = new ACEX.ContainerActor()
	acex.stageActor.addChild(gameView)
	gameView.addChild(hitAreaLayer)
	gameView.addChild(gameLayer)
	gameView.addChild(hudLayer)


	gameView.addLogic(gameVars.interactLogic = new InteractLogic())
	gameView.addLogic(new RandomSituationGenerator())
	gameView.addLogic(gameVars.cameraShake = new CameraShakeLogic())
	gameView.addLogic(gameVars.cameraMove = new CameraMoveLogic())
	gameView.addLogic(gameVars.questsLogic = new QuestsLogic())


	//Adding a background grid
	gameLayer.addChild(gameVars.grid = new Grid(100))
	gameLayer.addChild(gameVars.player = new Player())

	// XXX : For tests ONLY
	gameVars.player.addXp(1000)

	//Adding some random turrets in the map
	setObjects()
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
	MenuTools.center("proposedQuestMenu")
	MenuTools.center("journalMenu")

	gameView.play()
	// gameMenuView.pause()

	acex.run()
}

function setupHudLayer() {

	hudObjects.xpBar = new ACEX.Bar(acex.sw * 0.7, acex.sh * 0.03, acex.sw * 0.25, acex.sh * 0.02, 
		function() {
			this.setPartialTotal(gameVars.player.xp, gameVars.player.nextLevelXp)
			var newPostText = "L." + gameVars.player.level
			var tpostText = this.tpost.textObj.text
			if (tpostText != newPostText) {
				this.tpost.updateText(newPostText)
			}
		})
	hudObjects.xpBar.addPrePostText("xp", "lvl. 1")

	hudObjects.lifeBar = new ACEX.Bar(acex.sw * 0.7, acex.sh * 0.08, acex.sw * 0.25, acex.sh * 0.03,
		function() {
			this.setPartialTotal(gameVars.player.life, gameVars.player.maxLife)
		},
		true, 0.3)

	hudObjects.diamonds = new ACEX.BText("Diamonds: 0", 0x00ff00, acex.sw * 0.9, acex.sh * 0.12, null, false,
		{"size": "15px", "font": "Impact"})
	hudObjects.diamonds.update = function() {
		this.updateText("Diamonds: " + gameVars.player.diamonds)
	}


	hudObjects.radialCooldownBar = new ACEX.RadiusBar(acex.sw * 0.9, acex.sh * 0.9, acex.sh * 0.025,
		function() {
			// I will use the radiusBar with an inverse meaning in this case(the max is when cooldown reached 0)
			var partial = gameVars.player.radialCooldown.maxTime - gameVars.player.radialCooldown.time
			this.setPartialTotal(partial, gameVars.player.radialCooldown.maxTime)
		})

	hudObjects.optionsIcon = new ACEX.BText("", 0xffcc00, 40, acex.sh - 100, 
		'resources/options.png', clickable = true)
	hudObjects.optionsIcon.mouseup = function() {
		if (gameView.paused) {
			//gameMenuView.pause()
			MenuTools.hide("gameMenu")
			gameView.play()

		}else {
			gameView.pause()
			MenuTools.show("gameMenu")
		}
	}
	hudLayer.addChild(hudObjects.optionsIcon)	
	hudObjects.journalIcon = new ACEX.BText("", 0xffcc00, 80, acex.sh - 100, 
		'resources/options.png', clickable = true)
	hudObjects.journalIcon.mouseup = function() {
		if (gameView.paused) {
			MenuTools.hide("journalMenu")
			gameView.play()
		}else {
			gameView.pause()
			MenuTools.show("journalMenu")
		}
	}
	hudLayer.addChild(hudObjects.journalIcon)




	hudLayer.addChild(hudObjects.xpBar)
	hudLayer.addChild(hudObjects.lifeBar)
	hudLayer.addChild(hudObjects.diamonds)
	hudLayer.addChild(hudObjects.radialCooldownBar)
}

function setObjects() {
	var g = gameVars.grid
	var p = gameVars.player
	// Adding some turrets
	for (var i = 0; i < 50; i++) {
		var rx = ACEX.Utils.randInt(-g.w / 2, g.w / 2)
		var ry = ACEX.Utils.randInt(-g.h / 2, g.h / 2)
		var lvl = ACEX.Utils.randInt(1, 4)
		gameLayer.addChild(new Turret(lvl, rx, ry))
	}
	//Adding some npcs
	for (var i = 0; i < 20; i++) {
		var rx = ACEX.Utils.randInt(-g.w / 2, g.w / 2)
		var ry = ACEX.Utils.randInt(-g.h / 2, g.h / 2)
		var lvl = ACEX.Utils.randInt(1, 4)
		gameLayer.addChild(new Npc(GameUtils.randomName(), rx, ry))
	}
	//Adding a test enemyspawner
	gameLayer.addChild(new EnemySpawner(p.obj.position.x, p.obj.position.y + 300, 5))
	// Adding a test turret
	var testTurret = new Turret(1, p.obj.position.x, p.obj.position.y + 330)
	gameLayer.addChild(testTurret)

	// Adding a test overboss
	var testOB = new OverBoss(2, "Big Test Boss")
	testOB.obj.position.set(p.obj.position.x - 300, p.obj.position.y)
	testOB.obj.rotation = Math.PI / 2
	gameLayer.addChild(testOB)

	// Adding a test quest
	var testQuest = new StandardKillQuest("test quest kill", "desc kill !!!", "Bug", 100, 0, 2)
	testQuest.accept()


	//Adding an npc near the player
	gameLayer.addChild(new Npc(GameUtils.randomName(), 
		p.obj.position.x + 100, 
		p.obj.position.y
		)
	)

	// Test for mouse up
	// BText
	// var testBText = new ACEX.BText("Test BText", 0x00ff00, acex.sw * 0.3, acex.sh * 0.3, null, true,
	// 	{"size": "15px", "font": "Impact"})

	// testBText.mouseup = function() {
	// 	this.setForRemoval()
	// }
	// hudLayer.addChild(testBText)
	// SpeechText
	// var npcDialog = new ACEX.Actor()
	// npcDialog.obj = new PIXI.DisplayObjectContainer
	// npcDialog.speechText = new ACEX.SpeechText("Test Speech Text")
	// npcDialog.showQuestButton = new ACEX.BText("Show Quest", 0xffcc00, 
	// 	0, npcDialog.speechText.obj.position.y + 20, null, clickable = true)
	// npcDialog.showQuestButton.mouseup = function() { console.log("hello") }
	// npcDialog.addChild(npcDialog.speechText)
	// npcDialog.addChild(npcDialog.showQuestButton)

	// hudLayer.addChild(npcDialog)

}

// function addMission(missionId) {
// 	var m = new MissionLogic(missionId)
// 	gameVars.activeMissions[missionId] = 1
// 	console.log("added mission " + missionId)
// 	gameView.addLogic(m)
// }

// function removeMission(missionId) {
// 	gameView.removeLogic(missionId)
// 	console.log("removed mission " + missionId)
// 	delete gameVars.activeMissions[missionId]
// }

// function setupGameMenus() {
// 	gameVars.gameMenu = new ACEX.Window("Game Menu", 400,  300)
// 	gameVars.gameMenu.center()
// 	gameMenuLayer.addChild(gameVars.gameMenu)
// }

// function EventLog() {
// 	this.maxQueue = 20
// 	this.events = []
// 	this.addEvent = function(action, objType, objName, amount) {
// 		objName = objName || ""
// 		amount = amount || 1
// 		var t = new Date().getTime()
// 		if (this.events.length > this.maxQueue) {
// 			this.events.splice(0, 1)
// 		}
// 		this.events.push({
// 			time: t, 
// 			action: action, 
// 			objType: objType,
// 			objName: objName,
// 			amount: amount,
// 		})
// 	}
// 	/**
// 	 * Return the number of events checked and the last time registerd
// 	 */
// 	this.checkEvents = function(afterTime, action, objType, objName, amount) {
// 		objName = objName || ""
// 		amount = amount || 1
// 		var maxTime = afterTime
// 		var numFound = 0
// 		for (var i in this.events) {
// 			var e  = this.events[i]
// 			//console.log(e)
// 			if (e.time >= afterTime &&
// 				e.action == action &&
// 				e.objType == objType &&
// 				(objName == "" || e.objName == objName) &&
// 				e.amount == amount) {
// 				numFound++
// 				if (e.time > maxTime) {
// 					maxTime = e.time
// 				}
// 			}
// 		}
// 		return {n: numFound, nextTime: maxTime}
// 	}
// }

