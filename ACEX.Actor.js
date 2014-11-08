ACEX.Actor = function() {
	this.name = "Actor"
	this.alive = true
	this.children = []
	this.obj = null
}

ACEX.Actor.prototype.__run = function() {
    if (this.alive) {
        this.run()
        for (id in this.children) {
            var c = this.children[id]
            if (c.alive) {
                this.children[id].__run()
            }else {
                this.removeChild(id)
            }
        }
    }      
}

ACEX.Actor.prototype.addChild = function(a) {
	this.children.push(a)
	a.owner = this
	this.obj.addChild(a.obj)
}

ACEX.Actor.prototype.removeChild = function(id) {
	this.children[id].removeSelf()
    this.children[id].owner = null
    this.children.splice(id, 1)
}

ACEX.Actor.prototype.setForRemoval = function() {
	this.alive = false
}

ACEX.Actor.prototype.removeSelf = function() {
	this.owner.obj.removeChild(this.obj)
}

ACEX.Actor.prototype.initProps = function() {}
ACEX.Actor.prototype.initObj = function() {}
ACEX.Actor.prototype.run = function() {}