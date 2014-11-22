MenuTools = {
	upgradeRadialFireRate: function() {
		gameVars.player.upgradeRadialFireRate()
		MenuTools.refreshGameMenu()
	},
	refreshGameMenu: function() {
		$("#gameMenu_radialFireRate").text(ACEX.Utils.roundFloat(1 / gameVars.player.cooldown.maxTime, 2))
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