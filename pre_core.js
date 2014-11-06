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