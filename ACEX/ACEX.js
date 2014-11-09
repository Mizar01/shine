/**
* Some useful extensions for javascript
*/

/**
* Add a method to any function to speed up code generation when inheriting.
*/
Function.prototype.extends = function(baseClass, typeName) {
    this.prototype = Object.create(baseClass.prototype)
    this.prototype.constructor = this

    //The superClass must be used in a static way
    // example: XXX.Object.superClass.method.call(instance,params)  
    // DON'T USE superClass with 'this' identifier.
    // Use this.getSuperClass instead
    this.superClass = baseClass.prototype //(USE WITH CAUTION : VERY DANGEROUS)

    this.prototype.type = typeName

    this.prototype.getSuperClass = function() {
        return eval(this.getType() + ".superClass")
    }

}


// Utility to disables text selection, is annoying for the game
// (function($){
//     $.fn.disableSelection = function() {
//         return this
//                  .attr('unselectable', 'on')
//                  .css('user-select', 'none')
//                  .on('selectstart', false);
//     };
// })(jQuery);


var __acex_standard_name = "acex"
function getAcex() {
    return window[__acex_standard_name]
}

THREE = function() {}  // This is used so I can load some useful THREE.js methods

ACEX = function(w, h, assets, callback) {
    window[__acex_standard_name] = this
    this.sw = w
    this.sh = h
    this.stageActor = new ACEX.StageActor(true)
    this.time = new ACEX.TimeManager() //Global time of the game.
    this.renderer = null
    this.canvasContainerId = "canvas_container"
    this.canvasAlign = "center"
    this.canvasInit()
    this.loadAssets(assets, callback)
    this.stageActor.obj.mouseup = function(){getAcex().events["mouseup"] = true}
    this.events = []
}

ACEX.prototype.canvasInit = function() {
    this.renderer = PIXI.autoDetectRenderer(this.sw, this.sh)
    var cc = document.createElement("div")
    cc.id = this.canvasContainerId
    cc.align = this.canvasAlign
    document.body.appendChild(cc)
    document.getElementById(cc.id).appendChild(this.renderer.view) 
}

ACEX.prototype.loadAssets = function(assets, callback) {
    var loader = new PIXI.AssetLoader(assets)
    loader.onComplete = function() {
        window[callback]()
    }
    loader.load()
}

ACEX.prototype.run = function() {
    this.time.run()
    this.stageActor.__run()
    this.renderer.render(this.stageActor.obj)
    this.resetEvents()
    requestAnimFrame(function() {getAcex().run()})
}

ACEX.prototype.resetEvents = function() {
    this.events = []
}

ACEX.prototype.getEvent = function(event) {
    if (this.events[event] == null) {
        return false
    }else {
        return true
    }
}

ACEX.prototype.getMouseCoords = function() {
    return this.stageActor.obj.getMousePosition().clone()
}

