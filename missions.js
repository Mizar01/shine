// These are function missions used by MissionLogic
var missions = []
missions["FirstMission"] = {
	generate: function() {
		var p = gameVars.player
		var x = p.obj.position.x + 200
		var y = p.obj.position.y - 30
		var b = new Bug(1)
		b.obj.position.set(x, y)
		gameLayer.addChild(b)
		this.objToDestroy = b
	},
	xpReward: 300
}

