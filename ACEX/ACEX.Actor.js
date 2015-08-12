ACEX.Actor = function() {
	this.alive = true
	this.children = []
	this.obj = null
    this.owner = null
    this.paused = false
    this.hitAreaObj = null //A separated hitAreaObj (sometimes is useful to have a separated object for this.)
    this.hideOnPause = false
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
    if (this.hideOnPause) {
        this.show()
    }
}
ACEX.Actor.prototype.pause = function() {
    this.paused = true
    if (this.hideOnPause) {
        this.hide()
    }
}

ACEX.Actor.prototype.show = function() {
    this.obj.visible = true
}

ACEX.Actor.prototype.hide = function() {
    this.obj.visible = false
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
	this.owner.obj.removeChild(this.obj)  // Call to PIXI.Object.removeChild
}

ACEX.Actor.prototype.initProps = function() {}
ACEX.Actor.prototype.initObj = function() {}
ACEX.Actor.prototype.run = function() {}

ACEX.Actor.prototype.center = function() {
    // TODO : this actually works only for direct children of stage
    // or for chilren of parents positioned in 0,0 and unscaled.
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

ACEX.Actor.prototype.addHitAreaObj = function(hitAreaObj, pointer) {
    var o = this.obj
    this.obj.hitArea = hitAreaObj
    o.interactive = true
    if (pointer) {
        o.buttonMode = true
    }
    this.obj._acex_actor = this    
    o.mouseup = o.tap = function(pdata) {
        this._acex_actor.mouseup(pdata)
    }
}

/**
 * Gets the position of the object relative to the originPoint in the world.
 * The originPoint is (0,0) or a different position if you want to find the 
 * relative location (i.e. for a different layer) 
 */
// ACEX.Actor.prototype.getGlobalPosition = function(originPoint) {
//     originPoint = originPoint || new PIXI.Point()
//     return this.obj.toGlobal(originPoint)
// }
/**
 * E' un wrapper di DisplayObject.toLocal. Se originActor è valorizzato allora l'originPoint può cambiare di conseguenza.
 * Se originActor è nullo di default viene usato un originPoint a 0,0.
 */
ACEX.Actor.prototype.getRelativePosition = function(originPoint, originActor) { 
    originPoint = originPoint || new PIXI.Point()
    var originObj = null
    if (originActor) {
        originObj = originActor.obj
    }
    var toLocalP = this.obj.toLocal(originPoint, originObj)
    return new PIXI.Point(toLocalP.x * -1, toLocalP.y * -1)
}


ACEX.Actor.prototype.setRectHitArea = function(x, y, w, h, pointer) {
    this.addHitAreaObj(new PIXI.Rectangle(x, y, w, h), pointer)
}
ACEX.Actor.prototype.setCircleHitArea = function(x, y, r, pointer) {
    this.addHitAreaObj(new PIXI.Circle(x, y, r), pointer)
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
ACEX.ContainerActor.prototype.removeLogic = function(logicId) {
    for (li in this.logics) {
        var l = this.logics[li]
        if (l.id != null && l.id == logicId) {
            this.logics.splice(li, 1)
        }
    }
}
ACEX.ContainerActor.prototype.run = function() {
    for (li in this.logics) {
        this.logics[li].run()
    }
}
