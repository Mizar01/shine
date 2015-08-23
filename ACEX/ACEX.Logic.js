ACEX.Logic = function() {
	this.toDelete = false
}
ACEX.Logic.prototype.run = function() {}
ACEX.Logic.prototype.setForRemoval = function() {
	this.toDelete = true
}