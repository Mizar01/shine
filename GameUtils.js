GameUtils = {
	firstNames: [
		["Jack", "Tom", "Tim", "Frank", "Sam", "Kain", "Carl", "Albert", "Jester"],
		["Fiona", "Liza", "Cat", "Jeanie", "Susan", "Carole", "Tina", "Sheela", "Corinna"]
	],
	lastNames: ["Forbes", "Luciani", "Colson", "Gloast", "Redchenko", "Romanov", "Queel", "Pensy",
		"Nuntacket", "Hovernoon", "Shaddy", "Mallory", "Repetti", "Soriano", "Provalsky", "Shuk-dah"
	],
    randomName: function(isMale) {
    	var ln = GameUtils.lastNames
    	var rl = ln[ACEX.Utils.randInt(0, ln.length - 1)]
    	var m = 0
    	if (!isMale) {
    		m = 1
    	}
    	var fn = GameUtils.firstNames[m]
    	var rf = fn[ACEX.Utils.randInt(0, fn.length - 1)]
    	return rf + " " + rl
	},
}


MenuTools = {
	upgradeRadialFireCooldown: function() {
		gameVars.player.upgradeRadialFireCooldown()
		MenuTools.refreshGameMenu()
	},
	refreshGameMenu: function() {
		// $("#gameMenu_radialFireRate").text(ACEX.Utils.roundFloat(1 / gameVars.player.radialCooldown.maxTime, 3))
		$("#gameMenu_radialFireCooldown").text(ACEX.Utils.roundFloat(gameVars.player.radialCooldown.maxTime, 2))
	},
	showGameMenu: function() {
		MenuTools.refreshGameMenu()
		$("#gameMenu").show()
	},
	hideGameMenu: function() {
		$("#gameMenu").hide()
	},
	center: function(id) {
		var w = $("#" + id).width()
		var h = $("#" + id).height()
		var cOff = $("canvas").offset()
		$("#" + id).css("left", (cOff.left + acex.sw/2 - w/2) + "px")
		$("#" + id).css("top", (cOff.top + acex.sh/2 - h/2) + "px")
	},
}