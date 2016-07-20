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
	show: function(dialogName) {
		MenuTools["refresh" + ACEX.Utils.capitalize(dialogName)]()
		ModalUtils.show()
	},
	hide: function() {
		ModalUtils.hide()
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
		gameVars.player.upgradeProperty("speed", "add", 0.01, 5, true, 1)
		MenuTools.refreshGameMenu()
	},

	refreshGameMenu: function() {
		// $("#gameMenu_radialFireRate").text(ACEX.Utils.roundFloat(1 / gameVars.player.radialCooldown.maxTime, 3))
		var p = gameVars.player
		var htmlUpgrades = [
			HtmlUtils.buildHtmlUpgrade("RadialFireCooldown", "Radial Fire Cooldown", 
				ACEX.Utils.roundFloat(p.radialCooldown.maxTime, 2)),
			HtmlUtils.buildHtmlUpgrade("FireCooldown", "Fire Cooldown", 
				ACEX.Utils.roundFloat(p.cooldown.maxTime, 2)),			
			HtmlUtils.buildHtmlUpgrade("Speed", "Speed", 
				ACEX.Utils.roundFloat(p.speed, 2)),
		]
		ModalUtils.setProperties("GameMenu", "Upgrades (" + p.diamonds + " diamonds left)", htmlUpgrades.join(""))


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
		ModalUtils.setProperties("JournalMenu", "Journal", html)
	},	
	refreshProposedQuestMenu: function() {
		// var cc = gameVars.currentNpc.currentQuest
		// ACEX.HtmlUtils.setInput("proposedQuestId", cc.id)
		// $("#currentCharacterQuest .questName").html(cc.name)
		// $("#currentCharacterQuest .questCurrentObjective").html("(" + cc.currentObjective + ")")
		// $("#currentCharacterQuest .questDescription").html(cc.desc)
		// MenuTools.hide("npcDialog")
		var cc = gameVars.currentNpc.currentQuest
		var htmlDesc = "<div class='text-default'>" + cc.desc + "</div>"
		var htmlObj = "<div class='text-danger'>" + cc.currentObjective + "</div>"
		ModalUtils.setProperties("ProposedQuestMenu", cc.name, htmlDesc + "\n" + htmlObj, [
			HtmlUtils.buildButton("MenuTools.acceptQuest()", "Accept"),
			HtmlUtils.buildButton("MenuTools.refuseQuest()", "Refuse")
		])
		ModalUtils.setData("proposedQuestId", cc.id)
	},
	refreshNpcDialog: function() {
		var npc = gameVars.currentNpc
		var buttons = []
		if (npc.hasNewQuests && !npc.hasActiveQuests) {
			buttons = [
				HtmlUtils.buildButton("MenuTools.show('proposedQuestMenu')", "Show Quests")
			]
		}
		ModalUtils.setProperties("NpcDialog", npc.name, "", buttons) //The content will be set with Typed.js
		ModalUtils.setTyped(npc.dialogMessage)
	},

	abandonQuest: function(qId) {
		var q = GameUtils.findQuest(qId)
		q.abandon()
		MenuTools.refreshJournalMenu()
	},	
	acceptQuest: function() {
		var cId = ModalUtils.getData("proposedQuestId")
		// TODO: add the quest to journal
		// find the npc with this questId
		var q = GameUtils.findQuest(cId)
		q.accept()
		ModalUtils.hide()
		console.log("Accepted mission " + q.name)
		// TODO : show some message on screen (a toast)
	},	
	refuseQuest: function() {
		ModalUtils.hide()
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

ModalUtils = {
	setProperties: function(current, title, content, buttons) {
		buttons = buttons || []
		var m = "#defaultModalWindow"
		$(m).data("current", current)
		$(m + " .modal-title").html(title)
		$(m + " .modal-body").html(content)
		$(m + " #additionalButtonsContainer").html("")
		for (var bi in buttons) {
			var htmlb = buttons[bi]
			$(m + " #additionalButtonsContainer").append(htmlb)
		}
	},

	setData: function(k, v) {
		$("#defaultModalWindow").data(k, v)
	},

	getData: function(k) {
		return $("#defaultModalWindow").data(k)
	},

	// TODO : buildButton could be put outside ModalUtils

	hide: function() {
		$("#defaultModalWindow").modal("hide")
	},

	close: function() {
		hideModal()
	},

	show: function() {
		$("#defaultModalWindow").modal("show")
	},

	setTyped: function(msg) {
		$("#defaultModalWindow .modal-body").typed({strings: [msg], speed: 0})
	}
}

HtmlUtils = {
	buildHtmlUpgrade: function(name, desc, value) {
		var htmlInit = "<p class='row'>"
		var text = "<div class='text-default col-md-8'>" + desc + "</div>"
		var btn = HtmlUtils.buildButton("MenuTools.upgrade" + ACEX.Utils.capitalize(name) + "()", ">>", 
			"btn btn-danger btn-xs col-md-2")
		var value = "<div class='col-md-2'>" + value + "</div>"
		var htmlEnd = "</p>"
		return htmlInit + text + btn + value + htmlEnd
	},
	buildButton: function(onclick, value, cls) {
		cls = cls || "btn btn-lg btn-primary"
		var html = "<input type='button' class='" + cls + "' onclick=\"" + onclick + "\" value=\"" + value + "\">"
		return html
	},
}