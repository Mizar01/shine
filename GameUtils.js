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
	findQuest: function(qId, from) {
		from = from || gameVars.globalQuestList
		for (var i in gameVars.globalQuestList) {
			var q = gameVars.globalQuestList[i]
			if (q.id == qId) {
				return q
			}
		}
	},
}

MenuTools = {
	show: function(menuName) {
		MenuTools["refresh" + ACEX.Utils.capitalize(menuName)]()
		$("#" + menuName).show()
	},
	hide: function(menuName) {
		$("#" + menuName).hide()
	},
	upgradeRadialFireCooldown: function() {
		gameVars.player.upgradeProperty("radialCooldown.maxTime", "sub", 0.3, 1, true, 1)
		MenuTools.refreshGameMenu()
	},	
	upgradeFireCooldown: function() {
		gameVars.player.upgradeProperty("cooldown.maxTime", "sub", 0.3, 0.2, true, 1)
		MenuTools.refreshGameMenu()
	},
	upgradeSpeed: function() {
		gameVars.player.upgradeProperty("speed", "add", 0.01, 3, true, 1)
		MenuTools.refreshGameMenu()
	},

	refreshGameMenu: function() {
		// $("#gameMenu_radialFireRate").text(ACEX.Utils.roundFloat(1 / gameVars.player.radialCooldown.maxTime, 3))
		$("#gameMenu_radialFireCooldown").text(ACEX.Utils.roundFloat(gameVars.player.radialCooldown.maxTime, 2))
		$("#gameMenu_fireCooldown").text(ACEX.Utils.roundFloat(gameVars.player.cooldown.maxTime, 2))
		$("#gameMenu_speed").text(ACEX.Utils.roundFloat(gameVars.player.speed, 2))
		$("#gameMenu_diamonds").text(gameVars.player.diamonds)

	},
	refreshJournalMenu: function() {
		var html = ""
		for (var i in gameVars.questsLogic.quests) {
			var q = gameVars.questsLogic.quests[i]
			html += ""+
				"<div class='questContainer'>\n" +
				"	<div class='questContent'>" + q.name + "</div>\n" +
				"   <div class='questCurrentObjective'>(" + q.currentObjective + ":" + q.currentQta + "/" + q.targetQta +")</div>\n" + 
				"   <div class='questAbandon acexHtmlButton' onclick='MenuTools.abandonQuest(\"" + q.id + "\")'>Abandon</div>\n" + 
				"</div>\n"
		}
		$("#journalMenu_content").html(html)
	},	
	refreshProposedQuestMenu: function() {
		var cc = gameVars.npcDialogContainer.proposedQuest
		ACEX.HtmlUtils.setInput("proposedQuestId", cc.id)
		$("#currentCharacterQuest .questName").html(cc.name)
		$("#currentCharacterQuest .questCurrentObjective").html("(" + cc.currentObjective + ")")
		$("#currentCharacterQuest .questDescription").html(cc.desc)
		gameVars.npcDialogContainer.close()
	},
	// showGameMenu: function() {
	// 	MenuTools.refreshGameMenu()
	// 	$("#gameMenu").show()
	// },
	// hideGameMenu: function() {
	// 	$("#gameMenu").hide()
	// },
	abandonQuest: function(qId) {
		var q = GameUtils.findQuest(qId)
		q.abandon()
		MenuTools.refreshJournalMenu()
	},	
	acceptQuest: function() {
		var cId = ACEX.HtmlUtils.getInput("proposedQuestId")
		// TODO: add the quest to journal
		// find the npc with this questId
		var q = GameUtils.findQuest(cId)
		q.accept()
		$("#proposedQuestMenu").hide()
		console.log("Accepted mission " + q.name)
		// TODO : show some message on screen (a toast)
	},	
	refuseQuest: function() {
		$("#proposedQuestMenu").hide()

	},	
	browseQuest: function(direction) {
		// TODO: load inside #questContent the next or prev. quest in the player list.
	},
	center: function(id) {
		var w = $("#" + id).width()
		var h = $("#" + id).height()
		var cOff = $("canvas").offset()
		$("#" + id).css("left", (cOff.left + acex.sw/2 - w/2) + "px")
		$("#" + id).css("top", (cOff.top + acex.sh/2 - h/2) + "px")
	},
}

// Commands useful launched by console, for tests and other purposes
ConsoleUtils = {
	addKillQuests: function(qta) {
		for (var i = 0; i < qta; i++) {
			var q = new StandardKillQuest("test quest kill" + ACEX.Utils.randInt(0, 1000), "desc kill !!!", "Bug", 100, 0, 2)
			q.accept()
		}
	}
}