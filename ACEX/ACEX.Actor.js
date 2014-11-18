ACEX.Actor = function() {
	this.alive = true
	this.children = []
	this.obj = null
    this.owner = null
    this.paused = false
    this.hitAreaObj = null //A separated hitAreaObj (sometimes is useful to have a separated object for this.)
}

ACEX.Actor.prototype.__run = function() {
    if (this.alive && !this.paused) {
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

ACEX.Actor.prototype.play = function() {
    this.paused = false
}
ACEX.Actor.prototype.pause = function() {
    this.paused = true
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

ACEX.Actor.prototype.followPoint = function(p2, speed, rotate) {
    var mustRotate = rotate || false
    var p1 = this.obj.position
    if (ACEX.Utils.pointDistance(p1, p2) > 3) {
        var angle = ACEX.Utils.angleToPoint(p1, p2)
        this.obj.position.set(
            p1.x + Math.cos(angle) * speed,
            p1.y + Math.sin(angle) * speed
        )
        if (mustRotate) {
            this.obj.rotation = angle
        }
    }
}

ACEX.Actor.prototype.rotateToPoint = function(p2) {
    this.obj.rotation = ACEX.Utils.angleToPoint(this.obj.position, p2)
}

/**
* Makes the actor move along the current rotation
*/
ACEX.Actor.prototype.moveForward = function(speed) {
    this.obj.position.x += speed * Math.cos(this.obj.rotation)
    this.obj.position.y += speed * Math.sin(this.obj.rotation)
}

ACEX.Actor.prototype.setHitArea = function(x, y, w, h, pointer, callback) {
    var o = this.obj
    o.hitArea = new PIXI.Rectangle(x, y, w, h)
    o.interactive = true
    if (pointer) {
        o.buttonMode = true
    }
    if (callback) {
        o.mouseup = callback
    }
    this.obj._acex_actor = this

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
