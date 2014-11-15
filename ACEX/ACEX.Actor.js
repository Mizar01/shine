ACEX.Actor = function() {
	this.alive = true
	this.children = []
	this.obj = null
    this.owner = null
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

ACEX.Actor.prototype.center = function() {
    this.obj.position.set(getAcex().sw/2, getAcex().sh/2)
}

ACEX.Actor.prototype.followPoint = function(p2, speed) {
    var p1 = this.obj.position
    if (ACEX.Utils.pointDistance(p1, p2) > 3) {
        var angle = Math.atan2((p2.y - p1.y),(p2.x - p1.x))
        this.obj.position.set(
            p1.x + Math.cos(angle) * speed,
            p1.y + Math.sin(angle) * speed
        )
    }
}

ACEX.StageActor = function() {
    ACEX.Actor.call(this)
    this.obj = new PIXI.Stage(0x000000) 
}
ACEX.StageActor.extends(ACEX.Actor, "ACES.StageActor")

//View, Layers are the names usually adopted for this type of container
ACEX.ContainerActor = function() {
    ACEX.Actor.call(this)
    this.obj = new PIXI.DisplayObjectContainer()
    this.logics = []
}
ACEX.ContainerActor.extends(ACEX.Actor, "ACEX.ContainerActor")
ACEX.ContainerActor.prototype.addLogic = function(logic) {
    this.logics.push(logic)
}
ACEX.ContainerActor.prototype.run = function() {
    for (li in this.logics) {
        this.logics[li].run()
    }
}
